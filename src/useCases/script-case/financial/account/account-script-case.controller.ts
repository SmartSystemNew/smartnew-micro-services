import {
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import FinanceRepository from 'src/repositories/finance-repository';
import ProviderRepository from 'src/repositories/provider-repository';
import { BranchRepository } from 'src/repositories/branch-repository';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import FinanceTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
import { MessageService } from 'src/service/message.service';
import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
import MaterialRepository from 'src/repositories/material-repository';
import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import { DateService } from 'src/service/data.service';
import InsertFinanceBody from './dtos/insertFinance-body';
import FinanceControlRepository from 'src/repositories/finance-control-repository';
import FinanceNumberRepository from 'src/repositories/finance-number-repository';
import FinanceNumberTypeDocumentRepository from 'src/repositories/finance-numberTypeDocument-repository';
import { IFinancePrisma } from 'src/models/IFinance';
import LogFinanceRepository from 'src/repositories/log-finance-repository';
import InsertItemBody from './dtos/insertItem-body';
import EquipmentRepository from 'src/repositories/equipment-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { CompositionItemRepository } from 'src/repositories/composition-item-repository';
import FinanceItemBoundRepository from 'src/repositories/finance-item-bound-repository';
import { z } from 'zod';
import { $Enums } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { ENVService } from 'src/service/env.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/service/file.service';
import { UpdateInstallmentFinanceBody } from './dtos/updateInstallmentFinance-body';
import FinanceEmissionItemRepository from 'src/repositories/finance-emissionItem-repository';
import FinanceRegisterTributeRepository from 'src/repositories/finance-registerTribute-repository';
import InsertRegisterBody from 'src/useCases/financial/account/dtos/insertTribute-body';
import UpdateRegisterBody from 'src/useCases/financial/account/dtos/updateRegister-body';
import FinanceTaxationRepository from 'src/repositories/financeTaxation-repository';
import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';

@ApiTags('Script Case - Financial - Account')
@Controller('/script-case/financial/account')
export default class AccountScriptCaseController {
  constructor(
    private financeRepository: FinanceRepository,
    private providerRepository: ProviderRepository,
    private branchRepository: BranchRepository,
    private financeTypeDocumentRepository: FinanceTypeDocumentRepository,
    private financeItemRepository: FinanceItemRepository,
    private materialRepository: MaterialRepository,
    private contractTypeInput: ContractTypeInputRepository,
    private financeTypePaymentRepository: FinanceTypePaymentRepository,
    private financePaymentRepository: FinancePaymentRepository,
    private dateService: DateService,
    private envService: ENVService,
    private fileService: FileService,
    private financeControlRepository: FinanceControlRepository,
    private financeNumberRepository: FinanceNumberRepository,
    private financeNumberTypeDocumentRepository: FinanceNumberTypeDocumentRepository,
    private logFinanceRepository: LogFinanceRepository,
    private equipmentRepository: EquipmentRepository,
    private orderRepository: ServiceOrderRepository,
    private compositionItemRepository: CompositionItemRepository,
    private financeItemBoundRepository: FinanceItemBoundRepository,
    private financeEmissionItemRepository: FinanceEmissionItemRepository,
    private financeRegisterTributeRepository: FinanceRegisterTributeRepository,
    private financeTaxationRepository: FinanceTaxationRepository,
    private contractTypeInputRepository: ContractTypeInputRepository,
    private materialServiceOrderRepository: MaterialServiceOrderRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/list-branch')
  async listBranch(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      type: z.string().optional().default('branch'),
    });

    const query = querySchema.parse(req.query);

    const response = user.branch.map((branch) => {
      return {
        id: branch.id,
        name: `${branch.name} ${branch.cnpj}`,
        //selected: false,
      };
    });

    return { [query.type]: response, success: true };
  }

  @UseGuards(AuthGuard)
  @Get('/list-type-payment')
  async listTypePayment(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      type: z.string().optional().default('typePayment'),
    });

    const query = querySchema.parse(req.query);

    const allTypePayment = await this.financeTypePaymentRepository.listByClient(
      user.clientId,
    );

    const response = allTypePayment.map((typePayment) => {
      return {
        id: typePayment.id,
        name: typePayment.descricao,
        split: typePayment.parcela === 1,
        //selected: false,
      };
    });

    return { [query.type]: response, success: true };
  }

  @UseGuards(AuthGuard)
  @Get('/list-equipment')
  async listEquipment(@Req() req) {
    const user: IUserInfo = req.user;

    const equipment = await this.equipmentRepository.listByBranch(
      user.branches,
    );

    return {
      data: equipment.map((item) => {
        return {
          value: item.ID.toString(),
          label: `${item.equipamento_codigo} - ${item.descricao}`,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-input')
  async listInput(@Req() req) {
    const user: IUserInfo = req.user;

    const input = await this.contractTypeInputRepository.listByClient(
      user.clientId,
    );

    return {
      data: input.map((item) => {
        return {
          value: item.id.toString(),
          label: item.insumo,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-material')
  async listMaterial(@Req() req) {
    const user: IUserInfo = req.user;

    const input = await this.materialRepository.listByClient(user.clientId);

    return {
      data: input.map((item) => {
        return {
          value: item.id.toString(),
          label: `${item.codigo} - ${item.material}`,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-material-by-order/:orderId')
  async listMaterialByOrder(@Param('orderId') orderId: string) {
    const material =
      await this.materialServiceOrderRepository.listByServiceOrder(
        Number(orderId),
      );

    return {
      data: material.map((item) => {
        return {
          value: item.materials.id.toString(),
          label: `${item.materials.codigo} - ${item.materials.material}`,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-order')
  async listOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const order = await this.orderRepository.listByBranch(user.branches);

    return {
      data: order.map((item) => {
        return {
          value: item.ID.toString(),
          label: `${item.ordem} - ${item.equipment.descricao}`,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findById(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const allProvider = await this.providerRepository.listByBranches(
      user.branches,
      user.clientId,
    );

    const allFinanceTypePayment =
      await this.financeTypePaymentRepository.listByClient(user.clientId);

    const issuer_identification =
      finance.direcao === 'pagar'
        ? allProvider.map((value) => {
            return {
              id: value.ID,
              name: `${value.razao_social} ${value.cnpj}`,
              selected: finance.emitente === value.ID,
              days: value.dias,
            };
          })
        : user.branch.map((value) => {
            return {
              id: value.id,
              name: `${value.name} ${value.cnpj}`,
              selected: finance.emitente === value.id,
              days: null,
            };
          });

    const recipient =
      finance.direcao === 'pagar'
        ? user.branch.map((value) => {
            return {
              id: value.id,
              name: `${value.name} ${value.cnpj}`,
              selected: finance.remetente === value.id,
              days: null,
            };
          })
        : allProvider.map((value) => {
            return {
              id: value.ID,
              name: `${value.razao_social} ${value.cnpj}`,
              selected: finance.remetente === value.ID,
              days: value.dias,
            };
          });

    const allTypeDocument =
      await this.financeTypeDocumentRepository.listByClient(user.clientId);

    const document_type = allTypeDocument.map((value) => {
      return {
        id: value.id,
        name: value.descricao,
        selected: finance.documentType.id === value.id,
        hasKey: value.requer_chave,
      };
    });

    const total =
      (await this.financeItemRepository.aggregateByTitle(finance.id))._sum
        .total || 0;

    const allFinancePayment = await this.financePaymentRepository.findByFinance(
      finance.id,
    );

    const days =
      finance.direcao === 'pagar'
        ? issuer_identification.find((value) => value.selected === true)
            ?.days || 1
        : recipient.find((value) => value.selected === true)?.days || 1;

    const canDelete =
      (allFinancePayment.length === 0 ||
        !allFinancePayment.some((value) => value.status === 3)) &&
      finance.bankTransferPay === null &&
      finance.bankTransferReceive === null;

    const canEdit =
      (allFinancePayment.length === 0 ||
        !allFinancePayment.some((value) => value.status === 3)) &&
      finance.bankTransferPay === null &&
      finance.bankTransferReceive === null;

    // console.log(finance);
    // console.log(allFinancePayment);

    const response = {
      id: finance.id,
      type: finance.direcao,
      direction: [
        {
          id: 'pagar',
          name: 'Contas a pagar',
          selected: finance.direcao === 'pagar',
        },
        {
          id: 'receber',
          name: 'Contas a receber',
          selected: finance.direcao === 'receber',
        },
      ],
      invoice_number: finance.documento_numero,
      document_number: finance.numero_fiscal,
      issuer_identification,
      recipient,
      date_emission: this.dateService
        .dayjs(finance.data_emissao)
        //.add(6, 'h')
        .format('YYYY-MM-DD'),
      date_release: this.dateService
        .dayjs(finance.data_lancamento)
        //.add(3, 'h')
        .format('YYYY-MM-DD HH:mm'),
      document_type,
      access_key: finance.chave,
      status: finance.status,
      observation: finance.descricao,
      total,
      typePayment: allFinanceTypePayment.map((value) => {
        return {
          id: value.id,
          name: value.descricao,
          selected:
            finance.paymentType !== null && value.id === finance.paymentType.id,
          willInstallment: value.parcela === 1,
        };
      }),
      dueDate:
        finance.data_vencimento !== null
          ? this.dateService.dayjs(finance.data_vencimento).format('YYYY-MM-DD')
          : this.dateService
              .dayjs(finance.data_emissao)
              .add(3, 'h')
              .add(days === null ? 0 : days, 'D')
              .format('YYYY-MM-DD'),
      goInstallments: finance.parcelar === 1,
      installmentAmount: finance.quantidade_parcela,
      paymentFrequency: finance.frequencia_pagamento,
      total_addition: finance.total_acrescimo,
      total_discount: finance.total_desconto,
      addition_liquid: finance.acrescimo_desconto,
      total_liquid: finance.total_liquido,
      fixInterval: finance.frequencia_fixa === 1,
      canDelete,
      canEdit,
      days,
      dados: allFinancePayment.map((value) => {
        return {
          id: value.id,
          split: value.parcela,
          dueDate: value.vencimento,
          extension: value.prorrogacao,
          amountPay: value.valor_a_pagar,
          addition: value.acrescimo,
          discount: value.desconto,
          installmentValue: value.valor_parcela,
          pay: value.status === 3,
          paymentDay: value.emissionItem
            ? value.emissionItem.emission.data_vencimento
            : null,
        };
      }),
    };

    return { ...response, success: true };
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateFinance(@Req() req, @Param('id') id: number) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const bodySchema = z.object({
      values: z
        .object({
          observation: z
            .string()
            .transform((value) => (value === '' ? null : value))
            .optional(),
          date_emission: z
            .string()
            .transform((value) => (value === '' ? null : new Date(value)))
            .optional(),
        })
        .optional(),
    });

    const body = bodySchema.parse(req.body);

    await this.financeRepository.update(finance.id, {
      descricao: body.values?.observation,
      data_emissao: body.values?.date_emission,
    });

    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteFinance(@Req() req, @Param('id') id: number) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    if (
      finance.status === 'FECHADO' ||
      finance.installmentFinance.some((value) => value.status === 3)
    ) {
      throw new ConflictException({
        message: MessageService.Finance_not_delete_split,
        success: false,
      });
    }

    if (finance.requestProvider.length > 0) {
      throw new ConflictException({
        message: MessageService.Finance_not_delete_buy_bound,
        success: false,
      });
    }

    //await this.financePaymentRepository.deleteByFinance(finance.id);
    try {
      await this.financeRepository.delete(finance.id);
    } catch (error) {
      console.log(error);

      throw new ConflictException(error);
    }

    return {
      success: true,
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async insertFinance(@Req() req, @Body() body: InsertFinanceBody) {
    const user: IUserInfo = req.user;

    const dateEmission = this.dateService
      .dayjs(body.date_emission)
      //.subtract(3, 'h')
      .toDate();
    //return false;
    const documentType = await this.financeTypeDocumentRepository.findById(
      Number(body.document_type),
    );

    if (!documentType) {
      throw new NotFoundException(
        MessageService.Finance_typeDocument_not_found,
      );
    }
    let issue = 0;
    let sender = 0;

    if (body.type === 'pagar') {
      const provider = await this.providerRepository.findById(
        Number(body.issuer_identification),
      );

      if (!provider) {
        throw new NotFoundException(MessageService.Finance_issue_not_found);
      }

      issue = provider.ID;

      const branch = user.branch.find(
        (value) => value.id === Number(body.recipient),
      );

      if (!branch) {
        throw new NotFoundException(MessageService.Finance_sender_not_found);
      }

      sender = branch.id;
    } else {
      const branch = user.branch.find(
        (value) => value.id === Number(body.issuer_identification),
      );

      if (!branch) {
        throw new NotFoundException(MessageService.Finance_sender_not_found);
      }

      issue = branch.id;

      const provider = await this.providerRepository.findById(
        Number(body.recipient),
      );

      if (!provider) {
        throw new NotFoundException(MessageService.Finance_issue_not_found);
      }

      sender = provider.ID;
    }

    const validFinance = await this.financeRepository.findIfExist(
      documentType.id,
      Number(body.issuer_identification),
      Number(body.recipient),
      body.document_number,
      body.type,
    );

    if (validFinance) {
      throw new ConflictException({
        message: MessageService.Finance_duplicate,
        exists: true,
        data: validFinance,
        success: false,
      });
    }

    const lastNumberProcess = await this.financeNumberRepository.findLastNumber(
      user.clientId,
    );

    await this.financeControlRepository.insert({
      emitente_pagar: body.type === 'pagar' ? issue : null,
      remetente_pagar: body.type === 'pagar' ? sender : null,
      emitente_receber: body.type === 'receber' ? issue : null,
      remetente_receber: body.type === 'receber' ? sender : null,
      finance: {
        create: {
          direcao: body.type,
          id_cliente: user.clientId,
          documento_numero: (lastNumberProcess + 1).toString(),
          id_documento_tipo: documentType.id,
          data_emissao: dateEmission,
          data_lancamento: this.dateService
            .dayjs(new Date())
            .subtract(3, 'h')
            .toDate(),
          emitente: issue,
          remetente: sender,
          id_filial: body.type === 'pagar' ? sender : issue,
          id_filial_pagador: 0,
          id_fornecedor: 0,
          chave: body.access_key,
          descricao: body.observation,
          log_user: user.login,
          numero_fiscal: body.document_number.toString(),
          total_acrescimo: 0,
          total_desconto: 0,
          documento_tipo: null,
          numberFinance: {
            create: {
              id_cliente: user.clientId,
              numero: lastNumberProcess + 1,
            },
          },
        },
      },
    });

    const finance = await this.financeRepository.findLast(user.clientId);

    await this.financeNumberTypeDocumentRepository.insert({
      id_cliente: user.clientId,
      id_tipo_documento: documentType.id,
      numero: Number(body.document_number),
    });

    await this.logFinance(finance, user, 'INSERT');

    return {
      id: finance.id,
      inserted: true,
      success: true,
    };
  }

  async logFinance(
    finance: IFinancePrisma,
    user: IUserInfo,
    action: 'INSERT' | 'UPDATE' | 'DELETE',
  ): Promise<boolean> {
    await this.logFinanceRepository.insert({
      //id: finance.id,
      id_financeiro: finance.id,
      acao: action,
      id_cliente: finance.id_cliente,
      id_filial: finance.id_filial,
      id_documento_tipo: finance.id_documento_tipo,
      direcao: finance.direcao,
      id_fornecedor: finance.id_fornecedor,
      id_filial_pagador: finance.id_filial_pagador,
      descricao: finance.descricao,
      documento_numero: finance.documento_numero,
      numero_fiscal: finance.numero_fiscal,
      documento_tipo: finance.documento_tipo,
      frequencia_pagamento: finance.frequencia_pagamento,
      documento_valor: finance.documento_valor,
      parcelar: finance.parcelar,
      quantidade_parcela: finance.quantidade_parcela,
      data_vencimento: finance.data_vencimento,
      observacoes: finance.observacoes,
      log_date: finance.log_date,
      log_user: finance.log_user,
      data_emissao: finance.data_emissao,
      data_lancamento: finance.data_lancamento,
      emitente: finance.emitente,
      remetente: finance.remetente,
      chave: finance.chave,
      status: finance.status,
      total_acrescimo: finance.total_acrescimo,
      total_desconto: finance.total_desconto,
      acrescimo_desconto: finance.acrescimo_desconto,
      total_liquido: finance.total_liquido,
      date_log: finance.log_date,
      user_log: user.login,
    });

    return true;
  }

  @UseGuards(AuthGuard)
  @Get('/:id/attach')
  async listAttachment(@Param('id') id: string) {
    const response: {
      img: { url: string; name: string; type: string }[];
      errorImg?: { message: string };
    } = {
      img: [],
    };

    try {
      const finance = await this.financeRepository.findById(Number(id));

      if (!finance) {
        throw new NotFoundException(MessageService.Finance_not_found);
      }

      const path = `${this.envService.FILE_PATH}/financeiro/id_${id}/`;

      const fileList = this.fileService.list(path);

      fileList.forEach((fileItem) => {
        response.img.push({
          url: `${this.envService.URL_IMAGE}/financeiro/id_${id}/${fileItem}`,
          name: fileItem.split('.')[0],
          type: fileItem.split('.')[1],
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
      success: true,
    };
  }

  @Post('/:id/attach')
  @UseInterceptors(FileInterceptor('file'))
  async insertAttach(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const path = `${this.envService.FILE_PATH}/financeiro/id_${id}/`;

    const fileInfo = file.originalname.split('.');

    const name = `${fileInfo[0]
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase()}.${fileInfo[1]}`;

    this.fileService.write(path, name, file.buffer);

    return {
      insert: true,
      url: `${this.envService.URL_IMAGE}/financeiro/id_${id}/${name}`,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/attach')
  async deleteAttach(
    @Param('id') id: string,
    @Body() body: { urlFile: string },
  ) {
    const path = `${this.envService.FILE_PATH}/financeiro/id_${id}/${body.urlFile}`;

    this.fileService.delete(path);

    return {
      delete: true,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id/item')
  async listItem(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const allItem = await this.financeItemRepository.findByTitle(finance.id);

    const allMaterial = await this.materialRepository.listByClientAndActive(
      user.clientId,
    );

    const allInput = await this.contractTypeInput.listByClient(user.clientId);

    const item = allItem.map((value) => {
      const material =
        finance.direcao === 'pagar'
          ? allMaterial.find((material) => {
              if (value.id_insumo !== null && material.id === value.id_insumo) {
                return true;
              } else if (
                value.id_material !== null &&
                material.id === value.id_material
              ) {
                return true;
              }

              return false;
            })
          : null;

      const input =
        finance.direcao === 'receber'
          ? allInput.find((input) => {
              if (value.id_insumo !== null && input.id === value.id_insumo) {
                return true;
              } else if (
                value.id_material !== null &&
                input.id === value.id_material
              ) {
                return true;
              }

              return false;
            })
          : null;

      const equipmentBound = value.financeBound.length
        ? value.financeBound[0].equipment
          ? value.financeBound[0].equipment
          : null
        : value.equipment;

      const orderBound = value.financeBound.length
        ? value.financeBound[0].order
          ? value.financeBound[0].order
          : null
        : value.order;

      return {
        id: value.id,
        item: value.item,
        bound: value.vinculo === 'STOCK' ? 'stock' : value.vinculo,
        itemBound:
          value.vinculo !== 'STOCK' &&
          value.vinculo !== 'EMPTY' &&
          value.vinculo !== null
            ? {
                id: equipmentBound?.ID ?? orderBound?.ID,
                description: equipmentBound
                  ? `${equipmentBound.equipamento_codigo}-${equipmentBound.descricao}`
                  : `${orderBound.ordem}-${orderBound.equipment.equipamento_codigo}-${orderBound.equipment.descricao}`,
              }
            : {},
        material:
          finance.direcao === 'pagar'
            ? {
                id: material.id,
                description: material.material,
              }
            : {
                id: input.id,
                description: input.insumo,
              },
        costCenter: `${value.compositionItem.compositionGroup.costCenter.centro_custo}-${value.compositionItem.compositionGroup.costCenter.descricao}`,
        composition: {
          id: value.compositionItem.id,
          code: value.compositionItem.composicao,
          description: value.compositionItem.descricao,
        },
        price: value.preco_unitario,
        quantity: value.quantidade,
        total: value.total,
      };
    });

    return {
      item,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id/item')
  async insertItem(
    @Req() req,
    @Param('id') id: string,
    @Body() body: InsertItemBody,
  ) {
    const user: IUserInfo = req.user;
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException({
        message: MessageService.Finance_not_found,
        success: false,
      });
    }

    let itemBound = null;

    if (body.bound !== '' && body.bound !== 'STOCK') {
      if (
        (body.bound === 'EQUIPMENT' || body.bound === 'equipment') &&
        body.item_bounded
      ) {
        const equipment = await this.equipmentRepository.findById(
          Number(body.item_bounded),
        );

        if (!equipment) {
          throw new NotFoundException({
            message: MessageService.Equipment_not_found,
            success: false,
          });
        }

        itemBound = equipment.ID;
      } else if (
        (body.bound === 'OS' || body.bound === 'os') &&
        body.item_bounded
      ) {
        const order = await this.orderRepository.findById(
          Number(body.item_bounded),
        );

        if (!order) {
          throw new NotFoundException({
            message: MessageService.FinanceItem_item_bound_not_found,
            success: false,
          });
        }

        itemBound = order.ID;
      }
    }

    const compositionItem = await this.compositionItemRepository.findById(
      Number(body.cost_center),
    );

    if (!compositionItem) {
      throw new NotFoundException({
        message: MessageService.FinanceItem_cost_center_not_found,
        success: false,
      });
    }

    let inputId = null;

    if (finance.direcao === 'pagar') {
      const material = await this.materialRepository.findById(
        Number(body.input),
      );

      if (!material) {
        throw new NotFoundException(
          MessageService.FinanceItem_cost_center_not_found,
        );
      }

      inputId = material.id;
    } else if (finance.direcao === 'receber') {
      const contractTypeInput = await this.contractTypeInput.findById(
        Number(body.input),
      );

      if (!contractTypeInput) {
        throw new NotFoundException({
          message: MessageService.FinanceItem_input_not_found,
          success: false,
        });
      }

      inputId = contractTypeInput.id;
    }

    let bound: $Enums.smartnewsystem_financeiro_titulos_dados_vinculo =
      $Enums.smartnewsystem_financeiro_titulos_dados_vinculo.EMPTY;

    if (body.bound === 'EQUIPMENT' || body.bound === 'equipment') {
      bound = 'EQUIPMENT';
    } else if (body.bound === 'OS' || body.bound === 'os') {
      bound = 'OS';
    } else if (body.bound === 'STOCK' || body.bound === 'stock') {
      bound = 'STOCK';
    }

    const item = await this.financeItemRepository.insert({
      id_titulo: finance.id,
      id_item_centro_custo: compositionItem.id,
      log_user: user.login,
      vinculo: bound === 'EMPTY' ? null : bound,
      id_equipamento: bound === 'EQUIPMENT' ? itemBound : null,
      id_os: bound === 'OS' ? itemBound : null,
      id_insumo: finance.direcao === 'receber' ? inputId : null,
      id_material: finance.direcao === 'pagar' ? inputId : null,
      quantidade: body.quantity,
      preco_unitario: body['unitary-value'],
      total: Number(body.quantity) * Number(body['unitary-value']),
    });

    if (body.bound === 'EQUIPMENT' || body.bound === 'equipment') {
      for await (const equipmentId of [itemBound]) {
        await this.financeItemBoundRepository.insert({
          id_item: item.id,
          id_equipamento: Number(equipmentId),
          id_os: null,
          log_user: user.login,
        });
      }
    }

    if (body.bound === 'OS' || body.bound === 'os') {
      for await (const orderId of [itemBound]) {
        await this.financeItemBoundRepository.insert({
          id_item: item.id,
          id_equipamento: null,
          id_os: Number(orderId),
          log_user: user.login,
        });
      }
    }

    const total =
      finance.documento_valor +
      Number(body.quantity) * Number(body['unitary-value']);
    const taxationFinance =
      (finance.total_acrescimo || 0) - (finance.total_desconto || 0);
    const totalLiquid = taxationFinance + total;

    await this.financeRepository.update(finance.id, {
      documento_valor: total,
      total_liquido: totalLiquid,
    });

    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/item/:itemId')
  async updateItem(
    @Req() req,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: InsertItemBody,
  ) {
    const user: IUserInfo = req.user;
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException({
        message: MessageService.Finance_not_found,
        success: false,
      });
    }

    const financeItem = await this.financeItemRepository.findById(
      Number(itemId),
    );

    if (!financeItem) {
      throw new NotFoundException({
        message: MessageService.FinanceItem_not_found,
        success: false,
      });
    }

    let itemBound = null;

    if (body.bound !== '' && body.bound !== 'STOCK') {
      if (
        (body.bound === 'EQUIPMENT' || body.bound === 'equipment') &&
        body.item_bounded
      ) {
        const equipment = await this.equipmentRepository.findById(
          Number(body.item_bounded),
        );

        if (!equipment) {
          throw new NotFoundException({
            message: MessageService.Equipment_not_found,
            success: false,
          });
        }

        itemBound = equipment.ID;
      } else if (
        (body.bound === 'OS' || body.bound === 'os') &&
        body.item_bounded
      ) {
        const order = await this.orderRepository.findById(
          Number(body.item_bounded),
        );

        if (!order) {
          throw new NotFoundException({
            message: MessageService.FinanceItem_item_bound_not_found,
            success: false,
          });
        }

        itemBound = order.ID;
      }
    }

    const compositionItem = await this.compositionItemRepository.findById(
      Number(body.cost_center),
    );

    if (!compositionItem) {
      throw new NotFoundException({
        message: MessageService.FinanceItem_cost_center_not_found,
        success: false,
      });
    }

    let inputId = null;

    if (finance.direcao === 'pagar') {
      const material = await this.materialRepository.findById(
        Number(body.input),
      );

      if (!material) {
        throw new NotFoundException(
          MessageService.FinanceItem_cost_center_not_found,
        );
      }

      inputId = material.id;
    } else if (finance.direcao === 'receber') {
      const contractTypeInput = await this.contractTypeInput.findById(
        Number(body.input),
      );

      if (!contractTypeInput) {
        throw new NotFoundException({
          message: MessageService.FinanceItem_input_not_found,
          success: false,
        });
      }

      inputId = contractTypeInput.id;
    }

    let bound: $Enums.smartnewsystem_financeiro_titulos_dados_vinculo =
      $Enums.smartnewsystem_financeiro_titulos_dados_vinculo.EMPTY;

    if (body.bound === 'EQUIPMENT' || body.bound === 'equipment') {
      bound = 'EQUIPMENT';
    } else if (body.bound === 'OS' || body.bound === 'os') {
      bound = 'OS';
    } else if (body.bound === 'STOCK' || body.bound === 'stock') {
      bound = 'STOCK';
    }

    const item = await this.financeItemRepository.update(financeItem.id, {
      id_item_centro_custo: compositionItem.id,
      vinculo: bound === 'EMPTY' ? null : bound,
      id_equipamento: bound === 'EQUIPMENT' ? itemBound : null,
      id_os: bound === 'OS' ? itemBound : null,
      id_insumo: finance.direcao === 'receber' ? inputId : null,
      id_material: finance.direcao === 'pagar' ? inputId : null,
      quantidade: body.quantity,
      preco_unitario: body['unitary-value'],
      total: Number(body.quantity) * Number(body['unitary-value']),
    });

    if (body.bound === 'EQUIPMENT' || body.bound === 'equipment') {
      for await (const equipmentId of [itemBound]) {
        const bound = await this.financeItemBoundRepository.findByItem(item.id);

        if (bound) {
          await this.financeItemBoundRepository.update(bound.id, {
            id_equipamento: Number(equipmentId),
            id_os: null,
            log_user: user.login,
          });
        } else {
          await this.financeItemBoundRepository.insert({
            id_item: item.id,
            id_equipamento: Number(equipmentId),
            id_os: null,
            log_user: user.login,
          });
        }
      }
    }

    if (body.bound === 'OS' || body.bound === 'os') {
      for await (const orderId of [itemBound]) {
        const bound = await this.financeItemBoundRepository.findByItem(item.id);

        if (bound) {
          await this.financeItemBoundRepository.update(bound.id, {
            id_os: Number(orderId),
            log_user: user.login,
          });
        } else {
          await this.financeItemBoundRepository.insert({
            id_item: item.id,
            id_equipamento: null,
            id_os: Number(orderId),
            log_user: user.login,
          });
        }
      }
    }

    const total =
      finance.documento_valor +
      Number(body.quantity) * Number(body['unitary-value']);
    const taxationFinance =
      (finance.total_acrescimo || 0) - (finance.total_desconto || 0);
    const totalLiquid = taxationFinance + total;

    await this.financeRepository.update(finance.id, {
      documento_valor: total,
      total_liquido: totalLiquid,
    });

    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/item/:itemId')
  async deleteItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException({
        message: MessageService.Finance_not_found,
        success: false,
      });
    }

    const financeItem = await this.financeItemRepository.findById(
      Number(itemId),
    );

    if (!financeItem) {
      throw new NotFoundException({
        message: MessageService.FinanceItem_not_found,
        success: false,
      });
    }

    await this.financeItemRepository.delete(financeItem.id);

    const totalItem = await this.financeItemRepository.aggregateByTitle(
      finance.id,
    );

    const total = Number(totalItem._sum.total);
    const taxationFinance =
      (finance.total_acrescimo || 0) - (finance.total_desconto || 0);
    const totalLiquid = taxationFinance + total;

    await this.financeRepository.update(finance.id, {
      documento_valor: total,
      total_liquido: totalLiquid,
    });

    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Get('/:id/register')
  async findRegisterByFinance(@Param('id') id: string) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const allRegister =
      await this.financeRegisterTributeRepository.findByFinance(finance.id);

    let totalAddition = 0;
    let totalDiscount = 0;

    const response = allRegister.map((register) => {
      if (register.tipo === 'ACRESCIMO') {
        totalAddition += register.valor;
      } else {
        totalDiscount += register.valor;
      }

      return {
        id: register.id,
        observation: register.descricao,
        type: register.tipo,
        value: register.valor,
        tributeId: register.tribute.id,
        tribute: register.tribute.descricao,
      };
    });

    return {
      data: response,
      totalAddition,
      totalDiscount,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id/register')
  async insertRegister(
    @Param('id') id: string,
    @Body() body: InsertRegisterBody,
  ) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const tribute = await this.financeTaxationRepository.findById(
      body.tributeId,
    );

    if (!tribute) {
      throw new NotFoundException(MessageService.Finance_taxationId_not_found);
    }

    await this.financeRegisterTributeRepository.create({
      id_titulo: finance.id,
      id_tributo: tribute.id,
      valor: body.value,
      descricao: body.description,
      tipo: body.type,
    });

    let totalAddition = finance.total_acrescimo;
    let totalDiscount = finance.total_desconto;

    if (body.type === 'ACRESCIMO') {
      totalAddition += body.value;
    } else {
      totalDiscount += body.value;
    }

    const totalAdditionDiscount = totalAddition - totalDiscount;

    const totalLiquid = finance.documento_valor + totalAdditionDiscount;

    await this.financeRepository.update(finance.id, {
      total_acrescimo: totalAddition,
      total_desconto: totalDiscount,
      acrescimo_desconto: totalAdditionDiscount,
      total_liquido: totalLiquid,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/register/:registerId')
  async updateRegister(
    @Param('id') id: string,
    @Param('registerId') registerId: string,
    @Body() body: UpdateRegisterBody,
  ) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const register = await this.financeRegisterTributeRepository.findById(
      Number(registerId),
    );

    if (!register) {
      throw new NotFoundException(MessageService.Finance_registerId_not_found);
    }

    const tribute = await this.financeTaxationRepository.findById(
      body.tributeId,
    );

    if (!tribute) {
      throw new NotFoundException(MessageService.Finance_taxationId_not_found);
    }

    await this.financeRegisterTributeRepository.update(register.id, {
      id_tributo: tribute.id,
      valor: body.value,
      descricao: body.description,
      tipo: body.type,
    });

    const totalAddition =
      await this.financeRegisterTributeRepository.sumFinanceAndType(
        finance.id,
        'ACRESCIMO',
      );
    const totalDiscount =
      await this.financeRegisterTributeRepository.sumFinanceAndType(
        finance.id,
        'DESCONTO',
      );

    const totalAdditionDiscount = totalAddition - totalDiscount;

    const totalLiquid = finance.documento_valor + totalAdditionDiscount;

    await this.financeRepository.update(finance.id, {
      total_acrescimo: totalAddition,
      total_desconto: totalDiscount,
      acrescimo_desconto: totalAdditionDiscount,
      total_liquido: totalLiquid,
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id/register/:registerId')
  async deleteRegister(
    @Param('id') id: string,
    @Param('registerId') registerId: string,
  ) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const register = await this.financeRegisterTributeRepository.findById(
      Number(registerId),
    );

    if (!register) {
      throw new NotFoundException(MessageService.Finance_registerId_not_found);
    }

    await this.financeRegisterTributeRepository.delete(register.id);

    const totalAddition =
      await this.financeRegisterTributeRepository.sumFinanceAndType(
        finance.id,
        'ACRESCIMO',
      );
    const totalDiscount =
      await this.financeRegisterTributeRepository.sumFinanceAndType(
        finance.id,
        'DESCONTO',
      );

    const totalAdditionDiscount = totalAddition - totalDiscount;

    const totalLiquid = finance.documento_valor + totalAdditionDiscount;

    await this.financeRepository.update(finance.id, {
      total_acrescimo: totalAddition,
      total_desconto: totalDiscount,
      acrescimo_desconto: totalAdditionDiscount,
      total_liquido: totalLiquid,
    });

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/installment')
  async updateInstallmentFinance(
    @Param('id') id: string,
    @Body() body: UpdateInstallmentFinanceBody,
  ) {
    let finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException(MessageService.Finance_not_found);
    }

    const totalItem = await this.financeItemRepository.aggregateByTitle(
      finance.id,
    );

    const allInstallment = await this.financePaymentRepository.findByFinance(
      finance.id,
    );

    if (allInstallment.some((split) => split.status === 3)) {
      throw new NotFoundException(MessageService.Finance_not_generate_split);
    }

    if (totalItem._sum.total === null || Number(totalItem._sum.total) === 0) {
      throw new NotFoundException(MessageService.FinanceItem_not_launch);
    }

    await this.financeRepository.update(finance.id, {
      documento_tipo: Number(body.paymentTypeId),
      parcelar: body.split ? 1 : 0,
      quantidade_parcela: body?.quantitySplit || 1,
      data_vencimento: this.dateService.dayjs(body.dueDate).toDate(),
      documento_valor: Number(totalItem._sum.total),
      frequencia_fixa: body.fixedFrequency && body?.fixedFrequency ? 1 : 0,
      frequencia_pagamento: body?.paymentFrequency || 0,
      total_liquido: Number(totalItem._sum.total) + finance.acrescimo_desconto,
    });

    finance = await this.financeRepository.findById(Number(id));

    const differenceTribute = finance.acrescimo_desconto;

    const totalLiquid = Number(totalItem._sum.total) + differenceTribute;

    const totalSplit = totalLiquid / finance.quantidade_parcela;

    const allEmissionItens =
      await this.financePaymentRepository.findIfWithEmission(
        finance.installmentFinance.map((value) => value.id),
      );

    let installmentPay = false;

    allEmissionItens.forEach((value) => {
      console.log(value);
      if (value.emissionItem.emission.pago === 1) {
        installmentPay = true;
      }
    });

    if (installmentPay) {
      throw new ConflictException(MessageService.Finance_not_generate_split);
    }

    for await (const installment of allEmissionItens) {
      await this.financeEmissionItemRepository.deleteForPayment(installment.id);
    }

    await this.financePaymentRepository.deleteByFinance(finance.id);

    let dueDate = this.dateService.dayjs(finance.data_vencimento);

    for await (const split of Array.from(
      Array(finance.quantidade_parcela).keys(),
    )) {
      await this.financePaymentRepository.create({
        id_titulo: finance.id,
        parcela: split + 1,
        vencimento: dueDate.toDate(),
        valor_a_pagar: totalSplit,
        valor_parcela: totalSplit,
      });

      if (finance.frequencia_fixa) {
        dueDate = dueDate.add(1, 'month');
      } else {
        dueDate = dueDate.add(finance.frequencia_pagamento, 'day');
      }
    }

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/installment/:installmentId')
  async updateInstallment(
    @Req() req,
    @Param('installmentId') installmentId: string,
  ) {
    const bodySchema = z.object({
      dueDate: z.coerce.date(),
      value: z.number(),
    });

    const body = bodySchema.parse(req.body);

    const installment = await this.financePaymentRepository.findById(
      Number(installmentId),
    );

    if (!installment) {
      throw new NotFoundException({
        message: MessageService.Finance_paymentId_not_found,
        success: false,
      });
    }

    if (installment.status === 3) {
      throw new NotFoundException({
        message: MessageService.Finance_payment_not_edit,
        success: false,
      });
    }

    await this.financePaymentRepository.update(installment.id, {
      vencimento: body.dueDate,
      valor_a_pagar: body.value,
      valor_parcela: body.value,
    });

    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/finish')
  async finalize(@Param('id') id: string) {
    const finance = await this.financeRepository.findById(Number(id));

    if (!finance) {
      throw new NotFoundException({
        message: MessageService.Finance_not_found,
        success: false,
      });
    }

    if (finance.status === 'FECHADO') {
      throw new NotFoundException({
        message: MessageService.Finance_not_open,
      });
    }

    const totalSplit = finance.installmentFinance.reduce((acc, value) => {
      return (acc += value.valor_a_pagar);
    }, 0);

    if (totalSplit === 0) {
      throw new NotFoundException({
        message: MessageService.Finance_payment_not_launch,
        success: false,
      });
    }

    if (finance.total_liquido !== totalSplit) {
      throw new NotFoundException({
        message: MessageService.Finance_not_finisher_split_difference_total,
        success: false,
      });
    }

    if (
      finance.status !== 'PROCESSANDO' &&
      finance.status !== 'AGUARDANDO_PEDIDO'
    ) {
      await this.financeRepository.update(finance.id, {
        status: 'PROCESSANDO',
      });
    }

    return {
      success: true,
      updated: true,
    };
  }
}
