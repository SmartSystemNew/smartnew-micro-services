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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import sharp from 'sharp';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import BuyApprobationRepository from 'src/repositories/buy-approbation-repository';
import BuyPreFinancePaymentRepository from 'src/repositories/buy-pre-finance-payment-repository';
import BuyQuotationItemRepository from 'src/repositories/buy-quotation-item-repository';
import BuyRepository from 'src/repositories/buy-repository';
import BuyRequestFaultRepository from 'src/repositories/buy-request-fault-repository';
import BuyRequestItemRepository from 'src/repositories/buy-request-item-repository';
import BuyRequestProviderRepository from 'src/repositories/buy-request-provider-repository';
import BuyRequestRepository from 'src/repositories/buy-request-repository';
import BuyRequestStatusRepository from 'src/repositories/buy-request-status-repository';
import FinanceControlRepository from 'src/repositories/finance-control-repository';
import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import FinanceRepository from 'src/repositories/finance-repository';
import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
import ProviderBankRepository from 'src/repositories/provider-bank-repository';
import { SectorExecutingRepository } from 'src/repositories/sector-executing-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { StatusServiceOrderRepository } from 'src/repositories/status-service-order-repository';
import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
import StockRepository from 'src/repositories/stock-repository';
import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';

@ApiTags('Script Case - Buy - Request')
@Controller('/script-case/buy/request')
export default class RequestScriptCaseController {
  constructor(
    private buyRequestRepository: BuyRequestRepository,
    private providerBankRepository: ProviderBankRepository,
    private buyRequestItemRepository: BuyRequestItemRepository,
    private buyRequestStatusRepository: BuyRequestStatusRepository,
    private buyQuotationItemRepository: BuyQuotationItemRepository,
    private financeRepository: FinanceRepository,
    private financeItemRepository: FinanceItemRepository,
    private buyRequestFaultRepository: BuyRequestFaultRepository,
    private stockRepository: StockRepository,
    private stockInventoryRepository: StockInventoryRepository,
    private serviceOrderRepository: ServiceOrderRepository,
    private materialServiceOrderRepository: MaterialServiceOrderRepository,
    private typeMaintenanceRepository: TypeMaintenanceRepository,
    private statusServiceOrderRepository: StatusServiceOrderRepository,
    private sectorExecutingRepository: SectorExecutingRepository,
    private financePaymentRepository: FinancePaymentRepository,
    private buyRequestProviderRepository: BuyRequestProviderRepository,
    private financeControlRepository: FinanceControlRepository,
    private buyRepository: BuyRepository,
    private buyApprobationRepository: BuyApprobationRepository,
    private buyPreFinancePaymentRepository: BuyPreFinancePaymentRepository,
    private fileService: FileService,
    private env: ENVService,
  ) {}
  @UseGuards(AuthGuard)
  @Get('/')
  async listTable(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      page: z.coerce
        .string()
        .transform((value) =>
          value === '' ? 0 : value === 'null' ? null : Number(value) - 1,
        )
        .optional(),
      perPage: z.coerce
        .string()
        .transform((value) =>
          value === '' ? 10 : value === 'null' ? null : Number(value),
        )
        .optional(),
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
      date_from: z
        .string()
        .transform((value) => (value === '' ? null : new Date(value)))
        .optional(),
      date_to: z
        .string()
        .transform((value) => (value === '' ? null : new Date(value)))
        .optional(),
    });

    const query = querySchema.parse(req.query);

    const allProviderBank =
      await this.providerBankRepository.listByClientAndDefault(user.clientId);

    let filterText = {};

    if (query.filterColumn) {
      switch (query.filterColumn) {
        case 'purchaseRequest':
          filterText = {
            buy: {
              numero: {
                equals: Number(query.filterText),
              },
            },
          };
          break;
        case 'number':
          filterText = {
            numero: {
              equals: Number(query.filterText),
            },
          };
          break;
        case 'fiscalId':
          filterText = {
            financeBound: {
              finance: {
                numero_fiscal: {
                  contains: query.filterText,
                },
              },
            },
          };
          break;
        case 'provider':
          filterText = {
            requestProvider: {
              some: {
                provider: {
                  nome_fantasia: {
                    contains: query.filterText,
                  },
                },
              },
            },
          };
          break;
        case 'branch':
          filterText = {
            buy: {
              branch: {
                filial_numero: {
                  contains: query.filterText,
                },
              },
            },
          };
          break;
        case 'responsable':
          filterText = {
            buy: {
              userResponsible: {
                name: { contains: query.filterText },
              },
            },
          };
          break;
        case 'closeRequest':
          if (query.date_from && query.date_to) {
            filterText = {
              buy: {
                fechamento: {
                  gte: query.date_from,
                  lte: query.date_to,
                },
              },
            };
          }
          break;
      }
    }

    const allRequest = await this.buyRequestRepository.listByBranches(
      user.branches,
      query.page,
      query.perPage,
      {
        AND: [
          ...(query.globalFilter
            ? [
                {
                  OR: [
                    ...(Number(query.globalFilter) > 0
                      ? [
                          {
                            numero: {
                              equals: Number(query.globalFilter),
                            },
                          },
                          {
                            buy: {
                              numero: {
                                equals: Number(query.globalFilter),
                              },
                            },
                          },
                        ]
                      : []),
                    {
                      requestProvider: {
                        some: {
                          finance: {
                            numero_fiscal: {
                              contains: query.globalFilter,
                            },
                          },
                        },
                      },
                    },
                    {
                      provider: {
                        nome_fantasia: {
                          contains: query.globalFilter,
                        },
                      },
                    },
                    {
                      buy: {
                        userResponsible: {
                          name: {
                            contains: query.globalFilter,
                          },
                        },
                      },
                    },
                    {
                      buy: {
                        branch: {
                          filial_numero: {
                            contains: query.globalFilter,
                          },
                        },
                      },
                    },
                  ],
                },
              ]
            : []),
          filterText,
        ],
      },
    );

    const allRequestWithinIndex =
      await this.buyRequestRepository.countByBranches(user.branches, {
        AND: [
          ...(query.globalFilter
            ? [
                {
                  OR: [
                    ...(Number(query.globalFilter) > 0
                      ? [
                          {
                            numero: {
                              equals: Number(query.globalFilter),
                            },
                          },
                          {
                            buy: {
                              numero: {
                                equals: Number(query.globalFilter),
                              },
                            },
                          },
                        ]
                      : []),
                    {
                      requestProvider: {
                        some: {
                          finance: {
                            numero_fiscal: {
                              contains: query.globalFilter,
                            },
                          },
                        },
                      },
                    },
                    {
                      provider: {
                        nome_fantasia: {
                          contains: query.globalFilter,
                        },
                      },
                    },
                    {
                      buy: {
                        userResponsible: {
                          name: {
                            contains: query.globalFilter,
                          },
                        },
                      },
                    },
                    {
                      buy: {
                        branch: {
                          filial_numero: {
                            contains: query.globalFilter,
                          },
                        },
                      },
                    },
                  ],
                },
              ]
            : []),
          //{},
          filterText,
        ],
      });
    // const allCondition = await this.buyConditionAnswerRepository.listByBuy()

    //const allBuyPreFinance = await this.buyPreFinancePaymentRepository.listByBuy()

    const response = allRequest.map((request) => {
      const providerBank = allProviderBank.find(
        (value) => value.id_fornecedor === request.provider.ID,
      );

      const buyPreFinance =
        request.buy.buyPreFinance[0].buyPreFinancePayment.find(
          (value) => value.provider.ID === request.provider.ID,
        );

      const financeBound = request.requestProvider.find(
        (value) => value.provider.ID === request.provider.ID,
      );

      const allCondition = request.buy.conditionAnswer.filter(
        (value) => value.provider.ID === request.provider.ID,
      );

      //const allStatus = [];

      const groupedByItem = request.requestItem.reduce(
        (acc, curr) => {
          if (!acc[curr.quotationItem.id]) {
            acc[curr.quotationItem.id] = [];
          }
          acc[curr.quotationItem.id].push(curr);
          return acc;
        },
        {} as {
          [key: string]: {
            id: number;
            status: {
              id: number;
              status: string;
              icone: string;
            };
            quotationItem: {
              id: number;
              quantidade: number;
              valor: number;
            };
          }[];
        },
      );
      //console.log(groupedByItem);
      // 2. Para cada grupo, seleciona o último id (maior id)
      const lastStatusPerItem = Object.values(groupedByItem).map((items) => {
        return items.reduce((prev, curr) => (curr.id > prev.id ? curr : prev));
      });

      //console.log(lastStatusPerItem);

      // 3. Conta a ocorrência de cada id_status
      const statusCount = lastStatusPerItem.reduce(
        (
          acc: any[],
          item: {
            id: number;
            status: {
              id: number;
              status: string;
              icone: string;
            };
            quotationItem: {
              id: number;
              quantidade: number;
              valor: number;
            };
          },
        ) => {
          const existingStatus = acc.find(
            (status) => status.statusId === item.status.id,
          );

          if (existingStatus) {
            existingStatus.count += 1;
          } else {
            acc.push({
              statusId: item.status.id,
              icon: item.status.icone,
              description: item.status.status,
              count: 1,
            });
          }

          return acc;
        },
        [],
      );

      return {
        id: request.id,
        number: financeBound
          ? Number(financeBound.finance.numero_fiscal) === request.numero
            ? 'Sem Registro'
            : financeBound.finance.numero_fiscal
          : null,
        purchaseRequest: request.buy.numero.toString().padStart(6, '0'),
        fiscalId: request.numero,
        branch: request.buy.branch.filial_numero,
        closeRequest: request.buy.fechamento,
        cnpjProvider: request?.provider?.cnpj || '',
        observation: request.buy.observacao,
        provider: request?.provider?.nome_fantasia || '',
        isCancelled: false,
        total: lastStatusPerItem.reduce((acc, current) => {
          return (acc +=
            current.quotationItem.quantidade * current.quotationItem.valor);
        }, 0),
        totalItem: request.requestItem.length,
        account: providerBank?.conta || null,
        agency: providerBank?.agencia || null,
        type: providerBank?.tipo_conta || null,
        bank: providerBank?.nome || null,
        pix: providerBank?.pix || null,
        typePayment: buyPreFinance.paymentType.descricao,
        question: allCondition.length
          ? allCondition[0].condition.condicao
          : null,
        answer: allCondition.length ? allCondition[0].resposta : null,
        responsable: request.buy.userResponsible.name,
        status: statusCount,
        // status: [
        //   {
        //     "statusId": 23,
        //     "icon": "package",
        //     "description": "FATURADO",
        //     "count": 1
        //   }
        // ],
      };
    });

    return {
      data: response,
      totalItems: allRequestWithinIndex,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-status')
  async listStatus(@Req() req) {
    const user: IUserInfo = req.user;

    const allStatus = await this.buyRequestStatusRepository.listClient(
      user.clientId,
    );

    const querySchema = z.object({
      type: z.coerce.string().default('status'),
    });

    const query = querySchema.parse(req.query);

    const data = allStatus.map((status) => ({
      value: status.id,
      text: status.status,
      finalize: status.finaliza === 1,
      close: status.cancelado === 1,
      icon: status.icone,
    }));

    return {
      [query.type]: data,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:requestId/find-report-status')
  async reportStatus(@Param('requestId') requestId: string) {
    const request = await this.buyRequestRepository.findById(Number(requestId));

    if (!request) {
      throw new NotFoundException(MessageService.Buy_request_id_not_found);
    }

    const allItemRequest = await this.buyRequestItemRepository.listByRequest(
      request.id,
    );

    const allItem = [];

    allItemRequest.forEach((item) => {
      const index = allItem.findIndex((i) => i.id === item.quotationItem.id);

      if (index >= 0) {
        allItem[index].close = item.status.finaliza === 1;
        allItem[index].status.push({
          close: item.status.finaliza === 1,
          date: item.log_date,
          icon: item.status.icone,
          id: item.id,
          status: item.status.status,
          statusId: item.status.id,
          user: item.user.name,
        });
      } else {
        allItem.push({
          close: item.status.finaliza === 1,
          id: item.quotationItem.id,
          name: `${item.quotationItem.item.material.material}-${request.provider.nome_fantasia}`,
          observation: request.buy.observacao,
          price: item.quotationItem.valor,
          quantity: item.quotationItem.quantidade,
          status: [
            {
              close: item.status.finaliza === 1,
              date: item.log_date,
              icon: item.status.icone,
              id: item.id,
              status: item.status.status,
              statusId: item.status.id,
              user: item.user.name,
            },
          ],
        });
      }
    });

    return {
      item: allItem,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:requestId')
  async findById(@Req() req, @Param('requestId') requestId: string) {
    const user: IUserInfo = req.user;
    const request = await this.buyRequestRepository.findById(Number(requestId));

    if (!request) {
      throw new NotFoundException(MessageService.Buy_request_id_not_found);
    }

    const findFinance = request.requestProvider.find(
      (value) => value.provider.ID === request.provider.ID,
    );

    if (
      user.module.findIndex((value) => value.id === 11) >= 0 &&
      findFinance &&
      findFinance.finance &&
      (request.numero_fiscal !== findFinance.finance?.numero_fiscal ||
        (request.typeDocument &&
          request.typeDocument.id !== findFinance.finance?.documentType.id) ||
        request.chave !== findFinance.finance?.chave ||
        request.data_emissao !== findFinance.finance?.data_emissao)
    ) {
      await this.buyRequestRepository.update(request.id, {
        numero_fiscal: findFinance.finance?.numero_fiscal,
        id_tipo_documento: findFinance.finance?.documentType.id || null,
        chave: findFinance.finance?.chave,
        data_emissao: findFinance.finance?.data_emissao,
      });
    }

    //console.log(request);
    const buyPreFinancePayment =
      request.buy.buyPreFinance[0].buyPreFinancePayment.find(
        (value) => value.provider.ID === request.provider.ID,
      );

    const finance =
      user.module.findIndex((value) => value.id === 11) >= 0 && findFinance
        ? {
            id: findFinance.finance.id,
            number:
              request.numero === Number(findFinance.finance?.numero_fiscal)
                ? ''
                : findFinance.finance?.numero_fiscal,
            documentType: findFinance.finance?.documentType.id,
            accessKey: findFinance.finance?.chave,
            emissionDate: findFinance.finance?.data_emissao
              .toISOString()
              .split('T')[0],
            able: findFinance.finance.id > 0,
            typePayment: findFinance
              ? {
                  value: findFinance.finance.paymentType.id,
                  text: findFinance.finance.paymentType.descricao,
                }
              : null,
            dueDate: findFinance.finance?.data_vencimento || null,
            quantitySplit: findFinance.finance?.quantidade_parcela,
            frequency: findFinance.finance?.frequencia_pagamento,
            split: findFinance.finance?.parcelar === 1,
            frequencyFix: findFinance.finance?.frequencia_fixa,
            questions: request.buy.conditionAnswer.map((condition) => {
              return {
                id: condition.id,
                answer: condition.resposta,
                ask: condition.condition.condicao,
              };
            }),
          }
        : {
            id: null,
            number: request.numero_fiscal,
            documentType: request?.typeDocument?.id || null,
            accessKey: request.chave,
            emissionDate:
              request.data_emissao?.toISOString().split('T')[0] || null,
            able: false,
            typePayment: buyPreFinancePayment
              ? {
                  value: buyPreFinancePayment.paymentType.id,
                  text: buyPreFinancePayment.paymentType.descricao,
                }
              : null,
            dueDate: buyPreFinancePayment.vencimento || null,
            quantitySplit: buyPreFinancePayment.quantidade_parcela,
            frequency: buyPreFinancePayment.frequencia,
            split: buyPreFinancePayment.parcelar === 1,
            frequencyFix: buyPreFinancePayment.frequencia_fixa,
            questions: request.buy.conditionAnswer.map((condition) => {
              return {
                id: condition.id,
                answer: condition.resposta,
                ask: condition.condition.condicao,
              };
            }),
          };

    const allItemRequest = await this.buyRequestItemRepository.listByRequest(
      request.id,
    );

    const allItem = [];

    let isCancelled = false;
    let canGoBack = true;

    allItemRequest.forEach((item) => {
      let index = allItem.findIndex((i) => i.id === item.quotationItem.id);

      if (item.status.cancelado === 1) {
        isCancelled = true;
      }

      if (index >= 0) {
        allItem[index].close = item.status.finaliza === 1;
        allItem[index].status.push({
          close: item.status.finaliza === 1,
          date: item.log_date,
          icon: item.status.icone,
          id: item.id,
          status: item.status.status,
          statusId: item.status.id,
          user: item.user.name,
        });
      } else {
        allItem.push({
          close: item.status.finaliza === 1,
          id: item.quotationItem.id,
          name: `${item.quotationItem.item.material.material}-${request.provider.nome_fantasia}`,
          observation: request.buy.observacao,
          price: item.quotationItem.valor,
          quantity: item.quotationItem.quantidade,
          status: [
            {
              close: item.status.finaliza === 1,
              date: item.log_date,
              icon: item.status.icone,
              id: item.id,
              status: item.status.status,
              statusId: item.status.id,
              user: item.user.name,
            },
          ],
        });

        index = allItem.findIndex((i) => i.id === item.quotationItem.id);
      }

      if (allItem[index].status.length > 1) {
        canGoBack = false;
      }
    });

    // const response = {
    //   finance,
    //   item: allItem,
    // };

    return {
      finance,
      item: allItem,
      isCancelled,
      canGoBack,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:requestId/item')
  async insertItem(@Req() req, @Param('requestId') requestId: string) {
    const user: IUserInfo = req.user;

    const request = await this.buyRequestRepository.findById(Number(requestId));

    if (!request) {
      throw new NotFoundException(MessageService.Buy_request_id_not_found);
    }

    const bodySchema = z.object({
      itemId: z.array(z.coerce.number()),
      status: z.coerce.number(),
      all_delivered: z.coerce.boolean().optional(),
      quantity_delivered: z.coerce.number().optional(),
      justify: z.coerce.string().optional(),
    });

    const body = bodySchema.parse(req.body);

    for await (const itemId of body.itemId) {
      const quotationItem =
        await this.buyQuotationItemRepository.findById(itemId);

      if (!quotationItem) {
        throw new NotFoundException({
          message: MessageService.Buy_quotation_item_not_found,
          success: false,
        });
      }

      const status = await this.buyRequestStatusRepository.findById(
        body.status,
      );

      if (!status) {
        throw new NotFoundException({
          message: MessageService.Buy_request_status_not_found,
          success: false,
        });
      }

      const validDuplicate =
        await this.buyRequestItemRepository.findByItemAndStatus(
          quotationItem.id,
          status.id,
        );

      if (validDuplicate) {
        throw new ConflictException({
          message: MessageService.Buy_request_status_item_duplicate,
          success: false,
        });
      }

      await this.buyRequestItemRepository.create({
        id_item: quotationItem.id,
        id_pedido: request.id,
        id_status: status.id,
        log_user: user.login,
      });

      // Editando no financeiro
      if (
        status.finaliza === 1 &&
        user.module.findIndex((value) => value.id === 11) >= 0
      ) {
        const finance = request.requestProvider.find(
          (value) => value.provider.ID === request.provider.ID,
        );

        const itemFinance = finance.finance.items.find(
          (value) =>
            value.material.id === quotationItem.item.material.id &&
            value.compositionItem.id ===
              quotationItem.item.compositionItem.id &&
            Number(value.quantidade) === quotationItem.quantidade &&
            Number(value.preco_unitario) === quotationItem.valor,
        );

        if (!itemFinance) {
          // console.log(finance.finance.items);
          // console.log(quotationItem);
          throw new ConflictException({
            message: 'item nao encontrado',
            success: false,
          });
        }

        if (body.all_delivered) {
          await this.financeItemRepository.update(itemFinance.id, {
            quantidade: body.quantity_delivered,
            total: body.quantity_delivered * quotationItem.valor,
          });
        } else {
          await this.buyRequestFaultRepository.create({
            id_item: quotationItem.id,
            id_compra: request.buy.id,
            observacao: body.justify,
            quantidade: body.quantity_delivered,
          });

          await this.financeItemRepository.update(itemFinance.id, {
            quantidade: body.quantity_delivered,
            total: body.quantity_delivered * quotationItem.valor,
          });
        }
      }

      // Editando no estoque
      if (
        status.finaliza === 1 &&
        user.module.findIndex((value) => value.id === 1) >= 0
      ) {
        let stock = await this.stockRepository.findByRequest(request.id);

        if (!stock) {
          stock = await this.stockRepository.create({
            id_cliente: user.clientId,
            id_filial: request.buy.branch.ID,
            id_fornecedor: request.provider.ID,
            id_pedido: request.id,
            numero_documento: request.numero.toString(),
            data_entrada: new Date(),
            log_user: user.login,
          });
        }

        await this.stockInventoryRepository.create({
          id_entrada: stock.id,
          data_entrada: new Date(),
          id_filial: request.buy.branch.ID,
          id_produto: quotationItem.item.material.id,
          id_codigo: quotationItem.item.materialSecond.id,
          id_centro_custo: quotationItem.item.compositionItem
            ? quotationItem.item.compositionItem.compositionGroup.costCenter.ID
            : null,
          quantidade: body.quantity_delivered,
          valor_unitario: quotationItem.valor,
          total: body.quantity_delivered * quotationItem.valor,
          log_user: user.login,
        });

        // Editando na ordem de serviço
        if (
          status.finaliza === 1 &&
          quotationItem.item.vinculo === 'os' &&
          quotationItem.item.material.tipo !== 'service'
        ) {
          const serviceOrder = await this.serviceOrderRepository.findById(
            quotationItem.item.serviceOrder.ID,
          );

          if (!serviceOrder) {
            throw new NotFoundException(
              MessageService.Service_order_id_not_found,
            );
          }

          const itemServiceOrder = serviceOrder.materialServiceOrder.find(
            (value) =>
              value.materialCodigo.id === quotationItem.item.materialSecond.id,
          );

          if (!itemServiceOrder) {
            await this.materialServiceOrderRepository.create({
              id_ordem_servico: serviceOrder.ID,
              id_cliente: user.clientId,
              material: quotationItem.item.material.id,
              id_codigo: quotationItem.item.materialSecond.id,
              quantidade: body.quantity_delivered,
              valor_unidade: quotationItem.valor,
              valor_total: body.quantity_delivered * quotationItem.valor,
              log_user: user.login,
            });
          } else {
            await this.materialServiceOrderRepository.update(
              itemServiceOrder.id,
              {
                quantidade: body.quantity_delivered,
                valor_unidade: quotationItem.valor,
                valor_total: body.quantity_delivered * quotationItem.valor,
              },
            );
          }
        }

        //Editando ordem de servico por equipamento

        if (
          status.finaliza === 1 &&
          quotationItem.item.vinculo === 'equipment'
        ) {
          const serviceOrder = quotationItem.item.serviceOrder
            ? await this.serviceOrderRepository.findByIdAndRequest(
                quotationItem.item.serviceOrder.ID,
                request.id,
              )
            : null;

          if (serviceOrder) {
            const itemServiceOrder = serviceOrder.materialServiceOrder.find(
              (value) =>
                value.materialCodigo.id ===
                quotationItem.item.materialSecond.id,
            );

            if (!itemServiceOrder) {
              await this.materialServiceOrderRepository.create({
                id_ordem_servico: serviceOrder.ID,
                id_cliente: user.clientId,
                material: quotationItem.item.material.id,
                id_codigo: quotationItem.item.materialSecond.id,
                quantidade: body.quantity_delivered,
                valor_unidade: quotationItem.valor,
                valor_total: body.quantity_delivered * quotationItem.valor,
                log_user: user.login,
              });
            } else {
              await this.materialServiceOrderRepository.update(
                itemServiceOrder.id,
                {
                  quantidade: body.quantity_delivered,
                  valor_unidade: quotationItem.valor,
                  valor_total: body.quantity_delivered * quotationItem.valor,
                },
              );
            }
          } else {
            let typeMaintenance =
              await this.typeMaintenanceRepository.findByClientAndType(
                user.clientId,
                'MANUTENÇÃO CORRENTIVA',
              );

            if (!typeMaintenance) {
              typeMaintenance = await this.typeMaintenanceRepository.create({
                ID_cliente: user.clientId,
                sigla: 'MC',
                status: true,
                tipo_manutencao: 'MANUTENÇÃO CORRENTIVA',
                log_user: user.login,
              });
            }

            const allStatus =
              await this.statusServiceOrderRepository.listByClient(
                user.clientId,
              );

            const statusOrderService = allStatus.find(
              (value) => value.status === 'EM ABERTO',
            );

            const allSectorExecuting =
              await this.sectorExecutingRepository.listByClient(user.clientId);

            const sectorExecuting = allSectorExecuting.find(
              (value) => value.descricao === 'MECANICA',
            );

            await this.serviceOrderRepository.create({
              data_hora_solicitacao: new Date(),
              ID_cliente: user.clientId,
              ID_filial: request.buy.branch.ID,
              id_pedido: request.id,
              id_equipamento: quotationItem.item.equipment.ID,
              descricao_solicitacao: request.buy.observacao,
              tipo_manutencao: typeMaintenance?.ID || null,
              status_os: statusOrderService?.id || null,
              setor_executante: sectorExecuting?.Id || null,
              materialServiceOrder: {
                create: {
                  id_cliente: user.clientId,
                  material: quotationItem.item.material.id,
                  id_codigo: quotationItem.item.materialSecond.id,
                  quantidade: body.quantity_delivered,
                  valor_unidade: quotationItem.valor,
                  valor_total: body.quantity_delivered * quotationItem.valor,
                  log_user: user.login,
                },
              },
            });
          }
        }
      }
    }

    return {
      created: true,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:requestId/item')
  async updateItem(@Req() req, @Param('requestId') requestId: string) {
    const user: IUserInfo = req.user;

    const request = await this.buyRequestRepository.findById(Number(requestId));

    if (!request) {
      throw new NotFoundException(MessageService.Buy_request_id_not_found);
    }

    const bodySchema = z.object({
      statusId: z.coerce.number(),
      status: z.coerce.number(),
      all_delivered: z.boolean().optional(),
      quantity_delivered: z.coerce.number().optional(),
      justify: z.coerce.string().optional(),
    });

    const body = bodySchema.parse(req.body);

    const requestItem = await this.buyRequestItemRepository.findById(
      body.statusId,
    );

    const quotationItem = await this.buyQuotationItemRepository.findById(
      requestItem.quotationItem.id,
    );

    if (!quotationItem) {
      throw new NotFoundException({
        message: MessageService.Buy_quotation_item_not_found,
        success: false,
      });
    }

    const status = await this.buyRequestStatusRepository.findById(body.status);

    if (!status) {
      throw new NotFoundException({
        message: MessageService.Buy_request_status_not_found,
        success: false,
      });
    }

    const validDuplicate =
      await this.buyRequestItemRepository.findByItemAndStatus(
        quotationItem.id,
        status.id,
      );

    if (validDuplicate) {
      throw new ConflictException({
        message: MessageService.Buy_request_status_item_duplicate,
        success: false,
      });
    }

    await this.buyRequestItemRepository.update(requestItem.id, {
      id_status: status.id,
      log_user: user.login,
    });

    // Editando no financeiro
    if (
      status.finaliza === 1 &&
      user.module.findIndex((value) => value.id === 11) >= 0
    ) {
      const finance = request.requestProvider.find(
        (value) => value.provider.ID === request.provider.ID,
      );

      const itemFinance = finance.finance.items.find(
        (value) =>
          value.material.id === quotationItem.item.material.id &&
          value.compositionItem.id === quotationItem.item.compositionItem.id &&
          Number(value.quantidade) === quotationItem.quantidade &&
          Number(value.preco_unitario) === quotationItem.valor,
      );

      if (!itemFinance) {
        // console.log(finance.finance.items);
        // console.log(quotationItem);
        throw new ConflictException({
          message: 'item nao encontrado',
          success: false,
        });
      }

      if (body.all_delivered) {
        await this.financeItemRepository.update(itemFinance.id, {
          quantidade: body.quantity_delivered,
          total: body.quantity_delivered * quotationItem.valor,
        });
      } else {
        await this.buyRequestFaultRepository.create({
          id_item: quotationItem.id,
          id_compra: request.buy.id,
          observacao: body.justify,
          quantidade: body.quantity_delivered,
        });

        await this.financeItemRepository.update(itemFinance.id, {
          quantidade: body.quantity_delivered,
          total: body.quantity_delivered * quotationItem.valor,
        });
      }
    }

    // Editando no estoque
    if (
      status.finaliza === 1 &&
      user.module.findIndex((value) => value.id === 1) >= 0
    ) {
      let stock = await this.stockRepository.findByRequest(request.id);

      if (!stock) {
        stock = await this.stockRepository.create({
          id_cliente: user.clientId,
          id_filial: request.buy.branch.ID,
          id_fornecedor: request.provider.ID,
          id_pedido: request.id,
          numero_documento: request.numero.toString(),
          data_entrada: new Date(),
          log_user: user.login,
        });
      }

      await this.stockInventoryRepository.create({
        id_entrada: stock.id,
        data_entrada: new Date(),
        id_filial: request.buy.branch.ID,
        id_produto: quotationItem.item.material.id,
        id_codigo: quotationItem.item.materialSecond.id,
        id_centro_custo:
          quotationItem.item.compositionItem.compositionGroup.costCenter.ID,
        quantidade: body.quantity_delivered,
        valor_unitario: quotationItem.valor,
        total: body.quantity_delivered * quotationItem.valor,
        log_user: user.login,
      });
    }

    // Editando na ordem de serviço
    if (
      status.finaliza === 1 &&
      quotationItem.item.vinculo === 'os' &&
      quotationItem.item.material.tipo !== 'service'
    ) {
      const serviceOrder = await this.serviceOrderRepository.findById(
        quotationItem.item.serviceOrder.ID,
      );

      if (!serviceOrder) {
        throw new NotFoundException(MessageService.Service_order_id_not_found);
      }

      const itemServiceOrder = serviceOrder.materialServiceOrder.find(
        (value) =>
          value.materialCodigo.id === quotationItem.item.materialSecond.id,
      );

      if (!itemServiceOrder) {
        await this.materialServiceOrderRepository.create({
          id_ordem_servico: serviceOrder.ID,
          id_cliente: user.clientId,
          material: quotationItem.item.material.id,
          id_codigo: quotationItem.item.materialSecond.id,
          quantidade: body.quantity_delivered,
          valor_unidade: quotationItem.valor,
          valor_total: body.quantity_delivered * quotationItem.valor,
          log_user: user.login,
        });
      } else {
        await this.materialServiceOrderRepository.update(itemServiceOrder.id, {
          quantidade: body.quantity_delivered,
          valor_unidade: quotationItem.valor,
          valor_total: body.quantity_delivered * quotationItem.valor,
        });
      }
    }

    //Editando ordem de servico por equipamento

    if (status.finaliza === 1 && quotationItem.item.vinculo === 'equipment') {
      const serviceOrder = await this.serviceOrderRepository.findByIdAndRequest(
        quotationItem.item.serviceOrder.ID,
        request.id,
      );

      if (serviceOrder) {
        const itemServiceOrder = serviceOrder.materialServiceOrder.find(
          (value) =>
            value.materialCodigo.id === quotationItem.item.materialSecond.id,
        );

        if (!itemServiceOrder) {
          await this.materialServiceOrderRepository.create({
            id_ordem_servico: serviceOrder.ID,
            id_cliente: user.clientId,
            material: quotationItem.item.material.id,
            id_codigo: quotationItem.item.materialSecond.id,
            quantidade: body.quantity_delivered,
            valor_unidade: quotationItem.valor,
            valor_total: body.quantity_delivered * quotationItem.valor,
            log_user: user.login,
          });
        } else {
          await this.materialServiceOrderRepository.update(
            itemServiceOrder.id,
            {
              quantidade: body.quantity_delivered,
              valor_unidade: quotationItem.valor,
              valor_total: body.quantity_delivered * quotationItem.valor,
            },
          );
        }
      } else {
        let typeMaintenance =
          await this.typeMaintenanceRepository.findByClientAndType(
            user.clientId,
            'MANUTENÇÃO CORRENTIVA',
          );

        if (!typeMaintenance) {
          typeMaintenance = await this.typeMaintenanceRepository.create({
            ID_cliente: user.clientId,
            sigla: 'MC',
            status: true,
            tipo_manutencao: 'MANUTENÇÃO CORRENTIVA',
            log_user: user.login,
          });
        }

        const allStatus = await this.statusServiceOrderRepository.listByClient(
          user.clientId,
        );

        const statusOrderService = allStatus.find(
          (value) => value.status === 'EM ABERTO',
        );

        const allSectorExecuting =
          await this.sectorExecutingRepository.listByClient(user.clientId);

        const sectorExecuting = allSectorExecuting.find(
          (value) => value.descricao === 'MECANICA',
        );

        await this.serviceOrderRepository.create({
          data_hora_solicitacao: new Date(),
          ID_cliente: user.clientId,
          ID_filial: request.buy.branch.ID,
          id_pedido: request.id,
          id_equipamento: quotationItem.item.equipment.ID,
          descricao_solicitacao: request.buy.observacao,
          tipo_manutencao: typeMaintenance?.ID || null,
          status_os: statusOrderService?.id || null,
          setor_executante: sectorExecuting?.Id || null,
          materialServiceOrder: {
            create: {
              id_cliente: user.clientId,
              material: quotationItem.item.material.id,
              id_codigo: quotationItem.item.materialSecond.id,
              quantidade: body.quantity_delivered,
              valor_unidade: quotationItem.valor,
              valor_total: body.quantity_delivered * quotationItem.valor,
              log_user: user.login,
            },
          },
        });
      }
    }

    return {
      updated: true,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:requestId/item')
  async deleteItem(@Req() req, @Param('requestId') requestId: string) {
    const request = await this.buyRequestRepository.findById(Number(requestId));

    if (!request) {
      throw new NotFoundException(MessageService.Buy_request_id_not_found);
    }

    const bodySchema = z.object({
      statusId: z.coerce.number(),
    });

    const body = bodySchema.parse(req.body);

    await this.buyRequestItemRepository.delete(body.statusId);

    return {
      deleted: true,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:requestId/finance')
  async updateFinance(@Req() req, @Param('requestId') requestId: string) {
    const user: IUserInfo = req.user;

    const request = await this.buyRequestRepository.findById(Number(requestId));

    if (!request) {
      throw new NotFoundException(MessageService.Buy_request_id_not_found);
    }

    const bodySchema = z.object({
      number: z.coerce.string(),
      documentType: z.coerce.number(),
      emissionDate: z.coerce.date(),
      accessKey: z.coerce.string().optional(),
      dueDate: z.coerce.date().optional().nullable(),
      frequency: z.coerce.number().optional().nullable(),
      frequencyFix: z.coerce.number().optional().nullable(),
      split: z.coerce.number().optional().nullable(),
      quantity: z.coerce.number().optional().nullable(),
      typePaymentId: z.coerce.number().optional().nullable(),
    });

    const body = bodySchema.parse(req.body);

    await this.buyRequestRepository.update(request.id, {
      numero_fiscal: body.number,
      chave: body.accessKey,
      data_emissao: body.emissionDate,
      id_tipo_documento: body.documentType,
    });

    if (user.module.findIndex((module) => module.id === 11) >= 0) {
      const findFinance = request.requestProvider.find(
        (value) => value.provider.ID === request.provider.ID,
      );

      //console.log(findFinance);

      await this.financeRepository.update(findFinance.finance.id, {
        numero_fiscal: body.number,
        chave: body.accessKey,
        data_emissao: body.emissionDate,
        id_documento_tipo: body.documentType,
      });
    } else {
      const buyPreFinancePayment =
        request.buy.buyPreFinance[0].buyPreFinancePayment.find(
          (value) => value.provider.ID === request.provider.ID,
        );

      await this.buyPreFinancePaymentRepository.update(
        buyPreFinancePayment.id,
        {
          vencimento: body.dueDate,
          frequencia: body.frequency,
          frequencia_fixa: body.frequencyFix,
          parcelar: body.split,
          quantidade_parcela: body.quantity,
          id_pagamento: body.typePaymentId,
        },
      );
    }

    return {
      updated: true,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:requestId/finalize')
  async finalizeFinance(@Req() req, @Param('requestId') requestId: string) {
    const user: IUserInfo = req.user;

    const request = await this.buyRequestRepository.findById(Number(requestId));

    if (!request) {
      throw new NotFoundException(MessageService.Buy_request_id_not_found);
    }

    const allItem = [];

    request.requestItem.forEach((item) => {
      const index = allItem.findIndex(
        (value) => value.quotationItem.id === item.quotationItem.id,
      );

      if (index < 0) {
        allItem.push(item);
      } else {
        allItem[index] = item;
      }

      //console.log(allItem);
    });

    //console.log(allItem);

    if (allItem.some((value) => value.status.finaliza === 0)) {
      return {
        message: MessageService.Buy_request_not_finalize,
        success: false,
      };
    }

    const bodySchema = z.object({
      number: z.coerce.string(),
      documentType: z.coerce.number(),
      emissionDate: z.coerce.date(),
      accessKey: z.coerce.string().optional(),
    });

    const body = bodySchema.parse(req.body);

    await this.buyRequestRepository.update(request.id, {
      numero_fiscal: body.number,
      chave: body.accessKey,
      data_emissao: body.emissionDate,
      id_tipo_documento: body.documentType,
    });

    if (user.module.findIndex((module) => module.id === 11) >= 0) {
      const findFinance = request.requestProvider.find(
        (value) => value.provider.ID === request.provider.ID,
      );

      //console.log(findFinance);

      const totalItem = findFinance.finance.items.reduce((acc, current) => {
        return (acc +=
          Number(current.preco_unitario) * Number(current.quantidade));
      }, 0);

      const finance = await this.financeRepository.findById(
        findFinance.finance.id,
      );

      const totalAddition = finance.registerTribute.reduce((acc, current) => {
        if (current.tipo === 'ACRESCIMO') {
          return (acc += Number(current.valor));
        } else {
          return (acc += 0);
        }
      }, 0);

      const totalDiscount = finance.registerTribute.reduce((acc, current) => {
        if (current.tipo === 'DESCONTO') {
          return (acc += Number(current.valor));
        } else {
          return (acc += 0);
        }
      }, 0);

      const totalLiquid = totalItem + (totalAddition - totalDiscount);

      await this.financeRepository.update(findFinance.finance.id, {
        numero_fiscal: body.number,
        chave: body.accessKey,
        data_emissao: body.emissionDate,
        id_documento_tipo: body.documentType,
        documento_valor: totalItem,
        total_acrescimo: totalAddition,
        total_desconto: totalDiscount,
        total_liquido: totalLiquid,
      });

      for await (const payment of finance.installmentFinance) {
        await this.financePaymentRepository.update(payment.id, {
          valor_a_pagar: totalLiquid / finance.quantidade_parcela,
          valor_parcela: totalLiquid / finance.quantidade_parcela,
        });
      }
    }

    if (user.module.findIndex((module) => module.id === 1) >= 0) {
      const stock = await this.stockRepository.findByRequest(request.id);

      if (!stock) {
        throw new NotFoundException(
          MessageService.Maintenance_stock_id_not_found,
        );
      }

      await this.stockRepository.update(stock.id, {
        numero_documento: body.number,
      });
    }

    return {
      updated: true,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Retorna um pedido para aprovação',
    description: `
    Este endpoint permite que um usuário autenticado retorne um pedido específico para a tela de aprovação.
    O pedido é identificado pelo parâmetro **requestId** na URL.

    Funcionalidades:
    - Verifica se o pedido existe no sistema.
    - Valida os itens do pedido para garantir que todos não estão finalizados.

    Notas:
    - Se existir outro pedido do compra, ele automaticamente também sera restaurado.
    - Se o pedido não for encontrado, retorna um erro 404.
      `,
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Pedido retornado com sucesso para aprovação.',
    type: class ReturnApprobationResponse {
      message: string;
      success: boolean;
    },
  })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  @Put('/:requestId/return-approbation')
  async returnForApprobation(
    @Req() req,
    @Param('requestId') requestId: string,
  ) {
    const user: IUserInfo = req.user;

    const request = await this.buyRequestRepository.findById(Number(requestId));

    if (!request) {
      throw new NotFoundException(MessageService.Buy_request_id_not_found);
    }

    const buyRequest = await this.buyRequestRepository.listByBuy(
      request.buy.id,
    );

    buyRequest.forEach((value) => {
      if (value.requestItem.some((item) => item.status.finaliza === 1)) {
        throw new ConflictException({
          message: MessageService.Buy_request_finalize,
          success: false,
        });
      }
    });

    // Remove do financeiro
    if (user.module.find((module) => module.id === 11)) {
      for await (const requestProvider of request.requestProvider) {
        const finance = await this.financeRepository.findById(
          requestProvider.finance.id,
        );

        await this.financePaymentRepository.deleteByFinance(finance.id);
        await this.buyRequestProviderRepository.delete(requestProvider.id);

        await this.financeRepository.delete(finance.id);
        await this.financeControlRepository.delete(finance.financeControl.id);
      }
    }

    // //Remove do Manutenção
    // if(user.module.find((module) => module.id === 1)){

    // }

    await this.buyRequestRepository.delete(request.id);
    await this.buyRepository.update(request.buy.id, {
      status: 4, // Volta para aprovacao
      buyApprobation: {
        updateMany: {
          data: {
            aprovado: null,
            assinatura: null,
          },
          where: {
            id_compra: request.buy.id,
          },
        },
      },
      observacao: request.buy.observacao + '\n Pedido Retornado!',
    });
  }

  @UseGuards(AuthGuard)
  @Post('/:requestId/attachment')
  @UseInterceptors(FilesInterceptor('files'))
  async createAttachments(
    @Req() req,
    @Param('requestId') requestId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const request = await this.buyRequestRepository.findById(Number(requestId));

    if (!request) {
      throw new NotFoundException(MessageService.Buy_request_id_not_found);
    }

    if (!files || files.length === 0) {
      throw new BadRequestException(MessageService.Attachments_file_required);
    }

    try {
      const path_local = this.env.FILE_PATH;
      let path_local_img = `${path_local}/pedido/id_${request.id}`;
      if (
        request.requestProvider.length > 0 &&
        request.requestProvider[0].finance
      ) {
        path_local_img = `${path_local}/financeiro/id_${request.requestProvider[0].finance.id}`;
      }

      // Itera sobre cada arquivo no array
      for (const file of files) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
          const processedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800 }) // Redimensiona a largura para 800px
            .jpeg({ quality: 80 }) // Define a qualidade para 80%
            .toBuffer();

          const fileInfo = file.originalname.split('.');

          const name = `${fileInfo[0]
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]/g, '')
            .toLowerCase()}.${fileInfo[1]}`;

          await this.fileService.write(
            path_local_img,
            name,
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
  @Get('/:requestId/attachment')
  async getAttachments(@Req() _req, @Param('requestId') requestId: string) {
    const response: {
      img: { url: string; name: string; type: string }[];
      errorImg?: { message: string };
    } = {
      img: [],
    };
    //const mapper = AttachmentsServiceOrderMapper;

    const request = await this.buyRequestRepository.findById(Number(requestId));

    if (!request) {
      throw new NotFoundException(MessageService.Buy_request_id_not_found);
    }

    try {
      const path_local = this.env.FILE_PATH;
      let path_local_img = `${path_local}/pedido/id_${request.id}`;
      if (
        request.requestProvider.length > 0 &&
        request.requestProvider[0].finance
      ) {
        path_local_img = `${path_local}/financeiro/id_${request.requestProvider[0].finance.id}`;
      }

      const fileList = this.fileService.list(path_local_img);

      fileList.forEach((fileItem) => {
        const imgInfo = fileItem.split('.');
        if (
          request.requestProvider.length > 0 &&
          request.requestProvider[0].finance
        ) {
          response.img.push({
            url: `${this.env.URL_IMAGE}/financeiro/id_${request.requestProvider[0].finance.id}/${fileItem}`,
            name: imgInfo[0],
            type: imgInfo[1],
          });
        } else {
          response.img.push({
            url: `${this.env.URL_IMAGE}/pedido/id_${request.id}/${fileItem}`,
            name: imgInfo[0],
            type: imgInfo[1],
          });
        }
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
  @Delete('/:requestId/attachment')
  async deleteAttachments(
    @Req() _req,
    @Param('requestId') requestId: string,
    @Body() body: { urlFile: string },
  ) {
    const request = await this.buyRequestRepository.findById(Number(requestId));

    if (!request) {
      throw new NotFoundException(MessageService.Buy_request_id_not_found);
    }

    const path_local = this.env.FILE_PATH;

    let path_local_img = `${path_local}/pedido/id_${request.id}/${body.urlFile}`;

    if (
      request.requestProvider.length > 0 &&
      request.requestProvider[0].finance
    ) {
      path_local_img = `${path_local}/financeiro/id_${request.requestProvider[0].finance.id}/${body.urlFile}`;
    }

    this.fileService.delete(path_local_img);
    return {
      deleted: true,
    };
  }
}
