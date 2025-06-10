import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import { FinancePaymentViewRepository } from 'src/repositories/finance-payment-view-repository';
import FinanceTributesRepository from 'src/repositories/finance-tributes-repository';
import { z } from 'zod';

@ApiTags('Script Case - Financial - Emission')
@Controller('/script-case/financial/emission')
export default class EmissionScriptCaseController {
  constructor(
    private financePaymentRepository: FinancePaymentRepository,
    private financePaymentViewRepository: FinancePaymentViewRepository,
    private financeTributeRepository: FinanceTributesRepository,
  ) {}
  @UseGuards(AuthGuard)
  @Get('/generate-excel')
  async generateExcel(@Req() req, @Query() query) {
    const user: IUserInfo = req.user;

    // console.log(user);
    // console.log(query);

    const querySchema = z.object({
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

    const body = querySchema.parse(query);

    let orWhere = {};
    if (body.globalFilter) {
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

    let status = [];

    if (body.status) {
      status = body.status.map((item) => {
        if (item === 'paid') {
          return 'PAGO';
        } else if (item === 'loser') {
          return 'VENCIDO';
        } else if (item === 'to_win') {
          return 'A VENCER';
        }
      });
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

    if (body.filterColumn) {
      switch (body.filterColumn) {
        case 'numero_processo': //Valor Gerado Pelo Banco
          andWhere.documento_numero = body.filterText;
          break;
        case 'documento_numero': //Valor Passado Pelo Usuario
          //$forSearch = "and (numero_fiscal = '$search')";
          andWhere.numero_fiscal = body.filterText;
          break;
        case 'request':
          break;
        case 'data_emissao':
          // $dateFrom 	= $_POST["date_from"];
          // $dateTo		= $_POST['date_to'];

          // $forDate = "and data_emissao between '$dateFrom' and '$dateTo' ";

          andWhere.data_emissao = {
            gte: body.date_from,
            lte: body.date_to,
          };
          break;
        case 'emitente':
          // $forSearch = "and ( emitente = '$search' )";
          andWhere.emitente = body.filterText;
          break;
        case 'recebedor':
          // $forSearch = "and ( remetente = '$search' )";
          andWhere.remetente = body.filterText;
          break;
        case 'vencimento':
          // $dateFrom 	= $_POST["date_from"];
          // $dateTo		= $_POST['date_to'];

          // $forDate = "and vencimento between '$dateFrom' and '$dateTo' ";
          andWhere.vencimento = {
            gte: body.date_from,
            lte: body.date_to,
          };
          break;
        case 'prorrogacao':
          // $dateFrom 	= $_POST["date_from"];
          // $dateTo		= $_POST['date_to'];

          // $forDate = "and prorrogacao between '$dateFrom' and '$dateTo' ";
          andWhere.prorrogacao = {
            gte: body.date_from,
            lte: body.date_to,
          };
        // break;
        case 'data_prevista':
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
            gte: body.date_from,
            lte: body.date_to,
          };
          break;
        case 'status':
          // $forSearch = "and ( descricao = '$search')";
          andWhere.descricao = body.filterText;
          break;
        case 'total':
          // $search = str_replace(".","", $search);
          // $search	= str_replace(",",".", $search);

          // $forSearch = "and (
          //           ( select
          // //             sum(total)
          //             from smartnewsystem_financeiro_titulos_dados where id_titulo = id_titulo
          //           ) = '$search' )";
          andWhere.totalItem = Number(body.filterText);
          break;
        case 'valor_a_pagar':
          // $search = str_replace(".","", $search);
          // $search	= str_replace(",",".", $search);

          // $forSearch = "and valor_a_pagar = '$search' ";
          andWhere.valor_a_pagar = Number(body.filterText);
          break;
        case 'valor_parcela':
          // $search = str_replace(".","", $search);
          // $search	= str_replace(",",".", $search);

          // $forSearch = "and valor_parcela = '$search' ";
          andWhere.valor_parcela = Number(body.filterText);
          break;
      }
    }

    // console.log(user)
    // console.log(body);

    // const allPayment = await this.financePaymentViewRepository.infoTableNoPage(
    //   user.clientId,
    //   body.type,
    //   {
    //     forEmission: body.issued,
    //     status: body.status || undefined,
    //     typePayment: body.typePayment || undefined,
    //     issue: body.filterColumn === 'emitente' ? body.filterText : null,
    //     sender: body.filterColumn === 'remetente' ? body.filterText : null,
    //     fiscalNumber:
    //       body.filterColumn === 'documento_numero'
    //         ? Number(body.filterText)
    //         : null,
    //     dateEmission:
    //       body.filterColumn === 'data_emissao'
    //         ? {
    //             start: body.date_from,
    //             end: body.date_to,
    //           }
    //         : undefined,
    //     dueDate:
    //       body.filterColumn === 'vencimento'
    //         ? {
    //             start: body.date_from,
    //             end: body.date_to,
    //           }
    //         : undefined,
    //     expectDate:
    //       body.filterColumn === 'data_prevista'
    //         ? {
    //             start: body.date_from,
    //             end: body.date_to,
    //           }
    //         : undefined,
    //     prorogation:
    //       body.filterColumn === 'prorrogacao'
    //         ? {
    //             start: body.date_from,
    //             end: body.date_to,
    //           }
    //         : undefined,
    //   },
    //   {
    //     ...(body.globalFilter &&
    //       body.globalFilter !== '' && {
    //         OR: [
    //           { numero_fiscal: { contains: body.globalFilter } },
    //           { documento_numero: { contains: body.globalFilter } },
    //           { emitente: { contains: body.globalFilter } },
    //           { remetente: { contains: body.globalFilter } },
    //         ],
    //       }),
    //   },
    // );

    const allPayment = await this.financePaymentViewRepository.infoTableNoPage(
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

    const allTributeClient = await this.financeTributeRepository.listByClient(
      user.clientId,
    );

    const allTribute: string[] = [];

    allTributeClient.forEach((item) => {
      allTribute.push(item.descricao);
    });

    let totalGross = 0;
    let totalLiquid = 0;
    let totalItems = 0;
    let total_data = 0;

    const finances = [];

    const data = allPayment.map((payment) => {
      totalLiquid += payment.valor_parcela;
      totalGross += payment.valor_a_pagar;
      totalItems++;
      total_data += payment.valor_parcela;
      //payment.finance.registerTribute[0].tribute.
      const tribute = allTribute.reduce((acc, value) => {
        const filter = payment.finance.registerTribute.filter(
          (item) => item.tribute.descricao === value,
        );

        acc[value] = filter.reduce(
          (obj, item) =>
            item.tipo === 'ACRESCIMO'
              ? (obj += item.valor)
              : (obj -= item.valor),
          0,
        );

        return acc;
      }, {});

      const findIndexFinance = finances.findIndex(
        (item) => item.id_finances === payment.id_titulo,
      );

      if (findIndexFinance < 0) {
        finances.push({
          id_finances: payment.id_titulo,
          number: payment.numero_fiscal,
          issue: payment.emitente,
          sender: payment.remetente,
          total: payment.finance.total_liquido,
          ...tribute,
        });
      }

      return {
        id: payment.id,
        id_finances: payment.id_titulo,
        numero_processo: payment.documento_numero,
        documento_numero: payment.numero_fiscal,
        data_emissao: payment.data_emissao,
        emitente: payment.emitente,
        recebedor: payment.remetente,
        vencimento: payment.vencimento,
        prorrogacao: payment.prorrogacao,
        valor_a_pagar: payment.valor_a_pagar,
        valor_parcela: payment.valor_parcela,
        parcela: `${payment.parcela}/${
          payment.finance.quantidade_parcela === 0
            ? 1
            : payment.finance.quantidade_parcela
        }`,
        status: {
          id: payment.status,
          name: payment.descricao,
        },
        total: payment.totalItem,
        request: payment.id_pedido ? payment.numero : 'Sem Registro',
        data_prevista: payment.data_vencimento,
        data_pagamento: payment.data_vencimento,
        type_payment: payment.tipo_pagamento,
        items: payment.finance.items.map((item) => {
          //totalGross += Number(item.quantidade) * Number(item.preco_unitario);
          return {
            number: payment.numero_fiscal,
            branch:
              body.type === 'pagar' ? payment.remetente : payment.emitente,
            cost_center: `${item.compositionItem.compositionGroup.costCenter.centro_custo}-${item.compositionItem.compositionGroup.costCenter.descricao}`,
            composition: `${item.compositionItem.compositionGroup.composicao}-${item.compositionItem.compositionGroup.descricao}`,
            compositionItem: `${item.compositionItem.composicao}-${item.compositionItem.descricao}`,
            material: item.material
              ? item.material.material
              : item.input
              ? item.input.insumo
              : null,
            bound: item.vinculo,
          };
        }),
      };
    });

    return {
      data,
      totalGross,
      totalLiquid,
      totalItems,
      total_data,
      finances,
      success: true,
    };
  }
}
