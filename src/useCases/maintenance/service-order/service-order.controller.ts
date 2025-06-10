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
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
//import * as sharp from 'sharp';
import sharp from 'sharp';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import DeletedResponseSwagger from 'src/models/swagger/delete-response';
import InsertedResponseSwagger from 'src/models/swagger/inserted-response';
import UpdatedResponseSwagger from 'src/models/swagger/updated-response';
import AttachmentTaskServiceRepository from 'src/repositories/attachment-task-service-repository';
import { AttachmentsServiceOrderRepository } from 'src/repositories/attachments-service-order-repository';
import { BranchRepository } from 'src/repositories/branch-repository';
import ClassificationServiceOrderRepository from 'src/repositories/classification-service-order-repository';
import { CompanyRepository } from 'src/repositories/company-repository';
import ControlClosedOrderServiceRepository from 'src/repositories/control-closed-order-service-repository';
import { CostServiceOrderRepository } from 'src/repositories/cost-service-order-repository';
import DescriptionPlanRepository from 'src/repositories/description-plan-repository';
import { EmployeeRepository } from 'src/repositories/employee-repository';
import EquipmentRepository from 'src/repositories/equipment-repository';
import { FailureAnalysisServiceOrderRepository } from 'src/repositories/failure-analysis-service-order-repository';
import JustifyStatusServiceOrderRepository from 'src/repositories/justify-status-service-order-repository';
import LogAttachmentTaskServiceRepository from 'src/repositories/log-attachment-task-service-repository';
import LogServiceOrderMaintainerRepository from 'src/repositories/log-service-order-maintainer-repository';
import LogTaskServiceOrderRepository from 'src/repositories/log-task-service-order-repository';
import LogTaskServiceOrderReturnRepository from 'src/repositories/log-task-service-order-return-repository';
import MaintenanceControlStockRepository from 'src/repositories/maintenance-control-stock-repository';
import MaintenanceRequesterRepository from 'src/repositories/maintenance-requester-repository';
import MaterialCodeRepository from 'src/repositories/material-code-repository';
import MaterialRepository from 'src/repositories/material-repository';
import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
import { NoteServiceOrderRepository } from 'src/repositories/note-service-order-repository';
import { NoteStopServiceOrderRepository } from 'src/repositories/note-stop-service-order-repository';
import PreventivePlanRepository from 'src/repositories/preventive-plan-repository';
import PriorityServiceOrderRepository from 'src/repositories/priority-service-order-repository';
import RegisterHourTaskServiceRepository from 'src/repositories/register-hour-task-service-repository';
import ServiceOrderMaintainerRepository from 'src/repositories/service-order-maintainer-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { StatusServiceOrderRepository } from 'src/repositories/status-service-order-repository';
import TaskServiceOrderRepository from 'src/repositories/task-service-order-repository';
import TaskServiceOrderReturnRepository from 'src/repositories/task-service-order-return-repository';
import { DateService } from 'src/service/data.service';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import {
  AttachmentsServiceOrderMapper,
  CostServiceOrderMapper,
  FailureAnalysisServiceOrderMapper,
  getArrayMapper,
  MaterialServiceOrderMapper,
  NoteServiceOrderMapper,
  NoteStopServiceOrderMapper,
  removeExtraFields,
  ServiceOrderMapper,
  setMapper,
  unSetMapper,
} from 'src/service/mapper.service';
import { MessageService } from 'src/service/message.service';
import { querySearchParam } from 'src/service/queryFilters.service';
import { z } from 'zod';
import { AttachmentsServiceOrderBody } from './dtos/attachments-service-order-body';
import { CostServiceOrderBody } from './dtos/cost-service-order-body';
import CreateTaskServiceOrder from './dtos/createTaskServiceOrder-body';
import { FailureAnalysisServiceOrderBody } from './dtos/failure-analysis-service-order-body';
import { MaterialServiceOrderBody } from './dtos/material-service-order-body';
import { NoteServiceOrderBody } from './dtos/note-service-order-body';
import { NoteStopServiceOrderBody } from './dtos/note-stop-service-order-body';
import { ServiceOrderBody } from './dtos/service-order-body';
import { AttachmentsServiceOrderSwaggerResponse } from './dtos/swagger/attachments-service-order-swagger';
import { CostServiceOrderSwaggerResponse } from './dtos/swagger/cost-service-order-swagger';
import CreateRegisterHourBodySwagger from './dtos/swagger/createRegisterHour-body-swagger';
import CreateTaskServiceOrderSwagger from './dtos/swagger/createTaskServiceOrder-body-swagger';
import { FailureAnalysisServiceOrderSwaggerResponse } from './dtos/swagger/failure-analysis-service-order-swagger';
import { GetServiceOrderSwaggerResponse } from './dtos/swagger/get-service-order-swagger';
import listServiceOrderQuerySwagger from './dtos/swagger/listServiceOrder-query-swagger';
import ListTaskServiceOrderResponseSwagger from './dtos/swagger/listTaskServiceOrder-response-swagger';
import listTechnicalDetailsResponseSwagger from './dtos/swagger/listTechnicalDetails-response-swagger';
import { MaterialServiceOrderSwaggerResponse } from './dtos/swagger/material-service-order-swagger';
import { NoteServiceOrderSwaggerResponse } from './dtos/swagger/note-service-order-swagger';
import { NoteStopServiceOrderSwaggerResponse } from './dtos/swagger/note-stop-service-order-swagger';
import { ServiceOrderSwaggerResponse } from './dtos/swagger/service-order-swagger';
import UpdateRegisterHourBodySwagger from './dtos/swagger/updateRegisterHour-body-swagger';
import UpdateTaskServiceOrderSwagger from './dtos/swagger/updateTaskServiceOrder-body-swagger';
import updateTechnicalDetailsBodySwagger from './dtos/swagger/updateTechnicalDetails-body-swagger';
import { UpdateServiceOrderStatusBody } from './dtos/update-service-order-status-body';
import UpdateJustifyStatusBody from './dtos/updateJustifyStatus-body';
import UpdateTaskServiceOrder from './dtos/updateTaskServiceOrder-body';
import updateTechnicalDetailsBody from './dtos/updateTechnicalDetails-body';
import CreateTaskServiceOrderByPlanBodySwagger from './dtos/swagger/createTaskServiceOrderByPlan-body-swagger';
import { PlanMaintenanceRepository } from 'src/repositories/plan-maintenance-repository';
import BuyRepository from 'src/repositories/buy-repository';
import BuyItemRepository from 'src/repositories/buy-item-repository';
import BuyPriorityRepository from 'src/repositories/buy-priority-repository';
import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';

@ApiTags('Maintenance - Service Order')
@ApiBearerAuth()
@Controller('/maintenance/service-order')
export default class ServiceOrderController {
  constructor(
    private dateService: DateService,
    private fileService: FileService,
    private env: ENVService,
    private serviceOrderRepository: ServiceOrderRepository,
    private companyRepository: CompanyRepository,
    private branchRepository: BranchRepository,
    private noteServiceOrderRepository: NoteServiceOrderRepository,
    private noteStopServiceOrderRepository: NoteStopServiceOrderRepository,
    private materialServiceOrderRepository: MaterialServiceOrderRepository,
    private costServiceOrderRepository: CostServiceOrderRepository,
    private failureAnalysisServiceOrderRepository: FailureAnalysisServiceOrderRepository,
    private attachmentsServiceOrderRepository: AttachmentsServiceOrderRepository,
    private maintenanceRequesterRepository: MaintenanceRequesterRepository,
    private equipmentRepository: EquipmentRepository,
    private priorityServiceOrderRepository: PriorityServiceOrderRepository,
    private classificationServiceOrderRepository: ClassificationServiceOrderRepository,
    private statusServiceOrderRepository: StatusServiceOrderRepository,
    private serviceOrderMaintainerRepository: ServiceOrderMaintainerRepository,
    private employeeRepository: EmployeeRepository,
    private taskServiceOrderRepository: TaskServiceOrderRepository,
    private registerHourTaskServiceRepository: RegisterHourTaskServiceRepository,
    private taskServiceOrderReturnRepository: TaskServiceOrderReturnRepository,
    private attachmentTaskServiceRepository: AttachmentTaskServiceRepository,
    private logAttachmentTaskServiceRepository: LogAttachmentTaskServiceRepository,
    private controlClosedOrderServiceRepository: ControlClosedOrderServiceRepository,
    private justifyStatusServiceOrderRepository: JustifyStatusServiceOrderRepository,
    private descriptionPlanRepository: DescriptionPlanRepository,
    private preventivePlanRepository: PreventivePlanRepository,
    private logServiceOrderMaintainer: LogServiceOrderMaintainerRepository,
    private logTaskServiceOrder: LogTaskServiceOrderRepository,
    private logTaskServiceOrderReturnRepository: LogTaskServiceOrderReturnRepository,
    private maintenanceControlStockRepository: MaintenanceControlStockRepository,
    private materialRepository: MaterialRepository,
    private materialCode: MaterialCodeRepository,
    private planMaintenanceRepository: PlanMaintenanceRepository,
    private buyRepository: BuyRepository,
    private buyItemRepository: BuyItemRepository,
    private buyPriorityRepository: BuyPriorityRepository,
    private materialEstoqueRepository: MaterialEstoqueRepository,
  ) {}

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Get('/change-maintainer')
  async listChangeMaintainer(@Req() req) {
    const user: IUserInfo = req.user;

    //console.log(user.clientId);

    const allChangeMaintainer = await this.serviceOrderRepository.listByClient(
      user.clientId,
    );

    for await (const serviceOrder of allChangeMaintainer) {
      if (!serviceOrder.mantenedores) {
        continue;
      }

      const allCollaborator = serviceOrder.mantenedores.split(',');

      for await (const collaboratorId of allCollaborator) {
        if (collaboratorId.length === 0) {
          continue;
        }

        const validCollaborator = await this.employeeRepository.findById(
          Number(collaboratorId),
        );

        if (!validCollaborator) {
          console.log('Invalid collaborator ID: ', collaboratorId);
          continue;
        }

        const collaborator =
          await this.serviceOrderMaintainerRepository.findByOrderAndCollaborator(
            serviceOrder.ID,
            Number(collaboratorId),
          );

        if (!collaborator) {
          //console.log(serviceOrder);
          //console.log('collaborator => ', collaboratorId);
          await this.serviceOrderMaintainerRepository.create({
            id_ordem_servico: serviceOrder.ID,
            id_colaborador: Number(collaboratorId),
          });
        }
      }
    }

    return {
      data: allChangeMaintainer,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-order-params')
  async listOrderByParams(@Req() req, @Query() query) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      scheduled: z
        .object({
          start: z.coerce
            .string()
            .transform((value) =>
              this.dateService.dayjsSubTree(value).toDate(),
            ),
          end: z.coerce.string().transform((value) => {
            const setHours = this.dateService
              .dayjsSubTree(value)
              .toDate()
              .setHours(23, 59, 59);
            return new Date(setHours);
          }),
        })
        .optional(),
      finished: z
        .object({
          start: z.coerce
            .string()
            .transform((value) => this.dateService.dayjs(value).toDate()),
          end: z.coerce
            .string()
            .transform((value) => this.dateService.dayjs(value).toDate()),
        })
        .optional(),
    });

    const { scheduled } = querySchema.parse(query);

    const allOrder = await this.serviceOrderRepository.listByWhere({
      ID_cliente: user.clientId,
      data_hora_solicitacao: scheduled
        ? {
            gte: this.dateService
              .dayjs(scheduled.start)
              .startOf('day')
              .toDate(),
            lte: this.dateService.dayjs(scheduled.end).endOf('day').toDate(),
          }
        : undefined,
      // data_hora_encerramento: dateClose
      //   ? {
      //       gte: this.dateService.dayjs(dateClose).startOf('day').toDate(),
      //       lte: this.dateService.dayjs(dateClose).endOf('day').toDate(),
      //     }
      //   : undefined,
    });

    const response = allOrder.map((order) => {
      return {
        id: order.ID,
        ordem: order.ordem,
        ordem_vinculada: order.ordem_vinculada,
        cliente: `${order.branch.razao_social} - ${order.branch.filial_numero}`,
        equipamento: `${order.equipment.equipamento_codigo} - ${order.equipment.descricao}`,
        modelo_equipamento: order.equipment.modelo,
        familia: order.equipment.family.familia,
        tipo_equipamento: order.equipment.typeEquipment?.tipo_equipamento,
        criticidade_equipamento:
          order.equipment.criticalityEquipment?.descricao,
        classificacao_equipamento: order.equipment.classification?.descricao,
        centro_de_custo: `${order.costCenter.centro_custo}-${order.costCenter.descricao}`,
        predio: order.building?.predio,
        setor: order.sector?.setor,
        departamento: order.department?.departamento,
        localizacao: order.localizacao || order.equipment.localizacao,
        descricao_solicitacao: order.descricao_solicitacao,
        descricao_solicitacao_realizada: order.descricao_servico_realizado,
        observacoes: order.observacoes,
        observacoes_executante: order.observacoes_executante,
        observacoes_cliente: order.observacoes_cliente,
        tipo_manutencao: order.typeMaintenance?.tipo_manutencao,
        setor_executante: order.sectorExecutor?.descricao,
        status: order.statusOrderService.status,
        status_executante: order.status_execucao,
        retorno_checklist: order.retorno_checklist,
        data_programada: order.data_hora_solicitacao
          ? this.dateService
              .dayjs(order.data_hora_solicitacao)
              .add(3, 'h')
              .format('DD/MM/YYYY HH:mm:ss')
          : null,
        data_prevista_termino: order.data_prevista_termino
          ? this.dateService
              .dayjs(order.data_prevista_termino)
              .add(3, 'h')
              .format('DD/MM/YYYY HH:mm:ss')
          : null,
        data_inicio: order.data_inicio
          ? this.dateService
              .dayjs(order.data_inicio)
              .add(3, 'h')
              .format('DD/MM/YYYY HH:mm:ss')
          : null,
        data_hora_encerramento: order.data_hora_encerramento
          ? this.dateService
              .dayjs(order.data_hora_encerramento)
              .add(3, 'h')
              .format('DD/MM/YYYY HH:mm:ss')
          : null,
        data_equipamento_parou: order.data_equipamento_parou
          ? this.dateService
              .dayjs(order.data_equipamento_parou)
              .add(3, 'h')
              .format('DD/MM/YYYY HH:mm:ss')
          : null,
        data_equipamento_funcionou: order.data_equipamento_funcionou
          ? this.dateService
              .dayjs(order.data_equipamento_funcionou)
              .add(3, 'h')
              .format('DD/MM/YYYY HH:mm:ss')
          : null,
        data_acionamento_tecnico: order.data_acionamento_tecnico
          ? this.dateService
              .dayjs(order.data_acionamento_tecnico)
              .add(3, 'h')
              .format('DD/MM/YYYY HH:mm:ss')
          : null,
        chegada_tecnico: order.chegada_tecnico,
        emissao: this.dateService
          .dayjs(order.log_date)
          .add(3, 'h')
          .format('DD/MM/YYYY HH:mm:ss'),
        em_atraso: order.data_prevista_termino
          ? (this.dateService
              .dayjs(order.data_prevista_termino)
              .isBefore(new Date()) &&
              order.fechada === 'N') ||
            (this.dateService
              .dayjs(order.data_prevista_termino)
              .isBefore(new Date()) &&
              order.fechada === 'C')
            ? 'S'
            : 'N'
          : (this.dateService
              .dayjs(order.data_hora_solicitacao)
              .isBefore(new Date()) &&
              order.fechada === 'N') ||
            (this.dateService
              .dayjs(order.data_hora_solicitacao)
              .isBefore(new Date()) &&
              order.fechada === 'C')
          ? 'S'
          : 'N',
        fechada: order.fechada,
        maquina_parada: order.maquina_parada === 1 ? 'S' : 'N',
        prioridade: order.priorityOrderService?.descricao,
        causa_motivo: order.failureCause?.descricao,
        classificacao: order.equipment.classification?.descricao,
        solicitante: order.solicitante,
        emissor: order.emissor,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list')
  async listByBranch(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.serviceOrderRepository.listByBranch(user.branches);

    const response = data.map((obj) => {
      const newObj = setMapper(obj, ServiceOrderMapper);
      return newObj;
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Company_not_found,
  })
  async createServiceOrder(@Req() req, @Body() body: ServiceOrderBody) {
    const user: IUserInfo = req.user;
    const company = await this.companyRepository.findById(user.clientId);

    if (!company) {
      throw new NotFoundException(MessageService.Company_not_found);
    }

    const branch = await this.branchRepository.findById(Number(body.idBranch));

    if (!branch) {
      throw new NotFoundException(MessageService.Branch_not_found);
    }

    if (body.idRequester) {
      const requester = await this.maintenanceRequesterRepository.findById(
        body.idRequester,
      );

      if (!requester) {
        throw new NotFoundException(MessageService.Requester_id_not_found);
      }
    }

    const equipment = await this.equipmentRepository.findById(body.idEquipment);

    if (!equipment) {
      throw new NotFoundException(MessageService.Equipment_not_found);
    }

    // if (!body.hourMeter && !body.hourMeter) {
    //   throw new BadRequestException(
    //     MessageService.hourMeter_or_odometer_not_found,
    //   );
    // }

    body.machineStop = body.machineStop ? 1 : 0;
    if (body.maintainers && Array.isArray(body.maintainers)) {
      body.maintainers = body.maintainers;
    }

    const fields_permission = [
      'dateTimeRequest',
      'idServiceOrderFather',
      'idBranch',
      'idEquipment',
      'idProgram',
      'idSchedule',
      'idMaintenancePlan',
      'idPlanningMaintenance',
      'idCostCenter',
      'idBuilding',
      'idSector',
      'idDepartment',
      'idFamilyEquipment',
      'idTypeEquipment',
      'idRequester',
      'LinkServiceOrder',
      'branch',
      'building',
      'sector',
      'department',
      'familyEquipment',
      'typeEquipment',
      'equipment',
      'model',
      'descriptionRequest',
      'descriptionServicePerformed',
      'comments',
      'observationsExecutor',
      'idTypeMaintenance',
      'idTpmTAG',
      'codeTag',
      'idStatusServiceOrder',
      'returnCheckList',
      'closed',
      'statusEquipment',
      'statusSchedule',
      'statusExecutante',
      'dateExpectedEnd',
      'dateStart',
      'dateEnd',
      'emission',
      'idSubGroup',
      'idSectorExecutor',
      'maintainers',
      'hourPrev',
      'hourReal',
      'costPredicted',
      'costHours',
      'costMaterial',
      'costReleased',
      'timeMachineStop',
      'dueDate',
      'imageExpiration',
      'location',
      'codePlanoMaintenance',
      'idSession',
      'hourWorkLoad',
      'workScale',
      'startOperation',
      'TerminoFuncionamento',
      'clientComments',
      'noteEvaluationService',
      'idProject',
      'idActionPlan',
      'machineStop',
      'hourMeter',
      'odometer',
      'countPrint',
      'priority',
      'classification',
      'dateEquipamentoStop',
      'dateTechnicalActivation',
      'arrivalTechnician',
      'dateEquipmentWorked',
      'occurrence',
      'causeReason',
      'statusFailure',
      'servicePending',
      'hasAttachment',
      'idServiceRequest',
      'idProductionRegistration',
      'aux',
    ];

    removeExtraFields(body, fields_permission);
    body['dateEmission'] = new Date();
    body['dateEmissionTimestamp'] = this.dateService.toMills(new Date());
    body['username'] = user && user.login;
    body['idClient'] = user && user.clientId;
    //body['requester'] = requester.nome;
    body['dateTimeRequest'] = this.dateService
      .dayjs(body.dateTimeRequest)
      .toDate();
    body['dateTimeRequestTimestamp'] = this.dateService.toMills(
      body.dateTimeRequest,
    );

    const dataMapper = unSetMapper(
      body,
      ServiceOrderMapper,
    ) as Prisma.controle_de_ordens_de_servicoUncheckedCreateInput;

    if (Array.isArray(body.maintainers)) {
      dataMapper.maintainers = {
        createMany: {
          data: body.maintainers.map((maintainerId) => {
            return {
              id_colaborador: Number(maintainerId),
            };
          }),
        },
      };

      dataMapper.mantenedores = body.maintainers.join(',');
    }

    //console.log(dataMapper);

    // return {
    //   test: true,
    // };

    try {
      // console.log(dataMapper);
      // console.log(new Date());

      const createdServiceOrder =
        await this.serviceOrderRepository.create(dataMapper);

      const mapperCreateServiceOder = setMapper(
        createdServiceOrder,
        ServiceOrderMapper,
      );

      const newLogMaintainer =
        await this.logServiceOrderMaintainer.listByMaintainerAndOrders(
          [equipment.branch.ID],
          {
            id_ordem_servico: Number(mapperCreateServiceOder.id),
            log_date: {
              gte: this.dateService
                .dayjsSubTree(new Date())
                .subtract(1, 'h')
                .toDate(),
            },
          },
        );

      for await (const logMaintainer of newLogMaintainer) {
        await this.logServiceOrderMaintainer.update(logMaintainer.id, {
          log_date: new Date(),
        });
      }

      return {
        inserted: true,
        data: mapperCreateServiceOder,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/list-table')
  @ApiQuery({
    type: listServiceOrderQuerySwagger,
  })
  @ApiOkResponse({
    description: 'Success',
    type: ServiceOrderSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async listServiceOrder(@Req() req: any) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      index: z.coerce.number().optional().default(0),
      perPage: z
        .string()
        .transform((value) => (value === 'false' ? null : Number(value)))
        .optional(),
      codeServiceOrder: z.coerce.string().optional(),
      descriptionRequest: z.coerce.string().optional(),
      dateTimeRequest: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      dateExpectedEnd: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      dateEmission: z
        //.string()
        .union([
          z
            .object({
              from: z.coerce.date().optional(),
              to: z.coerce
                .date()
                .transform((value) => {
                  value.setUTCHours(23, 59, 59, 999);
                  return value;
                })
                .optional(),
            })
            .optional(),
          z.string().optional(), // Permite que 'dateEmission' seja uma string
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      dateTimeEnd: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      requester: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      equipment: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      justification: z.coerce.string().optional(),
      status: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      statusOS: z.coerce.string().optional(),
      typeMaintenance: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      branch: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      family: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      typeEquipment: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      location: z.coerce.string().optional().nullable(),
      orderBound: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      comments: z.coerce.string().optional().nullable(),
      observationsExecuting: z.coerce.string().optional().nullable(),
      clientComments: z.coerce.string().optional().nullable(),
      noteEvaluationService: z.array(z.number()).optional().nullable(),
      hourlyCost: z.coerce.number().optional().nullable(),
      materialCost: z.coerce.number().optional().nullable(),
      totalCost: z.coerce.number().optional().nullable(),
      equipmentStop: z.coerce.boolean().optional().nullable(),
      timeEquipmentStop: z.coerce.number().optional().nullable(),
      failureStatus: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      causeReason: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      technicalActivationDate: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      technicianArrival: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
    });

    const query = querySchema.parse(req.query);

    //console.log('query => ', query);
    // console.log('req.query => ', req.query);

    if (query.perPage === 0) {
      const allItemsForCountStatus =
        await this.serviceOrderRepository.listServiceOrder(
          user.branches,
          null,
          null,
          {
            ...(query.codeServiceOrder &&
              query.codeServiceOrder.length && {
                ordem: {
                  contains: query.codeServiceOrder,
                },
              }),
            ...(query.descriptionRequest &&
              query.descriptionRequest.length && {
                descricao_solicitacao: {
                  contains: query.descriptionRequest,
                },
              }),
            ...(query.dateTimeRequest &&
              query.dateTimeRequest !== null && {
                data_hora_solicitacao: {
                  gte: query.dateTimeRequest.from,
                  //.startOf('D')
                  //.subtract(3, 'h')
                  //.toDate(),
                  lte: query.dateTimeRequest.to,
                  //.subtract(3, 'h')
                  //.toDate(),
                },
              }),
            ...(query.dateExpectedEnd &&
              query.dateExpectedEnd !== null && {
                data_prevista_termino: {
                  gte: query.dateExpectedEnd.from,
                  //.startOf('D')
                  //.subtract(3, 'h')
                  //.toDate(),
                  lte: query.dateExpectedEnd.to,
                  //.subtract(3, 'h')
                  //.toDate(),
                },
              }),
            ...(query.dateEmission &&
              query.dateEmission !== null && {
                log_date: {
                  gte: query.dateEmission.from,
                  //.startOf('D')
                  //.subtract(3, 'h')
                  //.toDate(),
                  lte: query.dateEmission.to,

                  //.subtract(3, 'h')
                  // .toDate(),
                },
              }),
            ...(query.requester &&
              query.requester.length && {
                id_solicitante: {
                  in: query.requester,
                },
              }),
            ...(query.equipment &&
              query.equipment.length && {
                equipment: {
                  ID: {
                    in: query.equipment,
                  },
                },
              }),
            ...(query.status &&
              query.status.length && {
                statusOrderService: {
                  id: {
                    in: query.status.map(Number),
                  },
                },
              }),
            ...(query.statusOS && query.statusOS.length
              ? query.statusOS === 'expectedToday'
                ? {
                    data_prevista_termino: {
                      gte: this.dateService
                        .dayjs(new Date())
                        .startOf('day')
                        .subtract(3, 'h')
                        .toDate(),
                      lte: this.dateService
                        .dayjs(new Date())
                        .endOf('day')
                        .subtract(3, 'h')
                        .toDate(),
                    },
                    data_hora_encerramento: null,
                  }
                : query.statusOS === 'finishToday'
                ? {
                    data_hora_encerramento: {
                      gte: this.dateService
                        .dayjs(new Date())
                        .startOf('day')
                        .subtract(3, 'h')
                        .toDate(),
                      lte: this.dateService
                        .dayjs(new Date())
                        .endOf('day')
                        .subtract(3, 'h')
                        .toDate(),
                    },
                  }
                : query.statusOS === 'finish'
                ? {
                    data_hora_encerramento: {
                      not: null,
                    },
                  }
                : query.statusOS === 'late'
                ? {
                    data_prevista_termino: {
                      lte: this.dateService
                        .dayjs(new Date())
                        .startOf('day')
                        .subtract(3, 'h')
                        .toDate(),
                    },
                    data_hora_encerramento: null,
                  }
                : {
                    statusOrderService: {
                      id: {
                        in: query.statusOS.split(',').map(Number),
                      },
                    },
                  }
              : {}),
            ...(query.family &&
              query.family.length && {
                equipment: {
                  family: {
                    ID: {
                      in: query.family,
                    },
                  },
                },
              }),
            ...(query.typeEquipment &&
              query.typeEquipment.length && {
                equipment: {
                  typeEquipment: {
                    ID: {
                      in: query.typeEquipment,
                    },
                  },
                },
              }),
            ...(query.location && {
              equipment: {
                localizacao: {
                  contains: query.location,
                },
              },
            }),
            ...(query.orderBound &&
              query.orderBound.length && {
                id_ordem_pai: {
                  in: query.orderBound,
                },
              }),
            ...(query.comments && {
              observacoes: {
                contains: query.comments,
              },
            }),
            ...(query.observationsExecuting && {
              observacoes_executante: {
                contains: query.observationsExecuting,
              },
            }),
            ...(query.clientComments && {
              observacoes_cliente: {
                contains: query.clientComments,
              },
            }),
            ...(query.noteEvaluationService && {
              nota_avalicao_servico: {
                in: query.noteEvaluationService,
              },
            }),
            ...(query.failureStatus &&
              query.failureStatus.length && {
                failureAnalysis: {
                  some: {
                    failureAction: {
                      id: {
                        in: query.failureStatus,
                      },
                    },
                  },
                },
              }),
            ...(query.causeReason &&
              query.causeReason.length && {
                failureAnalysis: {
                  some: {
                    failureCause: {
                      id: {
                        in: query.causeReason,
                      },
                    },
                  },
                },
              }),
            ...(query.technicalActivationDate &&
              query.technicalActivationDate === null && {
                data_acionamento_tecnico: {
                  gte: query.technicalActivationDate.from,
                  lte: query.technicalActivationDate.to,
                },
              }),
            ...(query.technicianArrival &&
              query.technicianArrival === null && {
                chegada_tecnico: {
                  gte: query.technicianArrival.from,
                  lte: query.technicianArrival.to,
                },
              }),
          },
        );

      const filterStatus = [];

      filterStatus.push(
        {
          id: 'expectedToday',
          name: 'Previsto Hoje',
          color: '#00FFFF',
          count: 0,
        },
        {
          id: 'finishToday',
          name: 'Finalizado Hoje',
          color: '#22c55e',
          count: 0,
        },
        {
          id: 'finish',
          name: 'Finalizado',
          color: '#010eFF',
          count: 0,
        },
        {
          id: 'late',
          name: 'Atrasado',
          color: '#FF5500',
          count: 0,
        },
      );

      allItemsForCountStatus.forEach((item) => {
        if (
          // end is today
          item.data_hora_encerramento === null &&
          this.dateService
            .dayjs(new Date())
            .startOf('day')
            .isSame(
              this.dateService
                .dayjsAddTree(item.data_prevista_termino)
                .startOf('day'),
              'day',
            )
        ) {
          const index = filterStatus.findIndex(
            (value) => value.id === 'expectedToday',
          );

          if (index >= 0) {
            filterStatus[index].count++;
          } else {
            filterStatus.push({
              id: 'expectedToday',
              name: 'Previsto Hoje',
              color: '#00FFFF',
              count: 1,
            });
          }
        } else if (
          // finish today
          this.dateService
            .dayjs(new Date())
            .startOf('day')
            .isSame(
              this.dateService
                .dayjsAddTree(item.data_hora_encerramento)
                .startOf('day'),
              'day',
            )
        ) {
          const index = filterStatus.findIndex(
            (value) => value.id === 'finishToday',
          );

          if (index >= 0) {
            filterStatus[index].count++;
          } else {
            filterStatus.push({
              id: 'finishToday',
              name: 'Finalizado Hoje',
              color: '#22c55e',
              count: 1,
            });
          }
        } else if (item.data_hora_encerramento !== null) {
          const index = filterStatus.findIndex(
            (value) => value.id === 'finish',
          );

          if (index >= 0) {
            filterStatus[index].count++;
          } else {
            filterStatus.push({
              id: 'finish',
              name: 'Finalizado',
              color: '#010eFF',
              count: 0,
            });
          }
        } else if (
          this.dateService
            .dayjs(new Date())
            .startOf('day')
            .isAfter(
              this.dateService
                .dayjsAddTree(item.data_prevista_termino)
                .startOf('day'),
              'day',
            )
        ) {
          const index = filterStatus.findIndex((value) => value.id === 'late');
          //console.log(item)
          if (index >= 0) {
            filterStatus[index].count++;
          } else {
            filterStatus.push({
              id: 'late',
              name: 'Atrasado',
              color: '#FF5500',
              count: 0,
            });
          }
        }
      });

      return {
        rows: [],
        pageCount: 0,
        filterStatus,
        totalPage: 0,
      };
    }
    // return {
    //   query,
    // };

    // console.log(query);
    // console.log(this.dateService
    //   .dayjs(new Date())
    //   .startOf('day')
    //   .subtract(3, 'h')
    //   .toDate())
    //console.log(user.branches);
    const data = await this.serviceOrderRepository.listServiceOrder(
      user.branches,
      query.perPage ? query.index : null,
      query.perPage,
      {
        ...(query.codeServiceOrder &&
          query.codeServiceOrder.length && {
            ordem: {
              contains: query.codeServiceOrder,
            },
          }),
        ...(query.descriptionRequest &&
          query.descriptionRequest.length && {
            descricao_solicitacao: {
              contains: query.descriptionRequest,
            },
          }),
        ...(query.dateTimeRequest &&
          query.dateTimeRequest !== null && {
            data_hora_solicitacao: {
              gte: query.dateTimeRequest.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateTimeRequest.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateExpectedEnd &&
          query.dateExpectedEnd !== null && {
            data_prevista_termino: {
              gte: query.dateExpectedEnd.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateExpectedEnd.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateEmission &&
          query.dateEmission !== null && {
            log_date: {
              gte: query.dateEmission.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateEmission.to,

              //.subtract(3, 'h')
              // .toDate(),
            },
          }),
        ...(query.requester &&
          query.requester.length && {
            id_solicitante: {
              in: query.requester,
            },
          }),
        ...(query.equipment &&
          query.equipment.length && {
            equipment: {
              ID: {
                in: query.equipment,
              },
            },
          }),
        ...(query.status &&
          query.status.length && {
            statusOrderService: {
              id: {
                in: query.status.map(Number),
              },
            },
          }),
        ...(query.statusOS && query.statusOS.length
          ? query.statusOS === 'expectedToday'
            ? {
                data_prevista_termino: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : query.statusOS === 'finishToday'
            ? {
                data_hora_encerramento: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
              }
            : query.statusOS === 'finish'
            ? {
                data_hora_encerramento: {
                  not: null,
                },
              }
            : query.statusOS === 'late'
            ? {
                data_prevista_termino: {
                  lte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : {
                statusOrderService: {
                  id: {
                    in: query.statusOS.split(',').map(Number),
                  },
                },
              }
          : {}),
        ...(query.typeMaintenance &&
          query.typeMaintenance.length && {
            typeMaintenance: {
              ID: {
                in: query.typeMaintenance.map(Number),
              },
            },
          }),
        ...(query.branch &&
          query.branch.length && {
            branch: {
              ID: {
                in: query.branch,
              },
            },
          }),
        ...(query.family &&
          query.family.length && {
            equipment: {
              family: {
                ID: {
                  in: query.family,
                },
              },
            },
          }),
        ...(query.typeEquipment &&
          query.typeEquipment.length && {
            equipment: {
              typeEquipment: {
                ID: {
                  in: query.typeEquipment,
                },
              },
            },
          }),
        ...(query.location && {
          equipment: {
            localizacao: {
              contains: query.location,
            },
          },
        }),
        ...(query.orderBound &&
          query.orderBound.length && {
            id_ordem_pai: {
              in: query.orderBound,
            },
          }),
        ...(query.comments && {
          observacoes: {
            contains: query.comments,
          },
        }),
        ...(query.observationsExecuting && {
          observacoes_executante: {
            contains: query.observationsExecuting,
          },
        }),
        ...(query.clientComments && {
          observacoes_cliente: {
            contains: query.clientComments,
          },
        }),
        ...(query.noteEvaluationService && {
          nota_avalicao_servico: {
            in: query.noteEvaluationService,
          },
        }),
        ...(query.failureStatus &&
          query.failureStatus.length && {
            failureAnalysis: {
              some: {
                failureAction: {
                  id: {
                    in: query.failureStatus,
                  },
                },
              },
            },
          }),
        ...(query.causeReason &&
          query.causeReason.length && {
            failureAnalysis: {
              some: {
                failureCause: {
                  id: {
                    in: query.causeReason,
                  },
                },
              },
            },
          }),
        ...(query.technicalActivationDate &&
          query.technicalActivationDate === null && {
            data_acionamento_tecnico: {
              gte: query.technicalActivationDate.from,
              lte: query.technicalActivationDate.to,
            },
          }),
        ...(query.technicianArrival &&
          query.technicianArrival === null && {
            chegada_tecnico: {
              gte: query.technicianArrival.from,
              lte: query.technicianArrival.to,
            },
          }),
      },
    );

    const allData = await this.serviceOrderRepository.countListServiceOrder(
      user.branches,
      {
        ...(query.codeServiceOrder &&
          query.codeServiceOrder.length && {
            ordem: {
              contains: query.codeServiceOrder,
            },
          }),
        ...(query.descriptionRequest &&
          query.descriptionRequest.length && {
            descricao_solicitacao: {
              contains: query.descriptionRequest,
            },
          }),
        ...(query.dateTimeRequest &&
          query.dateTimeRequest !== null && {
            data_hora_solicitacao: {
              gte: query.dateTimeRequest.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateTimeRequest.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateExpectedEnd &&
          query.dateExpectedEnd !== null && {
            data_prevista_termino: {
              gte: query.dateExpectedEnd.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateExpectedEnd.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateEmission &&
          query.dateEmission !== null && {
            log_date: {
              gte: query.dateEmission.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateEmission.to,

              //.subtract(3, 'h')
              // .toDate(),
            },
          }),
        ...(query.requester &&
          query.requester.length && {
            id_solicitante: {
              in: query.requester,
            },
          }),
        ...(query.equipment &&
          query.equipment.length && {
            equipment: {
              ID: {
                in: query.equipment,
              },
            },
          }),
        ...(query.status &&
          query.status.length && {
            statusOrderService: {
              id: {
                in: query.status.map(Number),
              },
            },
          }),
        ...(query.statusOS && query.statusOS.length
          ? query.statusOS === 'expectedToday'
            ? {
                data_prevista_termino: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : query.statusOS === 'finishToday'
            ? {
                data_hora_encerramento: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
              }
            : query.statusOS === 'finish'
            ? {
                data_hora_encerramento: {
                  not: null,
                },
              }
            : query.statusOS === 'late'
            ? {
                data_prevista_termino: {
                  lte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : {
                statusOrderService: {
                  id: {
                    in: query.statusOS.split(',').map(Number),
                  },
                },
              }
          : {}),
        ...(query.typeMaintenance &&
          query.typeMaintenance.length && {
            typeMaintenance: {
              ID: {
                in: query.typeMaintenance.map(Number),
              },
            },
          }),
        ...(query.branch &&
          query.branch.length && {
            branch: {
              ID: {
                in: query.branch,
              },
            },
          }),
        ...(query.family &&
          query.family.length && {
            equipment: {
              family: {
                ID: {
                  in: query.family,
                },
              },
            },
          }),
        ...(query.typeEquipment &&
          query.typeEquipment.length && {
            equipment: {
              typeEquipment: {
                ID: {
                  in: query.typeEquipment,
                },
              },
            },
          }),
        ...(query.location && {
          equipment: {
            localizacao: {
              contains: query.location,
            },
          },
        }),
        ...(query.orderBound &&
          query.orderBound.length && {
            id_ordem_pai: {
              in: query.orderBound,
            },
          }),
        ...(query.comments && {
          observacoes: {
            contains: query.comments,
          },
        }),
        ...(query.observationsExecuting && {
          observacoes_executante: {
            contains: query.observationsExecuting,
          },
        }),
        ...(query.clientComments && {
          observacoes_cliente: {
            contains: query.clientComments,
          },
        }),
        ...(query.noteEvaluationService && {
          nota_avalicao_servico: {
            in: query.noteEvaluationService,
          },
        }),
        ...(query.failureStatus &&
          query.failureStatus.length && {
            failureAnalysis: {
              some: {
                failureAction: {
                  id: {
                    in: query.failureStatus,
                  },
                },
              },
            },
          }),
        ...(query.causeReason &&
          query.causeReason.length && {
            failureAnalysis: {
              some: {
                failureCause: {
                  id: {
                    in: query.causeReason,
                  },
                },
              },
            },
          }),
        ...(query.technicalActivationDate &&
          query.technicalActivationDate === null && {
            data_acionamento_tecnico: {
              gte: query.technicalActivationDate.from,
              lte: query.technicalActivationDate.to,
            },
          }),
        ...(query.technicianArrival &&
          query.technicianArrival === null && {
            chegada_tecnico: {
              gte: query.technicianArrival.from,
              lte: query.technicianArrival.to,
            },
          }),
      },
    );

    const allItemsForCountStatus =
      await this.serviceOrderRepository.listForStatusTable(user.branches, {
        ...(query.codeServiceOrder &&
          query.codeServiceOrder.length && {
            ordem: {
              contains: query.codeServiceOrder,
            },
          }),
        ...(query.descriptionRequest &&
          query.descriptionRequest.length && {
            descricao_solicitacao: {
              contains: query.descriptionRequest,
            },
          }),
        ...(query.dateTimeRequest &&
          query.dateTimeRequest !== null && {
            data_hora_solicitacao: {
              gte: query.dateTimeRequest.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateTimeRequest.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateExpectedEnd &&
          query.dateExpectedEnd !== null && {
            data_prevista_termino: {
              gte: query.dateExpectedEnd.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateExpectedEnd.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateEmission &&
          query.dateEmission !== null && {
            log_date: {
              gte: query.dateEmission.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateEmission.to,

              //.subtract(3, 'h')
              // .toDate(),
            },
          }),
        ...(query.requester &&
          query.requester.length && {
            id_solicitante: {
              in: query.requester,
            },
          }),
        ...(query.equipment &&
          query.equipment.length && {
            equipment: {
              ID: {
                in: query.equipment,
              },
            },
          }),
        ...(query.status &&
          query.status.length && {
            statusOrderService: {
              id: {
                in: query.status.map(Number),
              },
            },
          }),
        ...(query.statusOS && query.statusOS.length
          ? query.statusOS === 'expectedToday'
            ? {
                data_prevista_termino: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : query.statusOS === 'finishToday'
            ? {
                data_hora_encerramento: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
              }
            : query.statusOS === 'finish'
            ? {
                data_hora_encerramento: {
                  not: null,
                },
              }
            : query.statusOS === 'late'
            ? {
                data_prevista_termino: {
                  lte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : {
                statusOrderService: {
                  id: {
                    in: query.statusOS.split(',').map(Number),
                  },
                },
              }
          : {}),
        ...(query.branch &&
          query.branch.length && {
            branch: {
              ID: {
                in: query.branch,
              },
            },
          }),
        ...(query.family &&
          query.family.length && {
            equipment: {
              family: {
                ID: {
                  in: query.family,
                },
              },
            },
          }),
        ...(query.typeEquipment &&
          query.typeEquipment.length && {
            equipment: {
              typeEquipment: {
                ID: {
                  in: query.typeEquipment,
                },
              },
            },
          }),
        ...(query.location && {
          equipment: {
            localizacao: {
              contains: query.location,
            },
          },
        }),
        ...(query.orderBound &&
          query.orderBound.length && {
            id_ordem_pai: {
              in: query.orderBound,
            },
          }),
        ...(query.comments && {
          observacoes: {
            contains: query.comments,
          },
        }),
        ...(query.observationsExecuting && {
          observacoes_executante: {
            contains: query.observationsExecuting,
          },
        }),
        ...(query.clientComments && {
          observacoes_cliente: {
            contains: query.clientComments,
          },
        }),
        ...(query.noteEvaluationService && {
          nota_avalicao_servico: {
            in: query.noteEvaluationService,
          },
        }),
        ...(query.failureStatus &&
          query.failureStatus.length && {
            failureAnalysis: {
              some: {
                failureAction: {
                  id: {
                    in: query.failureStatus,
                  },
                },
              },
            },
          }),
        ...(query.causeReason &&
          query.causeReason.length && {
            failureAnalysis: {
              some: {
                failureCause: {
                  id: {
                    in: query.causeReason,
                  },
                },
              },
            },
          }),
        ...(query.technicalActivationDate &&
          query.technicalActivationDate === null && {
            data_acionamento_tecnico: {
              gte: query.technicalActivationDate.from,
              lte: query.technicalActivationDate.to,
            },
          }),
        ...(query.technicianArrival &&
          query.technicianArrival === null && {
            chegada_tecnico: {
              gte: query.technicianArrival.from,
              lte: query.technicianArrival.to,
            },
          }),
      });

    const filterStatus = [];

    filterStatus.push(
      {
        id: 'expectedToday',
        name: 'Previsto Hoje',
        color: '#00FFFF',
        count: 0,
      },
      {
        id: 'finishToday',
        name: 'Finalizado Hoje',
        color: '#22c55e',
        count: 0,
      },
      {
        id: 'finish',
        name: 'Finalizado',
        color: '#010eFF',
        count: 0,
      },
      {
        id: 'late',
        name: 'Atrasado',
        color: '#FF5500',
        count: 0,
      },
    );

    allItemsForCountStatus.forEach((item) => {
      if (
        // end is today
        item.data_hora_encerramento === null &&
        this.dateService
          .dayjs(new Date())
          .startOf('day')
          .isSame(
            this.dateService
              .dayjsAddTree(item.data_prevista_termino)
              .startOf('day'),
            'day',
          )
      ) {
        const index = filterStatus.findIndex(
          (value) => value.id === 'expectedToday',
        );

        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'expectedToday',
            name: 'Previsto Hoje',
            color: '#00FFFF',
            count: 1,
          });
        }
      } else if (
        // finish today
        this.dateService
          .dayjs(new Date())
          .startOf('day')
          .isSame(
            this.dateService
              .dayjsAddTree(item.data_hora_encerramento)
              .startOf('day'),
            'day',
          )
      ) {
        const index = filterStatus.findIndex(
          (value) => value.id === 'finishToday',
        );

        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'finishToday',
            name: 'Finalizado Hoje',
            color: '#22c55e',
            count: 1,
          });
        }
      } else if (item.data_hora_encerramento !== null) {
        const index = filterStatus.findIndex((value) => value.id === 'finish');

        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'finish',
            name: 'Finalizado',
            color: '#010eFF',
            count: 0,
          });
        }
      } else if (
        this.dateService
          .dayjs(new Date())
          .startOf('day')
          .isAfter(
            this.dateService
              .dayjsAddTree(item.data_prevista_termino)
              .startOf('day'),
            'day',
          )
      ) {
        const index = filterStatus.findIndex((value) => value.id === 'late');
        //console.log(item)
        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'late',
            name: 'Atrasado',
            color: '#FF5500',
            count: 0,
          });
        }
      }
    });

    const dateService = new DateService();

    const response = data.map((obj) => {
      const newObj = setMapper(obj, ServiceOrderMapper);

      //console.log(obj);

      const totalHourForCollaborator = [];

      obj.note.forEach((note) => {
        const findIndex = totalHourForCollaborator.findIndex(
          (value) => value.id === note.employee?.id,
        );

        if (findIndex >= 0) {
          totalHourForCollaborator[findIndex].totalHour +=
            this.dateService.calculeDiffTimeInHour(
              note.data_hora_inicio,
              note.data_hora_termino || new Date(),
            );
          totalHourForCollaborator[findIndex].total =
            totalHourForCollaborator[findIndex].valueForHour *
            totalHourForCollaborator[findIndex].totalHour;
        } else {
          totalHourForCollaborator.push({
            id: note.employee?.id,
            name: note.employee?.nome,
            valueForHour: note.employee?.valor_hora || 0,
            totalHour: this.dateService.calculeDiffTimeInHour(
              note.data_hora_inicio,
              note.data_hora_termino || new Date(),
            ),
            total:
              note.employee?.valor_hora ||
              0 *
                this.dateService.calculeDiffTimeInHour(
                  note.data_hora_inicio,
                  note.data_hora_termino || new Date(),
                ),
          });
        }
      });

      const dateEquipmentStop =
        obj.noteStop.length > 0 ? obj.noteStop[0].data_hora_stop : null;
      const dateEquipmentWorked =
        obj.noteStop.length > 0
          ? obj.noteStop[obj.noteStop.length - 1].data_hora_start
          : null;

      const totalMaterial = obj.materialServiceOrder.reduce((acc, current) => {
        return acc + Number(current.quantidade) * Number(current.valor_unidade);
      }, 0);

      const serviceOrderInfo = {
        equipment: `${obj.equipment.equipamento_codigo} - ${obj.equipment.descricao}`,
        // openTime: dateService.serviceOrderOpenTimeDisplay(
        //   obj.data_hora_solicitacao,
        //   obj.fechada,
        //   obj.data_hora_encerramento,
        //   obj.data_prevista_termino,
        // ),
        openTime: dateService.formatTimeDifference(
          obj.data_hora_solicitacao,
          obj.data_hora_encerramento || new Date(),
        ),
        datePrev: dateService.formatTimeDifference(
          obj.data_hora_solicitacao,
          obj.data_prevista_termino || new Date(),
        ),
        // datePrev: dateService.serviceOrderOpenTimeDisplay(
        //   obj.data_hora_solicitacao,
        //   obj.fechada,
        //   obj.data_hora_encerramento,
        //   obj.data_prevista_termino,
        // ),
        justification: obj.justifyStatus.length
          ? obj.justifyStatus[obj.justifyStatus.length - 1].justificativa
          : null,
        status: {
          value: obj.statusOrderService.id,
          label: obj.statusOrderService.status,
          color: obj.statusOrderService.cor,
          hasFinished: obj.statusOrderService.finalizacao === 1,
          hasJustify: obj.statusOrderService.requer_justificativa === 'S',
        },
        dateEmissionTimestamp: obj.log_date_timestamp
          ? obj.log_date_timestamp
          : obj.log_date,
        dateTimeRequestTimestamp: obj.data_hora_solicitacao_timestamp
          ? obj.data_hora_solicitacao_timestamp
          : obj.data_hora_solicitacao,
        typeMaintenance: obj.typeMaintenance
          ? {
              id: obj.typeMaintenance.ID,
              label: obj.typeMaintenance.tipo_manutencao,
              typeMaintenance: obj.typeMaintenance.tipo_manutencao,
            }
          : null,
        machineStop: obj?.maquina_parada === 1,
        family: obj.equipment?.family?.familia || '',
        typeEquipment: obj.equipment.typeEquipment?.tipo_equipamento || null,
        //location:
        hourlyCost: totalHourForCollaborator.reduce((acc, current) => {
          return acc + current.total;
        }, 0),
        materialCost: totalMaterial,
        totalCost:
          totalHourForCollaborator.reduce((acc, current) => {
            return acc + current.total;
          }, 0) + totalMaterial,
        equipmentStop: obj.maquina_parada === 1,
        dateEquipmentStop,
        dateEquipmentWorked,
        timeEquipmentStop: dateEquipmentStop
          ? this.dateService.formatTimeDifference(
              dateEquipmentStop,
              dateEquipmentWorked || new Date(),
            )
          : null,
        // failureStatus: '',
        // causeReason: '',
        technicalActivationDate: obj.data_equipamento_funcionou,
        technicianArrival: obj.chegada_tecnico,
        automatic: obj.id_planejamento_manutencao ? true : false,
        maintainer: obj.maintainers.map((value) => {
          return {
            id: value.collaborator.nome,
            name: value.collaborator.nome,
          };
        }),
      };

      return {
        ...newObj,
        ...serviceOrderInfo,
      };
    });

    return {
      rows: response,
      pageCount: allData,
      filterStatus,
      totalPage: Math.ceil(allData / query.perPage) - 1,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/kanban')
  @ApiQuery({
    type: listServiceOrderQuerySwagger,
  })
  @ApiOkResponse({
    description: 'Success',
    type: ServiceOrderSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async kanban(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      index: z.coerce.number().optional().default(0),
      perPage: z
        .string()
        .transform((value) => (value === 'false' ? null : Number(value)))
        .optional(),
      codeServiceOrder: z.coerce.string().optional(),
      descriptionRequest: z.coerce.string().optional(),
      dateTimeRequest: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      dateExpectedEnd: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      dateEmission: z
        //.string()
        .union([
          z
            .object({
              from: z.coerce.date().optional(),
              to: z.coerce
                .date()
                .transform((value) => {
                  value.setUTCHours(23, 59, 59, 999);
                  return value;
                })
                .optional(),
            })
            .optional(),
          z.string().optional(), // Permite que 'dateEmission' seja uma string
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      dateTimeEnd: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      requester: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      equipment: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      justification: z.coerce.string().optional(),
      status: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      statusOS: z.coerce.string().optional(),
      typeMaintenance: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      branch: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      family: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      typeEquipment: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      location: z.coerce.string().optional().nullable(),
      orderBound: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      comments: z.coerce.string().optional().nullable(),
      observationsExecuting: z.coerce.string().optional().nullable(),
      clientComments: z.coerce.string().optional().nullable(),
      noteEvaluationService: z.array(z.number()).optional().nullable(),
      hourlyCost: z.coerce.number().optional().nullable(),
      materialCost: z.coerce.number().optional().nullable(),
      totalCost: z.coerce.number().optional().nullable(),
      equipmentStop: z.coerce.boolean().optional().nullable(),
      timeEquipmentStop: z.coerce.number().optional().nullable(),
      failureStatus: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      causeReason: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      technicalActivationDate: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      technicianArrival: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
    });

    const query = querySchema.parse(req.query);

    // const allStatus = await this.statusServiceOrderRepository.listByClient(
    //   user.clientId,
    // );

    // const response = {};

    // for await (const status of allStatus) {
    //   const allOrder =
    //     await this.serviceOrderRepository.listServiceOrderByKanban(
    //       user.branches,
    //       query.index,
    //       query.perPage,
    //       {
    //         status_os: status.id,
    //         ...(query.codeServiceOrder &&
    //           query.codeServiceOrder.length && {
    //             ordem: {
    //               contains: query.codeServiceOrder,
    //             },
    //           }),
    //         ...(query.descriptionRequest &&
    //           query.descriptionRequest.length && {
    //             descricao_solicitacao: {
    //               contains: query.descriptionRequest,
    //             },
    //           }),
    //         ...(query.dateTimeRequest &&
    //           query.dateTimeRequest !== null && {
    //             data_hora_solicitacao: {
    //               gte: query.dateTimeRequest.from,
    //               //.startOf('D')
    //               //.subtract(3, 'h')
    //               //.toDate(),
    //               lte: query.dateTimeRequest.to,
    //               //.subtract(3, 'h')
    //               //.toDate(),
    //             },
    //           }),
    //         ...(query.dateExpectedEnd &&
    //           query.dateExpectedEnd !== null && {
    //             data_prevista_termino: {
    //               gte: query.dateExpectedEnd.from,
    //               //.startOf('D')
    //               //.subtract(3, 'h')
    //               //.toDate(),
    //               lte: query.dateExpectedEnd.to,
    //               //.subtract(3, 'h')
    //               //.toDate(),
    //             },
    //           }),
    //         ...(query.dateEmission &&
    //           query.dateEmission !== null && {
    //             log_date: {
    //               gte: query.dateEmission.from,
    //               //.startOf('D')
    //               //.subtract(3, 'h')
    //               //.toDate(),
    //               lte: query.dateEmission.to,

    //               //.subtract(3, 'h')
    //               // .toDate(),
    //             },
    //           }),
    //         ...(query.requester &&
    //           query.requester.length && {
    //             id_solicitante: {
    //               in: query.requester,
    //             },
    //           }),
    //         ...(query.equipment &&
    //           query.equipment.length && {
    //             equipment: {
    //               ID: {
    //                 in: query.equipment,
    //               },
    //             },
    //           }),
    //         ...(query.status &&
    //           query.status.length && {
    //             statusOrderService: {
    //               id: {
    //                 in: query.status.map(Number),
    //               },
    //             },
    //           }),
    //         ...(query.statusOS && query.statusOS.length
    //           ? query.statusOS === 'expectedToday'
    //             ? {
    //                 data_prevista_termino: {
    //                   gte: this.dateService
    //                     .dayjs(new Date())
    //                     .startOf('day')
    //                     .subtract(3, 'h')
    //                     .toDate(),
    //                   lte: this.dateService
    //                     .dayjs(new Date())
    //                     .endOf('day')
    //                     .subtract(3, 'h')
    //                     .toDate(),
    //                 },
    //                 data_hora_encerramento: null,
    //               }
    //             : query.statusOS === 'finishToday'
    //             ? {
    //                 data_hora_encerramento: {
    //                   gte: this.dateService
    //                     .dayjs(new Date())
    //                     .startOf('day')
    //                     .subtract(3, 'h')
    //                     .toDate(),
    //                   lte: this.dateService
    //                     .dayjs(new Date())
    //                     .endOf('day')
    //                     .subtract(3, 'h')
    //                     .toDate(),
    //                 },
    //               }
    //             : query.statusOS === 'finish'
    //             ? {
    //                 data_hora_encerramento: {
    //                   not: null,
    //                 },
    //               }
    //             : query.statusOS === 'late'
    //             ? {
    //                 data_prevista_termino: {
    //                   lte: this.dateService
    //                     .dayjs(new Date())
    //                     .startOf('day')
    //                     .subtract(3, 'h')
    //                     .toDate(),
    //                 },
    //                 data_hora_encerramento: null,
    //               }
    //             : {
    //                 statusOrderService: {
    //                   id: {
    //                     in: query.statusOS.split(',').map(Number),
    //                   },
    //                 },
    //               }
    //           : {}),
    //         ...(query.branch &&
    //           query.branch.length && {
    //             branch: {
    //               ID: {
    //                 in: query.branch,
    //               },
    //             },
    //           }),
    //         ...(query.family &&
    //           query.family.length && {
    //             equipment: {
    //               family: {
    //                 ID: {
    //                   in: query.family,
    //                 },
    //               },
    //             },
    //           }),
    //         ...(query.typeEquipment &&
    //           query.typeEquipment.length && {
    //             equipment: {
    //               typeEquipment: {
    //                 ID: {
    //                   in: query.typeEquipment,
    //                 },
    //               },
    //             },
    //           }),
    //         ...(query.location && {
    //           equipment: {
    //             localizacao: {
    //               contains: query.location,
    //             },
    //           },
    //         }),
    //         ...(query.orderBound &&
    //           query.orderBound.length && {
    //             id_ordem_pai: {
    //               in: query.orderBound,
    //             },
    //           }),
    //         ...(query.comments && {
    //           observacoes: {
    //             contains: query.comments,
    //           },
    //         }),
    //         ...(query.observationsExecuting && {
    //           observacoes_executante: {
    //             contains: query.observationsExecuting,
    //           },
    //         }),
    //         ...(query.clientComments && {
    //           observacoes_cliente: {
    //             contains: query.clientComments,
    //           },
    //         }),
    //         ...(query.noteEvaluationService && {
    //           nota_avalicao_servico: {
    //             in: query.noteEvaluationService,
    //           },
    //         }),
    //         ...(query.failureStatus &&
    //           query.failureStatus.length && {
    //             failureAnalysis: {
    //               some: {
    //                 failureAction: {
    //                   id: {
    //                     in: query.failureStatus,
    //                   },
    //                 },
    //               },
    //             },
    //           }),
    //         ...(query.causeReason &&
    //           query.causeReason.length && {
    //             failureAnalysis: {
    //               some: {
    //                 failureCause: {
    //                   id: {
    //                     in: query.causeReason,
    //                   },
    //                 },
    //               },
    //             },
    //           }),
    //         ...(query.technicalActivationDate &&
    //           query.technicalActivationDate === null && {
    //             data_acionamento_tecnico: {
    //               gte: query.technicalActivationDate.from,
    //               lte: query.technicalActivationDate.to,
    //             },
    //           }),
    //         ...(query.technicianArrival &&
    //           query.technicianArrival === null && {
    //             chegada_tecnico: {
    //               gte: query.technicianArrival.from,
    //               lte: query.technicianArrival.to,
    //             },
    //           }),
    //       },
    //     );

    //   const total = await this.serviceOrderRepository.countListServiceOrder(
    //     user.branches,
    //     {
    //       status_os: status.id,
    //       ...(query.codeServiceOrder &&
    //         query.codeServiceOrder.length && {
    //           ordem: {
    //             contains: query.codeServiceOrder,
    //           },
    //         }),
    //       ...(query.descriptionRequest &&
    //         query.descriptionRequest.length && {
    //           descricao_solicitacao: {
    //             contains: query.descriptionRequest,
    //           },
    //         }),
    //       ...(query.dateTimeRequest &&
    //         query.dateTimeRequest !== null && {
    //           data_hora_solicitacao: {
    //             gte: query.dateTimeRequest.from,
    //             //.startOf('D')
    //             //.subtract(3, 'h')
    //             //.toDate(),
    //             lte: query.dateTimeRequest.to,
    //             //.subtract(3, 'h')
    //             //.toDate(),
    //           },
    //         }),
    //       ...(query.dateExpectedEnd &&
    //         query.dateExpectedEnd !== null && {
    //           data_prevista_termino: {
    //             gte: query.dateExpectedEnd.from,
    //             //.startOf('D')
    //             //.subtract(3, 'h')
    //             //.toDate(),
    //             lte: query.dateExpectedEnd.to,
    //             //.subtract(3, 'h')
    //             //.toDate(),
    //           },
    //         }),
    //       ...(query.dateEmission &&
    //         query.dateEmission !== null && {
    //           log_date: {
    //             gte: query.dateEmission.from,
    //             //.startOf('D')
    //             //.subtract(3, 'h')
    //             //.toDate(),
    //             lte: query.dateEmission.to,

    //             //.subtract(3, 'h')
    //             // .toDate(),
    //           },
    //         }),
    //       ...(query.requester &&
    //         query.requester.length && {
    //           id_solicitante: {
    //             in: query.requester,
    //           },
    //         }),
    //       ...(query.equipment &&
    //         query.equipment.length && {
    //           equipment: {
    //             ID: {
    //               in: query.equipment,
    //             },
    //           },
    //         }),
    //       ...(query.status &&
    //         query.status.length && {
    //           statusOrderService: {
    //             id: {
    //               in: query.status.map(Number),
    //             },
    //           },
    //         }),
    //       ...(query.statusOS && query.statusOS.length
    //         ? query.statusOS === 'expectedToday'
    //           ? {
    //               data_prevista_termino: {
    //                 gte: this.dateService
    //                   .dayjs(new Date())
    //                   .startOf('day')
    //                   .subtract(3, 'h')
    //                   .toDate(),
    //                 lte: this.dateService
    //                   .dayjs(new Date())
    //                   .endOf('day')
    //                   .subtract(3, 'h')
    //                   .toDate(),
    //               },
    //               data_hora_encerramento: null,
    //             }
    //           : query.statusOS === 'finishToday'
    //           ? {
    //               data_hora_encerramento: {
    //                 gte: this.dateService
    //                   .dayjs(new Date())
    //                   .startOf('day')
    //                   .subtract(3, 'h')
    //                   .toDate(),
    //                 lte: this.dateService
    //                   .dayjs(new Date())
    //                   .endOf('day')
    //                   .subtract(3, 'h')
    //                   .toDate(),
    //               },
    //             }
    //           : query.statusOS === 'finish'
    //           ? {
    //               data_hora_encerramento: {
    //                 not: null,
    //               },
    //             }
    //           : query.statusOS === 'late'
    //           ? {
    //               data_prevista_termino: {
    //                 lte: this.dateService
    //                   .dayjs(new Date())
    //                   .startOf('day')
    //                   .subtract(3, 'h')
    //                   .toDate(),
    //               },
    //               data_hora_encerramento: null,
    //             }
    //           : {
    //               statusOrderService: {
    //                 id: {
    //                   in: query.statusOS.split(',').map(Number),
    //                 },
    //               },
    //             }
    //         : {}),
    //       ...(query.branch &&
    //         query.branch.length && {
    //           branch: {
    //             ID: {
    //               in: query.branch,
    //             },
    //           },
    //         }),
    //       ...(query.family &&
    //         query.family.length && {
    //           equipment: {
    //             family: {
    //               ID: {
    //                 in: query.family,
    //               },
    //             },
    //           },
    //         }),
    //       ...(query.typeEquipment &&
    //         query.typeEquipment.length && {
    //           equipment: {
    //             typeEquipment: {
    //               ID: {
    //                 in: query.typeEquipment,
    //               },
    //             },
    //           },
    //         }),
    //       ...(query.location && {
    //         equipment: {
    //           localizacao: {
    //             contains: query.location,
    //           },
    //         },
    //       }),
    //       ...(query.orderBound &&
    //         query.orderBound.length && {
    //           id_ordem_pai: {
    //             in: query.orderBound,
    //           },
    //         }),
    //       ...(query.comments && {
    //         observacoes: {
    //           contains: query.comments,
    //         },
    //       }),
    //       ...(query.observationsExecuting && {
    //         observacoes_executante: {
    //           contains: query.observationsExecuting,
    //         },
    //       }),
    //       ...(query.clientComments && {
    //         observacoes_cliente: {
    //           contains: query.clientComments,
    //         },
    //       }),
    //       ...(query.noteEvaluationService && {
    //         nota_avalicao_servico: {
    //           in: query.noteEvaluationService,
    //         },
    //       }),
    //       ...(query.failureStatus &&
    //         query.failureStatus.length && {
    //           failureAnalysis: {
    //             some: {
    //               failureAction: {
    //                 id: {
    //                   in: query.failureStatus,
    //                 },
    //               },
    //             },
    //           },
    //         }),
    //       ...(query.causeReason &&
    //         query.causeReason.length && {
    //           failureAnalysis: {
    //             some: {
    //               failureCause: {
    //                 id: {
    //                   in: query.causeReason,
    //                 },
    //               },
    //             },
    //           },
    //         }),
    //       ...(query.technicalActivationDate &&
    //         query.technicalActivationDate === null && {
    //           data_acionamento_tecnico: {
    //             gte: query.technicalActivationDate.from,
    //             lte: query.technicalActivationDate.to,
    //           },
    //         }),
    //       ...(query.technicianArrival &&
    //         query.technicianArrival === null && {
    //           chegada_tecnico: {
    //             gte: query.technicianArrival.from,
    //             lte: query.technicianArrival.to,
    //           },
    //         }),
    //     },
    //   );

    //   if (!response[status.id]) {
    //     response[status.id] = {
    //       total: total || 0,
    //       data: [],
    //     };
    //   }

    //   response[status.id].data.push(
    //     allOrder.map((order) => {
    //       return {
    //         id: order.ID,
    //         status: {
    //           color: status.cor,
    //           name: status.status,
    //         },
    //         codeServiceOrder: order.ordem,
    //         branchCompanyName: order.branch.filial_numero,
    //         equipment: `${order.equipment.equipamento_codigo}-${order.equipment.descricao}`,
    //         datePrev: order.data_prevista_termino,
    //         dateEmission: order.data_hora_solicitacao,
    //       };
    //     }),
    //   );
    // }

    const allItemsForCountStatus =
      await this.serviceOrderRepository.listForStatusTable(user.branches, {
        ...(query.codeServiceOrder &&
          query.codeServiceOrder.length && {
            ordem: {
              contains: query.codeServiceOrder,
            },
          }),
        ...(query.descriptionRequest &&
          query.descriptionRequest.length && {
            descricao_solicitacao: {
              contains: query.descriptionRequest,
            },
          }),
        ...(query.dateTimeRequest &&
          query.dateTimeRequest !== null && {
            data_hora_solicitacao: {
              gte: query.dateTimeRequest.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateTimeRequest.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateExpectedEnd &&
          query.dateExpectedEnd !== null && {
            data_prevista_termino: {
              gte: query.dateExpectedEnd.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateExpectedEnd.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateEmission &&
          query.dateEmission !== null && {
            log_date: {
              gte: query.dateEmission.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateEmission.to,

              //.subtract(3, 'h')
              // .toDate(),
            },
          }),
        ...(query.requester &&
          query.requester.length && {
            id_solicitante: {
              in: query.requester,
            },
          }),
        ...(query.equipment &&
          query.equipment.length && {
            equipment: {
              ID: {
                in: query.equipment,
              },
            },
          }),
        ...(query.status &&
          query.status.length && {
            statusOrderService: {
              id: {
                in: query.status.map(Number),
              },
            },
          }),
        ...(query.statusOS && query.statusOS.length
          ? query.statusOS === 'expectedToday'
            ? {
                data_prevista_termino: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : query.statusOS === 'finishToday'
            ? {
                data_hora_encerramento: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
              }
            : query.statusOS === 'finish'
            ? {
                data_hora_encerramento: {
                  not: null,
                },
              }
            : query.statusOS === 'late'
            ? {
                data_prevista_termino: {
                  lte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : {
                statusOrderService: {
                  id: {
                    in: query.statusOS.split(',').map(Number),
                  },
                },
              }
          : {}),
        ...(query.branch &&
          query.branch.length && {
            branch: {
              ID: {
                in: query.branch,
              },
            },
          }),
        ...(query.family &&
          query.family.length && {
            equipment: {
              family: {
                ID: {
                  in: query.family,
                },
              },
            },
          }),
        ...(query.typeEquipment &&
          query.typeEquipment.length && {
            equipment: {
              typeEquipment: {
                ID: {
                  in: query.typeEquipment,
                },
              },
            },
          }),
        ...(query.location && {
          equipment: {
            localizacao: {
              contains: query.location,
            },
          },
        }),
        ...(query.orderBound &&
          query.orderBound.length && {
            id_ordem_pai: {
              in: query.orderBound,
            },
          }),
        ...(query.comments && {
          observacoes: {
            contains: query.comments,
          },
        }),
        ...(query.observationsExecuting && {
          observacoes_executante: {
            contains: query.observationsExecuting,
          },
        }),
        ...(query.clientComments && {
          observacoes_cliente: {
            contains: query.clientComments,
          },
        }),
        ...(query.noteEvaluationService && {
          nota_avalicao_servico: {
            in: query.noteEvaluationService,
          },
        }),
        ...(query.failureStatus &&
          query.failureStatus.length && {
            failureAnalysis: {
              some: {
                failureAction: {
                  id: {
                    in: query.failureStatus,
                  },
                },
              },
            },
          }),
        ...(query.causeReason &&
          query.causeReason.length && {
            failureAnalysis: {
              some: {
                failureCause: {
                  id: {
                    in: query.causeReason,
                  },
                },
              },
            },
          }),
        ...(query.technicalActivationDate &&
          query.technicalActivationDate === null && {
            data_acionamento_tecnico: {
              gte: query.technicalActivationDate.from,
              lte: query.technicalActivationDate.to,
            },
          }),
        ...(query.technicianArrival &&
          query.technicianArrival === null && {
            chegada_tecnico: {
              gte: query.technicianArrival.from,
              lte: query.technicianArrival.to,
            },
          }),
      });

    const filterStatus = [];

    filterStatus.push(
      {
        id: 'expectedToday',
        name: 'Previsto Hoje',
        color: '#00FFFF',
        count: 0,
      },
      {
        id: 'finishToday',
        name: 'Finalizado Hoje',
        color: '#22c55e',
        count: 0,
      },
      {
        id: 'finish',
        name: 'Finalizado',
        color: '#010eFF',
        count: 0,
      },
      {
        id: 'late',
        name: 'Atrasado',
        color: '#FF5500',
        count: 0,
      },
    );

    allItemsForCountStatus.forEach((item) => {
      if (
        // end is today
        item.data_hora_encerramento === null &&
        this.dateService
          .dayjs(new Date())
          .startOf('day')
          .isSame(
            this.dateService
              .dayjsAddTree(item.data_prevista_termino)
              .startOf('day'),
            'day',
          )
      ) {
        const index = filterStatus.findIndex(
          (value) => value.id === 'expectedToday',
        );

        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'expectedToday',
            name: 'Previsto Hoje',
            color: '#00FFFF',
            count: 1,
          });
        }
      } else if (
        // finish today
        this.dateService
          .dayjs(new Date())
          .startOf('day')
          .isSame(
            this.dateService
              .dayjsAddTree(item.data_hora_encerramento)
              .startOf('day'),
            'day',
          )
      ) {
        const index = filterStatus.findIndex(
          (value) => value.id === 'finishToday',
        );

        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'finishToday',
            name: 'Finalizado Hoje',
            color: '#22c55e',
            count: 1,
          });
        }
      } else if (item.data_hora_encerramento !== null) {
        const index = filterStatus.findIndex((value) => value.id === 'finish');

        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'finish',
            name: 'Finalizado',
            color: '#010eFF',
            count: 0,
          });
        }
      } else if (
        this.dateService
          .dayjs(new Date())
          .startOf('day')
          .isAfter(
            this.dateService
              .dayjsAddTree(item.data_prevista_termino)
              .startOf('day'),
            'day',
          )
      ) {
        const index = filterStatus.findIndex((value) => value.id === 'late');
        //console.log(item)
        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'late',
            name: 'Atrasado',
            color: '#FF5500',
            count: 0,
          });
        }
      }
    });

    return {
      //response,
      filterStatus,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/kanban/:statusId')
  @ApiQuery({
    type: listServiceOrderQuerySwagger,
  })
  @ApiOkResponse({
    description: 'Success',
    type: ServiceOrderSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async kanbanByStatus(@Req() req, @Param('statusId') statusId: string) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      index: z.coerce.number().optional().default(0),
      perPage: z
        .string()
        .transform((value) => (value === 'false' ? null : Number(value)))
        .optional(),
      codeServiceOrder: z.coerce.string().optional(),
      descriptionRequest: z.coerce.string().optional(),
      dateTimeRequest: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      dateExpectedEnd: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      dateEmission: z
        //.string()
        .union([
          z
            .object({
              from: z.coerce.date().optional(),
              to: z.coerce
                .date()
                .transform((value) => {
                  value.setUTCHours(23, 59, 59, 999);
                  return value;
                })
                .optional(),
            })
            .optional(),
          z.string().optional(), // Permite que 'dateEmission' seja uma string
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      dateTimeEnd: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      requester: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      equipment: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      justification: z.coerce.string().optional(),
      status: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      statusOS: z.coerce.string().optional(),
      typeMaintenance: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      branch: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      family: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      typeEquipment: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      location: z.coerce.string().optional().nullable(),
      orderBound: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      comments: z.coerce.string().optional().nullable(),
      observationsExecuting: z.coerce.string().optional().nullable(),
      clientComments: z.coerce.string().optional().nullable(),
      noteEvaluationService: z.array(z.number()).optional().nullable(),
      hourlyCost: z.coerce.number().optional().nullable(),
      materialCost: z.coerce.number().optional().nullable(),
      totalCost: z.coerce.number().optional().nullable(),
      equipmentStop: z.coerce.boolean().optional().nullable(),
      timeEquipmentStop: z.coerce.number().optional().nullable(),
      failureStatus: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      causeReason: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      technicalActivationDate: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
      technicianArrival: z
        .union([
          z.object({
            from: z.coerce.date().optional(),
            to: z.coerce
              .date()
              .transform((value) => {
                value.setUTCHours(23, 59, 59, 999);
                return value;
              })
              .optional(),
          }),
          z.string().optional(),
        ])
        .transform((value) => {
          // Se `value` for uma string vazia ou `undefined`, retorna `null`
          return value === '' ||
            value === undefined ||
            typeof value === 'string'
            ? null
            : value;
        })
        .optional(),
    });

    const query = querySchema.parse(req.query);

    const status = await this.statusServiceOrderRepository.findById(
      Number(statusId),
    );

    if (!status) {
      throw new NotFoundException({
        message: MessageService.Status_order_service_not_found,
      });
    }

    const allOrder = await this.serviceOrderRepository.listServiceOrderByKanban(
      user.branches,
      query.index,
      query.perPage,
      {
        status_os: status.id,
        ...(query.codeServiceOrder &&
          query.codeServiceOrder.length && {
            ordem: {
              contains: query.codeServiceOrder,
            },
          }),
        ...(query.descriptionRequest &&
          query.descriptionRequest.length && {
            descricao_solicitacao: {
              contains: query.descriptionRequest,
            },
          }),
        ...(query.dateTimeRequest &&
          query.dateTimeRequest !== null && {
            data_hora_solicitacao: {
              gte: query.dateTimeRequest.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateTimeRequest.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateExpectedEnd &&
          query.dateExpectedEnd !== null && {
            data_prevista_termino: {
              gte: query.dateExpectedEnd.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateExpectedEnd.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateEmission &&
          query.dateEmission !== null && {
            log_date: {
              gte: query.dateEmission.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateEmission.to,

              //.subtract(3, 'h')
              // .toDate(),
            },
          }),
        ...(query.requester &&
          query.requester.length && {
            id_solicitante: {
              in: query.requester,
            },
          }),
        ...(query.equipment &&
          query.equipment.length && {
            equipment: {
              ID: {
                in: query.equipment,
              },
            },
          }),
        ...(query.status &&
          query.status.length && {
            statusOrderService: {
              id: {
                in: query.status.map(Number),
              },
            },
          }),
        ...(query.statusOS && query.statusOS.length
          ? query.statusOS === 'expectedToday'
            ? {
                data_prevista_termino: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : query.statusOS === 'finishToday'
            ? {
                data_hora_encerramento: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
              }
            : query.statusOS === 'finish'
            ? {
                data_hora_encerramento: {
                  not: null,
                },
              }
            : query.statusOS === 'late'
            ? {
                data_prevista_termino: {
                  lte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : {
                statusOrderService: {
                  id: {
                    in: query.statusOS.split(',').map(Number),
                  },
                },
              }
          : {}),
        ...(query.branch &&
          query.branch.length && {
            branch: {
              ID: {
                in: query.branch,
              },
            },
          }),
        ...(query.family &&
          query.family.length && {
            equipment: {
              family: {
                ID: {
                  in: query.family,
                },
              },
            },
          }),
        ...(query.typeEquipment &&
          query.typeEquipment.length && {
            equipment: {
              typeEquipment: {
                ID: {
                  in: query.typeEquipment,
                },
              },
            },
          }),
        ...(query.location && {
          equipment: {
            localizacao: {
              contains: query.location,
            },
          },
        }),
        ...(query.orderBound &&
          query.orderBound.length && {
            id_ordem_pai: {
              in: query.orderBound,
            },
          }),
        ...(query.comments && {
          observacoes: {
            contains: query.comments,
          },
        }),
        ...(query.observationsExecuting && {
          observacoes_executante: {
            contains: query.observationsExecuting,
          },
        }),
        ...(query.clientComments && {
          observacoes_cliente: {
            contains: query.clientComments,
          },
        }),
        ...(query.noteEvaluationService && {
          nota_avalicao_servico: {
            in: query.noteEvaluationService,
          },
        }),
        ...(query.failureStatus &&
          query.failureStatus.length && {
            failureAnalysis: {
              some: {
                failureAction: {
                  id: {
                    in: query.failureStatus,
                  },
                },
              },
            },
          }),
        ...(query.causeReason &&
          query.causeReason.length && {
            failureAnalysis: {
              some: {
                failureCause: {
                  id: {
                    in: query.causeReason,
                  },
                },
              },
            },
          }),
        ...(query.technicalActivationDate &&
          query.technicalActivationDate === null && {
            data_acionamento_tecnico: {
              gte: query.technicalActivationDate.from,
              lte: query.technicalActivationDate.to,
            },
          }),
        ...(query.technicianArrival &&
          query.technicianArrival === null && {
            chegada_tecnico: {
              gte: query.technicianArrival.from,
              lte: query.technicianArrival.to,
            },
          }),
      },
    );

    const total = await this.serviceOrderRepository.countListServiceOrder(
      user.branches,
      {
        status_os: status.id,
        ...(query.codeServiceOrder &&
          query.codeServiceOrder.length && {
            ordem: {
              contains: query.codeServiceOrder,
            },
          }),
        ...(query.descriptionRequest &&
          query.descriptionRequest.length && {
            descricao_solicitacao: {
              contains: query.descriptionRequest,
            },
          }),
        ...(query.dateTimeRequest &&
          query.dateTimeRequest !== null && {
            data_hora_solicitacao: {
              gte: query.dateTimeRequest.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateTimeRequest.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateExpectedEnd &&
          query.dateExpectedEnd !== null && {
            data_prevista_termino: {
              gte: query.dateExpectedEnd.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateExpectedEnd.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateEmission &&
          query.dateEmission !== null && {
            log_date: {
              gte: query.dateEmission.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateEmission.to,

              //.subtract(3, 'h')
              // .toDate(),
            },
          }),
        ...(query.requester &&
          query.requester.length && {
            id_solicitante: {
              in: query.requester,
            },
          }),
        ...(query.equipment &&
          query.equipment.length && {
            equipment: {
              ID: {
                in: query.equipment,
              },
            },
          }),
        ...(query.status &&
          query.status.length && {
            statusOrderService: {
              id: {
                in: query.status.map(Number),
              },
            },
          }),
        ...(query.statusOS && query.statusOS.length
          ? query.statusOS === 'expectedToday'
            ? {
                data_prevista_termino: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : query.statusOS === 'finishToday'
            ? {
                data_hora_encerramento: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
              }
            : query.statusOS === 'finish'
            ? {
                data_hora_encerramento: {
                  not: null,
                },
              }
            : query.statusOS === 'late'
            ? {
                data_prevista_termino: {
                  lte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : {
                statusOrderService: {
                  id: {
                    in: query.statusOS.split(',').map(Number),
                  },
                },
              }
          : {}),
        ...(query.branch &&
          query.branch.length && {
            branch: {
              ID: {
                in: query.branch,
              },
            },
          }),
        ...(query.family &&
          query.family.length && {
            equipment: {
              family: {
                ID: {
                  in: query.family,
                },
              },
            },
          }),
        ...(query.typeEquipment &&
          query.typeEquipment.length && {
            equipment: {
              typeEquipment: {
                ID: {
                  in: query.typeEquipment,
                },
              },
            },
          }),
        ...(query.location && {
          equipment: {
            localizacao: {
              contains: query.location,
            },
          },
        }),
        ...(query.orderBound &&
          query.orderBound.length && {
            id_ordem_pai: {
              in: query.orderBound,
            },
          }),
        ...(query.comments && {
          observacoes: {
            contains: query.comments,
          },
        }),
        ...(query.observationsExecuting && {
          observacoes_executante: {
            contains: query.observationsExecuting,
          },
        }),
        ...(query.clientComments && {
          observacoes_cliente: {
            contains: query.clientComments,
          },
        }),
        ...(query.noteEvaluationService && {
          nota_avalicao_servico: {
            in: query.noteEvaluationService,
          },
        }),
        ...(query.failureStatus &&
          query.failureStatus.length && {
            failureAnalysis: {
              some: {
                failureAction: {
                  id: {
                    in: query.failureStatus,
                  },
                },
              },
            },
          }),
        ...(query.causeReason &&
          query.causeReason.length && {
            failureAnalysis: {
              some: {
                failureCause: {
                  id: {
                    in: query.causeReason,
                  },
                },
              },
            },
          }),
        ...(query.technicalActivationDate &&
          query.technicalActivationDate === null && {
            data_acionamento_tecnico: {
              gte: query.technicalActivationDate.from,
              lte: query.technicalActivationDate.to,
            },
          }),
        ...(query.technicianArrival &&
          query.technicianArrival === null && {
            chegada_tecnico: {
              gte: query.technicianArrival.from,
              lte: query.technicianArrival.to,
            },
          }),
      },
    );

    const response = allOrder.map((order) => {
      return {
        id: order.ID,
        status: {
          color: status.cor,
          name: status.status,
        },
        codeServiceOrder: order.ordem,
        branchCompanyName: order.branch.filial_numero,
        equipment: `${order.equipment.equipamento_codigo}-${order.equipment.descricao}`,
        datePrev: order.data_prevista_termino,
        dateEmission: order.data_hora_solicitacao,
      };
    });

    return {
      data: response,
      totalItens: total,
      totalPage: Math.ceil(total / query.perPage),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-table/:statusId')
  @ApiQuery({
    type: listServiceOrderQuerySwagger,
  })
  @ApiOkResponse({
    description: 'Success',
    type: ServiceOrderSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async listServiceOrderByStatus(@Req() req: any) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      index: z.coerce.number().optional().default(0),
      perPage: z
        .string()
        .transform((value) => (value === 'false' ? null : Number(value)))
        .optional(),
      codeServiceOrder: z.coerce.string().optional(),
      descriptionRequest: z.coerce.string().optional(),
      dateTimeRequest: z
        .object({
          from: z.coerce.date().optional(),
          to: z.coerce
            .date()
            .transform((value) => {
              value.setUTCHours(23, 59, 59, 999);
              return value;
            })
            .optional(),
        })
        .optional(),
      dateExpectedEnd: z
        .object({
          from: z.coerce.date().optional(),
          to: z.coerce
            .date()
            .transform((value) => {
              value.setUTCHours(23, 59, 59, 999);
              return value;
            })
            .optional(),
        })
        .optional(),
      dateEmission: z
        .object({
          from: z.coerce.date().optional(),
          to: z.coerce
            .date()
            .transform((value) => {
              value.setUTCHours(23, 59, 59, 999);
              return value;
            })
            .optional(),
        })
        .optional(),
      requester: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      equipment: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      justification: z.coerce.string().optional(),
      status: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
      statusOS: z.coerce.string().optional(),
    });

    const query = querySchema.parse(req.query);

    // console.log('query => ', query);
    // console.log('req.query => ', req.query);

    // return {
    //   query,
    // };

    // console.log(query);
    // console.log(this.dateService
    //   .dayjs(new Date())
    //   .startOf('day')
    //   .subtract(3, 'h')
    //   .toDate())

    const data = await this.serviceOrderRepository.listServiceOrder(
      user.branches,
      query.perPage ? query.index : null,
      query.perPage,
      {
        ...(query.codeServiceOrder &&
          query.codeServiceOrder.length && {
            ordem: {
              contains: query.codeServiceOrder,
            },
          }),
        ...(query.descriptionRequest &&
          query.descriptionRequest.length && {
            descricao_solicitacao: {
              contains: query.descriptionRequest,
            },
          }),
        ...(query.dateTimeRequest &&
          query.dateTimeRequest !== null && {
            data_hora_solicitacao: {
              gte: query.dateTimeRequest.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateTimeRequest.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateExpectedEnd &&
          query.dateExpectedEnd !== null && {
            data_prevista_termino: {
              gte: query.dateExpectedEnd.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateExpectedEnd.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateEmission &&
          query.dateEmission !== null && {
            log_date: {
              gte: query.dateEmission.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateEmission.to,

              //.subtract(3, 'h')
              // .toDate(),
            },
          }),
        ...(query.requester &&
          query.requester.length && {
            id_solicitante: {
              in: query.requester,
            },
          }),
        ...(query.equipment &&
          query.equipment.length && {
            equipment: {
              ID: {
                in: query.equipment,
              },
            },
          }),
        ...(query.status &&
          query.status.length && {
            statusOrderService: {
              id: {
                in: query.status.map(Number),
              },
            },
          }),
        ...(query.statusOS && query.statusOS.length
          ? query.statusOS === 'expectedToday'
            ? {
                data_prevista_termino: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : query.statusOS === 'finishToday'
            ? {
                data_hora_encerramento: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
              }
            : query.statusOS === 'finish'
            ? {
                data_hora_encerramento: {
                  not: null,
                },
              }
            : query.statusOS === 'late'
            ? {
                data_prevista_termino: {
                  lte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : {
                statusOrderService: {
                  id: {
                    in: query.statusOS.split(',').map(Number),
                  },
                },
              }
          : {}),
      },
    );

    const allData = await this.serviceOrderRepository.listServiceOrder(
      user.branches,
      null,
      null,
      {
        ...(query.codeServiceOrder &&
          query.codeServiceOrder.length && {
            ordem: {
              contains: query.codeServiceOrder,
            },
          }),
        ...(query.descriptionRequest &&
          query.descriptionRequest.length && {
            descricao_solicitacao: {
              contains: query.descriptionRequest,
            },
          }),
        ...(query.dateTimeRequest &&
          query.dateTimeRequest !== null && {
            data_hora_solicitacao: {
              gte: query.dateTimeRequest.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateTimeRequest.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateExpectedEnd &&
          query.dateExpectedEnd !== null && {
            data_prevista_termino: {
              gte: query.dateExpectedEnd.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateExpectedEnd.to,
              //.subtract(3, 'h')
              //.toDate(),
            },
          }),
        ...(query.dateEmission &&
          query.dateEmission !== null && {
            log_date: {
              gte: query.dateEmission.from,
              //.startOf('D')
              //.subtract(3, 'h')
              //.toDate(),
              lte: query.dateEmission.to,

              //.subtract(3, 'h')
              // .toDate(),
            },
          }),
        ...(query.requester &&
          query.requester.length && {
            id_solicitante: {
              in: query.requester,
            },
          }),
        ...(query.equipment &&
          query.equipment.length && {
            equipment: {
              ID: {
                in: query.equipment,
              },
            },
          }),
        ...(query.status &&
          query.status.length && {
            statusOrderService: {
              id: {
                in: query.status.map(Number),
              },
            },
          }),
        ...(query.statusOS && query.statusOS.length
          ? query.statusOS === 'expectedToday'
            ? {
                data_prevista_termino: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : query.statusOS === 'finishToday'
            ? {
                data_hora_encerramento: {
                  gte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                  lte: this.dateService
                    .dayjs(new Date())
                    .endOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
              }
            : query.statusOS === 'finish'
            ? {
                data_hora_encerramento: {
                  not: null,
                },
              }
            : query.statusOS === 'late'
            ? {
                data_prevista_termino: {
                  lte: this.dateService
                    .dayjs(new Date())
                    .startOf('day')
                    .subtract(3, 'h')
                    .toDate(),
                },
                data_hora_encerramento: null,
              }
            : {
                statusOrderService: {
                  id: {
                    in: query.statusOS.split(',').map(Number),
                  },
                },
              }
          : {}),
      },
    );

    const allItemsForCountStatus =
      await this.serviceOrderRepository.listServiceOrder(
        user.branches,
        null,
        null,
        {
          ...(query.codeServiceOrder &&
            query.codeServiceOrder.length && {
              ordem: {
                contains: query.codeServiceOrder,
              },
            }),
          ...(query.descriptionRequest &&
            query.descriptionRequest.length && {
              descricao_solicitacao: {
                contains: query.descriptionRequest,
              },
            }),
          ...(query.dateTimeRequest &&
            query.dateTimeRequest !== null && {
              data_hora_solicitacao: {
                gte: query.dateTimeRequest.from,
                //.startOf('D')
                //.subtract(3, 'h')
                //.toDate(),
                lte: query.dateTimeRequest.to,
                //.subtract(3, 'h')
                //.toDate(),
              },
            }),
          ...(query.dateExpectedEnd &&
            query.dateExpectedEnd !== null && {
              data_prevista_termino: {
                gte: query.dateExpectedEnd.from,
                //.startOf('D')
                //.subtract(3, 'h')
                //.toDate(),
                lte: query.dateExpectedEnd.to,
                //.subtract(3, 'h')
                //.toDate(),
              },
            }),
          ...(query.dateEmission &&
            query.dateEmission !== null && {
              log_date: {
                gte: query.dateEmission.from,
                //.startOf('D')
                //.subtract(3, 'h')
                //.toDate(),
                lte: query.dateEmission.to,

                //.subtract(3, 'h')
                // .toDate(),
              },
            }),
          ...(query.requester &&
            query.requester.length && {
              id_solicitante: {
                in: query.requester,
              },
            }),
          ...(query.equipment &&
            query.equipment.length && {
              equipment: {
                ID: {
                  in: query.equipment,
                },
              },
            }),
          ...(query.status &&
            query.status.length && {
              statusOrderService: {
                id: {
                  in: query.status.map(Number),
                },
              },
            }),
          ...(query.statusOS && query.statusOS.length
            ? query.statusOS === 'expectedToday'
              ? {
                  data_prevista_termino: {
                    gte: this.dateService
                      .dayjs(new Date())
                      .startOf('day')
                      .subtract(3, 'h')
                      .toDate(),
                    lte: this.dateService
                      .dayjs(new Date())
                      .endOf('day')
                      .subtract(3, 'h')
                      .toDate(),
                  },
                  data_hora_encerramento: null,
                }
              : query.statusOS === 'finishToday'
              ? {
                  data_hora_encerramento: {
                    gte: this.dateService
                      .dayjs(new Date())
                      .startOf('day')
                      .subtract(3, 'h')
                      .toDate(),
                    lte: this.dateService
                      .dayjs(new Date())
                      .endOf('day')
                      .subtract(3, 'h')
                      .toDate(),
                  },
                }
              : query.statusOS === 'finish'
              ? {
                  data_hora_encerramento: {
                    not: null,
                  },
                }
              : query.statusOS === 'late'
              ? {
                  data_prevista_termino: {
                    lte: this.dateService
                      .dayjs(new Date())
                      .startOf('day')
                      .subtract(3, 'h')
                      .toDate(),
                  },
                  data_hora_encerramento: null,
                }
              : {
                  statusOrderService: {
                    id: {
                      in: query.statusOS.split(',').map(Number),
                    },
                  },
                }
            : {}),
        },
      );

    const filterStatus = [];

    filterStatus.push(
      {
        id: 'expectedToday',
        name: 'Previsto Hoje',
        color: '#00FFFF',
        count: 0,
      },
      {
        id: 'finishToday',
        name: 'Finalizado Hoje',
        color: '#22c55e',
        count: 0,
      },
      {
        id: 'finish',
        name: 'Finalizado',
        color: '#010eFF',
        count: 0,
      },
      {
        id: 'late',
        name: 'Atrasado',
        color: '#FF5500',
        count: 0,
      },
    );

    allItemsForCountStatus.forEach((item) => {
      if (
        // end is today
        item.data_hora_encerramento === null &&
        this.dateService
          .dayjs(new Date())
          .startOf('day')
          .isSame(
            this.dateService
              .dayjsAddTree(item.data_prevista_termino)
              .startOf('day'),
            'day',
          )
      ) {
        const index = filterStatus.findIndex(
          (value) => value.id === 'expectedToday',
        );

        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'expectedToday',
            name: 'Previsto Hoje',
            color: '#00FFFF',
            count: 1,
          });
        }
      } else if (
        // finish today
        this.dateService
          .dayjs(new Date())
          .startOf('day')
          .isSame(
            this.dateService
              .dayjsAddTree(item.data_hora_encerramento)
              .startOf('day'),
            'day',
          )
      ) {
        const index = filterStatus.findIndex(
          (value) => value.id === 'finishToday',
        );

        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'finishToday',
            name: 'Finalizado Hoje',
            color: '#22c55e',
            count: 1,
          });
        }
      } else if (item.data_hora_encerramento !== null) {
        const index = filterStatus.findIndex((value) => value.id === 'finish');

        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'finish',
            name: 'Finalizado',
            color: '#010eFF',
            count: 0,
          });
        }
      } else if (
        this.dateService
          .dayjs(new Date())
          .startOf('day')
          .isAfter(
            this.dateService
              .dayjsAddTree(item.data_prevista_termino)
              .startOf('day'),
            'day',
          )
      ) {
        const index = filterStatus.findIndex((value) => value.id === 'late');
        //console.log(item)
        if (index >= 0) {
          filterStatus[index].count++;
        } else {
          filterStatus.push({
            id: 'late',
            name: 'Atrasado',
            color: '#FF5500',
            count: 0,
          });
        }
      }
    });

    const dateService = new DateService();
    const response = data.map((obj) => {
      const newObj = setMapper(obj, ServiceOrderMapper);

      //console.log(obj);

      const serviceOrderInfo = {
        equipment: `${obj.equipment.equipamento_codigo} - ${obj.equipment.descricao}`,
        openTime: dateService.serviceOrderOpenTimeDisplay(
          obj.data_hora_solicitacao,
          obj.fechada,
          obj.data_hora_encerramento,
          obj.data_prevista_termino,
        ),
        datePrev: dateService.serviceOrderOpenTimeDisplay(
          obj.data_hora_solicitacao,
          obj.fechada,
          obj.data_hora_encerramento,
          obj.data_prevista_termino,
        ),
        justification: obj.justifyStatus.length
          ? obj.justifyStatus[obj.justifyStatus.length - 1].justificativa
          : null,
        status: {
          value: obj.statusOrderService.id,
          label: obj.statusOrderService.status,
          color: obj.statusOrderService.cor,
          hasFinished: obj.statusOrderService.finalizacao === 1,
          hasJustify: obj.statusOrderService.requer_justificativa === 'S',
        },
        dateEmissionTimestamp: obj.log_date_timestamp
          ? obj.log_date_timestamp
          : obj.log_date,
        dateTimeRequestTimestamp: obj.data_hora_solicitacao_timestamp
          ? obj.data_hora_solicitacao_timestamp
          : obj.data_hora_solicitacao,
        typeMaintenance: obj.typeMaintenance
          ? {
              id: obj.typeMaintenance.ID,
              label: obj.typeMaintenance.tipo_manutencao,
              typeMaintenance: obj.typeMaintenance.tipo_manutencao,
            }
          : null,
        //status: obj.statusOrderService.status,
      };

      return {
        ...newObj,
        ...serviceOrderInfo,
      };
    });

    return {
      rows: response,
      pageCount: allData.length,
      filterStatus,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  @ApiOkResponse({
    description: 'Success',
    type: GetServiceOrderSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async serviceOrderById(@Req() req, @Param('id') id: string) {
    const user: IUserInfo = req.user;

    const obj = await this.serviceOrderRepository.serviceOrderById(Number(id));

    //console.log(obj);
    //
    if (!obj) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const paramsClose =
      await this.controlClosedOrderServiceRepository.findByClient(
        user.clientId,
      );

    const newObj = setMapper(obj, ServiceOrderMapper);

    const serviceOrderInfo = {
      machineStop: obj?.maquina_parada === 1,
      branch: obj.branch
        ? {
            id: obj.branch.ID,
            label: `${obj.branch.razao_social} - ${obj.branch.filial_numero}`,
            numberBranch: obj.branch.filial_numero,
            name: obj.branch.razao_social,
          }
        : null,
      equipment: obj.equipment
        ? {
            id: obj.equipment.ID,
            label: `${obj.equipment.equipamento_codigo} - ${obj.equipment.descricao}`,
            code: obj.equipment.equipamento_codigo,
            description: obj.equipment.descricao,
            numberSerie: obj.equipment.n_serie,
            hasPeriod: obj.equipment.registerEquipmentAction
              ? obj.equipment.registerEquipmentAction.turno
              : false,
            hasMileage: obj.equipment.registerEquipmentAction
              ? obj.equipment.registerEquipmentAction.quilometragem
              : false,
            hasHourMeter: obj.equipment.registerEquipmentAction
              ? obj.equipment.registerEquipmentAction.horimetro
              : false,
            mileage: obj.equipment.registerEquipment
              ? obj.equipment.registerEquipment.quilometragem
              : null,
            hourMeter: obj.equipment.registerEquipment
              ? obj.equipment.registerEquipment.horimetro
              : null,
          }
        : null,
      typeMaintenance: obj.typeMaintenance
        ? {
            id: obj.typeMaintenance.ID,
            label: obj.typeMaintenance.tipo_manutencao,
            typeMaintenance: obj.typeMaintenance.tipo_manutencao,
          }
        : null,
      sectorExecutor: obj.sectorExecutor
        ? {
            id: obj.sectorExecutor.Id,
            label: obj.sectorExecutor.descricao,
            description: obj.sectorExecutor.descricao,
          }
        : null,
      dateEmissionTimestamp: obj.log_date_timestamp
        ? this.dateService
            .dayjsAddTree(this.dateService.toMills(obj.log_date_timestamp))
            .format('DD-MM-YYYY HH:mm:ss')
        : obj.log_date,
      dateTimeRequestTimestamp: obj.data_hora_solicitacao_timestamp
        ? this.dateService
            .dayjsAddTree(
              this.dateService.toMills(obj.data_hora_solicitacao_timestamp),
            )
            .format('DD-MM-YYYY HH:mm:ss')
        : obj.data_hora_solicitacao,
      dateEquipmentStop:
        obj.noteStop.length > 0 ? obj.noteStop[0].data_hora_stop : null,
      dateEquipmentWorked:
        obj.noteStop.length > 0
          ? obj.noteStop[obj.noteStop.length - 1].data_hora_start
          : null,
      noteStop: obj.noteStop.length > 0 ? 'complete' : 'empty',
      note: obj.note.length > 0 ? 'complete' : 'empty',
      requiredNote: paramsClose ? paramsClose.apontamento === 1 : null,
      requiredNoteStop: paramsClose
        ? paramsClose.apontamento_parada === 1
        : null,
      justify:
        obj.justifyStatus.length > 0
          ? {
              value: obj.justifyStatus[obj.justifyStatus.length - 1].id,
              text: obj.justifyStatus[obj.justifyStatus.length - 1]
                .justificativa,
            }
          : null,
    };

    const response = {
      ...newObj,
      ...serviceOrderInfo,
    };

    // console.log('log_date => ', response.dateEmission);

    // console.log(
    //   'log_date milissegundos => ',
    //   this.dateService.toMills(response.dateEmissionTimestamp),
    // );

    // console.log(
    //   'log_date convertido novamente => ',
    //   this.dateService
    //     .dayjsAddTree(this.dateService.toMills(response.dateEmissionTimestamp))
    //     .format('DD-MM-YYYY HH:mm:ss'),
    // );

    // console.log('data_hora_solicitacao => ', response.dateTimeRequest);

    // console.log(
    //   'data_hora_solicitacao milissegundos => ',
    //   this.dateService.toMills(response.dateTimeRequestTimestamp),
    // );

    // console.log(
    //   'data_hora_solicitacao convertido => ',
    //   this.dateService
    //     .dayjsAddTree(
    //       this.dateService.toMills(response.dateTimeRequestTimestamp),
    //     )
    //     .format('DD-MM-YYYY HH:mm:ss'),
    // );

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async updateServiceOrder(
    @Req() req,
    @Param('id') id: string,
    @Body() body: ServiceOrderBody,
  ) {
    const user: IUserInfo = req.user;
    const company = await this.companyRepository.findById(user.clientId);

    if (!company) {
      throw new NotFoundException(MessageService.Company_not_found);
    }

    const branch = await this.branchRepository.findById(Number(body.idBranch));

    if (!branch) {
      throw new NotFoundException(MessageService.Branch_not_found);
    }

    const serviceOrder = await this.serviceOrderRepository.findById(Number(id));

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const requester = await this.maintenanceRequesterRepository.findById(
      body.idRequester,
    );

    // if (!requester) {
    //   throw new NotFoundException(MessageService.Requester_id_not_found);
    // }

    const equipment = await this.equipmentRepository.findById(body.idEquipment);

    body.machineStop = body.machineStop ? 1 : 0;
    if (body.maintainers && Array.isArray(body.maintainers)) {
      body.maintainers = body.maintainers;
    }
    //console.log('antes body =>', body);
    const fields_permission = [
      'dateTimeRequest',
      'idServiceOrderFather',
      'idBranch',
      'idEquipment',
      'idProgram',
      'idSchedule',
      'idMaintenancePlan',
      'idPlanningMaintenance',
      'idCostCenter',
      'idBuilding',
      'idSector',
      'idDepartment',
      'idFamilyEquipment',
      'idTypeEquipment',
      'idRequester',
      'LinkServiceOrder',
      'branch',
      'building',
      'sector',
      'department',
      'familyEquipment',
      'typeEquipment',
      'equipment',
      'model',
      'descriptionRequest',
      'descriptionServicePerformed',
      'comments',
      'observationsExecutor',
      'idTypeMaintenance',
      'idTpmTAG',
      'codeTag',
      'idStatusServiceOrder',
      'returnCheckList',
      'closed',
      'statusEquipment',
      'statusSchedule',
      'statusExecutante',
      'dateExpectedEnd',
      'dateStart',
      'dateEnd',
      'emission',
      'idSubGroup',
      'idSectorExecutor',
      'maintainers',
      'hourPrev',
      'hourReal',
      'costPredicted',
      'costHours',
      'costMaterial',
      'costReleased',
      'timeMachineStop',
      'dueDate',
      'imageExpiration',
      'location',
      'codePlanoMaintenance',
      'idSession',
      'hourWorkLoad',
      'workScale',
      'startOperation',
      'TerminoFuncionamento',
      'clientComments',
      'noteEvaluationService',
      'idProject',
      'idActionPlan',
      'machineStop',
      'hourMeter',
      'odometer',
      'countPrint',
      'priority',
      'classification',
      'dateEquipmentStop',
      'dateTechnicalActivation',
      'arrivalTechnician',
      'dateEquipmentWorked',
      'occurrence',
      'causeReason',
      'statusFailure',
      'servicePending',
      'hasAttachment',
      'idServiceRequest',
      'idProductionRegistration',
      'aux',
      'justify',
    ];

    removeExtraFields(body, fields_permission);
    body['username'] = user && user.login;
    body['idClient'] = user && user.clientId;
    //body['requester'] = requester.nome;
    body['idFamilyEquipment'] = equipment.family.ID;

    // const dataMapper = unSetMapper(
    //   body,
    //   ServiceOrderMapper,
    // ) as Prisma.controle_de_ordens_de_servicoUncheckedUpdateInput;
    //return dataMapper;
    const status = await this.statusServiceOrderRepository.findById(
      body.idStatusServiceOrder,
    );

    if (!status) {
      throw new NotFoundException(
        MessageService.Status_order_service_not_found,
      );
    }

    if (status.finalizacao === 1 && body.dateEnd === null) {
      throw new BadRequestException(
        MessageService.Cannot_end_service_order_without_end_date,
      );
    }

    const noteStop =
      await this.noteStopServiceOrderRepository.listByServiceOrder(
        serviceOrder.ID,
      );

    const allMaterialServiceOrder =
      await this.materialServiceOrderRepository.listByServiceOrder(
        serviceOrder.ID,
      );

    if (
      status.finalizacao === 1 &&
      (allMaterialServiceOrder.some((material) => material.data_uso === null) ||
        noteStop.some((note) => note.data_hora_start === null))
    ) {
      throw new BadRequestException(
        MessageService.Service_order_cannot_be_updated_until_all_materials_and_notes_are_completed,
      );
    }

    if (
      (body.dateEquipmentStop || body.dateEquipmentWorked) &&
      noteStop.length === 0
    ) {
      await this.noteStopServiceOrderRepository.create({
        data_hora_start: body.dateEquipmentWorked,
        data_hora_stop: body.dateEquipmentStop,
        id_ordem_servico: serviceOrder.ID,
        log_user: user.login,
      });
    }

    if (status.id !== serviceOrder.status_os) {
      if (status.requer_justificativa === 'S' && !body.justify) {
        throw new BadRequestException(
          MessageService.Service_order_justification_is_required,
        );
      } else if (
        status.requer_justificativa === 'S' &&
        body.justify.trim() === ''
      ) {
        throw new BadRequestException(
          MessageService.Service_order_justification_is_required,
        );
      }
    }

    try {
      const updateServiceOrder = await this.serviceOrderRepository.update(
        Number(id),
        //dataMapper,
        {
          ID_filial: branch.ID,
          id_equipamento: equipment.ID,
          tipo_manutencao:
            serviceOrder.typeMaintenance && serviceOrder.typeMaintenance.ID,
          horimetro: body.hourMeter,
          odometro: body.odometer,
          descricao_solicitacao: body.descriptionRequest,
          observacoes: body.comments,
          observacoes_executante: body.observationsExecutor,
          status_os: body.idStatusServiceOrder,
          data_hora_solicitacao: body.dateTimeRequest,
          data_equipamento_parou: body.dateEquipmentStop,
          data_prevista_termino: body.dateExpectedEnd,
          data_equipamento_funcionou: body?.dateEquipmentWorked || null,
          maquina_parada: body.machineStop,
          id_solicitante: requester?.id || null,
          setor_executante: body.idSectorExecutor,
          mantenedores: body?.maintainers?.join(',') || null,
          descricao_servico_realizado: body.descriptionServicePerformed,
          solicitante: requester?.nome || null,
          prioridade: body.priority,
          created_at: new Date(),
          data_hora_encerramento: body.dateEnd,
          ...(body.maintainers && {
            maintainers: {
              deleteMany: serviceOrder.maintainers
                .filter((value) =>
                  body.maintainers.every(
                    (item) => Number(item) !== value.id_colaborador,
                  ),
                )
                .map((value) => {
                  return {
                    id: value.id,
                  };
                }),
              upsert: body.maintainers.map((maintainer) => {
                return {
                  create: {
                    id_colaborador: Number(maintainer),
                  },
                  update: {},
                  where: {
                    id_ordem_servico_id_colaborador: {
                      id_colaborador: Number(maintainer),
                      id_ordem_servico: Number(id),
                    },
                  },
                };
              }),
            },
          }),
          ...(serviceOrder.status_os !== status.id &&
          status.requer_justificativa === 'S'
            ? {
                justifyStatus: {
                  create: {
                    id_status_antigo: serviceOrder.status_os,
                    id_status_novo: status.id,
                    justificativa: body.justify,
                    login: user.login,
                  },
                },
              }
            : body.justify && body.justify.length > 0
            ? {
                justifyStatus: {
                  update: {
                    data: {
                      justificativa: body.justify,
                    },
                    where: {
                      id: serviceOrder.justifyStatus[
                        serviceOrder.justifyStatus.length - 1
                      ].id,
                    },
                  },
                },
              }
            : {}),
        },
      );

      const newLogMaintainer =
        await this.logServiceOrderMaintainer.listByMaintainerAndOrders(
          [equipment.branch.ID],
          {
            id_ordem_servico: Number(id),
            log_date: {
              gte: this.dateService.dayjs(new Date()).subtract(1, 'h').toDate(),
            },
          },
        );

      for await (const logMaintainer of newLogMaintainer) {
        await this.logServiceOrderMaintainer.update(logMaintainer.id, {
          log_date: new Date(),
        });
      }

      const objMapper = setMapper(updateServiceOrder, ServiceOrderMapper);

      return {
        updated: true,
        data: objMapper,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id/info-status')
  async listStatusInServiceOrder(@Param('id') id: string) {
    const serviceOrder = await this.serviceOrderRepository.findById(Number(id));

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const status = serviceOrder.justifyStatus.map((value) => {
      return {
        id: value.id,
        status: value.status_new_service_order.status,
        justify: value.justificativa,
        logDate: value.log_date,
      };
    });

    return {
      data: status,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/info-status/:justifyId')
  async updateJustifyStatus(
    @Param('justifyId') id: string,
    @Body() body: UpdateJustifyStatusBody,
  ) {
    const justifyServiceOrder =
      await this.justifyStatusServiceOrderRepository.findById(Number(id));

    if (!justifyServiceOrder) {
      throw new NotFoundException(MessageService.Justify_status_id_not_found);
    }

    await this.justifyStatusServiceOrderRepository.update(
      justifyServiceOrder.id,
      {
        id_status_novo: body.statusId,
        justificativa: body.justification,
      },
    );

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id/status')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async updateServiceOrderStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateServiceOrderStatusBody,
  ) {
    try {
      const user: IUserInfo = req.user;

      const serviceOrder = await this.serviceOrderRepository.findById(
        Number(id),
      );

      if (!serviceOrder) {
        throw new NotFoundException(MessageService.Service_order_id_not_found);
      }

      const status = await this.statusServiceOrderRepository.findById(
        body.idStatusServiceOrder,
      );

      if (!status) {
        throw new NotFoundException(
          MessageService.Status_order_service_not_found,
        );
      }

      await this.serviceOrderRepository.update(Number(id), {
        status_os: status.id,
        ...(status.finalizacao &&
          status.finalizacao === 1 && {
            data_hora_encerramento: this.dateService
              .dayjs(body.dateEnd)
              .toDate(),
          }),
        ...(status.requer_justificativa === 'S' && {
          justifyStatus: {
            create: {
              id_status_antigo: serviceOrder.status_os,
              id_status_novo: status.id,
              justificativa: body.justify,
              login: user.login,
            },
          },
        }),
      });

      return {
        updated: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async deleteServiceOrder(@Req() req, @Param('id') id: string) {
    const serviceOrder = await this.serviceOrderRepository.findById(Number(id));

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      await this.serviceOrderRepository.delete(Number(id));
    } catch (error) {
      throw new BadRequestException(error);
    }

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/control-stock')
  async controlStock(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
  ) {
    const user: IUserInfo = req.user;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const allControl =
      await this.maintenanceControlStockRepository.listByClient(user.clientId);

    const response = {
      control: false,
    };

    console.log(allControl);
    if (allControl.length === 0) {
      response.control = false;
    } else if (allControl.every((value) => value.id_filial === null)) {
      console.log('entrou no primeiro if');
      response.control = allControl[0].controlar === 1;
    } else if (
      allControl.find((value) => value.id_filial === serviceOrder.ID)
    ) {
      console.log('entrou no segundo if');
      const control = allControl.find(
        (value) => value.id_filial === serviceOrder.ID,
      );
      response.control = control.controlar === 1;
    }

    return response;
  }

  @UseGuards(AuthGuard)
  @Get(':id_service_order/note')
  @ApiOkResponse({
    description: 'Success',
    type: NoteServiceOrderSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async listNoteServiceOrder(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Query() query,
  ) {
    const user: IUserInfo = req.user;
    const mapper = NoteServiceOrderMapper;
    let { fields } = query;

    let filters = querySearchParam(query);
    filters['idServiceOrder'] = Number(id_service_order);
    filters = unSetMapper(filters, mapper);

    fields = getArrayMapper(fields, mapper);

    const data = await this.noteServiceOrderRepository.listByClient(
      user.clientId,
      filters,
      fields,
    );

    //console.log(data);

    const response = data.map((obj) => {
      const objMapper = setMapper(obj, mapper);
      objMapper.realTime = objMapper.realTime && Number(objMapper.realTime);

      //TODO: verificar apos remoção do script-case e regra dos banco de validação de data no banco de dados
      objMapper.date = this.dateService
        .dayjs(objMapper.date)
        .format('YYYY-MM-DD');
      objMapper.dateStartHour = this.dateService
        .dayjs(objMapper.dateStartHour)
        .toDate();

      //objMapper.dateStartHourTimestamp = obj.data_hora_inicio_timestamp;

      objMapper.dateEndHour = this.dateService
        .dayjs(objMapper.dateEndHour)
        .toDate();

      //objMapper.dateEndHourTimestamp = obj.data_hora_termino_timestamp;
      return objMapper;
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id_service_order/note')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async createNoteServiceOrder(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Body() body: NoteServiceOrderBody,
  ) {
    const user: IUserInfo = req.user;
    const mapper = NoteServiceOrderMapper;
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }
    const yearCurrent = new Date().getFullYear();

    const yearEquipmentStop =
      serviceOrder.data_equipamento_parou instanceof Date &&
      serviceOrder.data_equipamento_parou.getFullYear();

    if (yearEquipmentStop && yearEquipmentStop < yearCurrent - 1) {
      throw new BadRequestException(
        MessageService.Note_year_limit_low_service_year,
      );
    }

    const company = await this.companyRepository.findById(user.clientId);

    if (!company) {
      throw new NotFoundException(MessageService.Company_not_found);
    }

    const fields_permission = [
      'description',
      'comments',
      'tasks',
      'date',
      'dateStartHour',
      'dateEndHour',
      'typeMaintenance',
      'idStatusServiceOrder',
      'idEmployee',
      'aux',
    ];

    //TODO: Remover assim que regra do de validação do banco for desativada
    // body.dateStartHour =
    //   body.dateStartHour &&
    //   this.dateService
    //     .dayjsSubTree(
    //       this.dateService.dayjsSubTree(body.dateStartHour).toDate(),
    //     )
    //     .toDate();
    // body.dateEndHour =
    //   body.dateEndHour &&
    //   this.dateService
    //     .dayjsSubTree(this.dateService.dayjsSubTree(body.dateEndHour).toDate())
    //     .toDate();
    //console.log('antes => ', body);
    body.dateStartHour =
      body.dateStartHour &&
      this.dateService
        .dayjs(body.dateStartHour)
        .set('year', this.dateService.dayjs(body.date).year())
        .set('month', this.dateService.dayjs(body.date).month())
        .set('date', this.dateService.dayjs(body.date).date())
        .toDate();
    body.dateEndHour =
      body.dateEndHour &&
      this.dateService
        .dayjs(body.dateEndHour)
        .set('year', this.dateService.dayjs(body.date).year())
        .set('month', this.dateService.dayjs(body.date).month())
        .set('date', this.dateService.dayjs(body.date).date())
        .toDate();

    body.date = body.date && this.dateService.dayjs(body.date).toDate();

    //console.log('depois => ', body);

    // console.log(
    //   'dateStartHour => ',
    //   this.dateService.dayjs(body.dateStartHour),
    // );
    //
    // console.log('dateEndHour => ', this.dateService.dayjs(body.dateEndHour));
    // console.log('date => ', this.dateService.dayjs(body.date));
    // console.log('new Date => ', new Date());
    // console.log(
    //   'valid some => ',
    //   this.dateService.dayjs(body.date).isSame(new Date(), 'day'),
    // );

    if (
      this.dateService.dayjs(body.date).isSame(new Date(), 'day') &&
      (this.dateService
        .dayjsSubTree(body.dateStartHour)
        .isAfter(this.dateService.dayjs(new Date())) ||
        this.dateService
          .dayjsSubTree(body.dateEndHour)
          .isAfter(this.dateService.dayjs(new Date())))
    ) {
      throw new ConflictException(MessageService.Note_conflict_hour);
    }

    removeExtraFields(body, fields_permission);
    body['dateEmission'] = new Date();
    body['dateStartHourTimestamp'] = this.dateService.toMills(
      body.dateStartHour,
    );
    body['dateEndHourTimestamp'] = this.dateService.toMills(body.dateEndHour);
    body['username'] = user && user.login;
    body['idServiceOrder'] = Number(id_service_order);
    body['username'] = user && req.user.login;
    body['idClient'] = user && user.clientId;
    body['idBranch'] = serviceOrder.branch.ID;
    body['idEquipment'] = serviceOrder.equipment.ID;

    const dataMapper = unSetMapper(
      body,
      mapper,
    ) as Prisma.sofman_apontamento_osUncheckedCreateInput;

    //return dataMapper;

    try {
      const newNote = await this.noteServiceOrderRepository.create(dataMapper);
      const mapperNewObj = setMapper(newNote, mapper);
      return {
        inserted: true,
        data: mapperNewObj,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/note/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async getNote(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const mapper = NoteServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      const obj = await this.noteServiceOrderRepository.findById(Number(id));

      const response = setMapper(obj, mapper);
      response.realTime = response.realTime && Number(response.realTime);

      //TODO: Remover assim que regra do de validação do banco for desativada
      response.date = this.dateService
        .dayjs(response.date)
        .format('yyyy-mm-DD');
      response.dateStartHour =
        response.dateStartHour &&
        this.dateService.dayjsAddTree(response.dateStartHour).toDate();
      response.dateEndHour =
        response.dateEndHour &&
        this.dateService.dayjsAddTree(response.dateEndHour).toDate();

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id_service_order/note/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async updateNote(
    @Req() req,
    @Param('id') id: string,
    @Param('id_service_order') id_service_order: string,
    @Body() body: NoteServiceOrderBody,
  ) {
    const user: IUserInfo = req.user;
    const mapper = NoteServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }
    const yearCurrent = new Date().getFullYear();
    const yearEquipmentStop =
      serviceOrder.data_equipamento_parou instanceof Date &&
      serviceOrder.data_equipamento_parou.getFullYear();

    if (yearEquipmentStop && yearEquipmentStop < yearCurrent - 1) {
      throw new BadRequestException(
        MessageService.Note_year_limit_low_service_year,
      );
    }

    const obj = await this.noteServiceOrderRepository.findById(Number(id));
    if (!obj) {
      throw new BadRequestException(MessageService.Note_id_not_found);
    }

    //TODO: Remover assim que regra do de validação do banco for desativada
    body.dateStartHour =
      body.dateStartHour && this.dateService.dayjs(body.dateStartHour).toDate();
    body.dateEndHour =
      body.dateEndHour && this.dateService.dayjs(body.dateEndHour).toDate();

    const fields_permission = [
      'description',
      'comments',
      'tasks',
      'date',
      'dateStartHour',
      'dateEndHour',
      'typeMaintenance',
      'idStatusServiceOrder',
      'idEmployee',
      'aux',
    ];

    removeExtraFields(body, fields_permission);
    body['username'] = user && user.login;
    body['idServiceOrder'] = Number(id_service_order);
    body['idClient'] = user && user.clientId;
    body['idBranch'] = serviceOrder.branch.ID;
    body['idEquipment'] = serviceOrder.equipment.ID;

    const dataMapper = unSetMapper(
      body,
      mapper,
    ) as Prisma.sofman_apontamento_osUncheckedUpdateInput;

    try {
      const updateObj = await this.noteServiceOrderRepository.update(
        Number(id),
        dataMapper,
      );

      const mapperNewObj = setMapper(updateObj, mapper);

      return {
        updated: true,
        data: mapperNewObj,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id_service_order/note/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async deleteNode(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      await this.noteServiceOrderRepository.delete(Number(id));

      return {
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/note-stop/')
  @ApiOkResponse({
    description: 'Success',
    type: NoteStopServiceOrderSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async listNoteStopServiceOrder(
    @Param('id_service_order') id_service_order: string,
    @Query() query,
  ) {
    const mapper = NoteStopServiceOrderMapper;
    let { fields } = query;

    let filters = querySearchParam(query);
    filters = unSetMapper(filters, mapper);

    fields = getArrayMapper(fields, mapper);

    const data = await this.noteStopServiceOrderRepository.listByServiceOrder(
      Number(id_service_order),
      filters,
      fields,
    );

    const response = data.map((obj) => {
      const newObj = setMapper(obj, mapper);
      return newObj;
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id_service_order/note-stop')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async createNoteStop(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Body() body: NoteStopServiceOrderBody,
  ) {
    const user: IUserInfo = req.user;
    const mapper = NoteStopServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }
    const yearCurrent = new Date().getFullYear();
    const yearEquipmentStop =
      serviceOrder.data_equipamento_parou instanceof Date &&
      serviceOrder.data_equipamento_parou.getFullYear();

    if (yearEquipmentStop && yearEquipmentStop < yearCurrent - 1) {
      throw new BadRequestException(
        MessageService.Note_year_limit_low_service_year,
      );
    }

    const dateStart = new Date(body.dateStartHour);
    const dateEnd = new Date(body.dateEndHour);
    const dateNow = new Date();

    if (dateEnd > dateStart) {
      throw new BadRequestException(
        MessageService.Note_start_hour_less_than_end_hour,
      );
    }

    if ((dateEnd || dateStart) > dateNow) {
      throw new BadRequestException(
        MessageService.Note_start_or_end_up_current_hour,
      );
    }

    //TODO: Remover assim que regra do de validação do banco for desativada
    body.dateStartHour = body.dateStartHour;
    // &&
    // this.dateService
    //   .dayjsSubTree(
    //     this.dateService.dayjsSubTree(body.dateStartHour).toDate(),
    //   )
    //   .toDate();
    body.dateEndHour = body.dateEndHour;
    // &&
    // this.dateService
    //   .dayjsSubTree(this.dateService.dayjsSubTree(body.dateEndHour).toDate())
    //   .toDate();

    if (body.dateStartHour) {
      const dateStart = new Date(body.dateStartHour).getFullYear();
      if (dateStart < yearCurrent - 1) {
        throw new BadRequestException(
          MessageService.Note_year_limit_low_service_year,
        );
      }
    }
    if (body.dateEndHour) {
      const dateEnd = new Date(body.dateEndHour).getFullYear();
      if (dateEnd < yearCurrent - 1) {
        throw new BadRequestException(
          MessageService.Note_year_limit_low_service_year,
        );
      }
    }

    const fields_permission = [
      'idSectorExecutor',
      'idCause',
      'dateEndHour',
      'dateStartHour',
      'comments',
      'entrance',
    ];

    removeExtraFields(body, fields_permission);

    body['username'] = user && req.user.login;
    body['idServiceOrder'] = Number(id_service_order);
    body['dateEmission'] = new Date();
    body['idEquipment'] = serviceOrder.equipment.ID;

    const dataMapper = unSetMapper(
      body,
      mapper,
    ) as Prisma.sofman_apontamento_paradasUncheckedCreateInput;

    try {
      const newNote =
        await this.noteStopServiceOrderRepository.create(dataMapper);

      const mapperNewObj = setMapper(newNote, mapper);
      return {
        inserted: true,
        data: mapperNewObj,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/note-stop/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async getNoteStop(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const mapper = NoteStopServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      const obj = await this.noteStopServiceOrderRepository.findById(
        Number(id),
      );

      const response = setMapper(obj, mapper);
      response.dateStartHour =
        response.dateStartHour &&
        this.dateService
          .dayjsAddTree(response.dateStartHour)
          .toDate()
          .toISOString();
      response.dateEndHour =
        response.dateEndHour &&
        this.dateService
          .dayjsAddTree(response.dateEndHour)
          .toDate()
          .toISOString();
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id_service_order/note-stop/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async updateNoteStop(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
    @Body() body: NoteStopServiceOrderBody,
  ) {
    const user: IUserInfo = req.user;
    const mapper = NoteStopServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const obj = await this.noteStopServiceOrderRepository.findById(Number(id));
    if (!obj) {
      throw new BadRequestException(MessageService.Note_id_not_found);
    }
    const yearCurrent = new Date().getFullYear();
    const yearEquipmentStop =
      serviceOrder.data_equipamento_parou instanceof Date &&
      serviceOrder.data_equipamento_parou.getFullYear();

    const dateStart = body.dateStartHour ? new Date(body.dateStartHour) : null;
    const dateEnd = new Date(body.dateEndHour);
    const dateNow = new Date();

    if (dateEnd > dateStart) {
      throw new BadRequestException(
        MessageService.Note_start_hour_less_than_end_hour,
      );
    }

    if ((dateEnd || dateStart) > dateNow) {
      throw new BadRequestException(
        MessageService.Note_start_or_end_up_current_hour,
      );
    }

    body.dateStartHour = body.dateStartHour;
    body.dateEndHour = body.dateEndHour;

    if (yearEquipmentStop && yearEquipmentStop < yearCurrent - 1) {
      throw new BadRequestException(
        MessageService.Note_year_limit_low_service_year,
      );
    }

    if (body.dateStartHour) {
      const dateStart = new Date(body.dateStartHour).getFullYear();
      if (dateStart < yearCurrent - 1) {
        throw new BadRequestException(
          MessageService.Note_year_limit_low_service_year,
        );
      }
    }
    if (body.dateEndHour) {
      const dateEnd = new Date(body.dateEndHour).getFullYear();
      if (dateEnd < yearCurrent - 1) {
        throw new BadRequestException(
          MessageService.Note_year_limit_low_service_year,
        );
      }
    }

    const fields_permission = [
      'idSectorExecutor',
      'idCause',
      'idBatch',
      'dateEndHour',
      'dateStartHour',
      'comments',
      'entrance',
    ];
    removeExtraFields(body, fields_permission);

    body['username'] = user && req.user.login;
    body['idServiceOrder'] = Number(id_service_order);
    body['idEquipment'] = serviceOrder.equipment.ID;

    // const dataMapper = unSetMapper(
    //   body,
    //   mapper,
    // ) as Prisma.sofman_apontamento_paradasUncheckedUpdateInput;
    console.log({
      data_hora_start: dateStart ? dateStart : null,
      data_hora_stop: dateEnd,
      observacoes: body.comments,
    });
    try {
      const updateObj = await this.noteStopServiceOrderRepository.update(
        Number(id),
        {
          data_hora_start: dateStart ? dateStart : null,
          data_hora_stop: dateEnd,
          observacoes: body.comments,
        },
      );

      const mapperNewObj = setMapper(updateObj, mapper);
      return {
        updated: true,
        data: mapperNewObj,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id_service_order/note-stop/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async deleteNodeStop(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      await this.noteStopServiceOrderRepository.delete(Number(id));

      return {
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/material')
  @ApiOkResponse({
    description: 'Success',
    type: MaterialServiceOrderSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async listMaterialServiceOrder(
    @Param('id_service_order') id_service_order: string,
    @Query() query,
  ) {
    const mapper = MaterialServiceOrderMapper;
    let { fields } = query;

    let filters = querySearchParam(query);
    filters = unSetMapper(filters, mapper);

    fields = getArrayMapper(fields, mapper);

    const data = await this.materialServiceOrderRepository.listByServiceOrder(
      Number(id_service_order),
      filters,
      fields,
    );

    const classification = {
      '1': 'Original',
      '2': 'Genuína',
      '3': 'Genérica',
      '4': 'Paralela',
      '5': 'Recondicionada',
    };

    const response = data.map((obj) => {
      const newObj = setMapper(obj, mapper);

      newObj.dateUse = obj.data_uso
        ? this.dateService.dayjsAddTree(obj.data_uso).format('YYYY-MM-DD')
        : null;

      newObj.secondaryCode = obj.materialCodigo
        ? {
            code: obj.materialCodigo.id,
            description: obj.materialCodigo.codigo,
          }
        : null;

      newObj.brand = obj?.materialCodigo?.marca
        ? obj.materialCodigo.marca
        : null;

      newObj.classification = obj?.materialCodigo?.classificacao
        ? classification[obj.materialCodigo.classificacao]
        : null;

      newObj.buyBound =
        obj.buyItem.length > 0 ? obj.buyItem[0].buy.numero : null;

      newObj.flow =
        obj.buyItem.length > 0
          ? obj.materialStock.length > 0
            ? 'stock'
            : 'buy'
          : obj.materialStock.length > 0
          ? 'stock'
          : null;

      return newObj;
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id_material/list-secondary-code')
  async listMaterial(@Req() req, @Param('id_material') idMaterial: string) {
    const user: IUserInfo = req.user;

    const materialCode = await this.materialCode.lisByMaterialAndCode(
      Number(idMaterial),
    );

    const allMaterialsSecondStock =
      await this.materialRepository.listStockCodeSecond(
        user.clientId,
        null,
        null,
        materialCode.map((value) => value.id),
      );

    const response = [];

    const classification = {
      '1': 'Original',
      '2': 'Genuína',
      '3': 'Genérica',
      '4': 'Paralela',
      '5': 'Recondicionada',
    };

    for (const value of materialCode) {
      const findSecond = allMaterialsSecondStock.find(
        (second) => second.id === value.id,
      );

      const stock = findSecond ? findSecond.entrada - findSecond.saida : 0;

      const reserve = findSecond ? findSecond.reserva : 0;

      const stockPhysical = stock - reserve;

      response.push({
        id: value.id,
        codeSecondary: value.codigo,
        material: findSecond ? findSecond.material : value.material.material,
        industry: value.marca,
        classification: value.classificacao
          ? classification[value.classificacao]
          : null,
        quantity: stockPhysical,
        reserve: reserve,
        stockPhysical: stockPhysical,
      });
    }

    return {
      stock: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id_service_order/material')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async createMaterial(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Body() body: MaterialServiceOrderBody,
  ) {
    const user: IUserInfo = req.user;
    const mapper = MaterialServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const fields_permission = [
      'idPlanTask',
      'idProgrammingR2',
      'category',
      'code',
      'idMaterial',
      'quantity',
      'unit',
      'valueUnit',
      'valueTotal',
      'utilized',
      'comments',
      'dateUse',
      'serialNumberOld',
      'serialNumberNew',
      'idSession',
    ];

    const secondaryId = body.idSecondary || null;

    removeExtraFields(body, fields_permission);
    body['idBranch'] = serviceOrder.ID_filial;
    body['idEquipment'] = serviceOrder.equipment.ID;

    body['username'] = user && user.login;
    body['idClient'] = user && req.user.clientId;
    body['dateEmission'] = new Date();
    body['idServiceOrder'] = Number(id_service_order);
    body['idSecondary'] = secondaryId;

    const dataMapper = unSetMapper(
      body,
      mapper,
    ) as Prisma.sofman_materiais_ordem_servicoUncheckedCreateInput;
    //return dataMapper;
    try {
      const material = await this.materialRepository.findById(
        Number(body.idMaterial),
      );

      if (material.tipo !== 'service') {
        const controlStock =
          await this.maintenanceControlStockRepository.listByClient(
            user.clientId,
          );

        const allStockByMaterial =
          await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            [body.idSecondary],
          );

        if (controlStock.length > 0) {
          if (controlStock.length === 1) {
            if (controlStock[0].controlar === 1) {
              const findSecond = allStockByMaterial.find(
                (second) => second.id === body.idSecondary,
              );

              const stock = findSecond
                ? findSecond.entrada - findSecond.saida
                : 0;

              const reserve = findSecond ? findSecond.reserva : 0;

              const stockPhysical = stock - reserve;

              if (!findSecond) {
                throw new ConflictException(
                  MessageService.Servicer_order_material_not_found_for_price,
                );
              } else if (stockPhysical < Number(body.quantity)) {
                throw new ConflictException(
                  MessageService.Service_order_material_quantity_larger_stock,
                );
              }
            }
          } else {
            const findBranch = controlStock.find(
              (value) => value.id_filial === serviceOrder.branch.ID,
            );

            if (findBranch) {
              if (findBranch.controlar === 1) {
                const findSecond = allStockByMaterial.find(
                  (second) => second.id === body.idSecondary,
                );

                const stock = findSecond
                  ? findSecond.entrada - findSecond.saida
                  : 0;

                const reserve = findSecond ? findSecond.reserva : 0;

                const stockPhysical = stock - reserve;

                if (!findSecond) {
                  throw new ConflictException(
                    MessageService.Servicer_order_material_not_found_for_price,
                  );
                } else if (stockPhysical < Number(body.quantity)) {
                  throw new ConflictException(
                    MessageService.Service_order_material_quantity_larger_stock,
                  );
                }
              }
            }
          }
        }
      }

      const newObj =
        await this.materialServiceOrderRepository.create(dataMapper);

      const objMapper = setMapper(newObj, mapper);

      return {
        inserted: true,
        data: objMapper,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/material/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async getMaterial(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const user: IUserInfo = _req.user;

    const mapper = MaterialServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      const obj = await this.materialServiceOrderRepository.findById(
        Number(id),
      );

      const response = setMapper(obj, mapper);

      if (obj.materialCodigo) {
        const allMaterialsSecondStock =
          await this.materialRepository.listStockCodeSecond(
            user.clientId,
            null,
            null,
            [obj.materialCodigo.id],
          );

        const findSecond = allMaterialsSecondStock.find(
          (second) => second.id === obj.materialCodigo.id,
        );

        const stock = findSecond ? findSecond.entrada - findSecond.saida : 0;

        const reserve = findSecond ? findSecond.reserva : 0;

        const stockPhysical = stock - reserve;

        response.stock = stockPhysical;
      }

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id_service_order/material/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async updateMaterial(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
    @Body() body: MaterialServiceOrderBody,
  ) {
    const user: IUserInfo = req.user;
    const mapper = MaterialServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const obj = await this.materialServiceOrderRepository.findById(Number(id));

    if (!obj) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    const fields_permission = [
      'idPlanTask',
      'idProgrammingR2',
      'category',
      'code',
      'idMaterial',
      'quantity',
      'unit',
      'valueUnit',
      'valueTotal',
      'utilized',
      'comments',
      'dateUse',
      'serialNumberOld',
      'serialNumberNew',
      'idSession',
    ];

    removeExtraFields(body, fields_permission);

    body['idBranch'] = serviceOrder.ID_filial;
    body['idEquipment'] = serviceOrder.equipment.ID;
    body['username'] = user && user.login;
    body['idServiceOrder'] = Number(id_service_order);
    body['idClient'] = user && req.user.clientId;
    // body.utilized = '1';

    const dataMapper = unSetMapper(
      body,
      mapper,
    ) as Prisma.sofman_materiais_ordem_servicoUncheckedUpdateInput;

    try {
      const updateObj = await this.materialServiceOrderRepository.update(
        Number(id),
        dataMapper,
      );

      const objMapper = setMapper(updateObj, mapper);

      return {
        updated: true,
        data: objMapper,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id_service_order/material/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async deleteMaterial(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const user: IUserInfo = _req.user;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const materialServiceOrder =
      await this.materialServiceOrderRepository.findById(Number(id));

    if (!materialServiceOrder) {
      throw new NotFoundException(MessageService.Material_id_not_found);
    }

    if (
      user.module.find((module) => module.id === 9) &&
      materialServiceOrder.buyItem.length > 0
    ) {
      throw new NotFoundException(
        MessageService.Service_order_material_bound_buy,
      );
    }

    try {
      await this.materialServiceOrderRepository.delete(Number(id));

      return {
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/:id_service_order/material/bound-stock')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async boundStock(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
  ) {
    const bodySchema = z.object({
      option: z.enum(['buy', 'stock']),
      materialId: z.array(z.number()),
    });

    const user: IUserInfo = req.user;

    const body = bodySchema.parse(req.body);

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    let buyIdFind = null;

    for await (const materialId of body.materialId) {
      const materialServiceOrder =
        await this.materialServiceOrderRepository.findById(materialId);

      if (!materialServiceOrder) {
        throw new NotFoundException(MessageService.Material_id_not_found);
      }

      if (
        materialServiceOrder.buyItem.length > 0 &&
        [2, 10].includes(materialServiceOrder.buyItem[0].buy.status)
      ) {
        buyIdFind = {
          id: materialServiceOrder.buyItem[0].buy.id,
          id_filial: materialServiceOrder.buyItem[0].buy.id_filial,
        };
      }
    }

    if (user.module.find((module) => module.id === 9)) {
      const buy = buyIdFind
        ? buyIdFind
        : await this.buyRepository.create({
            id_cliente: user.clientId,
            id_filial: serviceOrder.ID_filial,
            log_user: user.login,
            status: body.option === 'buy' ? 2 : 10,
          });

      const priority = await this.buyPriorityRepository.listByClient(
        user.clientId,
      );

      for await (const material of serviceOrder.materialServiceOrder.filter(
        (value) => body.materialId.includes(value.id),
      )) {
        const findItem =
          await this.buyItemRepository.findByBuyAndMaterialService(
            buy.id,
            material.id,
          );

        if (!findItem) {
          const item = await this.buyItemRepository.create({
            id_material: material.materials.id,
            id_material_secundario: material.materialCodigo.id,
            id_material_servico: material.id,
            quantidade: Number(material.quantidade),
            id_os: serviceOrder.ID,
            id_prioridade: priority.length > 0 ? priority[0].id : 1,
            id_solicitacao: buy.id,
            sequencia: 1,
            estoque: body.option === 'stock' ? 1 : null,
          });

          if (body.option === 'stock') {
            const findStock =
              await this.materialEstoqueRepository.findByBuyAndItem(
                buy.id,
                item.id,
              );

            if (!findStock) {
              await this.materialEstoqueRepository.create({
                id_cliente: user.clientId,
                id_compra: buy.id,
                id_filial: buy.id_filial,
                id_material: material.materials.id,
                id_material_secundario: material.materialCodigo.id,
                quantidade: Number(material.quantidade),
                id_item: item.id,
                id_item_material_servico: material.id,
                log_user: user.login,
              });
            }
          }
        } else {
          if (body.option === 'stock') {
            const findStock =
              await this.materialEstoqueRepository.findByBuyAndItem(
                buy.id,
                findItem.id,
              );

            if (!findStock) {
              await this.materialEstoqueRepository.create({
                id_cliente: user.clientId,
                id_compra: buy.id,
                id_filial: buy.id_filial,
                id_material: material.materials.id,
                id_material_secundario: material.materialCodigo.id,
                quantidade: Number(material.quantidade),
                id_item: findItem.id,
                id_item_material_servico: material.id,
                log_user: user.login,
              });
            }
          }
        }
      }
    } else {
      if (body.option === 'stock') {
        for await (const material of serviceOrder.materialServiceOrder.filter(
          (value) => body.materialId.includes(value.id),
        )) {
          if (body.option === 'stock') {
            const findStock =
              await this.materialEstoqueRepository.findByMaterialServiceOrder(
                material.id,
              );

            if (!findStock) {
              await this.materialEstoqueRepository.create({
                id_cliente: user.clientId,
                id_filial: serviceOrder.branch.ID,
                id_material: material.materials.id,
                id_material_secundario: material.materialCodigo.id,
                quantidade: Number(material.quantidade),
                id_item_material_servico: material.id,
                log_user: user.login,
              });
            }
          }
        }
      }
    }

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/cost')
  @ApiOkResponse({
    description: 'Success',
    type: CostServiceOrderSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async listCostServiceOrder(
    @Param('id_service_order') id_service_order: string,
    @Query() query,
  ) {
    const mapper = CostServiceOrderMapper;
    let { fields } = query;

    let filters = querySearchParam(query);
    filters = unSetMapper(filters, mapper);

    fields = getArrayMapper(fields, mapper);

    const data = await this.costServiceOrderRepository.listByServiceOrder(
      Number(id_service_order),
      filters,
      fields,
    );

    const response = data.map((obj) => {
      const newObj = setMapper(obj, mapper);
      newObj.dateCost = this.dateService
        .dayjsAddTree(obj.data_custo)
        .format('YYYY-MM-DD');
      return newObj;
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id_service_order/cost')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async createCost(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Body() body: CostServiceOrderBody,
  ) {
    const user: IUserInfo = req.user;
    const mapper = CostServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const fields_permission = [
      'idDescriptionCost',
      'quantity',
      'valueUnit',
      'cost',
      'dateCost',
      'comments',
    ];

    removeExtraFields(body, fields_permission);
    body['username'] = user && user.login;
    body['idServiceOrder'] = Number(id_service_order);
    body['dateEmission'] = new Date();

    const dataMapper = unSetMapper(
      body,
      mapper,
    ) as Prisma.sofman_cad_custos_ordens_servicoUncheckedCreateInput;

    //return dataMapper;

    try {
      const newObj = await this.costServiceOrderRepository.create(dataMapper);

      const objMapper = setMapper(newObj, mapper);
      return {
        inserted: true,
        data: objMapper,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/cost/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async getCost(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const mapper = CostServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      const obj = await this.costServiceOrderRepository.findById(Number(id));

      const response = setMapper(obj, mapper);
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id_service_order/cost/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async updateCost(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
    @Body() body: CostServiceOrderBody,
  ) {
    const user: IUserInfo = req.user;
    const mapper = CostServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }
    // const obj = await this.materialServiceOrderRepository.findById(Number(id));
    // if (!obj) {
    //   throw new BadRequestException(MessageService.Material_id_not_found);
    // }

    const fields_permission = [
      'idDescriptionCost',
      'quantity',
      'valueUnit',
      'cost',
      'dateCost',
      'comments',
    ];
    removeExtraFields(body, fields_permission);
    body['username'] = user && user.login;
    body['idServiceOrder'] = Number(id_service_order);

    const dataMapper = unSetMapper(
      body,
      mapper,
    ) as Prisma.sofman_cad_custos_ordens_servicoUncheckedUpdateInput;

    try {
      const updateObj = await this.costServiceOrderRepository.update(
        Number(id),
        dataMapper,
      );

      const objMapper = setMapper(updateObj, mapper);
      return {
        updated: true,
        data: objMapper,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id_service_order/cost/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async deleteCost(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      await this.costServiceOrderRepository.delete(Number(id));

      return {
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/failure-analysis')
  @ApiOkResponse({
    description: 'Success',
    type: FailureAnalysisServiceOrderSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async listFailureAnalysisServiceOrder(
    @Param('id_service_order') id_service_order: string,
    @Query() query,
  ) {
    const mapper = FailureAnalysisServiceOrderMapper;
    let { fields } = query;

    let filters = querySearchParam(query);
    filters = unSetMapper(filters, mapper);

    fields = getArrayMapper(fields, mapper);

    const data =
      await this.failureAnalysisServiceOrderRepository.listByServiceOrder(
        Number(id_service_order),
        filters,
        fields,
      );

    const response = data.map((obj) => {
      const newObj = setMapper(obj, mapper);
      return newObj;
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id_service_order/failure-analysis')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async createFailureAnalysis(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Body() body: FailureAnalysisServiceOrderBody,
  ) {
    const user: IUserInfo = req.user;
    const mapper = FailureAnalysisServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const fields_permission = [
      'idComponent',
      'idSymptom',
      'idCause',
      'idAction',
    ];

    const equipment = await this.equipmentRepository.findById(
      serviceOrder.equipment.ID,
    );

    if (equipment.typeEquipment === null) {
      throw new NotFoundException(
        MessageService.Equipment_equipment_type_not_found,
      );
    }

    removeExtraFields(body, fields_permission);
    body['username'] = user && user.login;
    body['idEquipment'] = equipment.ID;
    body['idTypeEquipment'] = equipment.typeEquipment.ID;
    body['idFamilyEquipment'] = equipment.family.ID;
    body['idServiceOrder'] = Number(id_service_order);
    body['idBranch'] = serviceOrder.ID_filial;
    body['idClient'] = Number(user.clientId);
    body['dateEmission'] = new Date();

    const dataMapper = unSetMapper(
      body,
      mapper,
    ) as Prisma.sofman_analise_falhaUncheckedCreateInput;

    try {
      const newObj =
        await this.failureAnalysisServiceOrderRepository.create(dataMapper);

      const objMapper = setMapper(newObj, mapper);
      return {
        inserted: true,
        data: objMapper,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/failure-analysis/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async getFailureAnalysis(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const mapper = FailureAnalysisServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      const obj = await this.failureAnalysisServiceOrderRepository.findById(
        Number(id),
      );

      const response = setMapper(obj, mapper);
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id_service_order/failure-analysis/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async updateFailureAnalysis(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
    @Body() body: FailureAnalysisServiceOrderBody,
  ) {
    const user: IUserInfo = req.user;
    const mapper = FailureAnalysisServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const obj = await this.failureAnalysisServiceOrderRepository.findById(
      Number(id),
    );
    if (!obj) {
      throw new BadRequestException(
        MessageService.Failure_analysis_id_not_found,
      );
    }

    const fields_permission = [
      'idComponent',
      'idSymptom',
      'idCause',
      'idAction',
    ];

    const equipment = await this.equipmentRepository.findById(
      serviceOrder.equipment.ID,
    );

    removeExtraFields(body, fields_permission);
    body['username'] = user && user.login;
    body['idEquipment'] = equipment.ID;
    body['idTypeEquipment'] = equipment.typeEquipment.ID;
    body['idFamilyEquipment'] = equipment.family.ID;
    body['idServiceOrder'] = Number(id_service_order);
    body['idBranch'] = serviceOrder.ID_filial;
    body['idClient'] = Number(user.clientId);

    const dataMapper = unSetMapper(
      body,
      mapper,
    ) as Prisma.sofman_analise_falhaUncheckedUpdateInput;

    try {
      const updateObj = await this.failureAnalysisServiceOrderRepository.update(
        Number(id),
        dataMapper,
      );

      const objMapper = setMapper(updateObj, mapper);
      return {
        updated: true,
        data: objMapper,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id_service_order/failure-analysis/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async deleteFailureAnalysis(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      await this.failureAnalysisServiceOrderRepository.delete(Number(id));

      return {
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/attachments')
  @ApiOkResponse({
    description: 'Success',
    type: AttachmentsServiceOrderSwaggerResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async listAttachmentsServiceOrder(
    @Param('id_service_order') id_service_order: string,
    @Query() query,
  ) {
    const mapper = AttachmentsServiceOrderMapper;
    let { fields } = query;

    let filters = querySearchParam(query);
    filters = unSetMapper(filters, mapper);

    fields = getArrayMapper(fields, mapper);

    const data =
      await this.attachmentsServiceOrderRepository.listByServiceOrder(
        Number(id_service_order),
        filters,
        fields,
      );

    const response = data.map((obj) => {
      const newObj = setMapper(obj, mapper);
      return newObj;
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id_service_order/attachments')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  @UseInterceptors(FileInterceptor('file'))
  async createAttachments(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Body() body: AttachmentsServiceOrderBody,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user: IUserInfo = req.user;
    const mapper = AttachmentsServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const fields_permission = [
      'attachment',
      'nameAttachment',
      'sizeAttachment',
      'comments',
    ];

    if (body.attachment) {
      body.attachment = Buffer.from(body.attachment);
    }

    // const originalName = iconv.decode(
    //   Buffer.from(file.originalname, 'binary'),
    //   'ISO-8859-1',
    // );

    // console.log('originalName => ', originalName);
    // file.originalname = sanitizeFilename(originalName);
    // console.log(file.originalname);

    // return {
    //   file,
    // };

    if (file && !body['nameAttachment']) {
      body['nameAttachment'] = file.originalname;
    }
    if (file && !body['sizeAttachment']) {
      body['sizeAttachment'] = file.size?.toString();
    }

    removeExtraFields(body, fields_permission);
    body['idBranch'] = serviceOrder.ID_filial;
    body['username'] = user && user.login;
    body['idServiceOrder'] = Number(id_service_order);
    body['idClient'] = Number(user.clientId);

    const dataMapper = unSetMapper(
      body,
      mapper,
    ) as Prisma.sofman_anexos_osUncheckedCreateInput;

    if (!file && !body['attachment']) {
      throw new BadRequestException(MessageService.Attachments_file_required);
    }

    try {
      if (file) {
        const nodes_permission = ['production', 'dev'];
        const path_remote = nodes_permission.includes(this.env.NODE_ENV)
          ? this.env.URL_IMAGE
          : this.env.FILE_PATH;
        const path_local = this.env.FILE_PATH;
        const path_local_img = `${path_local}/service_order/id_${id_service_order}`;
        const path_remote_img = `${path_remote}/service_order/id_${id_service_order}`;

        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
          const processedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800 }) // Redimensiona a largura para 800px
            .jpeg({ quality: 80 }) // Define a qualidade para 80%
            .toBuffer();

          this.fileService.write(
            path_local_img,
            file.originalname,
            processedImageBuffer,
          );
        } else {
          this.fileService.write(
            path_local_img,
            file.originalname,
            file.buffer,
          );
        }
        dataMapper['url'] = `${path_remote_img}/${file.originalname}`;
      }

      const newObj =
        await this.attachmentsServiceOrderRepository.create(dataMapper);

      const objMapper = setMapper(newObj, mapper);
      return {
        inserted: true,
        data: objMapper,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/attachments/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async getAttachments(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const mapper = AttachmentsServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      const obj = await this.attachmentsServiceOrderRepository.findById(
        Number(id),
      );

      const response = setMapper(obj, mapper);
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id_service_order/attachments/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateAttachments(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
    @Body() body: AttachmentsServiceOrderBody,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user: IUserInfo = req.user;
    const mapper = AttachmentsServiceOrderMapper;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const fields_permission = [
      'attachment',
      'nameAttachment',
      'sizeAttachment',
      'comments',
    ];
    removeExtraFields(body, fields_permission);
    body['idBranch'] = serviceOrder.ID_filial;
    body['username'] = user && user.login;
    body['idServiceOrder'] = Number(id_service_order);
    body['idClient'] = Number(user.clientId);

    const dataMapper = unSetMapper(
      body,
      mapper,
    ) as Prisma.sofman_anexos_osUncheckedUpdateInput;

    try {
      if (file) {
        const nodes_permission = ['production', 'dev'];
        const path_remote = nodes_permission.includes(this.env.NODE_ENV)
          ? this.env.URL_IMAGE
          : this.env.FILE_PATH;
        const path_local = this.env.FILE_PATH;
        const path_local_img = `${path_local}/service_order/id_${id_service_order}`;
        const path_remote_img = `${path_remote}/service_order/id_${id_service_order}`;
        this.fileService.write(path_local_img, file.originalname, file.buffer);
        dataMapper['url'] = `${path_remote_img}/${file.originalname}`;
      }

      const obj = await this.attachmentsServiceOrderRepository.findById(
        Number(id),
      );
      const updateObj = await this.attachmentsServiceOrderRepository.update(
        Number(id),
        {
          ...obj,
          ...dataMapper,
        } as Prisma.sofman_anexos_osUncheckedUpdateInput,
      );

      const objMapper = setMapper(updateObj, mapper);
      return {
        updated: true,
        data: objMapper,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id_service_order/attachments/:id')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async deleteAttachments(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('id') id: string,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );
    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      await this.attachmentsServiceOrderRepository.delete(Number(id));

      return {
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/technical-details')
  @ApiOkResponse({
    description: 'Success',
    type: listTechnicalDetailsResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async listTechnicalDetails(
    @Param('id_service_order') id_service_order: string,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const response = {
      maintenanceDiagnosis: serviceOrder.observacoes,
      solution: serviceOrder.descricao_servico_realizado,
      executorObservation: serviceOrder.observacoes_executante,
      technicalDrive: serviceOrder.data_acionamento_tecnico,
      technicalArrival: serviceOrder.chegada_tecnico,
      serviceEvaluationNote: serviceOrder.nota_avalicao_servico,
      priority:
        serviceOrder.priorityOrderService &&
        serviceOrder.priorityOrderService.id.toString(),
      classification:
        serviceOrder.classOrderService &&
        serviceOrder.classOrderService.id.toString(),
    };

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:id_service_order/technical-details')
  @ApiBody({
    type: updateTechnicalDetailsBodySwagger,
  })
  @ApiOkResponse({
    description: 'Success',
    type: UpdatedResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async updateTechnicalDetails(
    @Param('id_service_order') id_service_order: string,
    @Body() body: updateTechnicalDetailsBody,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    // const priorityOrderService = { id: null };

    // if (body.priority) {
    //   const findPriorityOrderService =
    //     await this.priorityServiceOrderRepository.findById(body.priority);

    //   if (!findPriorityOrderService) {
    //     throw new BadRequestException(
    //       MessageService.Priority_service_order_not_found,
    //     );
    //   }

    //   priorityOrderService.id = findPriorityOrderService.id;
    // }

    const classification = { id: null };

    if (body.classification) {
      const findClassification =
        await this.classificationServiceOrderRepository.findById(
          body.classification,
        );

      if (!findClassification) {
        throw new BadRequestException(
          MessageService.Classification_service_order_not_found,
        );
      }

      classification.id = findClassification.id;
    }

    await this.serviceOrderRepository.update(serviceOrder.ID, {
      observacoes: body.maintenanceDiagnosis,
      descricao_servico_realizado: body.solution,
      observacoes_executante: body.executorObservation,
      data_acionamento_tecnico: body.technicalDrive,
      chegada_tecnico: body.technicalArrival,
      nota_avalicao_servico: body.serviceEvaluationNote,
      //prioridade: priorityOrderService.id,
      classificacao: classification.id,
      created_at: new Date(),
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListTaskServiceOrderResponseSwagger,
  })
  @Get('/:id_service_order/task')
  async listTaskServiceOrder(
    @Param('id_service_order') id_service_order: string,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const tasks = await this.taskServiceOrderRepository.listByOrder(
      serviceOrder.ID,
    );

    const response = tasks.map((item) => {
      return {
        id: item.id,
        descriptionPlanning: item?.planTask?.planDescription.descricao || null,
        periodicity: item.periodicidade_uso,
        component: item?.component?.componente || null,
        minute: this.dateService.formatTotalTime(
          this.dateService.formatTimeDifferenceForRegisterHours(
            item.registerHour,
          ),
        ),
        //   ? item.status_exec === 1
        //     ? 'Executado'
        //     : 'Executando'
        //   : 'Sem Registro',
        status: item.legendTask
          ? {
              value: item.legendTask.id.toString(),
              label: `${item.legendTask.legenda}-${item.legendTask.descricao}`,
            }
          : null,
        task: {
          value: item.task.id.toString(),
          label: item.task.tarefa,
        },
        observation: item.observacao,
        unity: item.unity
          ? {
              value: item.unity?.id.toString(),
              label: item.unity?.unidade,
            }
          : null,
        registerHour: item.registerHour.map((value) => {
          return {
            id: value.id,
            start: value.inicio,
            end: value.fim,
          };
        }),
        response:
          item.taskReturn.length > 0
            ? item.task.tipo_dado === 'text'
              ? item.taskReturn[0].retorno_texto
              : item.task.tipo_dado === 'num'
              ? item.taskReturn[0]?.retorno_numero?.toString()
              : item.taskReturn.map((value) => value.retorno_opcao.toString())
            : null,
      };
    });

    return {
      task: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateTaskServiceOrderByPlanBodySwagger,
  })
  @Post('/:id_service_order/task/description-plan')
  async createTaskServiceOrderByPlan(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
  ) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      plan: z.array(
        z.object({
          id: z.number(),
          taskId: z.array(z.number()),
        }),
      ),
    });

    const body = bodySchema.parse(req.body);

    for await (const plan of body.plan) {
      const descriptionPlan = await this.descriptionPlanRepository.findById(
        Number(plan.id),
      );

      if (!descriptionPlan) {
        throw new NotFoundException(MessageService.Plan_id_not_found);
      }
    }

    for await (const plan of body.plan) {
      const descriptionPlan = await this.descriptionPlanRepository.findById(
        Number(plan.id),
      );

      if (!descriptionPlan) {
        throw new NotFoundException(MessageService.Plan_id_not_found);
      }

      for await (const planTaskId of plan.taskId) {
        const plan = await this.planMaintenanceRepository.findById(
          Number(planTaskId),
        );

        await this.taskServiceOrderRepository.create({
          id_cliente: user.clientId,
          id_ordem_servico: Number(id_service_order),
          tarefa: plan.tarefa,
          id_tarefa_plano: plan.ID,
          id_componente: plan.id_componente,
        });
      }
    }

    return {
      created: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateTaskServiceOrderSwagger,
  })
  @ApiResponse({
    type: InsertedResponseSwagger,
  })
  @Post('/:id_service_order/task')
  async createTaskServiceOrder(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Body() body: CreateTaskServiceOrder,
  ) {
    const user: IUserInfo = req.user;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const newTaskService = await this.taskServiceOrderRepository.create({
      id_cliente: user.clientId,
      id_filial: serviceOrder.ID_filial,
      id_ordem_servico: serviceOrder.ID,
      tarefa: Number(body.taskId),
      minutos: body.minute,
      observacao: body.observation,
      status_tarefa: body.statusId ? Number(body.statusId) : null,
      periodicidade_uso: body.periodicity,
      id_componente: body.componentId ? Number(body.componentId) : null,
      id_unidade_medida: body.unity ? Number(body.unity) : null,
      log_user: user.login,
    });

    return {
      inserted: true,
      id: newTaskService.id,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: UpdateTaskServiceOrderSwagger,
  })
  @ApiResponse({
    type: UpdatedResponseSwagger,
  })
  @Put('/:id_service_order/task/:taskId')
  async updateTaskServiceOrder(
    @Param('id_service_order') id_service_order: string,
    @Param('taskId') taskId: string,
    @Body() body: UpdateTaskServiceOrder,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const taskServiceOrder = await this.taskServiceOrderRepository.findById(
      Number(taskId),
    );

    if (!taskServiceOrder) {
      throw new NotFoundException(
        MessageService.Task_service_order_id_not_found,
      );
    }

    if (taskServiceOrder.task.obrigatorio === 1 && body.response === null) {
      throw new NotFoundException(
        MessageService.Task_service_order_response_not_found,
      );
    }

    await this.taskServiceOrderRepository.update(taskServiceOrder.id, {
      status_tarefa: body.statusId,
      observacao: body.observation,
      periodicidade_uso: body.periodicity,
      minutos: body.minute,
      id_unidade_medida: body.unity ? Number(body.unity) : null,
      id_componente: body.componentId ? Number(body.componentId) : null,
    });

    const logTask = await this.logTaskServiceOrder.last({
      id_ordem_servico: serviceOrder.ID,
    });

    await this.logTaskServiceOrder.update(logTask.id, {
      log_date: new Date(),
    });

    if (taskServiceOrder.task.tipo_dado === 'text') {
      const findDuplicate =
        await this.taskServiceOrderReturnRepository.findByTaskServiceTask(
          taskServiceOrder.id,
          taskServiceOrder.task.id,
          {
            retorno_texto: body.response,
          },
        );

      if (findDuplicate.length === 0) {
        const findExist =
          await this.taskServiceOrderReturnRepository.findByTaskServiceTask(
            taskServiceOrder.id,
            taskServiceOrder.task.id,
          );

        if (findExist.length !== 0) {
          for await (const item of findExist) {
            await this.taskServiceOrderReturnRepository.update(item.id, {
              retorno_texto: body.response,
            });
          }
        } else {
          await this.taskServiceOrderReturnRepository.create({
            id_tarefa_servico: taskServiceOrder.id,
            id_tarefa: taskServiceOrder.task.id,
            retorno_texto: body.response,
          });
        }
      }
    } else if (taskServiceOrder.task.tipo_dado === 'num') {
      const findDuplicate =
        await this.taskServiceOrderReturnRepository.findByTaskServiceTask(
          taskServiceOrder.id,
          taskServiceOrder.task.id,
          {
            retorno_numero: Number(body.response),
          },
        );

      if (findDuplicate.length === 0) {
        const findExist =
          await this.taskServiceOrderReturnRepository.findByTaskServiceTask(
            taskServiceOrder.id,
            taskServiceOrder.task.id,
          );

        if (findExist.length !== 0) {
          for await (const item of findExist) {
            await this.taskServiceOrderReturnRepository.update(item.id, {
              retorno_numero: Number(body.response),
            });
          }
        } else {
          await this.taskServiceOrderReturnRepository.create({
            id_tarefa_servico: taskServiceOrder.id,
            id_tarefa: taskServiceOrder.task.id,
            retorno_numero: Number(body.response),
          });
        }
      }
    } else if (taskServiceOrder.task.tipo_dado === 'single') {
      const findAllReturn =
        await this.taskServiceOrderReturnRepository.findByTaskServiceTask(
          taskServiceOrder.id,
          taskServiceOrder.task.id,
        );

      const allNotCreate = findAllReturn.filter(
        (item) =>
          body.response.findIndex(
            (value) => Number(value) === item.retorno_opcao,
          ) === -1,
      );

      for await (const item of allNotCreate) {
        await this.taskServiceOrderReturnRepository.delete(item.id);
      }

      const allCreate = body.response.filter(
        (value) =>
          findAllReturn.findIndex(
            (item) => Number(value) === item.retorno_opcao,
          ) === -1,
      );

      for await (const item of allCreate) {
        await this.taskServiceOrderReturnRepository.create({
          id_tarefa_servico: taskServiceOrder.id,
          id_tarefa: taskServiceOrder.task.id,
          retorno_opcao: Number(item),
        });
      }
    } else if (taskServiceOrder.task.tipo_dado === 'multiple') {
      const findAllReturn =
        await this.taskServiceOrderReturnRepository.findByTaskServiceTask(
          taskServiceOrder.id,
          taskServiceOrder.task.id,
        );

      const allNotCreate = findAllReturn.filter(
        (item) =>
          body.response.findIndex(
            (value) => Number(value) === item.retorno_opcao,
          ) === -1,
      );

      for await (const item of allNotCreate) {
        await this.taskServiceOrderReturnRepository.delete(item.id);
      }

      const allCreate = body.response.filter(
        (value) =>
          findAllReturn.findIndex(
            (item) => Number(value) === item.retorno_opcao,
          ) === -1,
      );

      for await (const item of allCreate) {
        await this.taskServiceOrderReturnRepository.create({
          id_tarefa_servico: taskServiceOrder.id,
          id_tarefa: taskServiceOrder.task.id,
          retorno_opcao: Number(item),
        });
      }
    }

    const allLog = await this.logTaskServiceOrderReturnRepository.lasts({
      id_tarefa_servico: taskServiceOrder.id,
      log_date: {
        gte: this.dateService.dayjs(new Date()).subtract(5, 'M').toDate(),
      },
    });

    for await (const log of allLog) {
      await this.logTaskServiceOrderReturnRepository.update(log.id, {
        log_date: new Date(),
      });
    }

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: DeletedResponseSwagger,
  })
  @Delete('/:id_service_order/task/:taskId')
  async deleteTaskServiceOrder(
    @Param('id_service_order') id_service_order: string,
    @Param('taskId') taskId: string,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const taskServiceOrder = await this.taskServiceOrderRepository.findById(
      Number(taskId),
    );

    if (!taskServiceOrder) {
      throw new NotFoundException(
        MessageService.Task_service_order_id_not_found,
      );
    }

    await this.registerHourTaskServiceRepository.deleteByTask(
      taskServiceOrder.id,
    );

    await this.taskServiceOrderRepository.delete(taskServiceOrder.id);

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id_service_order/task/:taskId/attachment')
  async getAttachmentsByTaskService(
    @Param('id_service_order') id_service_order: string,
    @Param('taskId') taskId: string,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const taskServiceOrder = await this.taskServiceOrderRepository.findById(
      Number(taskId),
    );

    if (!taskServiceOrder) {
      throw new NotFoundException(
        MessageService.Task_service_order_id_not_found,
      );
    }

    const allAttachment = await this.attachmentTaskServiceRepository.findByTask(
      taskServiceOrder.id,
    );

    const response = allAttachment.map((value) => {
      return {
        id: value.id,
        url: value.url,
        observation: value.observacao,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id_service_order/task/:taskId/attachment')
  @UseInterceptors(FileInterceptor('file'))
  async createAttachmentsByTaskService(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Param('taskId') taskId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const taskServiceOrder = await this.taskServiceOrderRepository.findById(
      Number(taskId),
    );

    if (!taskServiceOrder) {
      throw new NotFoundException(
        MessageService.Task_service_order_id_not_found,
      );
    }

    try {
      if (file) {
        const nodes_permission = ['production', 'dev'];
        const path_remote = nodes_permission.includes(this.env.NODE_ENV)
          ? this.env.URL_IMAGE
          : this.env.FILE_PATH;
        const path_local = this.env.FILE_PATH;
        const path_local_img = `${path_local}/service_order/id_${id_service_order}/task/id_${taskId}`;
        const path_remote_img = `${path_remote}/service_order/id_${id_service_order}/task/id_${taskId}`;

        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
          // Compressão para JPEG
          const processedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800 }) // Redimensiona a largura para 800px
            .jpeg({ quality: 80 }) // Define a qualidade para 80%
            .toBuffer();

          // Escreve a imagem processada no sistema de arquivos
          this.fileService.write(
            path_local_img,
            file.originalname,
            processedImageBuffer,
          );
        } else {
          this.fileService.write(
            path_local_img,
            file.originalname,
            file.buffer,
          );
        }

        await this.attachmentTaskServiceRepository.create({
          id_tarefa_servico: taskServiceOrder.id,
          anexo: file.originalname,
          url: `${path_remote_img}/${file.originalname}`,
          observacao: req?.body?.observation || null,
        });
      }

      return {
        inserted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id_service_order/task/:taskId/attachment/:id')
  async deleteAttachmentsByTaskService(
    @Req() _req,
    @Param('id_service_order') id_service_order: string,
    @Param('taskId') taskId: string,
    @Param('id') id: string,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const taskServiceOrder = await this.taskServiceOrderRepository.findById(
      Number(taskId),
    );

    if (!taskServiceOrder) {
      throw new NotFoundException(
        MessageService.Task_service_order_id_not_found,
      );
    }

    const attachment = await this.attachmentTaskServiceRepository.findById(
      Number(id),
    );

    try {
      await this.attachmentTaskServiceRepository.delete(Number(id));

      //const nodes_permission = ['production', 'dev'];

      const path_local = this.env.FILE_PATH;
      const path_local_img = `${path_local}/service_order/id_${id_service_order}/task/id_${taskId}/${attachment.anexo}`;

      this.fileService.delete(path_local_img);

      return {
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateRegisterHourBodySwagger,
  })
  @ApiResponse({
    type: InsertedResponseSwagger,
  })
  @Post('/:id_service_order/task/:taskId/register-hour')
  async createRegister(
    @Param('id_service_order') id_service_order: string,
    @Param('taskId') taskId: string,
    @Body() body: CreateRegisterHourBodySwagger,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const taskServiceOrder = await this.taskServiceOrderRepository.findById(
      Number(taskId),
    );

    if (!taskServiceOrder) {
      throw new NotFoundException(
        MessageService.Task_service_order_id_not_found,
      );
    }

    await this.registerHourTaskServiceRepository.create({
      id_tarefa_servico: taskServiceOrder.id,
      inicio: body.start,
      fim: body.end,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: UpdateRegisterHourBodySwagger,
  })
  @ApiResponse({
    type: UpdatedResponseSwagger,
  })
  @Put('/:id_service_order/task/:taskId/register-hour/:registerId')
  async updateRegister(
    @Param('id_service_order') id_service_order: string,
    @Param('taskId') taskId: string,
    @Param('registerId') registerId: string,
    @Body() body: UpdateRegisterHourBodySwagger,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const taskServiceOrder = await this.taskServiceOrderRepository.findById(
      Number(taskId),
    );

    if (!taskServiceOrder) {
      throw new NotFoundException(
        MessageService.Task_service_order_id_not_found,
      );
    }

    const registerHour = await this.registerHourTaskServiceRepository.findById(
      Number(registerId),
    );

    if (!registerHour) {
      throw new NotFoundException(MessageService.Register_hour_id_not_found);
    }

    await this.registerHourTaskServiceRepository.update(registerHour.id, {
      inicio: body.start,
      fim: body.end,
    });

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: DeletedResponseSwagger,
  })
  @Delete('/:id_service_order/task/:taskId/register-hour/:registerId')
  async deleteRegister(
    @Param('id_service_order') id_service_order: string,
    @Param('taskId') taskId: string,
    @Param('registerId') registerId: string,
  ) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const taskServiceOrder = await this.taskServiceOrderRepository.findById(
      Number(taskId),
    );

    if (!taskServiceOrder) {
      throw new NotFoundException(
        MessageService.Task_service_order_id_not_found,
      );
    }

    const registerHour = await this.registerHourTaskServiceRepository.findById(
      Number(registerId),
    );

    if (!registerHour) {
      throw new NotFoundException(MessageService.Register_hour_id_not_found);
    }

    await this.registerHourTaskServiceRepository.delete(registerHour.id);

    return {
      deleted: true,
    };
  }
}
