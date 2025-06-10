import {
  Body,
  Controller,
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
import { ReportBody } from './dtos/report-body';
import { IUserInfo } from 'src/models/IUser';
import { DateService } from 'src/service/data.service';
import { FindNextDaysBody } from './dtos/findNextDays-query';
import { FindNextDaysResponse } from './dtos/findNextDays-response';
import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
import { ApiTags } from '@nestjs/swagger';

dayjs.locale('pt-br');
@ApiTags('Financial - Reports - Dashboard Finance')
@Controller('/financial/reports/dashboard-finance')
export class DashboardFinanceController {
  constructor(
    private costCenterRepository: CostCenterRepository,
    private financePaymentRepository: FinancePaymentRepository,
    private financeItemRepository: FinanceItemRepository,
    private dateService: DateService,
    private descriptionCostCenterRepository: DescriptionCostCenterRepository,
  ) {}

  @Get('/')
  async get() {
    return { message: 'OK' };
  }

  @UseGuards(AuthGuard)
  @Get('/list-branches')
  async listBranches(@Request() req) {
    const { user } = req; // @UseGuards(AuthGuard)
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
  async report(@Request() req, @Body() body: ReportBody) {
    const user: IUserInfo = req.user;
    /*Status Ids
      A Vencer - 1
      Vencido  - 2
      Pago     - 3
    */
    const startDate = dayjs(body.startDate).format('YYYY-MM-DD');
    const endDate = dayjs(body.endDate).format('YYYY-MM-DD');
    // const totalRevenue =
    //   await this.financePaymentRepository.aggregateSumByCostCenterAndStatusAndPay(
    //     user.clientId,
    //     'receber',
    //     body.costCenter,
    //     startDate,
    //     endDate,
    //     ['FECHADO', 'PROCESSANDO'],
    //   ); //Total Receitas
    // const totalExpress =
    //   await this.financePaymentRepository.aggregateSumByCostCenterAndStatusAndPay(
    //     user.clientId,
    //     'pagar',
    //     body.costCenter,
    //     startDate,
    //     endDate,
    //     ['FECHADO', 'PROCESSANDO'],
    //   ); //Total Despesas
    const totalRevenue =
      await this.financePaymentRepository.sumViewReceiveByDateAndClient(
        startDate,
        endDate,
        user.clientId,
        body.costCenter,
        body.issued,
      ); //Total Receitas
    const totalExpress =
      await this.financePaymentRepository.sumViewExpressByDateAndClient(
        startDate,
        endDate,
        user.clientId,
        body.costCenter,
        body.issued,
      ); //Total Despesas

    const allBranches: {
      name: string;
      express: number;
      receive: number;
      netProfit: number;
    }[] = [];

    const listReceivePayment =
      await this.financePaymentRepository.listViewReceiveByDateAndClient(
        user.clientId,
        startDate,
        endDate,
        body.costCenter,
        body.issued,
        //body.issued,
      );

    listReceivePayment.forEach((item) => {
      const index = allBranches.findIndex(
        (value) => value.name === item.branch_name.replace(/\d+/g, '').trim(),
      );
      if (index >= 0) {
        allBranches[index].receive += Number(item.valor_parcela);
      } else {
        allBranches.push({
          name: item.branch_name.replace(/\d+/g, '').trim(),
          receive: Number(item.valor_parcela),
          express: 0,
          netProfit: 0,
        });
      }
    });

    const listExpressPayment =
      await this.financePaymentRepository.listViewExpressByDateAndClient(
        user.clientId,
        startDate,
        endDate,
        body.costCenter,
        body.issued,
        //body.issued,
      );

    listExpressPayment.forEach((item) => {
      const index = allBranches.findIndex(
        (value) => value.name === item.branch_name.replace(/\d+/g, '').trim(),
      );
      if (index >= 0) {
        allBranches[index].express += Number(item.valor_parcela);
      } else {
        allBranches.push({
          name: item.branch_name.replace(/\d+/g, '').trim(),
          express: Number(item.valor_parcela),
          receive: 0,
          netProfit: 0,
        });
      }
    });
    allBranches.forEach((item) => {
      item.netProfit = item.receive - item.express;
    });

    //return allBranches;
    // const accountsReceivable =
    //   await this.financePaymentRepository.aggregateSumByCostCenterAndStatusAndPay(
    //     user.clientId,
    //     'receber',
    //     body.costCenter,
    //     startDate,
    //     endDate,
    //     ['FECHADO', 'PROCESSANDO'],
    //     [1],
    //   ); //Contas a Receber
    // const billsToPay =
    //   await this.financePaymentRepository.aggregateSumByCostCenterAndStatusAndPay(
    //     user.clientId,
    //     'pagar',
    //     body.costCenter,
    //     startDate,
    //     endDate,
    //     ['FECHADO', 'PROCESSANDO'],
    //     [1],
    //   ); //Contas a Pagar
    const accountsReceivable =
      await this.financePaymentRepository.sumViewReceiveByDateAndClientAndPay(
        startDate,
        endDate,
        user.clientId,
        body.costCenter,
        [1],
        body.issued,
      ); //Contas a Receber com status a vencer
    const billsToPay =
      await this.financePaymentRepository.sumViewExpressByDateAndClientAndPay(
        startDate,
        endDate,
        user.clientId,
        body.costCenter,
        [1],
        body.issued,
      ); //Contas a Pagar com status a vencer

    const netProfit = totalRevenue - totalExpress; //Lucro liquido = Total Receitas - Total Despesas

    //Calcular Saldo - Falta fazer

    const liquidRatio = accountsReceivable - billsToPay; //Índice Liquido = Contas a Receber - Contas a Pagar

    // const receiveDefeated =
    //   await this.financePaymentRepository.aggregateSumByCostCenterAndStatusAndPay(
    //     user.clientId,
    //     'receber',
    //     body.costCenter,
    //     startDate,
    //     endDate,
    //     ['ABERTO', 'FECHADO', 'PROCESSANDO', 'AGUARDANDO_PEDIDO'],
    //     [2],
    //   ); //Vencido a receber
    // const payDefeated =
    //   await this.financePaymentRepository.aggregateSumByCostCenterAndStatusAndPay(
    //     user.clientId,
    //     'pagar',
    //     body.costCenter,
    //     startDate,
    //     endDate,
    //     ['ABERTO', 'FECHADO', 'PROCESSANDO', 'AGUARDANDO_PEDIDO'],
    //     [2],
    //   ); //Vencido a pagar
    const receiveDefeated =
      await this.financePaymentRepository.sumViewReceiveByDateAndClientAndPay(
        startDate,
        endDate,
        user.clientId,
        body.costCenter,
        [2],
        body.issued,
      ); //Vencido a receber
    const payDefeated =
      await this.financePaymentRepository.sumViewExpressByDateAndClientAndPay(
        startDate,
        endDate,
        user.clientId,
        body.costCenter,
        [2],
        body.issued,
      ); //Vencido a pagar

    const defeated = {
      receiveDefeated,
      payDefeated,
    };

    const response = {
      branches: allBranches,
      totalRevenue: totalRevenue,
      totalExpress: totalExpress,
      netProfit: netProfit,
      due: {
        accountsReceivable,
        billsToPay,
      },
      defeated,
      liquidRatio: liquidRatio,
      dashboardMonth: [],
    };

    if (body.type === undefined || body.type === 'monthly') {
      const rangeDate = await this.dateService.generateStartAndEndForDate(
        dayjs(startDate).toDate(),
        dayjs(endDate).toDate(),
      );

      for await (const range of rangeDate) {
        // const totalRevenueMonth =
        //   await this.financePaymentRepository.aggregateSumByCostCenterAndStatusAndPay(
        //     user.clientId,
        //     'receber',
        //     body.costCenter,
        //     range.start,
        //     range.end,
        //     ['FECHADO', 'PROCESSANDO'],
        //   ); //Total Receitas
        // const totalExpressMonth =
        //   await this.financePaymentRepository.aggregateSumByCostCenterAndStatusAndPay(
        //     user.clientId,
        //     'pagar',
        //     body.costCenter,
        //     range.start,
        //     range.end,
        //     ['FECHADO', 'PROCESSANDO'],
        //   ); //Total Despesas
        const totalRevenueMonth =
          await this.financePaymentRepository.sumViewReceiveByDateAndClient(
            dayjs(range.start).format('YYYY-MM-DD'),
            dayjs(range.end).format('YYYY-MM-DD'),
            user.clientId,
            body.costCenter,
            body.issued,
          ); //Total Receitas
        const totalExpressMonth =
          await this.financePaymentRepository.sumViewExpressByDateAndClient(
            dayjs(range.start).format('YYYY-MM-DD'),
            dayjs(range.end).format('YYYY-MM-DD'),
            user.clientId,
            body.costCenter,
            body.issued,
          ); //Total Despesas
        const netProfitMonth = totalRevenueMonth - totalExpressMonth; //Lucro liquido = Total Receitas - Total Despesas
        const month =
          body.type === 'monthly'
            ? dayjs(range.start).format('MMM/YYYY')
            : dayjs(range.start).format('DD/MMM');

        response.dashboardMonth.push({
          totalReceive: totalRevenueMonth,
          totalExpress: totalExpressMonth * -1,
          netProfit: netProfitMonth,
          month,
        });
      }
    } else {
      const allListReceiveInMonth =
        await this.financePaymentRepository.listViewReceiveByDateAndClient(
          user.clientId,
          startDate,
          endDate,
          body.costCenter,
          body.issued,
        );

      const allReceiveInMonth: {
        date: dayjs.Dayjs;
        value: number;
      }[] = [];

      allListReceiveInMonth.forEach((item) => {
        const validDate = body.issued
          ? dayjs(item.data_vencimento)
          : dayjs(item.prorrogacao);

        const index = allReceiveInMonth.findIndex((value) =>
          value.date.isSame(validDate),
        );

        if (index >= 0) {
          allReceiveInMonth[index].value += Number(item.valor_parcela);
        } else {
          allReceiveInMonth.push({
            date: validDate,
            value: Number(item.valor_parcela),
          });
        }
      });

      const allListExpressInMonth =
        await this.financePaymentRepository.listViewExpressByDateAndClient(
          user.clientId,
          startDate,
          endDate,
          body.costCenter,
          body.issued,
        );

      const allExpressInMonth: {
        date: dayjs.Dayjs;
        value: number;
      }[] = [];

      allListExpressInMonth.forEach((item) => {
        const validDate = body.issued
          ? dayjs(item.data_vencimento)
          : dayjs(item.prorrogacao);

        const index = allExpressInMonth.findIndex((value) =>
          value.date.isSame(validDate),
        );

        if (index >= 0) {
          allExpressInMonth[index].value += Number(item.valor_parcela);
        } else {
          allExpressInMonth.push({
            date: validDate,
            value: Number(item.valor_parcela),
          });
        }
      });

      allReceiveInMonth.sort((a, b) =>
        dayjs(a.date, 'DD/MM/YYYY').isAfter(dayjs(b.date, 'DD/MM/YYYY'))
          ? 1
          : -1,
      );

      allExpressInMonth.sort((a, b) =>
        dayjs(a.date, 'DD/MM/YYYY').isAfter(dayjs(b.date, 'DD/MM/YYYY'))
          ? 1
          : -1,
      );

      response.dashboardMonth = this.dateService.groupByDateForFinance(
        allReceiveInMonth,
        allExpressInMonth,
      );
    }

    return response;
  }

  @UseGuards(AuthGuard)
  @Post('/report/forDays')
  async findNextDays(@Req() req, @Body() body: FindNextDaysBody) {
    const user: IUserInfo = req.user;

    let startDate = dayjs(body.endDate);
    const endDate = dayjs(body.endDate).add(body.nextDays, 'd');

    const totalRevenue =
      await this.financePaymentRepository.sumViewReceiveByDateAndClient(
        body.startDate,
        body.endDate,
        user.clientId,
        body.costCenter,
        body.issued,
      ); //Total Receitas
    const totalExpress =
      await this.financePaymentRepository.sumViewExpressByDateAndClient(
        body.startDate,
        body.endDate,
        user.clientId,
        body.costCenter,
        body.issued,
      ); //Total Despesas
    const netProfitPrevious = totalRevenue - totalExpress; //Lucro liquido = Total Receitas - Total Despesas

    const response: FindNextDaysResponse = {
      next: [],
    };
    let netProfit = netProfitPrevious;
    while (!startDate.isSame(endDate)) {
      const findReceive =
        await this.financePaymentRepository.sumViewReceiveByDateAndClient(
          startDate.format('YYYY-MM-DD'),
          startDate.format('YYYY-MM-DD'),
          user.clientId,
          body.costCenter,
          body.issued,
        );

      const findExpress =
        await this.financePaymentRepository.sumViewExpressByDateAndClient(
          startDate.format('YYYY-MM-DD'),
          startDate.format('YYYY-MM-DD'),
          user.clientId,
          body.costCenter,
          body.issued,
        );

      netProfit += findReceive - findExpress;

      response.next.push({
        date: startDate.toDate(),
        receive: findReceive,
        express: findExpress,
        netProfit,
      });

      startDate = startDate.add(1, 'd');
    }

    return response;
  }
}
