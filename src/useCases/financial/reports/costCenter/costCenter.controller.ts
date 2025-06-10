import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
//import * as dayjs from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { AuthGuard } from 'src/guard/auth.guard';
import { CostCenterRepository } from 'src/repositories/cost-center-repository';
import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import {
  ListReportFinanceResponse,
  ListReportResponse,
  ListReportTestFinanceResponse,
  ListReportTestResponse,
} from './dtos/listReport-response';
import { MessageService } from 'src/service/message.service';
import { listReportBody } from './dtos/listReport-body';
import { IUserInfo } from 'src/models/IUser';
import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
import { ApiTags } from '@nestjs/swagger';

dayjs.locale('pt-br');

@ApiTags('Financial - Reports - Cost Center')
@Controller('/financial/reports/cost-center')
export class CostCenterController {
  constructor(
    private costCenterRepository: CostCenterRepository,
    private financePaymentRepository: FinancePaymentRepository,
    private financeItemRepository: FinanceItemRepository,
    private descriptionCostCenterRepository: DescriptionCostCenterRepository,
  ) {}

  @Get('/')
  async get() {
    return { message: 'OK' };
  }

  @UseGuards(AuthGuard)
  @Get('/list-branches')
  async listBranches(@Request() req) {
    const user: IUserInfo = req.user; // @UseGuards(AuthGuard)
    // @Get('/report')
    // async listReport(@Request() req) {
    //   const { user } = req;

    //   const branches = await this.costCenterRepository.listCostCenter(
    //     user.branches,
    //   );
    // }

    const allBranch =
      await this.descriptionCostCenterRepository.listByBranchesComplete(
        user.branches,
      );

    const formatted = allBranch.map((descriptionCostCenter) => ({
      value: descriptionCostCenter.id.toString(),
      costCenter: descriptionCostCenter.descricao_centro_custo,
    }));

    return formatted;
  }

  @UseGuards(AuthGuard)
  @Post('/report')
  async listReportTest(@Req() req, @Body() body: listReportBody) {
    const user: IUserInfo = req.user;
    const response: ListReportResponse[] = [];

    // const firstDayOfMonth = dayjs(body.startDate).toDate();
    // const lastDayOfMonth = dayjs(body.endDate).toDate();

    const allPayment =
      // body.direction === 'pagar'
      //   ? await this.financePaymentRepository.listViewExpressByDateAndClient(
      //       user.clientId,
      //       dayjs(body.startDate).format('YYYY-MM-DD'),
      //       dayjs(body.endDate).format('YYYY-MM-DD'),
      //       body.costCenterId,
      //       body.paid,
      //     )
      await this.financePaymentRepository.listViewReceiveByDateAndClient(
        user.clientId,
        dayjs(body.startDate).format('YYYY-MM-DD'),
        dayjs(body.endDate).format('YYYY-MM-DD'),
        body.costCenterId,
        body.paid,
      );

    const paymentArr: ListReportTestResponse[] = [];

    allPayment.forEach((value) => {
      const index = paymentArr.findIndex((item) => item.id === value.id);

      if (index >= 0) {
        paymentArr[index].items.push({
          total: value.total,
          compositionItem: {
            id: value.composition_item_id,
            composicao: value.composition_item_composicao,
            descricao: value.composition_item_descricao,
            compositionGroup: {
              id: value.composition_group_id,
              composicao: value.composition_group_composicao,
              descricao: value.composition_group_descricao,
              costCenter: {
                ID: value.costCenter_ID,
                centro_custo: value.costCenter_code,
                descricao: value.costCenter_descricao,
                descriptionCostCenter: {
                  id: value.descriptionCostCenter_id,
                  descricao: value.descriptionCostCenter_name,
                  branch: {
                    ID: value.branch_id,
                    filial_numero: value.branch_name,
                  },
                },
              },
            },
          },
        });
      } else {
        paymentArr.push({
          id: value.id,
          numero_fiscal: value.numero_fiscal,
          parcela: value.parcela,
          prorrogacao: value.prorrogacao,
          valor_a_pagar: value.valor_a_pagar,
          valor_parcela: value.valor_parcela,
          emitente: value.emitente,
          remetente: value.remetente,
          material: value.material,
          insumo: value.insumo,
          items: [
            {
              total: value.total,
              compositionItem: {
                id: value.composition_item_id,
                composicao: value.composition_item_composicao,
                descricao: value.composition_item_descricao,
                compositionGroup: {
                  id: value.composition_group_id,
                  composicao: value.composition_group_composicao,
                  descricao: value.composition_group_descricao,
                  costCenter: {
                    ID: value.costCenter_ID,
                    centro_custo: value.costCenter_code,
                    descricao: value.costCenter_descricao,
                    descriptionCostCenter: {
                      id: value.descriptionCostCenter_id,
                      descricao: value.descriptionCostCenter_name,
                      branch: {
                        ID: value.branch_id,
                        filial_numero: value.branch_name,
                      },
                    },
                  },
                },
              },
            },
          ],
        });
      }
    });

    if (body.costCenterId) {
      // const listPayment = body.paid
      //   ? await this.financePaymentRepository.listItemsByDateAndDirectionAndCostCenterAndPay(
      //       firstDayOfMonth,
      //       lastDayOfMonth,
      //       body.direction,
      //       body.costCenterId,
      //     )
      //   : await this.financePaymentRepository.listItemsByDateAndDirectionAndCostCenter(
      //       firstDayOfMonth,
      //       lastDayOfMonth,
      //       body.direction,
      //       body.costCenterId,
      //     );

      //const month = dayjs(currentDate).format('MM/YYYY');

      for await (const payment of paymentArr) {
        const totalItem = payment.items.reduce(
          (acc, current) => (acc += Number(current.total)),
          0,
        );
        const month = dayjs(payment.prorrogacao).format('MM/YYYY');

        for await (const value of payment.items) {
          // if (
          //   !body.costCenterId.includes(
          //     value.compositionItem.compositionGroup.costCenter.ID,
          //   )
          // ) {
          //   continue;
          // }

          const totalItemByPeriod =
            (Number(value.total) * Number(payment.valor_parcela)) / totalItem;

          const {
            compositionItem: {
              compositionGroup: {
                costCenter,
                costCenter: {
                  descriptionCostCenter: { branch },
                },
              },
            },
          } = value;

          const index = response.findIndex(
            (item) =>
              item.code === branch.ID.toString() &&
              item.name ===
                `${costCenter.centro_custo}-${costCenter.descricao}` &&
              item.categoryCode === branch.ID.toString() &&
              item.category === branch.filial_numero &&
              item.month === month,
          );

          if (index >= 0) {
            response[index].cost += totalItemByPeriod;
            response[index].item.push({
              dueDate: payment.prorrogacao,
              numberSplit: payment.parcela,
              valueSplit: Number(payment.valor_parcela),
              currentDate: payment.prorrogacao,
              material:
                body.direction === 'pagar' ? payment.material : payment.insumo,
              total: totalItemByPeriod,
              number: payment.numero_fiscal,
              provider:
                body.direction === 'pagar'
                  ? payment.emitente
                  : payment.remetente,
            });
          } else {
            response.push({
              id: costCenter.ID,
              categoryId: branch.ID,
              cost: totalItemByPeriod,
              code: costCenter.centro_custo,
              name: `${costCenter.centro_custo}-${costCenter.descricao}`,
              categoryCode: branch.ID.toString(),
              category: branch.filial_numero,
              month,
              item: [
                {
                  dueDate: payment.prorrogacao,
                  numberSplit: payment.parcela,
                  valueSplit: Number(payment.valor_parcela),
                  currentDate: payment.prorrogacao,
                  material:
                    body.direction === 'pagar'
                      ? payment.material
                      : payment.insumo,
                  total: totalItemByPeriod,
                  number: payment.numero_fiscal,
                  provider:
                    body.direction === 'pagar'
                      ? payment.emitente
                      : payment.remetente,
                },
              ],
            });
          }
        }
      }
    } else {
      throw new ForbiddenException(
        MessageService.FinanceItem_cost_center_not_found,
      );
    }
    // let tot = 0;

    // response.forEach((item) => (tot += Number(item.cost)));

    response.sort((a, b) => {
      const [monthA, yearA] = a.month.split('/').map(Number);
      const [monthB, yearB] = b.month.split('/').map(Number);

      if (yearA !== yearB) {
        return yearA - yearB;
      } else {
        return monthA - monthB;
      }
    });
    return { items: response };
  }

  @UseGuards(AuthGuard)
  @Post('/reportTest')
  async listReport(@Body() body: listReportBody) {
    const response: ListReportResponse[] = [];

    const firstDayOfMonth = dayjs(body.startDate).toDate();
    const lastDayOfMonth = dayjs(body.endDate).toDate();

    if (body.costCenterId) {
      const listPayment = body.paid
        ? await this.financePaymentRepository.listItemsByDateAndDirectionAndDescriptionCostCenterAndPay(
            1,
            firstDayOfMonth,
            lastDayOfMonth,
            body.direction,
            body.costCenterId,
          )
        : await this.financePaymentRepository.listItemsByDateAndDirectionAndDescriptionCostCenter(
            1,
            firstDayOfMonth,
            lastDayOfMonth,
            body.direction,
            body.costCenterId,
          );

      //const month = dayjs(currentDate).format('MM/YYYY');

      for await (const payment of listPayment) {
        const totalItem = payment.finance.items.reduce(
          (acc, current) => (acc += Number(current.total)),
          0,
        );
        const month = dayjs(payment.prorrogacao).format('MM/YYYY');

        for await (const value of payment.finance.items) {
          if (
            !body.costCenterId.includes(
              value.compositionItem.compositionGroup.costCenter.ID,
            )
          ) {
            continue;
          }

          const totalItemByPeriod =
            (Number(value.total) * payment.valor_parcela) / totalItem;

          const {
            compositionItem: {
              compositionGroup: {
                costCenter,
                costCenter: {
                  descriptionCostCenter: { branch },
                },
              },
            },
          } = value;

          const index = response.findIndex(
            (item) =>
              item.code === branch.ID.toString() &&
              item.name ===
                `${costCenter.centro_custo}-${costCenter.descricao}` &&
              item.categoryCode === branch.ID.toString() &&
              item.category === branch.filial_numero &&
              item.month === month,
          );

          if (index >= 0) {
            response[index].cost += totalItemByPeriod;
            response[index].item.push({
              dueDate: payment.prorrogacao,
              numberSplit: payment.parcela,
              valueSplit: payment.valor_parcela,
              currentDate: payment.prorrogacao,
              material: value.material
                ? value.material.material
                : value.input.insumo,
              total: totalItemByPeriod,
              number: payment.finance.numero_fiscal,
              provider: payment.finance.financeControl.issuePay
                ? payment.finance.financeControl.issuePay.nome_fantasia
                : payment.finance.financeControl.senderReceive.nome_fantasia,
            });
          } else {
            response.push({
              id: costCenter.ID,
              categoryId: branch.ID,
              cost: totalItemByPeriod,
              code: costCenter.centro_custo,
              name: `${costCenter.centro_custo}-${costCenter.descricao}`,
              categoryCode: branch.ID.toString(),
              category: branch.filial_numero,
              month,
              item: [
                {
                  dueDate: payment.prorrogacao,
                  numberSplit: payment.parcela,
                  valueSplit: payment.valor_parcela,
                  currentDate: payment.prorrogacao,
                  material: value.material
                    ? value.material.material
                    : value.input.insumo,
                  total: totalItemByPeriod,
                  number: payment.finance.numero_fiscal,
                  provider: payment.finance.financeControl.issuePay
                    ? payment.finance.financeControl.issuePay.nome_fantasia
                    : payment.finance.financeControl.senderReceive
                        .nome_fantasia,
                },
              ],
            });
          }
        }
      }
    } else {
      throw new ForbiddenException(
        MessageService.FinanceItem_cost_center_not_found,
      );
    }

    return { items: response };
  }

  @UseGuards(AuthGuard)
  @Post('/reportFinance')
  async listReportFinance(@Req() req, @Body() body: listReportBody) {
    const user: IUserInfo = req.user;
    const response: ListReportFinanceResponse[] = [];

    // const firstDayOfMonth = dayjs(body.startDate).toDate();
    // const lastDayOfMonth = dayjs(body.endDate).toDate();

    const allPaymentPay =
      await this.financePaymentRepository.listViewExpressByDateAndClient(
        user.clientId,
        dayjs(body.startDate).format('YYYY-MM-DD'),
        dayjs(body.endDate).format('YYYY-MM-DD'),
        body.costCenterId,
        body.paid,
      );
    const allPaymentReceive =
      await this.financePaymentRepository.listViewReceiveByDateAndClient(
        user.clientId,
        dayjs(body.startDate).format('YYYY-MM-DD'),
        dayjs(body.endDate).format('YYYY-MM-DD'),
        body.costCenterId,
        body.paid,
      );

    const paymentArr: ListReportTestFinanceResponse[] = [];

    allPaymentPay.forEach((value) => {
      const index = paymentArr.findIndex((item) => item.id === value.id);

      if (index >= 0) {
        paymentArr[index].items.push({
          total: value.total,
          compositionItem: {
            id: value.composition_item_id,
            composicao: value.composition_item_composicao,
            descricao: value.composition_item_descricao,
            compositionGroup: {
              id: value.composition_group_id,
              composicao: value.composition_group_composicao,
              descricao: value.composition_group_descricao,
              costCenter: {
                ID: value.costCenter_ID,
                centro_custo: value.costCenter_code,
                descricao: value.costCenter_descricao,
                descriptionCostCenter: {
                  id: value.descriptionCostCenter_id,
                  descricao: value.descriptionCostCenter_name,
                  branch: {
                    ID: value.branch_id,
                    filial_numero: value.branch_name,
                  },
                },
              },
            },
          },
        });
      } else {
        paymentArr.push({
          id: value.id,
          numero_fiscal: value.numero_fiscal,
          parcela: value.parcela,
          type: 'pagar',
          prorrogacao: value.prorrogacao,
          valor_a_pagar: value.valor_a_pagar,
          valor_parcela: value.valor_parcela,
          emitente: value.emitente,
          remetente: value.remetente,
          material: value.material,
          insumo: value.insumo,
          items: [
            {
              total: value.total,
              compositionItem: {
                id: value.composition_item_id,
                composicao: value.composition_item_composicao,
                descricao: value.composition_item_descricao,
                compositionGroup: {
                  id: value.composition_group_id,
                  composicao: value.composition_group_composicao,
                  descricao: value.composition_group_descricao,
                  costCenter: {
                    ID: value.costCenter_ID,
                    centro_custo: value.costCenter_code,
                    descricao: value.costCenter_descricao,
                    descriptionCostCenter: {
                      id: value.descriptionCostCenter_id,
                      descricao: value.descriptionCostCenter_name,
                      branch: {
                        ID: value.branch_id,
                        filial_numero: value.branch_name,
                      },
                    },
                  },
                },
              },
            },
          ],
        });
      }
    });

    allPaymentReceive.forEach((value) => {
      const index = paymentArr.findIndex((item) => item.id === value.id);

      if (index >= 0) {
        paymentArr[index].items.push({
          total: value.total,
          compositionItem: {
            id: value.composition_item_id,
            composicao: value.composition_item_composicao,
            descricao: value.composition_item_descricao,
            compositionGroup: {
              id: value.composition_group_id,
              composicao: value.composition_group_composicao,
              descricao: value.composition_group_descricao,
              costCenter: {
                ID: value.costCenter_ID,
                centro_custo: value.costCenter_code,
                descricao: value.costCenter_descricao,
                descriptionCostCenter: {
                  id: value.descriptionCostCenter_id,
                  descricao: value.descriptionCostCenter_name,
                  branch: {
                    ID: value.branch_id,
                    filial_numero: value.branch_name,
                  },
                },
              },
            },
          },
        });
      } else {
        paymentArr.push({
          id: value.id,
          numero_fiscal: value.numero_fiscal,
          type: 'receber',
          parcela: value.parcela,
          prorrogacao: value.prorrogacao,
          valor_a_pagar: value.valor_a_pagar,
          valor_parcela: value.valor_parcela,
          emitente: value.emitente,
          remetente: value.remetente,
          material: value.material,
          insumo: value.insumo,
          items: [
            {
              total: value.total,
              compositionItem: {
                id: value.composition_item_id,
                composicao: value.composition_item_composicao,
                descricao: value.composition_item_descricao,
                compositionGroup: {
                  id: value.composition_group_id,
                  composicao: value.composition_group_composicao,
                  descricao: value.composition_group_descricao,
                  costCenter: {
                    ID: value.costCenter_ID,
                    centro_custo: value.costCenter_code,
                    descricao: value.costCenter_descricao,
                    descriptionCostCenter: {
                      id: value.descriptionCostCenter_id,
                      descricao: value.descriptionCostCenter_name,
                      branch: {
                        ID: value.branch_id,
                        filial_numero: value.branch_name,
                      },
                    },
                  },
                },
              },
            },
          ],
        });
      }
    });

    if (body.costCenterId) {
      // const listPayment = body.paid
      //   ? await this.financePaymentRepository.listItemsByDateAndDirectionAndCostCenterAndPay(
      //       firstDayOfMonth,
      //       lastDayOfMonth,
      //       body.direction,
      //       body.costCenterId,
      //     )
      //   : await this.financePaymentRepository.listItemsByDateAndDirectionAndCostCenter(
      //       firstDayOfMonth,
      //       lastDayOfMonth,
      //       body.direction,
      //       body.costCenterId,
      //     );

      //const month = dayjs(currentDate).format('MM/YYYY');

      for await (const payment of paymentArr) {
        const totalItem = payment.items.reduce(
          (acc, current) => (acc += Number(current.total)),
          0,
        );
        const month = dayjs(payment.prorrogacao).format('MM/YYYY');

        for await (const value of payment.items) {
          // if (
          //   !body.costCenterId.includes(
          //     value.compositionItem.compositionGroup.costCenter.ID,
          //   )
          // ) {
          //   continue;
          // }

          const totalItemByPeriod =
            (Number(value.total) * Number(payment.valor_parcela)) / totalItem;

          const {
            compositionItem: {
              compositionGroup: {
                costCenter,
                costCenter: {
                  descriptionCostCenter: { branch },
                },
              },
            },
          } = value;

          const index = response.findIndex(
            (item) =>
              item.code === costCenter.centro_custo &&
              item.name ===
                `${costCenter.centro_custo}-${costCenter.descricao}` &&
              item.categoryCode === branch.ID.toString() &&
              item.category === branch.filial_numero &&
              item.month === month,
          );

          if (index >= 0) {
            if (payment.type === 'pagar') {
              response[index].costPay += totalItemByPeriod;
            } else {
              response[index].costReceive += totalItemByPeriod;
            }

            response[index].item.push({
              dueDate: payment.prorrogacao,
              numberSplit: payment.parcela,
              valueSplit: Number(payment.valor_parcela),
              currentDate: payment.prorrogacao,
              material:
                body.direction === 'pagar' ? payment.material : payment.insumo,
              total: totalItemByPeriod,
              number: payment.numero_fiscal,
              provider:
                body.direction === 'pagar'
                  ? payment.emitente
                  : payment.remetente,
            });
          } else {
            let costPay = 0;
            let costReceive = 0;
            if (payment.type === 'pagar') {
              costPay = totalItemByPeriod;
            } else {
              costReceive = totalItemByPeriod;
            }

            response.push({
              id: costCenter.ID,
              categoryId: branch.ID,
              costPay,
              costReceive,
              code: costCenter.centro_custo,
              name: `${costCenter.centro_custo}-${costCenter.descricao}`,
              categoryCode: branch.ID.toString(),
              category: branch.filial_numero,
              month,
              item: [
                {
                  dueDate: payment.prorrogacao,
                  numberSplit: payment.parcela,
                  valueSplit: Number(payment.valor_parcela),
                  currentDate: payment.prorrogacao,
                  material:
                    body.direction === 'pagar'
                      ? payment.material
                      : payment.insumo,
                  total: totalItemByPeriod,
                  number: payment.numero_fiscal,
                  provider:
                    body.direction === 'pagar'
                      ? payment.emitente
                      : payment.remetente,
                },
              ],
            });
          }
        }
      }
    } else {
      throw new ForbiddenException(
        MessageService.FinanceItem_cost_center_not_found,
      );
    }
    // let tot = 0;

    // response.forEach((item) => (tot += Number(item.cost)));

    return { items: response };
  }
}
