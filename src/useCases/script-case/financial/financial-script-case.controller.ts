import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import FinanceBankRepository from 'src/repositories/finance-bank-repository';
import { FinancePaymentViewRepository } from 'src/repositories/finance-payment-view-repository';
import FinanceTributesRepository from 'src/repositories/finance-tributes-repository';
import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
import FinanceBankTransactionRepository from 'src/repositories/financeBankTransaction-repository';
import { DateService } from 'src/service/data.service';
import { z } from 'zod';

@ApiTags('Script Case')
@Controller('/script-case/financial')
export default class FinancialScriptCaseController {
  constructor(
    private financeTypePaymentRepository: FinanceTypePaymentRepository,
    private financeTributesRepository: FinanceTributesRepository,
    private financeBankRepository: FinanceBankRepository,
    private financeBankTransactionRepository: FinanceBankTransactionRepository,
    private financePaymentViewRepository: FinancePaymentViewRepository,
    private dateService: DateService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/finance-type-payment')
  async financeTypePayment(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.financeTypePaymentRepository.listByClient(
      user.clientId,
    );

    const querySchema = z.object({
      type: z.string().optional().default('payment'),
    });

    const query = querySchema.parse(req.query);

    return {
      [query.type]: querySet.map((value) => {
        return {
          value: value.id,
          text: `${value.descricao}`,
        };
      }),
      success: true,
    };
  }
  @UseGuards(AuthGuard)
  @Get('/finance-tributes')
  async financeTributes(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.financeTributesRepository.listByClient(
      user.clientId,
    );

    const querySchema = z.object({
      type: z.string().optional().default('tributes'),
    });

    const query = querySchema.parse(req.query);

    return {
      [query.type]: querySet.map((value) => {
        return {
          value: value.id,
          text: `${value.descricao}`,
        };
      }),
      success: true,
    };
  }
  @UseGuards(AuthGuard)
  @Get('/finance-bank')
  async financeBank(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.financeBankRepository.listByClient(
      user.clientId,
      { status: 'ATIVO' },
    );

    const newQuerySet = [];
    for await (const obj of querySet) {
      const value_in = await this.financeBankTransactionRepository.sumValuesIn(
        user.clientId,
        obj.id,
      );
      const value_out =
        await this.financeBankTransactionRepository.sumValuesOut(
          user.clientId,
          obj.id,
        );
      newQuerySet.push({
        id: obj.id.toString(),
        name: `${obj.nome} ${obj.numero_conta} - ${obj.agencia}`,
        // account: obj.conta,
        // date: obj.vencimento,
        // cvc: obj.cvc,
        total: value_in - value_out,
        negative: obj.negativo == 1,
      });
    }
    const response = { success: true, data: newQuerySet };
    return response;
  }

  @UseGuards(AuthGuard)
  @Get('/finance-info-table')
  async financeInfoTable(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
      type: z.enum(['pagar', 'receber']),
      forEmission: z.boolean().optional().default(false).nullable(),
      globalFilter: z.string().optional().nullable(),
      status: z
        .string()
        .transform((value) => {
          if (!value || value.trim() === '') {
            return null;
          } else {
            return value.split(',');
          }
        })
        .optional()
        .nullable(),
      typePayment: z
        .string()
        .transform((value) => {
          if (!value || value.trim() === '') {
            return null;
          } else {
            return value.split(',').map(Number);
          }
        })
        .optional()
        .nullable(),
      fiscalNumber: z.coerce.number().optional().nullable(),
      dateEmission: z
        .object({
          start: z.coerce.date(),
          end: z.coerce.date(),
        })
        .optional()
        .nullable(),
      issue: z.coerce.string().optional(),
      sender: z.coerce.string().optional(),
      dueDate: z
        .object({
          start: z.coerce.date(),
          end: z.coerce.date(),
        })
        .optional()
        .nullable(),
      prorogation: z
        .object({
          start: z.coerce.date(),
          end: z.coerce.date(),
        })
        .optional()
        .nullable(),
      expectDate: z
        .object({
          start: z.coerce.date(),
          end: z.coerce.date(),
        })
        .optional()
        .nullable(),
      filterColumn: z.string().optional().nullable(),
      filterText: z.string().optional().nullable(),
      date_from: z.coerce
        .string()
        .transform((value) =>
          value === '' || value === null ? null : new Date(value),
        )
        .optional()
        .nullable(),
      date_to: z.coerce
        .string()
        .transform((value) =>
          value === '' || value === null ? null : new Date(value),
        )
        .optional()
        .nullable(),
      totalItem: z.coerce.number().optional().nullable(),
      valueToPay: z.coerce.number().optional().nullable(),
      valuePay: z.coerce.number().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    // const data = {};
    // data['take'] = Number(perPage);
    // data['skip'] = Number(page > 1 ? page - 1 : 1) * perPage;
    // data['type'] = type;
    // data['clientId'] = user.clientId;
    // data['forEmission'] = forEmission;
    // data['status'] = status;
    // data['typePayment'] = typePayment;
    // data['fiscalNumber'] = fiscalNumber;
    // data['dateEmission'] = dateEmission;
    // data['issue'] = issue;
    // data['sender'] = sender;
    // data['dueDate'] = dueDate;
    // data['prorogation'] = prorogation;
    // data['expectDate'] = expectDate;
    // data['totalItem'] = totalItem;
    // data['valueToPay'] = valueToPay;
    // data['valuePay'] = valuePay;

    // const param = {};
    // Object.entries(data)
    //   .filter((v) => v[1] !== '')
    //   .forEach(([k, v]) => (param[k] = v));
    let orWhere = {};
    if (query.globalFilter) {
      orWhere = {
        OR: [
          {
            numero_fiscal: {
              contains: query.globalFilter,
            },
          },
          {
            documento_numero: {
              contains: query.globalFilter,
            },
          },
          {
            emitente: {
              contains: query.globalFilter,
            },
          },
          {
            remetente: {
              contains: query.globalFilter,
            },
          },
          {
            descricao: {
              contains: query.globalFilter,
            },
          },
        ],
      };
    }

    const andWhere: {
      documento_numero?: string | null;
      numero_fiscal?: string | null;
      descricao?: string | null;
      emitente?: string | null;
      remetente?: string | null;
      totalItem?: number | null;
      valor_parcela?: number | null;
      valor_a_pagar?: number | null;
      data_emissao?: {
        gte?: Date | null;
        lte?: Date | null;
      } | null;
      vencimento?: {
        gte?: Date | null;
        lte?: Date | null;
      } | null;
      data_vencimento?: {
        gte?: Date | null;
        lte?: Date | null;
      } | null;
      prorrogacao?: {
        gte?: Date | null;
        lte?: Date | null;
      } | null;
    } = {};

    if (query.filterColumn) {
      switch (query.filterColumn) {
        case 'numero_processo': //Valor Gerado Pelo Banco
          andWhere.documento_numero = query.filterText;
          break;
        case 'documento_numero': //Valor Passado Pelo Usuario
          //$forSearch = "and (numero_fiscal = '$search')";
          andWhere.numero_fiscal = query.filterText;
          break;
        case 'request':
          break;
        case 'data_emissao':
          // $dateFrom 	= $_POST["date_from"];
          // $dateTo		= $_POST['date_to'];

          // $forDate = "and data_emissao between '$dateFrom' and '$dateTo' ";

          andWhere.data_emissao = {
            gte: query.date_from,
            lte: query.date_to,
          };
          break;
        case 'emitente':
          // $forSearch = "and ( emitente = '$search' )";
          andWhere.emitente = query.filterText;
          break;
        case 'recebedor':
          // $forSearch = "and ( remetente = '$search' )";
          andWhere.remetente = query.filterText;
          break;
        case 'vencimento':
          // $dateFrom 	= $_POST["date_from"];
          // $dateTo		= $_POST['date_to'];

          // $forDate = "and vencimento between '$dateFrom' and '$dateTo' ";
          andWhere.vencimento = {
            gte: query.date_from,
            lte: query.date_to,
          };
          break;
        case 'prorrogacao':
          // $dateFrom 	= $_POST["date_from"];
          // $dateTo		= $_POST['date_to'];

          // $forDate = "and prorrogacao between '$dateFrom' and '$dateTo' ";
          andWhere.prorrogacao = {
            gte: query.date_from,
            lte: query.date_to,
          };
        // break;
        case 'data_prevista':
          //console.log('entrei aqui');
          // $dateFrom 	= $_POST["date_from"];
          // $dateTo		= $_POST['date_to'];

          // $forDate = "and id in (
          //         SELECT
          //           emi.id_pagamento
          //         FROM smartnewsystem_financeiro_emissao_itens emi
          //         join smartnewsystem_financeiro_emissao em on em.id = emi.id_emissao
          //         where emi.id_pagamento = $bank.id
          //         and em.data_vencimento BETWEEN '$dateFrom' and '$dateTo'
          //       )";
          andWhere.data_vencimento = {
            gte: query.date_from,
            lte: query.date_to,
          };
          break;
        case 'status':
          // $forSearch = "and ( descricao = '$search')";
          andWhere.descricao = query.filterText;
          break;
        case 'total':
          // $search = str_replace(".","", $search);
          // $search	= str_replace(",",".", $search);

          // $forSearch = "and (
          //           ( select
          // //             sum(total)
          //             from smartnewsystem_financeiro_titulos_dados where id_titulo = id_titulo
          //           ) = '$search' )";
          andWhere.totalItem = Number(query.filterText);
          break;
        case 'valor_a_pagar':
          // $search = str_replace(".","", $search);
          // $search	= str_replace(",",".", $search);

          // $forSearch = "and valor_a_pagar = '$search' ";
          andWhere.valor_a_pagar = Number(query.filterText);
          break;
        case 'valor_parcela':
          // $search = str_replace(".","", $search);
          // $search	= str_replace(",",".", $search);

          // $forSearch = "and valor_parcela = '$search' ";
          andWhere.valor_parcela = Number(query.filterText);
          break;
      }
    }
    // console.log({
    //   perPage: query.perPage,
    //   valuePage: query.page,
    //   page: (query.page - 1) * query.perPage,
    // });

    //console.log('andWhere => ', andWhere);

    let status: string[] = [];

    if (query.status) {
      status = query.status.map((item) => {
        if (item === 'paid') {
          return 'PAGO';
        } else if (item === 'loser') {
          return 'VENCIDO';
        } else if (item === 'to_win') {
          return 'A VENCER';
        }
      });
    }

    const querySet = await this.financePaymentViewRepository.infoTable(
      query.perPage,
      (query.page - 1) * query.perPage,
      query.type,
      query.type === 'pagar'
        ? {
            ...orWhere,
            ...andWhere,
            id_cliente: user.clientId,
            ...(query.status && {
              descricao: {
                in: status,
              },
            }),
            ...(query.typePayment && {
              tipo_pagamento_id: {
                in: query.typePayment,
              },
            }),
          }
        : {},
      query.type === 'receber'
        ? {
            ...orWhere,
            ...andWhere,
            id_cliente: user.clientId,
            ...(query.status && {
              descricao: {
                in: status,
              },
            }),
            ...(query.typePayment && {
              tipo_pagamento_id: {
                in: query.typePayment,
              },
            }),
          }
        : {},
    );

    let totalGross = 0;
    let totalLiquid = 0;
    let totalItems = 0;

    const alLFinance = await this.financePaymentViewRepository.infoTableNoPage(
      query.type,
      query.type === 'pagar'
        ? {
            ...orWhere,
            ...andWhere,
            id_cliente: user.clientId,
            ...(query.status && {
              descricao: {
                in: status,
              },
            }),
            ...(query.typePayment && {
              tipo_pagamento_id: {
                in: query.typePayment,
              },
            }),
          }
        : {},
      query.type === 'receber'
        ? {
            ...orWhere,
            ...andWhere,
            id_cliente: user.clientId,
            ...(query.status && {
              descricao: {
                in: status,
              },
            }),
            ...(query.typePayment && {
              tipo_pagamento_id: {
                in: query.typePayment,
              },
            }),
          }
        : {},
    );

    alLFinance.forEach((value) => {
      totalGross += value.valor_a_pagar;
      totalLiquid += value.valor_parcela;
      totalItems += 1;
    });

    const finance = querySet.map((value) => {
      return {
        data_emissao: this.dateService
          .dayjs(value.data_emissao)
          .add(3, 'h')
          .format('YYYY-M-D'),
        data_prevista: value.data_vencimento
          ? this.dateService
              .dayjs(value.data_vencimento)
              .add(3, 'h')
              .format('YYYY-M-D')
          : null,
        documento_numero:
          Number(value.numero_fiscal) === value.numero
            ? 'Sem Registro'
            : value.numero_fiscal,
        emitente: value.emitente,
        id: value.id,
        id_finances: value.id_titulo,
        numero_processo: value.documento_numero,
        parcela: `${value.parcela}/${value.finance.installmentFinance.length}`,
        prorrogacao: value.prorrogacao
          ? this.dateService
              .dayjs(value.prorrogacao)
              .add(3, 'h')
              .format('YYYY-M-D')
          : null,
        recebedor: value.remetente,
        request: value.id_pedido === null ? 'Sem Registro' : value.numero,
        status: { id: value.status, name: value.descricao },
        total: value.totalItem,
        type_payment: value.tipo_pagamento,
        valor_a_pagar: value.valor_a_pagar,
        valor_parcela: value.valor_parcela,
        vencimento: this.dateService
          .dayjs(value.vencimento)
          .add(3, 'h')
          .format('YYYY-M-D'),
      };
    });

    const response = {
      success: true,
      data: finance,
      totalGross,
      totalLiquid,
      totalItems,
    };
    return response;
  }
}
