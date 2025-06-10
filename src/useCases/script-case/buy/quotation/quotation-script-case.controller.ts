import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import listTablePaginationSwagger from 'src/models/swagger/list-table-pagination-swagger';
import BuyConditionAnswerRepository from 'src/repositories/buy-condition-answer-repository';
import BuyConditionRepository from 'src/repositories/buy-condition-repository';
import BuyItemRepository from 'src/repositories/buy-item-repository';
import BuyPreFinancePaymentRepository from 'src/repositories/buy-pre-finance-payment-repository';
import BuyPreFinanceRepository from 'src/repositories/buy-pre-finance-repository';
import BuyQuotationRepository from 'src/repositories/buy-quotation-repository';
import BuyRepository from 'src/repositories/buy-repository';
import BuyResponsibleQuotationRepository from 'src/repositories/buy-responsible-quotation-repository';
import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
import ProviderRepository from 'src/repositories/provider-repository';
import { DateService } from 'src/service/data.service';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';
import UpdateAskBody from './dtos/updateAsk-body';

@ApiTags('Script Case - Buy - Quotation')
@ApiBearerAuth()
@ApiOkResponse({ description: 'Success' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('/script-case/buy/quotation')
export default class QuotationScriptCaseController {
  constructor(
    private buyRepository: BuyRepository,
    private buyResponsibleQuotationRepository: BuyResponsibleQuotationRepository,
    private buyQuotationRepository: BuyQuotationRepository,
    private buyItemRepository: BuyItemRepository,
    private providerRepository: ProviderRepository,
    private buyConditionRepository: BuyConditionRepository,
    private buyPreFinanceRepository: BuyPreFinanceRepository,
    private buyConditionAnswerRepository: BuyConditionAnswerRepository,
    private buyPreFinancePaymentRepository: BuyPreFinancePaymentRepository,
    private financeTypePaymentRepository: FinanceTypePaymentRepository,
    private dateService: DateService,
  ) {}
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

    if (query.filterColumn) {
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
          notIn: [1, 8, 10, 11, 12],
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
          notIn: [1, 8],
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
      buyer: buyResponsible.length > 0,
      edit: buy.buyStatus.id === 2,
      success: true,
    };

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:buyId/find-item')
  async findItemByBuyId(@Param('buyId') buyId: string) {
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const items = await this.buyItemRepository.listByBuy(buy.id);

    const response = items.map((item) => {
      return {
        id: item.id,
        material: `${item.sequencia}-${item.material.codigo} | ${item.material.material}`,
        codeNCM: item.material.codigo_ncm,
        codeSecondary: item.material.codigo_secundario,
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
  async listQuotationByBuy(@Param('buyId') buyId: string) {
    const buy = await this.buyRepository.findById(Number(buyId));

    if (!buy) {
      throw new NotFoundException(MessageService.Buy_id_not_found);
    }

    const allQuotation = await this.buyQuotationRepository.listByBuy(buy.id);

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
          observation: item.observacao,
          quantity: item.quantidade,
          value: item.valor,
          total: item.quantidade * item.valor,
        };
      });

      const findQuotationByProvider = buy.buyQuotationDiscount.filter(
        (value) => value.provider.ID === quotation.provider.ID,
      );

      return {
        id: quotation.id,
        provider: quotation.provider.nome_fantasia,
        allQuantity,
        grossTotal,
        total:
          findQuotationByProvider.reduce((acc, current) => {
            if (current.tipo === 'ACRESCIMO') {
              return (acc += current.valor);
            } else {
              return (acc -= current.valor);
            }
          }, 0) + grossTotal,
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

    buy.item.forEach((item) => {
      const quotationItems = item.quotationItem.map((quotationItem) => {
        totalGross += quotationItem
          ? quotationItem.valor * (quotationItem.quantidade || item.quantidade)
          : 0;

        // console.log(item);
        // console.log(quotationItem);

        return {
          id: quotationItem.id,
          idItem: item.id,
          material: `${item.sequencia} - ${item.material.codigo} | ${item.material.material}`,
          observation: quotationItem.observacao,
          quantity: quotationItem.quantidade,
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
  @Get('/:buyId/list-provider-if-response')
  async listProviderIfResponse(@Req() req, @Param('buyId') buyId: string) {
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

    for await (const value of quotation) {
      const findProvider = await this.buyRepository.listByBuyAndFinishProvider(
        Number(buyId),
        value.provider.ID,
      );

      //console.log(findProvider);

      let allRespond = false;

      if (findProvider) {
        allRespond = findProvider.buyPreFinance.length
          ? findProvider.buyPreFinance[0].buyPreFinancePayment[0]
              .paymentType !== null &&
            findProvider?.buyPreFinance[0].buyPreFinancePayment[0]
              .vencimento !== null
          : false;

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

        const validItem = value.buy.item.every(
          (item) =>
            value.quotationItem.findIndex((val) => val.item.id === item.id) >=
            0,
        );
        //
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
                value.provider.ID,
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
      allResponsed: provider.every((item) => item.allResponsed),
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
      frequency: z.coerce.boolean(),
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

    //console.log(buyPreFinance);

    await this.buyPreFinancePaymentRepository.update(
      buyPreFinance.buyPreFinancePayment[0].id,
      {
        id_pagamento: typePayment.id,
        vencimento: dueDate,
        quantidade_parcela: quantityInstallments,
        frequencia: frequency ? 1 : 0,
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
}
