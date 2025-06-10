import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BranchRepository } from 'src/repositories/branch-repository';
import MaintenancePerformanceRepository from 'src/repositories/maintenance-performance-repository';
import CustoDiversosRepository from 'src/repositories/custo-diversos-repository';
import MaintenanceRequesterRepository from 'src/repositories/maintenance-requester-repository';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';
import InsertRequesterBody from './dtos/insertRequester-body';
import UpdateRequesterBody from './dtos/updateRequester-body';
import EquipmentRepository from 'src/repositories/equipment-repository';
import { DateService } from 'src/service/data.service';
import ServiceOrderRepository from 'src/repositories/service-order-repository';

interface IFilters {
  equipamento?: string;
  localizacao?: string;
  familia?: string;
  tipo_equipamento?: string;
  ordensServico?: number[];
  globalFilter?: string;
  filterColumn?: string;
  filterText?: string;
}

interface IFiltersCustos {
  id_ordem_servico?: number[] | null;
  id_cliente?: number[] | null;
  ID_filial?: number[] | null;
  id_equipamento?: number[] | null;
  id_familia?: number[] | null;
  id_tipo_equipamento?: number[] | null;
  descricao_custo?: string | null;
  setor_executante?: string | null;
  status?: string | null;
  ordem?: number | null;
  globalFilter?: string | null;
  filterColumn?: string | null;
  filterText?: string | null;
}

@ApiTags('Maintenance')
@ApiBearerAuth()
@ApiOkResponse({ description: 'Success' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('/maintenance')
export default class MaintenanceController {
  constructor(
    private maintenanceRequesterRepository: MaintenanceRequesterRepository,
    private maintenancePerformanceRepository: MaintenancePerformanceRepository,
    private custoDiversosRepository: CustoDiversosRepository,
    private branchRepository: BranchRepository,
    private equipmentRepository: EquipmentRepository,
    private dateService: DateService,
    private serviceOrderRepository: ServiceOrderRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/requester')
  async listTableRequester(@Req() req) {
    const user: IUserInfo = req.user;

    const allRequester = await this.maintenanceRequesterRepository.listByBranch(
      user.branches,
    );

    const response = allRequester.map((requester) => {
      return {
        id: requester.id,
        name: requester.nome,
        email: requester.email,
        notification: requester.notificacao === 1,
        status: requester.status === 1,
        observations: requester.observacoes,
        branch: {
          value: requester.branch.ID.toString(),
          label: requester.branch.filial_numero,
        },
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/requester')
  async insertRequester(@Req() req, @Body() body: InsertRequesterBody) {
    const user: IUserInfo = req.user;

    const branch = await this.branchRepository.findById(Number(body.branchId));

    if (!branch) {
      throw new NotFoundException(MessageService.Branch_not_found);
    }

    await this.maintenanceRequesterRepository.create({
      id_cliente: user.clientId,
      id_filial: branch.ID,
      nome: body.name,
      email: body.email,
      notificacao: body.notification === true ? 1 : 0,
      status: body.status === true ? 1 : 0,
      observacoes: body.observation,
      log_user: user.login,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/requester/:id')
  async updateRequester(
    @Param('id') id: string,
    @Body() body: UpdateRequesterBody,
  ) {
    const requester = await this.maintenanceRequesterRepository.findById(
      Number(id),
    );

    if (!requester) {
      throw new NotFoundException(MessageService.Requester_id_not_found);
    }

    const branch = await this.branchRepository.findById(Number(body.branchId));

    if (!branch) {
      throw new NotFoundException(MessageService.Branch_not_found);
    }

    await this.maintenanceRequesterRepository.update(requester.id, {
      id_filial: branch.ID,
      nome: body.name,
      email: body.email,
      notificacao: body.notification === true ? 1 : 0,
      status: body.status === true ? 1 : 0,
      observacoes: body.observation,
    });

    return {
      update: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/requester/:id')
  async deleteRequester(@Param('id') id: string) {
    const requester = await this.maintenanceRequesterRepository.findById(
      Number(id),
    );

    if (!requester) {
      throw new NotFoundException(MessageService.Requester_id_not_found);
    }

    await this.maintenanceRequesterRepository.delete(requester.id);

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/performance-maintenance')
  async gridIndicatorPerformanceMaintenance(@Req() req) {
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
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
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
      equipamento: z.string().optional(),
      localizacao: z.string().optional(),
      familia: z.string().optional(),
      tipo_equipamento: z.string().optional(),
      ordensServico: z
        .string()
        .transform((value) =>
          value === '' ? null : value.split(',').map(Number),
        )
        .optional(),
    });

    const {
      page,
      perPage,
      startDate,
      endDate,
      globalFilter,
      filterColumn,
      filterText,
      equipamento,
      localizacao,
      familia,
      tipo_equipamento,
      ordensServico,
    } = querySchema.parse(req.query);

    const formattedStartDate = startDate
      ? startDate.toISOString().split('T')[0]
      : '2022-01-01';
    const formattedEndDate = endDate
      ? endDate.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const filters: IFilters = {
      equipamento,
      localizacao,
      familia,
      tipo_equipamento,
      ordensServico,
      globalFilter,
      filterColumn,
      filterText,
    };

    const gridIndicatorPerformanceMaintenance =
      await this.maintenancePerformanceRepository.gridIndicatorPerformanceMaintenance(
        user.clientId,
        formattedStartDate,
        formattedEndDate,
        page,
        perPage,
        filters,
      );

    return {
      data: gridIndicatorPerformanceMaintenance,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/grid-custo-diversos')
  async gridCustoDiversos(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      page: z.coerce
        .string()
        .optional()
        .nullable()
        .transform((value) =>
          value === 'null' || value === undefined || value.length === 0
            ? null
            : Math.max(0, Number(value)),
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
      id_ordem_servico: z
        .string()
        .transform((value) =>
          value === '' ? null : value.split(',').map(Number),
        )
        .optional(),
      id_cliente: z
        .union([z.string(), z.array(z.string())])
        .transform((value) => {
          if (!value || (Array.isArray(value) && value.length === 0))
            return null;
          const arr = Array.isArray(value) ? value : [value];
          return arr.map((v) => Number(v));
        })
        .optional(),
      ID_filial: z
        .string()
        .transform((value) =>
          value === '' ? null : value.split(',').map(Number),
        )
        .optional(),
      id_equipamento: z
        .union([z.string(), z.array(z.string())])
        .transform((value) => {
          if (!value || (Array.isArray(value) && value.length === 0))
            return null;
          const arr = Array.isArray(value) ? value : [value];
          return arr.map((v) => Number(v));
        })
        .optional(),
      id_familia: z
        .union([z.string(), z.array(z.string())])
        .transform((value) => {
          if (!value || (Array.isArray(value) && value.length === 0))
            return null;
          const arr = Array.isArray(value) ? value : [value];
          return arr.map((v) => Number(v));
        })
        .optional(),
      id_tipo_equipamento: z
        .union([z.string(), z.array(z.string())])
        .transform((value) => {
          if (!value || (Array.isArray(value) && value.length === 0))
            return null;
          const arr = Array.isArray(value) ? value : [value];
          return arr.map((v) => Number(v));
        })
        .optional(),
      descricao_custo: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      setor_executante: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      status: z
        .string()
        .transform((value) => (value === '' ? null : value))
        .optional(),
      ordem: z.coerce
        .number()
        .optional()
        .transform((value) => (value === undefined ? null : value)),
      clientId: z
        .string()
        .transform((value) =>
          value === '' ? null : value.split(',').map(Number),
        )
        .optional(),
      login: z
        .string()
        .transform((value) => (value === '' ? null : value.split(',')))
        .optional(),
    });

    const {
      page,
      perPage,
      globalFilter,
      filterColumn,
      filterText,
      id_ordem_servico,
      id_cliente,
      ID_filial,
      id_equipamento,
      id_familia,
      id_tipo_equipamento,
      descricao_custo,
      setor_executante,
      status,
      ordem,
    } = querySchema.parse(req.query);

    const filters: IFiltersCustos = {
      id_ordem_servico,
      id_cliente,
      ID_filial,
      id_equipamento,
      id_familia,
      id_tipo_equipamento,
      descricao_custo,
      setor_executante,
      status,
      ordem,
      globalFilter,
      filterColumn,
      filterText,
    };

    const gridCustoDiversos =
      await this.custoDiversosRepository.gridCustoDiversos(
        Array.isArray(user.clientId) ? user.clientId : [user.clientId],
        Array.isArray(user.login) ? user.login : [user.login],
        page,
        perPage,
        filters,
      );

    return {
      data: gridCustoDiversos,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/performance-maintenance-grid')
  async gridPerformanceMaintenance(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      branches: z.array(z.coerce.number()).optional(),
      familyId: z.array(z.coerce.number()).optional().nullable(),
      equipmentId: z.array(z.coerce.number()).optional().nullable(),
      index: z.coerce
        .string()
        .optional()
        .nullable()
        .transform((value) =>
          value === 'null' || value === undefined || value.length === 0
            ? null
            : Math.max(0, Number(value)),
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
    });

    const {
      startDate,
      endDate,
      branches,
      familyId,
      equipmentId,
      index,
      perPage,
    } = querySchema.parse(req.query);

    const gridIndicatorPerformanceMaintenance =
      await this.maintenancePerformanceRepository.gridPerformance(
        user.clientId,
        branches,
        startDate,
        endDate,
        index,
        perPage,
        {
          ...(familyId &&
            familyId.length > 0 && {
              AND: {
                equipment: {
                  ID_familia: { in: familyId },
                },
              },
            }),
          ...(equipmentId &&
            equipmentId.length > 0 && {
              AND: {
                equipment: {
                  ID: { in: equipmentId },
                },
              },
            }),
        },
      );

    const allEquipment =
      await this.equipmentRepository.listEquipmentWithProspectScale(
        user.clientId,
        branches,
        {
          prospectScale: {
            some: {
              data_programada: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          ...(familyId &&
            familyId.length > 0 && {
              AND: {
                ID_familia: { in: familyId },
              },
            }),
          ...(equipmentId &&
            equipmentId.length > 0 && {
              AND: {
                ID: { in: equipmentId },
              },
            }),
        },
      );

    const countOrderServiceGroupEquipmentWithNoteStop =
      await this.serviceOrderRepository.countOrderServiceGroupEquipmentWithNoteStop(
        user.clientId,
        branches,
        startDate,
        endDate,
      );

    const response = [];

    for (const order of gridIndicatorPerformanceMaintenance) {
      for (const noteStop of order.noteStop) {
        const prospectScale = allEquipment.find(
          (equipment) => equipment.ID === order.equipment.ID,
        );

        let prospectScaleNumber = 0;
        if (prospectScale) {
          const dateProgrammed = prospectScale.prospectScale.find((scale) =>
            this.dateService
              .dayjs(scale.data_programada)
              .isSame(noteStop.data_hora_stop, 'day'),
          );

          if (dateProgrammed) {
            prospectScaleNumber =
              this.dateService.calculeDiffTimeInHour(
                dateProgrammed.inicio,
                dateProgrammed.termino,
              ) || 0; // qualquer coisa remover aqui e colocar 0

            if (
              this.dateService
                .dayjsAddTree(dateProgrammed.termino)
                .format('HH:mm:ss') === '23:59:59'
            ) {
              prospectScaleNumber = 24;
            }
          }
        }

        let countEquipmentAndServiceOrderOpen = 1;

        const equipmentFind = countOrderServiceGroupEquipmentWithNoteStop.find(
          (equipment) => equipment.equipmentId === order.equipment.ID,
        );

        if (equipmentFind) {
          countEquipmentAndServiceOrderOpen = equipmentFind.count;
        }

        const tempTotalRepair = noteStop.data_hora_start
          ? this.dateService.calculeDiffTimeInHour(
              noteStop.data_hora_stop,
              noteStop.data_hora_start,
            )
          : 24;

        const tempAvailability =
          ((prospectScaleNumber - tempTotalRepair) / prospectScaleNumber) * 100;

        const tempMTBF =
          (prospectScaleNumber - tempTotalRepair) /
          countEquipmentAndServiceOrderOpen /
          countEquipmentAndServiceOrderOpen;

        const tempMTTR = tempTotalRepair / countEquipmentAndServiceOrderOpen;

        const dataAcionamento = order.data_acionamento_tecnico || new Date();
        const chegadaTecnico = order.chegada_tecnico || new Date();

        const tempDateActionTechnical = this.dateService.calculeDiffTimeInHour(
          dataAcionamento,
          chegadaTecnico,
        );

        const tempFailureRate = 1 / tempMTBF;

        const findEquipmentInResponse = response.findIndex(
          (value) => value.equipment.id === order.equipment.ID,
        );

        if (findEquipmentInResponse === -1) {
          response.push({
            equipment: {
              id: order.equipment.ID,
              requestDateTime: order.data_hora_solicitacao,
              order: order.ordem,
              name: order.equipment.descricao,
              code: order.equipment.equipamento_codigo,
              family: order.equipment.family.familia,
              typeEquipment:
                order?.equipment?.typeEquipment?.tipo_equipamento || null,
            },
            expectedTime: prospectScaleNumber,
            mtbf: tempMTBF,
            mttr: tempMTTR,
            mwt: tempDateActionTechnical,
            availability: tempAvailability,
            failureRate: tempFailureRate,
            totalRepair: tempTotalRepair,
            totalStop: 1,
            allOrder: [{ id: order.ID, order: order.ordem }],
            totalOrder: 1,
          });
        } else {
          const findOrderInResponse = response[
            findEquipmentInResponse
          ].allOrder.find((value) => value.id === order.ID);

          if (!findOrderInResponse) {
            response[findEquipmentInResponse].totalOrder += 1;
            response[findEquipmentInResponse].allOrder.push({
              id: order.ID,
              order: order.ordem,
            });
          }

          response[findEquipmentInResponse].totalStop += 1;
          response[findEquipmentInResponse].mtbf += tempMTBF;
          //response[findEquipmentInResponse].expectedTime += prospectScaleNumber;
          response[findEquipmentInResponse].mttr += tempMTTR;
          response[findEquipmentInResponse].mwt += tempDateActionTechnical;
          response[findEquipmentInResponse].availability += tempAvailability;
          response[findEquipmentInResponse].failureRate += tempFailureRate;
          response[findEquipmentInResponse].totalRepair += tempTotalRepair;
        }
      }
    }

    for (const equipment of response) {
      //equipment.expectedTime = equipment.expectedTime / equipment.totalStop;
      equipment.mtbf = equipment.mtbf / equipment.totalStop;
      equipment.mttr = equipment.mttr / equipment.totalStop;
      equipment.availability = equipment.availability / equipment.totalStop;
      equipment.failureRate = equipment.failureRate / equipment.totalStop;
      equipment.mwt = equipment.mwt / equipment.totalStop;
    }

    return {
      response,
    };
  }
}
