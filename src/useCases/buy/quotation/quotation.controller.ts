/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
//import { Prisma } from '@prisma/client';
import sharp from 'sharp';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import DeletedResponseSwagger from 'src/models/swagger/delete-response';
import InsertedResponseSwagger from 'src/models/swagger/inserted-response';
import listTablePaginationSwagger from 'src/models/swagger/list-table-pagination-swagger';
import UpdatedResponseSwagger from 'src/models/swagger/updated-response';
import { AttachmentsServiceOrderRepository } from 'src/repositories/attachments-service-order-repository';
import BuyConditionAnswerRepository from 'src/repositories/buy-condition-answer-repository';
import BuyConditionRepository from 'src/repositories/buy-condition-repository';
import BuyElevationsRepository from 'src/repositories/buy-elevations-repository';
import BuyItemQuotationReasonRepository from 'src/repositories/buy-item-quotation-reason-repository';
import BuyItemRepository from 'src/repositories/buy-item-repository';
import BuyPreFinancePaymentRepository from 'src/repositories/buy-pre-finance-payment-repository';
import BuyPreFinanceRepository from 'src/repositories/buy-pre-finance-repository';
import BuyQuotationDiscountRepository from 'src/repositories/buy-quotation-discount-repository';
import BuyQuotationItemRepository from 'src/repositories/buy-quotation-item-repository';
import BuyQuotationRepository from 'src/repositories/buy-quotation-repository';
import BuyRepository from 'src/repositories/buy-repository';
import BuyResponsibleQuotationRepository from 'src/repositories/buy-responsible-quotation-repository';
import FinanceTributesRepository from 'src/repositories/finance-tributes-repository';
import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
import ProviderRepository from 'src/repositories/provider-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { DateService } from 'src/service/data.service';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
//import { AttachmentsServiceOrderMapper, removeExtraFields, setMapper, unSetMapper } from 'src/service/mapper.service';
import { MessageService } from 'src/service/message.service';
import { DeleteAttachBody } from 'src/useCases/system/dtos/deleteAttach-body';
import { z } from 'zod';
import FindItemBuyIdResponseSwagger from './dtos/swagger/findItemByBuyId-response-swagger';
import InsertItemQuotationBodySwagger from './dtos/swagger/insertItemQuotation-body-swagger';
import { ListDiscountResponse } from './dtos/swagger/listDiscount-response-swagger';
import UpdatedItemQuotationBodySwagger from './dtos/swagger/updateItemQuotation-body-swagger copy';
import UpdateAskBody from './dtos/updateAsk-body';

@ApiTags('Buy - Quotation')
@ApiBearerAuth()
@ApiOkResponse({ description: 'Success' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('buy/quotation')
export default class QuotationScriptCaseController {
  constructor(
    private buyRepository: BuyRepository,
    private env: ENVService,
    private buyResponsibleQuotationRepository: BuyResponsibleQuotationRepository,
    private buyQuotationRepository: BuyQuotationRepository,
    private serviceOrderRepository: ServiceOrderRepository,
    private buyItemRepository: BuyItemRepository,
    private providerRepository: ProviderRepository,
    private buyConditionRepository: BuyConditionRepository,
    private buyPreFinanceRepository: BuyPreFinanceRepository,
    private buyConditionAnswerRepository: BuyConditionAnswerRepository,
    private attachmentsServiceOrderRepository: AttachmentsServiceOrderRepository,
    private buyPreFinancePaymentRepository: BuyPreFinancePaymentRepository,
    private financeTypePaymentRepository: FinanceTypePaymentRepository,
    private buyElevationsRepository: BuyElevationsRepository,
    private dateService: DateService,
    private envService: ENVService,
    private fileService: FileService,
    private buyQuotationItemRepository: BuyQuotationItemRepository,
    private buyItemQuotationReasonRepository: BuyItemQuotationReasonRepository,
    private financeTributesRepository: FinanceTributesRepository,
    private buyQuotationDiscountRepository: BuyQuotationDiscountRepository,
  ) { }
  @UseGuards(AuthGuard)
  @ApiQuery({
    type: listTablePaginationSwagger,
  })
  @Get('/')
  async listRequest(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      page: z.coerce
        .string()
        .optional()
        .nullable()
        .transform((value) =>
          value === 'null'
            ? null
            : value === undefined || value.length === 0
              ? null
              : Number(value) - 1,
        ),
      perPage: z.coerce
        .string()
        .optional()
        .nullable()
        .transform((value) =>
          value === 'null'
            ? null
            : value === undefined || value.length === 0
              ? null
              : Number(value),
        ),
      globalFilter: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      filterColumn: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      filterText: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      dateFrom: z
        .string()
        .transform((value) => (value === '' ? null : new Date(value)))
        .optional(),
      dateTo: z
        .string()
        .transform((value) => (value === '' ? null : new Date(value)))
        .optional(),
      status: z
        .string()
        .transform((value) =>
          value === '' ? null : value.split(',').map(Number),
        )
        .optional(),
    });

    const query = querySchema.parse(req.query);

    // console.log(user);
    // console.log(query);

    let filterText = {};

    if (query.filterColumn && query.filterText) {
      switch (query.filterColumn) {
        case 'code':
          filterText = {
            numero: {
              equals: Number(query.filterText),
            },
          };
          break;
        case 'company':
          filterText = {
            branch: {
              filial_numero: {
                contains: query.filterText,
              },
            },
          };
          break;
        case 'status':
          filterText = {
            buyStatus: {
              descricao: {
                contains: query.filterText,
              },
            },
          };
          break;
        case 'date':
          if (query.dateFrom && query.dateTo) {
            filterText = {
              logBuy: {
                log_date: {
                  gte: query.dateFrom,
                  lte: query.dateTo,
                },
              },
            };
          }
          break;
        case 'user':
          filterText = {
            user: {
              name: {
                contains: query.filterText,
              },
            },
          };
          break;
        case 'observation':
          filterText = {
            observacao: {
              contains: query.filterText,
            },
          };
          break;
      }
    }

    const allQuotation = await this.buyRepository.listByClientAndFilterGrid(
      user.clientId,
      query.page,
      query.perPage,
      {
        status: {
          notIn: [1, 8, 11],
        },
        AND: [
          ...(query.globalFilter
            ? [
              {
                OR: [
                  {
                    numero: {
                      equals: Number(query.globalFilter),
                    },
                  },
                  {
                    observacao: {
                      contains: query.globalFilter,
                    },
                  },
                  {
                    user: {
                      name: {
                        contains: query.globalFilter,
                      },
                    },
                  },
                  {
                    buyStatus: {
                      descricao: {
                        contains: query.globalFilter,
                      },
                    },
                  },
                  {
                    branch: {
                      filial_numero: {
                        contains: query.globalFilter,
                      },
                    },
                  },
                ],
              },
            ]
            : []),
          ...(query.status ? [{ status: { in: query.status } }] : []),
          filterText,
        ],
      },
    );

    const totalQuotation = await this.buyRepository.listByClientAndFilterGrid(
      user.clientId,
      null,
      null,
      {
        status: {
          notIn: [1, 8, 10],
        },
      },
    );

    const response = allQuotation.map((quotation) => {
      //console.log(quotation);
      return {
        code: quotation.numero.toString().padStart(6, '0'),
        company: quotation.branch.filial_numero,
        date:
          quotation.logBuy.length >= 1
            ? quotation.logBuy[0].log_date
            : quotation.log_date,
        id: quotation.id,
        observation: quotation.observacao,
        statusId: quotation.buyStatus.id,
        status: quotation.buyStatus.descricao,
        user: quotation?.user?.name,
      };
    });

    return {
      success: true,
      requests: response,
      totalItems: totalQuotation.length,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/isBuyer')
  async isBuyer(@Req() req, @Param('buyId') buyId: string) {
    const user: IUserInfo = req.user;

    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const buyResponsible =
      await this.buyResponsibleQuotationRepository.listByBranchesAndLogin(
        user.branches,
        user.login,
      );

    const response = {
      code: buy.numero.toString().padStart(6, '0'),
      buyer: buyResponsible.length > 0,
      edit: buy.buyStatus.id === 2,
      success: true,
    };

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: FindItemBuyIdResponseSwagger
  })
  @Get('/:buyId/find-item')
  async findItemByBuyId(@Param('buyId') buyId: string) {
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const items = await this.buyItemRepository.listByBuyAndNotStock(buy.id);

    const allMaterialAndCode = items.map(item => {
      return {
        itemId: item.id,
        materialId: item.material.id,
        secondaryId: item.materialSecond?.id || null,
        secondaryUrl: ''
      }
    })

    try {
      const type = ['jpeg', 'png', 'jpg']

      for await (const material of allMaterialAndCode) {
        const path = `${this.envService.FILE_PATH}/material/id_${material.materialId}/code_${material.secondaryId}/`;

        const fileList = this.fileService.list(path);

        const matchingFile = fileList.find(fileItem => type.some(value => fileItem.includes(value)));

        if (matchingFile) {
          material.secondaryUrl = `${this.envService.URL_IMAGE}/material/id_${material.materialId}/code_${material.secondaryId}/${matchingFile}`;
        }
      }
    } catch (error) {
      console.error(error)
      throw new ConflictException("Erro ao buscar imagem do codigo secundario")
    }

    const classification = {
      '0': '',
      '1': 'Original',
      '2': 'Genuína',
      '3': 'Genérica',
      '4': 'Paralela',
      '5': 'Recondicionada'
    }

    const response = items.map((item) => {
      return {
        id: item.id,
        materialId: item.material.id,
        material: `${item.materialSecond.codigo || ''} - ${item.material.material || ''} - ${item.materialSecond.marca || ''} - ${classification[item.materialSecond.classificacao || '0']}`,
        codeNCM: item.material.codigo_ncm,
        codeSecondary: item.materialSecond ? {
          value: item.materialSecond.id,
          code: [item.materialSecond.codigo || '', item.materialSecond.marca || '', item.materialSecond.classificacao || '']
            .join(' - '),
          urlPath: allMaterialAndCode.find(value => value.secondaryId === item.materialSecond.id)?.secondaryUrl || ''
        } : null,
        quantity: item.quantidade,
        observation: item.observacao,
        quotation: item.quotationItem.length,
        item_enable: item.quoteReason.map((reason) => {
          return {
            id: reason.id,
            providerId: reason.id_fornecedor,
            enable: reason.bloquear === 1,
          };
        }),
      };
    });

    return {
      items: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: FindItemBuyIdResponseSwagger
  })
  @Get('/:buyId/find-item/stock')
  async findItemNotStockByBuyId(@Param('buyId') buyId: string) {
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const items = await this.buyItemRepository.listByBuyAndStock(buy.id);

    const allMaterialAndCode = items.map(item => {
      return {
        itemId: item.id,
        materialId: item.material.id,
        secondaryId: item.materialSecond?.id || null,
        secondaryUrl: ''
      }
    })

    try {
      const type = ['jpeg', 'png', 'jpg']

      for await (const material of allMaterialAndCode) {
        const path = `${this.envService.FILE_PATH}/material/id_${material.materialId}/code_${material.secondaryId}/`;

        const fileList = this.fileService.list(path);

        const matchingFile = fileList.find(fileItem => type.some(value => fileItem.includes(value)));

        if (matchingFile) {
          material.secondaryUrl = `${this.envService.URL_IMAGE}/material/id_${material.materialId}/code_${material.secondaryId}/${matchingFile}`;
        }
      }
    } catch (error) {
      console.error(error)
      throw new ConflictException("Erro ao buscar imagem do codigo secundario")
    }

    const classification = {
      '0': '',
      '1': 'Original',
      '2': 'Genuína',
      '3': 'Genérica',
      '4': 'Paralela',
      '5': 'Recondicionada'
    }

    const response = items.map((item) => {
      return {
        id: item.id,
        material: ` ${item.material.codigo} - ${item.material.material}`,
        codeNCM: item.material.codigo_ncm,
        codeSecondary: item.materialSecond ? {
          code: item.materialSecond.codigo,
          brand: item.materialSecond.marca,
          classification: item.materialSecond.classificacao ? classification[item.materialSecond.classificacao] : null,
          urlPath: allMaterialAndCode.find(value => value.secondaryId === item.materialSecond.id)?.secondaryUrl || ''
        } : null,
        quantity: item.quantidade,
        observation: item.observacao,
        quotation: item.quotationItem.length,
        item_enable: item.quoteReason.map((reason) => {
          return {
            id: reason.id,
            providerId: reason.id_fornecedor,
            enable: reason.bloquear === 1,
          };
        }),
      };
    });

    return {
      items: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/list-quotation')
  async listQuotationByBuy(@Req() req, @Param('buyId') buyId: string) {
    const querySchema = z.object({
      financeId: z.coerce.number().optional().nullable()
    })

    const query = querySchema.parse(req.query)

    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const allQuotation = await this.buyQuotationRepository.listByBuy(buy.id, {
      ...(query.financeId && {
        id_fornecedor: query.financeId
      })
    });

    const response = allQuotation.map((quotation) => {
      let allQuantity = 0;
      let grossTotal = 0;

      const items = quotation.quotationItem.map((item) => {
        grossTotal += item.quantidade * item.valor;
        allQuantity++;
        // console.log(item);
        return {
          id: item.id,
          material: `${item.item.sequencia}-${item.item.material.codigo} | ${item.item.material.material}`,
          secondaryCode: item.item.materialSecond ? item.item.materialSecond.codigo : '',
          manufacturer: item.item.materialSecond ? item.item.materialSecond.marca : '',
          observation: item.observacao,
          quantity: item.quantidade,
          value: item.valor,
          total: item.quantidade * item.valor,
        };
      });

      const findQuotationByProvider = buy.buyQuotationDiscount.filter(
        (value) => value.provider.ID === quotation.provider.ID,
      );

      const discount = findQuotationByProvider.reduce((acc, current) => {
        if (current.tipo === 'ACRESCIMO') {
          return (acc += current.valor);
        } else {
          return (acc -= current.valor);
        }
      }, 0)

      return {
        id: quotation.id,
        providerId: quotation.provider.ID,
        provider: quotation.provider.nome_fantasia,
        allQuantity,
        grossTotal,
        totalTribute: discount,
        total: discount + grossTotal,
        items,
      };
    });

    return {
      quotations: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/list-items-by-provider/:providerId')
  async listItemsByProvider(
    @Param('buyId') buyId: string,
    @Param('providerId') providerId: string,
  ) {
    const provider = await this.providerRepository.findById(Number(providerId));

    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    const buy = await this.buyRepository.findByIdAndProviderQuotation(
      Number(buyId),
      provider.ID,
    );

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    let totalGross = 0;

    const totalDiscount = buy.buyQuotationDiscount.reduce((acc, current) => {
      if (current.tipo === 'ACRESCIMO') {
        return (acc += current.valor);
      } else {
        return (acc -= current.valor);
      }
    }, 0);

    const response = [];

    const allMaterialAndCode = buy.item.map(item => {
      return {
        itemId: item.id,
        materialId: item.material.id,
        secondaryId: item.materialSecond?.id || null,
        secondaryUrl: ''
      }
    })

    try {
      const type = ['jpeg', 'png', 'jpg']

      for await (const material of allMaterialAndCode) {
        const path = `${this.envService.FILE_PATH}/material/id_${material.materialId}/code_${material.secondaryId}/`;

        const fileList = this.fileService.list(path);

        const matchingFile = fileList.find(fileItem => type.some(value => fileItem.includes(value)));

        if (matchingFile) {
          material.secondaryUrl = `${this.envService.URL_IMAGE}/material/id_${material.materialId}/code_${material.secondaryId}/${matchingFile}`;
        }
      }
    } catch (error) {
      console.error(error)
      throw new ConflictException("Erro ao buscar imagem do codigo secundario")
    }

    const classification = {
      '0': '',
      '1': 'Original',
      '2': 'Genuína',
      '3': 'Genérica',
      '4': 'Paralela',
      '5': 'Recondicionada'
    }

    buy.item.forEach((item) => {
      const quotationItems = item.quotationItem.map((quotationItem) => {
        totalGross += quotationItem
          ? quotationItem.valor * (quotationItem.quantidade || item.quantidade)
          : 0;

        return {
          id: quotationItem.id,
          idItem: item.id,
          materialId: item.material.id,
          material: item.material.material || '',
          codeSecondaryId: item?.materialSecond?.id,
          codeSecondary: [item?.materialSecond?.codigo, item?.materialSecond?.marca, classification[item?.materialSecond?.classificacao || '0']].join(' - '),
          observation: quotationItem.observacao,
          quantity: quotationItem.quantidade,
          quantityOld: item.quantidade,
          price: quotationItem.valor || null,
          total:
            quotationItem.valor * (quotationItem.quantidade || item.quantidade),
        };
      });

      response.push(...quotationItems);
    });

    return {
      items: response,
      totalGross,
      totalDiscount,
      total: totalDiscount + totalGross,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListDiscountResponse
  })
  @Get('/:buyId/list-discount/:providerId')
  async listDiscount(@Param('buyId') buyId: number, @Param('providerId') providerId: number) {
    const provider = await this.providerRepository.findById(Number(providerId));

    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    const buy = await this.buyRepository.findByIdAndProviderQuotation(
      Number(buyId),
      provider.ID,
    );

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const response = buy.buyQuotationDiscount.map((discount) => {
      return {
        id: discount.id,
        description: discount.motivo,
        type: discount.tipo,
        tribute: discount.tribute.descricao,
        value: discount.valor,
        provider: {
          id: discount.provider.ID,
          name: discount.provider.nome_fantasia,
        },
      };
    })

    return {
      discounts: response,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: InsertedResponseSwagger
  })
  @Post('/:buyId/list-discount/:providerId')
  async insertDiscount(@Req() req, @Param('buyId') buyId: number, @Param('providerId') providerId: number) {
    const bodySchema = z.object({
      tributeId: z.coerce.number(),
      value: z.coerce.number(),
      description: z.string().optional().nullable(),
      type: z.enum(['ACRESCIMO', 'DESCONTO']),
    })

    const body = bodySchema.parse(req.body);

    const provider = await this.providerRepository.findById(Number(providerId));

    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    const buy = await this.buyRepository.findByIdAndProviderQuotation(
      Number(buyId),
      provider.ID,
    );

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const tribute = await this.financeTributesRepository.findById(body.tributeId)

    if (!tribute) {
      throw new NotFoundException(MessageService.Finance_taxationId_not_found);
    }

    await this.buyQuotationDiscountRepository.create({
      id_compra: buy.id,
      id_tributo: tribute.id,
      valor: body.value,
      motivo: body.description || '',
      tipo: body.type,
      id_fornecedor: provider.ID,
    })

    return {
      inserted: true
    }

  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: DeletedResponseSwagger
  })
  @Delete('/:buyId/list-discount/:providerId/:id')
  async deletedDiscount(@Param('id') id: string) {
    const discount = await this.buyQuotationDiscountRepository.findById(Number(id))

    if (!discount) {
      throw new NotFoundException(MessageService.Buy_quotation_discount_id_not_found)
    }

    await this.buyQuotationDiscountRepository.delete(discount.id)

    return {
      deleted: true
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/item/:itemId/attach')
  async listByProviderAttach(
    @Param('buyId') buyId: string,
    @Param('itemId') itemId: string,
  ) {
    const buy = await this.buyRepository.findById(Number(buyId))

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found)
    }

    const buyItemQuotation = await this.buyQuotationItemRepository.findById(Number(itemId))

    if (!buyItemQuotation) {
      throw new NotFoundException(MessageService.Buy_quotation_item_not_found)
    }

    const response: {
      img: { url: string }[];
      errorImg?: { message: string };
    } = {
      img: [],
    };

    try {
      const path = `${this.envService.FILE_PATH}/cotacao/item_cotacao/id_${buyItemQuotation.id}/`;

      const fileList = this.fileService.list(path);

      fileList.forEach((fileItem) => {
        response.img.push({
          url: `${this.envService.URL_IMAGE}/cotacao/item_cotacao/id_${buyItemQuotation.id}/${fileItem}`,
        });
      });

    } catch (error) {
      console.log(error);
      response.errorImg = {
        message: MessageService.SYSTEM_FTP_IMG_ERROR_CONNECT,
      };
    }

    return {
      ...response
    }

  }

  @UseGuards(AuthGuard)
  @Delete('/:buyId/provider/:providerId')
  async deleteProvider(@Param('buyId') buyId: string, @Param('providerId') providerId: string,) {
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const provider = await this.providerRepository.findById(Number(providerId));

    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    const buyQuotation = await this.buyQuotationRepository.findByBuyAndProvider(buy.id, provider.ID);

    if (!buyQuotation) {
      throw new BadRequestException(MessageService.Buy_quotation_not_found);
    }

    await this.buyQuotationRepository.delete(buyQuotation.id);
    await this.buyQuotationDiscountRepository.deleteByBuyAndProvider(buy.id, provider.ID);

    return {
      deleted: true,
      success: true
    }
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: InsertItemQuotationBodySwagger
  })
  @ApiResponse({
    type: InsertedResponseSwagger
  })
  @Post('/:buyId/item')
  async insertItemQuotation(@Req() req, @Param('buyId') buyId: string) {
    const user: IUserInfo = req.user

    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const bodySchema = z.object({
      itemId: z.number(),
      providerId: z.number(),
      quantity: z.number(),
      observation: z.string().nullable().optional(),
      price: z.number(),
      reason: z.string().optional().nullable(),
      blockInProvider: z.boolean().optional().nullable(),
      codeSecondary: z.number().optional().nullable(),
    })

    const body = bodySchema.parse(req.body)

    const provider = await this.providerRepository.findById(body.providerId)

    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found)
    }

    const quotation = {
      id: null
    }

    const findQuotation = await this.buyQuotationRepository.findByBuyAndProvider(buy.id, provider.ID)

    if (!findQuotation) {
      const newQuotation = await this.buyQuotationRepository.create({
        id_cliente: user.clientId,
        id_compra: buy.id,
        id_fornecedor: provider.ID,
        log_user: user.login,
      })

      quotation.id = newQuotation.id
    } else {
      quotation.id = findQuotation.id
    }

    const buyItem = await this.buyItemRepository.findById(body.itemId)

    if (!buyItem) {
      throw new NotFoundException(MessageService.Buy_item_id_not_found)
    }

    if (buyItem.quantidade < body.quantity) {
      if ((body.reason && body.reason.length === 0) || body.blockInProvider === null) {
        throw new NotFoundException(MessageService.Buy_quotation_item_reason_or_block_not_found)
      }

      await this.buyItemQuotationReasonRepository.create({
        id_fornecedor: provider.ID,
        id_item: buyItem.id,
        quantidade: body.quantity,
        observacao: body.reason,
        bloquear: body.blockInProvider ? 1 : 0,
      })
    }

    await this.buyQuotationItemRepository.create({
      id_cotacao: quotation.id,
      id_item: buyItem.id,
      quantidade: body.quantity,
      valor: body.price,
      observacao: body.observation,
    })

    if (body.codeSecondary) {
      await this.buyItemRepository.update(buyItem.id, {
        id_material_secundario: body.codeSecondary
      })
    }

    return {
      inserted: true,
      success: true
    }
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: UpdatedItemQuotationBodySwagger
  })
  @ApiResponse({
    type: UpdatedResponseSwagger
  })
  @Put('/:buyId/item/:itemId')
  async updateItemQuotation(
    @Req() req,
    @Param('buyId') buyId: string,
    @Param('itemId') itemId: string,

  ) {
    const buy = await this.buyRepository.findById(Number(buyId))

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found)
    }

    const buyItemQuotation = await this.buyQuotationItemRepository.findById(Number(itemId))

    if (!buyItemQuotation) {
      throw new NotFoundException(MessageService.Buy_quotation_item_not_found)
    }

    buyItemQuotation.item.id

    const bodySchema = z.object({
      quantity: z.number(),
      observation: z.string().nullable().optional(),
      price: z.number(),
      reason: z.string().optional().nullable(),
      blockInProvider: z.boolean().optional().nullable(),
      codeSecondary: z.number().optional().nullable(),
    })

    const body = bodySchema.parse(req.body)

    if (buyItemQuotation.item.quantidade < body.quantity) {
      if ((body.reason && body.reason.length === 0) || body.blockInProvider === null) {
        throw new NotFoundException(MessageService.Buy_quotation_item_reason_or_block_not_found)
      }

      const findReason = await this.buyItemQuotationReasonRepository.findByProviderAndItem(buyItemQuotation.quotation.provider.ID, buyItemQuotation.item.id)

      if (!findReason) {
        await this.buyItemQuotationReasonRepository.create({
          id_fornecedor: buyItemQuotation.quotation.provider.ID,
          id_item: buyItemQuotation.item.id,
          quantidade: body.quantity,
          observacao: body.reason,
          bloquear: body.blockInProvider ? 1 : 0,
        });
      } else {
        await this.buyItemQuotationReasonRepository.update(findReason.id, {
          quantidade: body.quantity,
          observacao: body.reason,
          bloquear: body.blockInProvider ? 1 : 0,
        })
      }

    }

    await this.buyQuotationItemRepository.update(buyItemQuotation.id, {
      quantidade: body.quantity,
      observacao: body.observation,
      valor: body.price,
    });

    if (body.codeSecondary) {
      await this.buyItemRepository.update(buyItemQuotation.item.id, {
        id_material_secundario: body.codeSecondary
      })
    }

    return {
      updated: true,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: DeletedResponseSwagger
  })
  @Delete('/:buyId/item/:itemId')
  async deleteItemQuotation(@Param('buyId') buyId: string,
    @Param('itemId') itemId: string,) {
    const buy = await this.buyRepository.findById(Number(buyId))

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found)
    }

    const buyItemQuotation = await this.buyQuotationItemRepository.findById(Number(itemId))

    if (!buyItemQuotation) {
      throw new NotFoundException(MessageService.Buy_quotation_item_not_found)
    }

    const findItemReason = await this.buyItemQuotationReasonRepository.findByProviderAndItem(buyItemQuotation.quotation.provider.ID, buyItemQuotation.item.id)

    if (findItemReason) {
      await this.buyItemQuotationReasonRepository.delete(findItemReason.id)
    }

    await this.buyQuotationItemRepository.delete(buyItemQuotation.id);

    const quotation = await this.buyQuotationRepository.findById(buyItemQuotation.quotation.id)

    if (quotation.quotationItem.length === 0) {
      const findPreFinance = await this.buyPreFinanceRepository.findByBuyAndProvider(buy.id, quotation.provider.ID)

      if (findPreFinance) {
        await this.buyPreFinanceRepository.delete(findPreFinance.id)
      }

      await this.buyConditionAnswerRepository.deleteByBuyAndProvider(buy.id, quotation.provider.ID)

      await this.buyQuotationRepository.delete(quotation.id);
    }

    return {
      deleted: true,
      success: true,
    };

  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/list-provider-if-response')
  async listProviderIfResponse(@Req() req, @Param('buyId') buyId: string) {
    const buy = await this.buyRepository.findById(Number(buyId))

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found)
    }

    const user: IUserInfo = req.user;

    const quotation = await this.buyQuotationRepository.listByBuy(
      Number(buyId),
    );

    if (!quotation) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    let typePaymentFix = 0;

    const allTypePayment = await this.financeTypePaymentRepository.listByClient(
      user.clientId,
    );

    if (allTypePayment.length === 0) {
      const newTypePayment = await this.financeTypePaymentRepository.create({
        id_cliente: user.clientId,
        descricao: 'BOLETO',
        parcela: 0,
      });

      typePaymentFix = newTypePayment.id;
    } else {
      typePaymentFix = allTypePayment[0].id;
    }

    const provider = [];

    const allItemItemPriority = buy.item.filter((item) => item.estoque !== null).every(item => item.priority.compra_direta === 1);

    // Aqui estou calculando o total da cotação
    const limits = await this.buyElevationsRepository.listElevations(buy.branch.ID);

    // ordenando limites por valor
    limits.sort((a, b) => parseFloat(a.limite_valor.toString()) - parseFloat(b.limite_valor.toString()));

    let requiredProviders = null;

    let biggerTotal = 0

    for (const item of quotation) {
      const totalQuotation = item.quotationItem.reduce((acc, current) => {
        return acc + current.quantidade * current.valor
      }, 0);

      if (totalQuotation >= biggerTotal) {
        biggerTotal = totalQuotation
      }
    }

    for (const limit of limits) {
      if (biggerTotal >= parseFloat(limit.limite_valor.toString())) {
        requiredProviders = limit.num_fornecedores;
      }
    }

    const allProviders = (quotation.map(quotation => quotation.provider));

    if (!allItemItemPriority && requiredProviders && allProviders.length < requiredProviders) {
      throw new BadRequestException(
        `Para esta cotação, é exigido a inclusão de ${requiredProviders} fornecedores no processo. \n Falta a inclusão de ${requiredProviders - allProviders.length} fornecedores.`,
      );
    }

    for await (const value of quotation) {
      const findProvider = await this.buyRepository.listByBuyAndFinishProvider(
        Number(buyId),
        value.provider.ID,
      );

      let allRespond = false;

      if (findProvider) {
        allRespond = findProvider.buyPreFinance.length
          ? findProvider.buyPreFinance[0].buyPreFinancePayment[0]
            .paymentType !== null &&
          findProvider?.buyPreFinance[0].buyPreFinancePayment[0]
            .vencimento !== null
          : false;

        const validItem = value.buy.item.filter(item => item.estoque !== 1).every(
          (item) =>
            value.quotationItem.findIndex((val) => val.item.id === item.id) >=
            0,
        );

        if (!validItem) {
          const condition =
            await this.buyConditionRepository.findByClientAndName(
              user.clientId,
              'Esse fornecedor não tem todos os itens solicitados. justificativa:',
            );

          if (!condition) {
            await this.buyConditionRepository.create({
              id_cliente: user.clientId,
              condicao:
                'Esse fornecedor não tem todos os itens solicitados. justificativa:',
              editavel: 1,
              conditionAnswer: {
                create: {
                  id_compra: value.buy.id,
                  id_fornecedor: value.provider.ID,
                  resposta: '',
                },
              },
            });
          } else {
            const validDuplicate =
              await this.buyConditionAnswerRepository.findByBuyAndCondition(
                value.buy.id,
                condition.id,
                value.provider.ID,
              );

            if (!validDuplicate)
              await this.buyConditionAnswerRepository.create({
                id_compra: value.buy.id,
                id_condicoes: condition.id,
                id_fornecedor: value.provider.ID,
                resposta: '',
              });
          }
        } else {
          const condition =
            await this.buyConditionRepository.findByClientAndName(
              user.clientId,
              'Esse fornecedor não tem todos os itens solicitados. justificativa:',
            );

          if (condition) {
            const validDuplicate =
              await this.buyConditionAnswerRepository.findByBuyAndCondition(
                value.buy.id,
                condition.id,
                value.provider.ID
              );

            if (validDuplicate)
              await this.buyConditionAnswerRepository.delete(validDuplicate.id);
          }
        }

        if (
          findProvider.conditionAnswer.length > 0 &&
          findProvider.conditionAnswer.findIndex(
            (item) =>
              value.provider.ID === item.provider.ID &&
              (item.resposta === '' || item.resposta === null),
          ) >= 0
        ) {
          allRespond = false;
        }
      } else {
        const findBuyPreFinance = await this.buyPreFinanceRepository.listByBuy(
          value.buy.id,
        );

        if (!findBuyPreFinance) {
          await this.buyPreFinanceRepository.create({
            id_compra: value.buy.id,
            emitente: value.buy.branch.ID,
            buyPreFinancePayment: {
              create: {
                id_fornecedor: value.provider.ID,
                frequencia: 1,
                log_user: user.login,
                parcelar: 0,
                quantidade_parcela: 1,
                vencimento: new Date(),
                id_pagamento: typePaymentFix,
              },
            },
          });
        } else {
          await this.buyPreFinancePaymentRepository.create({
            id_pre_financeiro: findBuyPreFinance.id,
            id_fornecedor: value.provider.ID,
            frequencia: 1,
            log_user: user.login,
            parcelar: 0,
            quantidade_parcela: 1,
            vencimento: new Date(),
            id_pagamento: typePaymentFix,
          });
        }

        const allCondition = await this.buyConditionRepository.listByClient(
          user.clientId,
        );

        const allConditionByBuy =
          await this.buyConditionAnswerRepository.listByBuyAndProvider(
            value.buy.id,
            value.provider.ID,
          );

        for await (const condition of allCondition) {
          const index = allConditionByBuy.findIndex(
            (buyCond) => buyCond.condition.id === condition.id,
          );

          if (index < 0 && condition.editavel === 1) {
            await this.buyConditionAnswerRepository.create({
              id_condicoes: condition.id,
              id_compra: value.buy.id,
              id_fornecedor: value.provider.ID,
              resposta: '',
            });
          }
        }

        const validItem = value.buy.item.filter(item => item.estoque !== 1).every(
          (item) =>
            value.quotationItem.findIndex((val) => val.item.id === item.id) >=
            0,
        );

        if (!validItem) {
          const condition =
            await this.buyConditionRepository.findByClientAndName(
              user.clientId,
              'Esse fornecedor não tem todos os itens solicitados. justificativa:',
            );

          if (!condition) {
            await this.buyConditionRepository.create({
              id_cliente: user.clientId,
              condicao:
                'Esse fornecedor não tem todos os itens solicitados. justificativa:',
              editavel: 1,
              conditionAnswer: {
                create: {
                  id_compra: value.buy.id,
                  id_fornecedor: value.provider.ID,
                  resposta: '',
                },
              },
            });
          } else {
            const validDuplicate =
              await this.buyConditionAnswerRepository.findByBuyAndCondition(
                value.buy.id,
                condition.id,
                value.provider.ID
              );

            if (!validDuplicate)
              await this.buyConditionAnswerRepository.create({
                id_compra: value.buy.id,
                id_condicoes: condition.id,
                id_fornecedor: value.provider.ID,
                resposta: '',
              });
          }
        } else {
          const condition =
            await this.buyConditionRepository.findByClientAndName(
              user.clientId,
              'Esse fornecedor não tem todos os itens solicitados. justificativa:',
            );

          if (condition) {
            const validDuplicate =
              await this.buyConditionAnswerRepository.findByBuyAndCondition(
                value.buy.id,
                condition.id,
                value.provider.ID
              );

            if (validDuplicate)
              await this.buyConditionAnswerRepository.delete(validDuplicate.id);
          }
        }

        // const buyPreFinance = await this.buyPreFinanceRepository.listByBuy(
        //   value.buy.id,
        // );

        // if (!buyPreFinance) {
        //   await this.buyPreFinanceRepository.create({
        //     id_compra: value.buy.id,
        //     emitente: value.buy.branch.ID,
        //     buyPreFinancePayment: {
        //       create: {
        //         id_fornecedor: value.provider.ID,
        //         log_user: user.login,
        //         parcelar: 1,
        //         frequencia: 1,
        //         quantidade_parcela: 1,
        //         vencimento: new Date(),
        //       },
        //     },
        //   });
        // }
      }

      provider.push({
        id: value.provider.ID,
        name: value.provider.nome_fantasia,
        allResponsed: allRespond,
      });
    }

    return {
      allResponsed: provider.length > 0 ? provider.every((item) => item.allResponsed) : false,
      provider,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/list-ask-by-provider/:providerId')
  async listAskByProvider(
    @Param('buyId') buyId: string,
    @Param('providerId') providerId: string,
  ) {
    const provider = await this.providerRepository.findById(Number(providerId));

    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const allCondition =
      await this.buyConditionAnswerRepository.listByBuyAndProvider(
        buy.id,
        provider.ID,
      );

    const ask = [];

    allCondition.forEach((answer) => {
      if (answer.condition.editavel) {
        ask.push({
          id: answer.id,
          ask: answer.condition.condicao,
          response: answer.resposta,
        });
      } else
        ask.push({
          id: answer.id,
          ask: answer.condition.condicao,
          missingItems: true,
          response: answer.resposta,
        });
    });

    const allAskByFinance = await this.buyRepository.listByBuyAndFinishProvider(
      buy.id,
      provider.ID,
    );

    if (allAskByFinance) {
      allAskByFinance.buyPreFinance.forEach((value) => {
        value.buyPreFinancePayment.forEach((payment) => {
          ask.push({
            id: 'paymentType',
            response: payment.paymentType.id,
          });
          //(payment.vencimento);
          ask.push({
            id: 'dueDate',
            response: this.dateService
              .dayjsAddTree(payment.vencimento)
              .format('YYYY-MM-DD'),
          });

          ask.push({
            id: 'quantityInstallments',
            response: payment.quantidade_parcela,
          });

          ask.push({
            id: 'frequency',
            response: payment.frequencia,
          });

          ask.push({
            id: 'fixFrequency',
            response: payment.frequencia_fixa,
          });
        });
      });
    }

    return {
      asks: ask,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:buyId/update-ask/:providerId')
  async updateAsk(
    @Param('buyId') buyId: string,
    @Param('providerId') providerId: string,
    @Body() body: UpdateAskBody,
  ) {
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const provider = await this.providerRepository.findById(Number(providerId));

    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    const bodySchema = z.object({
      responses: z.array(
        z.object({
          id: z.coerce.number(),
          response: z.string(),
        }),
      ),
      paymentType: z.coerce.number(),
      dueDate: z.coerce.date(),
      quantityInstallments: z.coerce.number(),
      frequency: z.coerce.number(),
      fixFrequency: z.coerce.boolean(),
    });

    const {
      responses,
      paymentType,
      dueDate,
      quantityInstallments,
      frequency,
      fixFrequency,
    } = bodySchema.parse(body);

    const typePayment =
      await this.financeTypePaymentRepository.findById(paymentType);

    if (!typePayment) {
      throw new NotFoundException(MessageService.Finance_typePayment_not_found);
    }

    for await (const ask of responses) {
      await this.buyConditionAnswerRepository.update(ask.id, {
        resposta: ask.response,
      });
    }

    const buyPreFinance =
      await this.buyPreFinanceRepository.findByBuyAndProvider(
        buy.id,
        provider.ID,
      );

    if (!buyPreFinance) {
      throw new NotFoundException({
        success: false,
        message: MessageService.Buy_pre_finance_not_found,
      });
    }

    await this.buyPreFinancePaymentRepository.update(
      buyPreFinance.buyPreFinancePayment.find((value) => value.provider.ID === provider.ID).id,
      {
        id_pagamento: typePayment.id,
        vencimento: dueDate,
        quantidade_parcela: quantityInstallments,
        frequencia: frequency,
        frequencia_fixa: fixFrequency ? 1 : 0,
      },
    );

    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:buyId/finish-request')
  async finishRequest(@Req() req, @Param('buyId') buyId: string) {
    const user: IUserInfo = req.user;

    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const allQuotation = await this.buyQuotationRepository.listByBuy(buy.id);

    if (allQuotation.length === 0) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    for await (const quotation of allQuotation) {
      const allConditionAnswer =
        await this.buyConditionAnswerRepository.listByBuyAndProvider(
          quotation.buy.id,
          quotation.provider.ID,
        );

      if (
        allConditionAnswer.length > 0 &&
        allConditionAnswer.findIndex((item) => item.resposta === '') >= 0
      ) {
        throw new NotFoundException(
          MessageService.Buy_quotation_answer_not_response,
        );
      }

      const financeQuotation =
        await this.buyPreFinanceRepository.findByBuyAndProvider(
          quotation.buy.id,
          quotation.provider.ID,
        );

      if (!financeQuotation) {
        throw new NotFoundException(MessageService.Buy_pre_finance_not_found);
      }

      if (
        financeQuotation.buyPreFinancePayment[0].paymentType === null ||
        financeQuotation.buyPreFinancePayment[0].vencimento === null
      ) {
        throw new NotFoundException(
          MessageService.Buy_quotation_finance_not_response,
        );
      }

      for await (const quotation of allQuotation) {
        await this.buyQuotationRepository.update(quotation.id, {
          fechado_por: user.login,
        });
      }

      await this.buyRepository.update(buy.id, {
        status: 3,
      });

      return {
        success: true,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/verify_control')
  async verifyControl(@Param('buyId') buyId: string) {
    // 1 - Buscar a compra pelo ID
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    // Aqui to buscando todas as cotações da compra
    const allQuotation = await this.buyQuotationRepository.listByBuy(buy.id);

    //console.log(buy.branch.ID);

    // Aqui estou calculando o total da cotação
    const total = allQuotation.reduce((acc, curr) => {
      const totalItem = curr.quotationItem.reduce((accItem, currItem) =>
        accItem + (currItem.quantidade * currItem.valor), 0);
      return acc + totalItem;
    }, 0);

    const totalCotacao = parseFloat(total.toFixed(2));

    const limits = await this.buyElevationsRepository.listElevations(buy.branch.ID);

    // ordenando limites por valor
    limits.sort((a, b) => parseFloat(a.limite_valor.toString()) - parseFloat(b.limite_valor.toString()));

    let requiredProviders = null;

    for (const limit of limits) {
      if (totalCotacao <= parseFloat(limit.limite_valor.toString())) {
        requiredProviders = limit.num_fornecedores;
        break;
      }
    }

    // AQUI ROBSON Se eu não encontrou um limite adequado, usa o maior disponível
    if (!requiredProviders && limits.length > 0) {
      requiredProviders = limits[limits.length - 1].num_fornecedores;
    }

    const allProviders = (allQuotation.map(quotation => quotation.provider));

    //console.log(allProviders.length);
    // console.log(requiredProviders);

    if (allProviders.length < requiredProviders) {
      throw new BadRequestException(
        `Número insuficiente de fornecedores: necessário pelo menos ${requiredProviders}, mas apenas ${allProviders.length} foram encontrados.`
      );
    }

    return {
      allProviders,
      allQuotation
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:buyId/provider/:id_provider/attachments')
  @UseInterceptors(FilesInterceptor('files'))
  async createAttachments(
    @Req() req,
    @Param('buyId') buy_id: string,
    @Param('id_provider') id_provider: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const provider = await this.providerRepository.findById(
      Number(id_provider),
    );

    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    if (!files || files.length === 0) {
      throw new BadRequestException(MessageService.Attachments_file_required);
    }

    try {
      const path_local = this.env.FILE_PATH;
      const path_local_img = `${path_local}/buy/${buy_id}/quotation/provider/id_${id_provider}`;

      // Itera sobre cada arquivo no array
      for (const file of files) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
          const processedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800 }) // Redimensiona a largura para 800px
            .jpeg({ quality: 80 }) // Define a qualidade para 80%
            .toBuffer();

          await this.fileService.write(
            path_local_img,
            file.originalname,
            processedImageBuffer,
          );
        } else {
          await this.fileService.write(
            path_local_img,
            file.originalname,
            file.buffer,
          );
        }
      }

      return {
        inserted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/provider/:id_provider/attachments')
  async getAttachments(
    @Req() _req,
    @Param('buyId') buy_id: string,
    @Param('id_provider') id_provider: string,
  ) {

    const response: {
      img: { url: string }[];
      errorImg?: { message: string };
    } = {
      img: [],
    };
    //const mapper = AttachmentsServiceOrderMapper;

    const provider = await this.providerRepository.findById(
      Number(id_provider),
    );
    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    try {
      const path = `${this.envService.FILE_PATH}/buy/${buy_id}/quotation/provider/id_${id_provider}`;

      const fileList = this.fileService.list(path);
      fileList.forEach((fileItem) => {
        response.img.push({
          url: `${this.envService.URL_IMAGE}/buy/${buy_id}/quotation/provider/id_${id_provider}/${fileItem}`,
        });
      });
    } catch (error) {
      console.log(error);
      response.errorImg = {
        message: MessageService.SYSTEM_FTP_IMG_ERROR_CONNECT,
      };
    }

    return {
      ...response,
    };

  }

  @UseGuards(AuthGuard)
  @Delete('/:buyId/provider/:id_provider/attachments')
  async deleteAttachments(
    @Req() _req,
    @Param('buyId') buy_id: string,
    @Param('id_provider') id_provider: string,
    @Body() body: DeleteAttachBody
  ) {
    const provider = await this.providerRepository.findById(
      Number(id_provider),
    );
    if (!provider) {
      throw new NotFoundException(MessageService.Provider_id_not_found);
    }

    const path_local = this.env.FILE_PATH;
    const path_local_img = `${path_local}/buy/${buy_id}/quotation/provider/id_${id_provider}/${body.urlFile}`;

    this.fileService.delete(path_local_img);
    return {
      deleted: true,
    }
  }
}
