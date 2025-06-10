import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import MaterialRepository from 'src/repositories/material-repository';
import ServiceOrderMaintainerRepository from 'src/repositories/service-order-maintainer-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
import { DateService } from 'src/service/data.service';
import { z } from 'zod';
import ListCalendarMaintainerQuerySwagger from './dtos/swagger/listCalendarMaintainer-query-swagger';
import listCalendarMaintainerResponseSwagger from './dtos/swagger/listCalendarMaintainer-response-swagger';

@ApiTags('Maintenance - Reports')
@Controller('maintenance/reports')
export default class ReportsController {
  constructor(
    private serviceOrderRepository: ServiceOrderRepository,
    private materialRepository: MaterialRepository,
    private typeMaintenanceRepository: TypeMaintenanceRepository,
    private serviceOrderMaintainerRepository: ServiceOrderMaintainerRepository,
    private dateService: DateService,
  ) {}
  @UseGuards(AuthGuard)
  @Get('/status-maintenance')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ListStatusMaintenance(@Req() req, @Query() query: any) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      branchId: z.coerce.number().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      typeMaintenanceId: z.coerce.number().optional(),
    });

    const parseQuery = querySchema.parse(req.query);
    const { branchId, startDate, endDate, typeMaintenanceId } = parseQuery;

    const filter: any = {};

    if (startDate || endDate) {
      filter.log_date = {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      };
    }

    if (branchId) {
      filter.ID_filial = branchId;
    }

    if (typeMaintenanceId) {
      filter.typeMaintenance = {
        ID: typeMaintenanceId,
      };
    }

    const allOrdensTeste =
      await this.serviceOrderRepository.listOrdensMaintainer(
        user.branches,
        filter,
      );

    const statusMaintenance = allOrdensTeste.reduce(
      (acc, order) => {
        const status = order.statusOrderService.status;

        if (!acc[status]) {
          acc[status] = 0;
        }
        acc[status] += 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    const totalOrdens = Object.values(statusMaintenance).reduce(
      (sum, count) => sum + count,
      0,
    );

    const formattedData = Object.entries(statusMaintenance).map(
      ([status, count]) => ({
        status,
        count: count as number,
        porcentage: (count / totalOrdens) * 100,
      }),
    );

    return {
      totalOrdens,
      data: formattedData,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/orders-status')
  async OrdersByDay(@Req() req): Promise<any> {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}$/, 'Formato esperado: YYYY-MM'),
      branchId: z.coerce.number().optional(),
    });

    const parseQuery = querySchema.parse(req.query);
    const { startDate, branchId } = parseQuery;

    const [year, month] = startDate.split('-').map(Number);
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const filter: any = {
      log_date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    };

    if (branchId) {
      filter.ID_filial = branchId;
    }

    const serviceOrders = await this.serviceOrderRepository.listOrdersCalendar(
      user.branches,
      filter,
    );

    const groupedOrders: Record<string, { id: number; color: string }[]> = {};

    serviceOrders.forEach((order) => {
      const logDate = new Date(order.log_date);
      const day = logDate.getDate().toString();

      if (!groupedOrders[day]) {
        groupedOrders[day] = [];
      }

      const orderEntry = {
        id: order.statusOrderService.id,
        color: order.statusOrderService.cor,
      };

      // Check if this id/color combination already exists in the day's array
      const exists = groupedOrders[day].some(
        (entry) =>
          entry.id === orderEntry.id && entry.color === orderEntry.color,
      );

      // Only add if it doesn't exist yet
      if (!exists) {
        groupedOrders[day].push(orderEntry);
      }
    });

    return { data: groupedOrders };
  }

  @UseGuards(AuthGuard)
  @Get('/calendar-orders')
  async CalendarOrdersTypeMaintenance(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      branchId: z.coerce.number().optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      typeMaintenanceId: z.coerce.number().optional(),
    });

    const parseQuery = querySchema.parse(req.query);
    const { branchId, startDate, endDate, typeMaintenanceId } = parseQuery;

    const finalEndDate = endDate || new Date();

    const filter: any = {
      log_date: {
        gte: startDate,
        lte: finalEndDate,
      },
      data_hora_encerramento: null,
      typeMaintenanceId,
    };

    if (branchId) {
      filter.ID_filial = branchId;
    }

    if (typeMaintenanceId) {
      filter.typeMaintenance = {
        ID: typeMaintenanceId,
      };
    }

    const serviceOrders =
      await this.serviceOrderRepository.listOrdersCalendarTypeMaintenance(
        user.branches,
        filter,
      );

    const groupedOrders: Record<string, Record<string, number>> = {};

    for (
      let date = new Date(startDate);
      date <= finalEndDate;
      date.setDate(date.getDate() + 1)
    ) {
      const currentDate = date.toISOString().split('T')[0];
      groupedOrders[currentDate] = {};

      serviceOrders.forEach((order) => {
        const orderDate = order.log_date.toISOString().split('T')[0];
        if (orderDate === currentDate) {
          const status = order.statusOrderService?.status || 'Outros';

          if (!groupedOrders[currentDate][status]) {
            groupedOrders[currentDate][status] = 0;
          }
          groupedOrders[currentDate][status]++;
        }
      });
    }
    return groupedOrders;
  }

  @UseGuards(AuthGuard)
  @Get('/calendar-service-order')
  async CalendarServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      branchId: z.coerce.number().optional(),
      startDate: z.coerce.date(),
    });

    const parseQuery = querySchema.parse(req.query);
    const { branchId, startDate } = parseQuery;

    const startOfDayUTC = new Date(startDate);
    startOfDayUTC.setUTCHours(0, 0, 0, 0);

    const endOfDayUTC = new Date(startDate);
    endOfDayUTC.setUTCHours(23, 59, 59, 999);

    const filter: any = {
      log_date: {
        gte: startOfDayUTC,
        lte: endOfDayUTC,
      },
    };

    if (branchId) {
      filter.ID_filial = branchId;
    }

    const serviceOrders = await this.serviceOrderRepository.listOrdersCalendar(
      user.branches,
      filter,
    );

    const ordersList = serviceOrders.map((order) => {
      const logDate = new Date(order.log_date);

      let timeOpened: string;
      if (order.data_hora_encerramento) {
        const endDate = new Date(order.data_hora_encerramento);
        const timeOpenedMs = endDate.getTime() - logDate.getTime();
        const timeOpenedDays = Math.floor(timeOpenedMs / (1000 * 60 * 60 * 24));
        timeOpened =
          timeOpenedDays > 0 ? `${timeOpenedDays} dia(s)` : 'Menos de 1 dia';
      } else {
        const now = new Date();
        const timeOpenedMs = now.getTime() - logDate.getTime();
        const timeOpenedDays = Math.floor(timeOpenedMs / (1000 * 60 * 60 * 24));
        timeOpened =
          timeOpenedDays > 0 ? `${timeOpenedDays} dia(s)` : 'Menos de 1 dia';
      }

      return {
        id: order.ID,
        orderServiceNumber: order.ordem
          ? String(order.ordem).padStart(9, '0')
          : null,
        equipment: order.equipamento,
        timeOpened,
        dateEmission: logDate.toISOString().split('T')[0],
        status: {
          name: order.statusOrderService.status,
          color: order.statusOrderService.cor,
        },
      };
    });

    return { data: ordersList };
  }

  @UseGuards(AuthGuard)
  @Get('/stop-record')
  async StopRecordTypeMaintenance(@Req() req): Promise<any[]> {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      branchId: z.coerce.number().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      typeMaintenanceId: z.coerce.number().optional(),
    });

    const parseQuery = querySchema.parse(req.query);
    const { branchId, startDate, endDate, typeMaintenanceId } = parseQuery;

    const finalEndDate = endDate || new Date();

    const filter: any = {
      log_date: {
        gte: startDate,
        lte: finalEndDate,
      },
      data_hora_encerramento: null,
    };

    if (branchId) {
      filter.ID_filial = branchId;
    }

    if (typeMaintenanceId) {
      filter.typeMaintenance = {
        ID: typeMaintenanceId,
      };
    }

    const serviceOrders =
      await this.serviceOrderRepository.stopRecordTypeMaintenance(
        user.branches,
        filter,
      );

    const groupedData = {};

    serviceOrders.forEach((order) => {
      const type = order.typeMaintenance?.tipo_manutencao || 'Outros';

      const startTime = order.data_equipamento_parou
        ? new Date(order.data_equipamento_parou)
        : null;
      const endTime = order.data_equipamento_funcionou
        ? new Date(order.data_equipamento_funcionou)
        : null;

      const timeHours =
        startTime && endTime
          ? (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
          : 0;

      const dueDate = order.data_prevista_termino
        ? new Date(order.data_prevista_termino)
        : new Date();
      const isDelayed = new Date() > dueDate;

      if (!groupedData[type]) {
        groupedData[type] = {
          totalOrders: 0,
          delayedOrders: 0,
          totalDowntime: 0,
        };
      }

      groupedData[type].totalOrders += 1;
      groupedData[type].totalDowntime += timeHours;
      if (isDelayed) {
        groupedData[type].delayedOrders += 1;
      }
    });

    const response = Object.entries(groupedData).map(([type, data]: any) => ({
      typeMaintenance: type,
      totalOrders: data.totalOrders,
      delayedOrders: data.delayedOrders,
      totalStopTime: data.totalDowntime.toFixed(2),
    }));

    return response;
  }

  @UseGuards(AuthGuard)
  @Get('/execution-statistics')
  async ExecutionStatistics(@Req() req): Promise<any> {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      branchId: z.coerce.number().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      typeMaintenanceId: z.coerce.number().optional(),
    });

    const parseQuery = querySchema.parse(req.query);
    const { branchId, startDate, endDate, typeMaintenanceId } = parseQuery;

    const finalEndDate = endDate || new Date();

    const filter: any = {
      log_date: {
        gte: startDate,
        lte: finalEndDate,
      },
      //typeMaintenance filtro id aqui
    };

    if (branchId) {
      filter.ID_filial = branchId;
    }

    if (typeMaintenanceId) {
      filter.typeMaintenance = {
        ID: typeMaintenanceId,
      };
    }

    const serviceOrders =
      await this.serviceOrderRepository.listOrdensMaintainer(
        user.branches,
        filter,
      );

    function calculateHoursDifference(
      startDate: string | Date,
      endDate: string | Date,
    ): number {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const diffInMilliseconds = end.getTime() - start.getTime();

      return diffInMilliseconds / (1000 * 60 * 60);
    }

    const totalOrders = serviceOrders.length;

    const notInExecution = serviceOrders.filter(
      (order) => order.statusOrderService.status === 'EM ABERTO',
    ).length;

    const inExecution = serviceOrders.filter(
      (order) =>
        order.statusOrderService.status !== 'ENCERRADO' &&
        order.statusOrderService.status !== 'CANCELADO' &&
        order.statusOrderService.status !== 'EM ABERTO',
    ).length;

    //const currentDate = new Date();

    const predictedExecutionHours = serviceOrders
      .filter((order) => order.log_date)
      .reduce((total, order) => {
        const totalForOrder = order.taskServiceOrder.reduce(
          (current, taskService) => {
            const totalItem = taskService.registerHour.reduce(
              (totalRegister, value) => {
                if (value.fim) {
                  // Tarefa concluída: usa o tempo real
                  return (
                    totalRegister +
                    calculateHoursDifference(value.inicio, value.fim)
                  );
                } else {
                  // Tarefa em andamento: usa uma estimativa (ex.: 2 horas)
                  return totalRegister + 2; // Ajuste conforme lógica de negócio
                }
              },
              0,
            );
            return current + totalItem;
          },
          0,
        );
        return total + totalForOrder;
      }, 0)
      .toFixed();

    // Horas executadas no período (executedHoursInPeriod)
    const executedHoursInPeriod = serviceOrders
      .filter((order) => order.log_date)
      .reduce((total, order) => {
        const totalForOrder = order.taskServiceOrder.reduce(
          (current, taskService) => {
            const totalItem = taskService.registerHour.reduce(
              (totalRegister, value) => {
                if (
                  value.fim &&
                  new Date(value.fim) <= finalEndDate &&
                  new Date(value.inicio) >= (startDate || new Date(0))
                ) {
                  // Apenas tarefas concluídas no período
                  return (
                    totalRegister +
                    calculateHoursDifference(value.inicio, value.fim)
                  );
                }
                return totalRegister + 0;
              },
              0,
            );
            return current + totalItem;
          },
          0,
        );
        return total + totalForOrder;
      }, 0)
      .toFixed();

    const executionPercentage = totalOrders
      ? ((inExecution / totalOrders) * 100).toFixed(2)
      : '0';

    const notInExecutionPercentage = totalOrders
      ? (100 - parseFloat(executionPercentage)).toFixed(2)
      : '0';

    const totalHorasTotais =
      parseFloat(predictedExecutionHours) + parseFloat(executedHoursInPeriod);

    const hrsPredictedPorcentage = totalHorasTotais
      ? (
          (parseFloat(predictedExecutionHours) / totalHorasTotais) *
          100
        ).toFixed()
      : '0';

    const hrsExecutionPorcentage = totalHorasTotais
      ? ((parseFloat(executedHoursInPeriod) / totalHorasTotais) * 100).toFixed(
          2,
        )
      : '0';

    const groupedData = {
      notInExecution,
      inExecution,
      predictedExecutionHours,
      executedHoursInPeriod,
      executionPercentage,
      notInExecutionPercentage,
      hrsPredictedPorcentage,
      hrsExecutionPorcentage,
    };

    return groupedData;
  }

  @UseGuards(AuthGuard)
  @Get('/grid-material')
  async PositionMaterials(@Req() req): Promise<any> {
    const user: IUserInfo = req.user;

    // Validação dos query params
    const querySchema = z.object({
      branchId: z.coerce.number().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      typeMaintenanceId: z.coerce.number().optional(),
    });

    const parseQuery = querySchema.parse(req.query);
    const { branchId, startDate, endDate, typeMaintenanceId } = parseQuery;

    const finalEndDate = endDate || new Date();

    const filter: any = {
      log_date: {
        gte: startDate,
        lte: finalEndDate,
      },
      materialServiceOrder: {
        some: {
          serviceOrder: {
            statusOrderService: {
              status: 'EM ABERTO',
            },
          },
        },
      },
    };

    if (branchId) {
      filter.ID_filial = branchId;
    }

    if (typeMaintenanceId) {
      filter.typeMaintenance = {
        ID: typeMaintenanceId,
      };
    }

    console.log(filter);

    const allPositionMaterials =
      await this.materialRepository.listForReportStockByClient(
        user.clientId,
        null,
        null,
        null,
        filter,
      );

    const result = allPositionMaterials
      .filter((material) => material.materialServiceOrder.length > 0)
      .map((material) => {
        const qtdOS = material.materialServiceOrder.length;

        const saldo = +material.estoque_real || 0;

        const qtdFaltante = saldo - qtdOS;

        return {
          serviceOrderId:
            material.materialServiceOrder[0]?.serviceOrder?.ID || 0,
          tagCode: material.codigo || '',
          branch: material.company?.razao_social || '',
          input: material.material || '',
          quantityOS: qtdOS,
          balance: saldo,
          missingQuantity: qtdFaltante < 0 ? qtdFaltante : 0,
        };
      });

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('/performance-indicator')
  async PerformanceIndicator(@Req() req): Promise<any> {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      typeMaintenance: z
        .string()
        .optional()
        .transform((val) => (val ? val.split(',').map(Number) : undefined)),
    });

    const { startDate, endDate, typeMaintenance } = querySchema.parse(
      req.query,
    );

    const finalEndDate = endDate || new Date();
    const finalStartDate =
      startDate || new Date(new Date().setDate(finalEndDate.getDate() - 30));

    const formatDate = (date: Date): string => date.toISOString().split('T')[0];

    const formattedStartDate = formatDate(finalStartDate);
    const formattedEndDate = formatDate(finalEndDate);

    const allIndicators =
      await this.serviceOrderRepository.graficPerformanceIndicatorsKPIS(
        user.clientId,
        formattedStartDate,
        formattedEndDate,
        typeMaintenance,
      );

    return {
      success: true,
      data: allIndicators,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/type-maintenance')
  async listTypeMaintenance(@Req() req) {
    const user: IUserInfo = req.user;

    const typeMaintenance = await this.typeMaintenanceRepository.listByClient(
      user.clientId,
    );

    return {
      data: typeMaintenance.map((item) => ({
        id: item.ID,
        description: item.tipo_manutencao,
      })),
    };
  }

  @UseGuards(AuthGuard)
  @ApiQuery({
    type: ListCalendarMaintainerQuerySwagger,
  })
  @ApiResponse({
    type: listCalendarMaintainerResponseSwagger,
  })
  @Post('/calendar-maintainer')
  async listCalendarMaintainer(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional().nullable(),
      branchId: z.array(z.coerce.number()).optional().nullable(),
      maintainerId: z.array(z.coerce.number()).optional().nullable(),
    });

    const query = querySchema.parse(req.body);

    const allCollaborator =
      await this.serviceOrderMaintainerRepository.listByBranch(
        query.branchId ? query.branchId : user.branches,
        {
          serviceOrder: {
            data_hora_solicitacao: {
              gte: query.startDate,
            },
            data_prevista_termino: {
              lte: query.endDate || new Date(),
            },
          },
          ...(query.maintainerId &&
            query.maintainerId.length && {
              id_colaborador: {
                in: query.maintainerId,
              },
            }),
        },
      );

    const response: {
      dates: {
        date: string;
        dayWeek: string;
      }[];
      maintainers: {
        name: string;
        services: {
          [key: string]: {
            id: number;
            description: string;
            branch: string;
            equipment: string;
            timeLeft: string;
            data_hora_solicitacao: Date;
            data_prevista_termino: Date;
            data_hora_encerramento: Date;
            status: string;
          }[];
        };
      }[];
    } = {
      dates: [],
      maintainers: [],
    };

    // Normalizar as datas do filtro para trabalhar apenas com a parte da data
    const filterStartDate = this.dateService
      .dayjs(query.startDate)
      .utc()
      .startOf('day');
    const filterEndDate = this.dateService
      .dayjs(query.endDate || new Date())
      .utc()
      .endOf('day');

    // Gerar todas as datas no intervalo do filtro
    let currentDate = filterStartDate;
    while (
      currentDate.isBefore(filterEndDate) ||
      currentDate.isSame(filterEndDate, 'day')
    ) {
      const formattedDate = currentDate.format('DD-MM-YYYY');
      response.dates.push({
        date: formattedDate,
        dayWeek: currentDate.format('dddd'),
      });
      currentDate = currentDate.add(1, 'day');
    }

    // Processar os mantenedores e ordens de serviço
    allCollaborator.forEach((collaborator) => {
      // Normalizar as datas da ordem de serviço para trabalhar apenas com a parte da data
      const orderStartDate = this.dateService
        .dayjs(collaborator.serviceOrder.data_hora_solicitacao)
        .utc()
        .startOf('day');
      let orderEndDate = this.dateService
        .dayjs(collaborator.serviceOrder.data_prevista_termino || new Date())
        .utc()
        .endOf('day');

      // Ajuste na repetição de ordens encerradas: usar data_hora_encerramento se disponível
      if (collaborator.serviceOrder.data_hora_encerramento) {
        orderEndDate = this.dateService
          .dayjs(collaborator.serviceOrder.data_hora_encerramento)
          .utc()
          .endOf('day');
      }

      const startDate = orderStartDate.isBefore(filterStartDate)
        ? filterStartDate
        : orderStartDate;
      const endDate = orderEndDate.isAfter(filterEndDate)
        ? filterEndDate
        : orderEndDate;

      const generateDateRange = (start, end) => {
        const dates = [];
        let currentDate = start;

        while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
          dates.push(currentDate);
          currentDate = currentDate.add(1, 'day');
        }

        return dates;
      };

      const dateRange = generateDateRange(startDate, endDate);

      let maintainer = response.maintainers.find(
        (m) => m.name === collaborator.collaborator.nome,
      );

      if (!maintainer) {
        maintainer = {
          name: collaborator.collaborator.nome,
          services: {},
        };
        response.maintainers.push(maintainer);
      }

      // Inicializar todas as datas para o mantenedor
      response.dates.forEach((date) => {
        if (!maintainer.services[date.date]) {
          maintainer.services[date.date] = [];
        }
      });

      dateRange.forEach((date) => {
        const formattedDate = date.format('DD-MM-YYYY');

        // Normalizar ambas as datas para UTC no cálculo do timeLeft
        const startDateTime = this.dateService
          .dayjs(collaborator.serviceOrder.log_date)
          .utc();
        const endDateTime = this.dateService
          .dayjs(collaborator.serviceOrder.data_hora_encerramento || new Date())
          .utc();

        maintainer.services[formattedDate].push({
          id: collaborator.serviceOrder.ID,
          description: collaborator.serviceOrder.ordem,
          branch: collaborator.serviceOrder.branch.filial_numero,
          equipment: `${collaborator.serviceOrder.equipment.equipamento_codigo}-${collaborator.serviceOrder.equipment.descricao}`,
          timeLeft: this.dateService.formatTimeDifference(
            startDateTime.toDate(), // log_date em UTC
            endDateTime.toDate(), // data_hora_encerramento ou data atual em UTC
          ),
          data_hora_solicitacao:
            collaborator.serviceOrder.data_hora_solicitacao,
          data_prevista_termino:
            collaborator.serviceOrder.data_prevista_termino,
          data_hora_encerramento:
            collaborator.serviceOrder.data_hora_encerramento,
          status: collaborator.serviceOrder.statusOrderService.status,
        });
      });
    });

    // Ordenar as datas e serviços
    response.maintainers.forEach((maintainer) => {
      const dates = Object.keys(maintainer.services);
      const orderedDates = dates.sort((a, b) => {
        const dateA = this.dateService.parseDates(a).getTime();
        const dateB = this.dateService.parseDates(b).getTime();
        return dateA - dateB;
      });

      const orderedServices = {};
      orderedDates.forEach((date) => {
        orderedServices[date] = maintainer.services[date];
      });

      maintainer.services = orderedServices;
    });

    response.dates.sort((a, b) => {
      const dateA = this.dateService.parseDates(a.date).getTime();
      const dateB = this.dateService.parseDates(b.date).getTime();
      return dateA - dateB;
    });

    return {
      data: response,
    };
  }
}
