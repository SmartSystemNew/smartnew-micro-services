import {
  ConflictException,
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import EquipmentRepository from 'src/repositories/equipment-repository';
import LogAppointmentServiceOrderRepository from 'src/repositories/log-appointment-service-order-repository';
import LogAttachmentRequestServiceRepository from 'src/repositories/log-attachment-request-service-repository';
import LogAttachmentServiceOrderRepository from 'src/repositories/log-attachment-service-order-repository';
import LogAttachmentTaskServiceRepository from 'src/repositories/log-attachment-task-service-repository';
import LogMaterialServiceOrderRepository from 'src/repositories/log-material-service-order-repository';
import { LogNoteStopServiceOrderRepository } from 'src/repositories/log-note-stop-service-order-repository';
import LogRegisterHourTaskServiceRepository from 'src/repositories/log-register-hour-task-service-repository';
import LogRequestServiceRepository from 'src/repositories/log-request-service-repository';
import LogServiceOrderMaintainerRepository from 'src/repositories/log-service-order-maintainer-repository';
import LogServiceOrderRepository from 'src/repositories/log-service-order-repository';
import LogServiceOrderSignatureRepository from 'src/repositories/log-service-order-signature-repository';
import LogTaskListOptionRepository from 'src/repositories/log-task-list-option-repository';
import LogTaskOptionRepository from 'src/repositories/log-task-option-repository';
import LogTaskServiceOrderRepository from 'src/repositories/log-task-service-order-repository';
import LogTaskServiceOrderReturnRepository from 'src/repositories/log-task-service-order-return-repository';
import MaintenanceDisplacementRepository from 'src/repositories/maintenance-displacement-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { DateService } from 'src/service/data.service';
import { z } from 'zod';
import FindUserResponseSwagger from './dtos/swagger/findUser-response-swagger';
import ListAppointmentManualResponseSwagger from './dtos/swagger/listAppointmentManual-response-swagger';
import ListAttachmentRequestServiceResponseSwagger from './dtos/swagger/listAttachmentRequestService-response-swagger';
import ListAttachmentServiceOrderResponseSwagger from './dtos/swagger/listAttachmentServiceOrder-response-swagger';
import ListBoundTaskResponseSwagger from './dtos/swagger/listBoundTask-response-swagger';
import ListDisplacementResponseSwagger from './dtos/swagger/listDisplacement-response-swagger';
import ListNoteStopResponseSwagger from './dtos/swagger/listNoteStop-response-swagger';
import ListOptionTaskResponseSwagger from './dtos/swagger/listOptionTask-response-swagger';
import ListRegisterHourOfTaskServiceResponseSwagger from './dtos/swagger/listRegisterHourOfTaskService-response-swagger';
import ListRequestServiceResponseSwagger from './dtos/swagger/listRequestService-response-swagger';
import ListServiceOrderResponseSwagger from './dtos/swagger/listServiceOrder-response-swagger';
import ListTaskReturnResponseSwagger from './dtos/swagger/listTaskReturn-response-swagger';
import AppListTaskServiceOrderResponseSwagger from './dtos/swagger/listTaskServiceOrder-response-swagger';
import LogCostServiceOrderRepository from 'src/repositories/log-cost-service-order-repository';

@ApiTags('Maintenance - Service Order - App')
@ApiBearerAuth()
@Controller('/maintenance/service-order/app')
export default class AppServiceOrderController {
  LogMaterialServiceOrderRepository: any;
  ServiceOrderRepository: any;
  constructor(
    private dateService: DateService,
    private logRequestServiceRepository: LogRequestServiceRepository,
    private logServiceOrderRepository: LogServiceOrderRepository,
    private logServiceOrderMaintainer: LogServiceOrderMaintainerRepository,
    private logTaskServiceOrderRepository: LogTaskServiceOrderRepository,
    private logRegisterHourTaskServiceRepository: LogRegisterHourTaskServiceRepository,
    private logAttachmentServiceOrderRepository: LogAttachmentServiceOrderRepository,
    private logAttachmentRequestServiceRepository: LogAttachmentRequestServiceRepository,
    private logTaskOptionRepository: LogTaskOptionRepository,
    private logTaskListOptionRepository: LogTaskListOptionRepository,
    private logTaskServiceOrderReturnRepository: LogTaskServiceOrderReturnRepository,
    private logMaterialServiceOrderRepository: LogMaterialServiceOrderRepository,
    private maintenanceDisplacementRepository: MaintenanceDisplacementRepository,
    private logAppointmentServiceOrderRepository: LogAppointmentServiceOrderRepository,
    private logAttachmentTaskServiceRepository: LogAttachmentTaskServiceRepository,
    private logCostServiceOrderRepository: LogCostServiceOrderRepository,
    private logServiceOrderSignatureRepository: LogServiceOrderSignatureRepository,
    private logNoteStopServiceOrderRepository: LogNoteStopServiceOrderRepository,
    private serviceOrderRepository: ServiceOrderRepository,
    private equipmentRepository: EquipmentRepository,
  ) {}

  @ApiResponse({
    type: ListRequestServiceResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/list-request-service')
  async listRequestService(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const allRequestService =
      await this.logRequestServiceRepository.listByBranchesAndFilter(
        user.branches,
        {
          created_at: {
            gte: startTimestamp,
          },
        },
      );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    allRequestService.forEach((requestService) => {
      const now = new Date();
      const timestamp1 = requestService.log_date
        ? new Date(requestService.log_date).getTime()
        : now.getTime();
      const timestamp2 = requestService.requestService?.orderService?.log_date
        ? new Date(
            requestService.requestService.orderService.log_date,
          ).getTime()
        : now.getTime();

      const totalHours = Math.abs(timestamp1 - timestamp2) / (1000 * 60 * 60);
      const days = Math.floor(totalHours / 24);
      const hours = Math.floor(totalHours % 24);
      const time_action = `${days} dia${days !== 1 ? 's' : ''} e ${hours} hora${
        hours !== 1 ? 's' : ''
      }`;

      const item = {
        id: requestService.id_solicitacao.toString(),
        id_app: requestService.id_app,
        equipment_id: requestService.id_equipamento.toString(),
        service_order_id:
          requestService.requestService?.orderService?.ID?.toString() || null,
        codigo: requestService.codigo_solicitacao,
        problem_id: requestService.id_problema?.toString() || null,
        priority_id: requestService.prioridade?.toString() || null,
        stopped_machine: requestService?.maquina_parada === 1,
        subject: requestService?.assunto,
        description: requestService.mensagem,
        status: requestService?.status?.toString() || null,
        date_emission: requestService.log_date,
        date_expected: requestService?.data_prevista || null,
        date_machine_stopped: requestService?.data_equipamento_parou || null,
        time_action,
      };

      if (!query.timestamp) {
        if (requestService.acao === 'DELETE') {
          deletedIds.add(item.id);
          return;
        }

        const findIndex = response.created.findIndex(
          (value) => value.id === item.id,
        );

        if (findIndex === -1) {
          response.created.push(item);
        } else {
          response.created[findIndex] = item;
        }
      } else if (
        requestService.acao === 'INSERT' &&
        !updatedIds.has(item.id) &&
        !deletedIds.has(item.id)
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id,
        );

        if (findIndex === -1) {
          response.created.push(item);
        } else {
          response.created[findIndex] = item;
        }
      } else if (requestService.acao === 'UPDATE' && !deletedIds.has(item.id)) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id,
        );

        if (findIndex === -1) {
          response.updated.push(item);
          updatedIds.add(item.id);
        } else {
          response.updated[findIndex] = item;
        }
      } else if (requestService.acao === 'DELETE') {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id,
        );

        if (findIndex === -1) {
          response.updated.push(item);
          deletedIds.add(item.id);
        } else {
          response.updated[findIndex] = item;
        }
      }
    });

    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @ApiResponse({
    type: ListRequestServiceResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/list-request-service-test')
  async listRequestServiceTest(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    //console.log(startTimestamp);

    const allRequestService =
      await this.logRequestServiceRepository.listByBranchesAndFilter(
        user.branches,
        {
          log_date: {
            gte: startTimestamp,
          },
        },
      );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    allRequestService.forEach((requestService) => {
      const item = {
        id: requestService.id_solicitacao.toString(),
        id_app: requestService.id_app,
        equipment_id: requestService.id_equipamento.toString(),
        service_order_id:
          requestService.requestService?.orderService?.ID?.toString() || null,
        codigo: requestService.codigo_solicitacao,
        problem_id: requestService.id_problema.toString(),
        priority_id: requestService.prioridade.toString(),
        stopped_machine: requestService?.maquina_parada === 1,
        subject: requestService?.assunto,
        description: requestService.mensagem,
        status: requestService?.status?.toString() || null,
        date_emission: requestService.log_date,
        date_expected: requestService?.data_prevista,
      };

      // if (requestService.acao === 'INSERT') {
      //   const isAlreadyInCreated = response.created.some(
      //     (createdItem) => createdItem.id === item.id,
      //   );
      //   if (!isAlreadyInCreated) {
      //     response.created.push(item);
      //   }
      // } else if (requestService.acao === 'UPDATE') {
      //   const isAlreadyInCreated = response.created.some(
      //     (createdItem) => createdItem.id === item.id,
      //   );

      //   if (!isAlreadyInCreated) {
      //     const isAlreadyInUpdated = response.updated.some(
      //       (updatedItem) => updatedItem.id === item.id,
      //     );
      //     if (!isAlreadyInUpdated) {
      //       response.updated.push(item);
      //     }
      //   }
      // } else if (requestService.acao === 'DELETE') {
      //   const isAlreadyInCreated = response.created.some(
      //     (createdItem) => createdItem.id === item.id,
      //   );
      //   const isAlreadyInUpdated = response.updated.some(
      //     (updatedItem) => updatedItem.id === item.id,
      //   );

      //   if (!isAlreadyInCreated && !isAlreadyInUpdated) {
      //     const isAlreadyInDeleted = response.deleted.some(
      //       (deletedItem) => deletedItem.id === item.id,
      //     );
      //     if (!isAlreadyInDeleted) {
      //       response.deleted.push({ id: item.id });
      //     }
      //   }
      // }

      if (!query.timestamp) {
        if (requestService.acao === 'DELETE') {
          deletedIds.add(item.id);
          return;
        }

        const findIndex = response.created.findIndex(
          (value) => value.id === item.id,
        );

        if (findIndex === -1) {
          response.created.push(item);
        } else {
          response.created[findIndex] = item;
        }
      } else if (
        requestService.acao === 'INSERT' &&
        !updatedIds.has(item.id) &&
        !deletedIds.has(item.id)
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id,
        );

        if (findIndex === -1) {
          response.created.push(item);
        } else {
          response.created[findIndex] = item;
        }
      } else if (requestService.acao === 'UPDATE' && !deletedIds.has(item.id)) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id,
        );

        if (findIndex === -1) {
          response.updated.push(item);
          updatedIds.add(item.id);
        } else {
          response.updated[findIndex] = item;
        }
      } else if (requestService.acao === 'DELETE') {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id,
        );

        if (findIndex === -1) {
          response.updated.push(item);
          deletedIds.add(item.id);
        } else {
          response.updated[findIndex] = item;
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      change: { ...response },
      timestamp: new Date().getTime(),
    };
  }

  @ApiResponse({
    type: ListServiceOrderResponseSwagger,
  })
  @ApiResponse({
    type: ListServiceOrderResponseSwagger,
  })
  @ApiResponse({
    type: ListServiceOrderResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/list-service-order')
  async listServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.string().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? this.dateService.dayjs(query.timestamp).toDate()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    //console.log(startTimestamp);

    const allServiceOrder =
      await this.logServiceOrderRepository.listByBranchesAndFilter(
        user.branches,
        {
          created_at: {
            gte: startTimestamp,
          },
          ...(user.collaboratorId !== null &&
            user.typeAccess === 2 && {
              serviceOrder: {
                maintainers: {
                  some: {
                    id_colaborador: user.collaboratorId,
                  },
                },
              },
            }),
        },
      );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    allServiceOrder.forEach((item) => {
      if (!query.timestamp) {
        if (item.acao !== 'DELETE') {
          const findIndex = response.created.findIndex(
            (value) => value.id === item.id_ordem.toString(),
          );

          if (findIndex === -1) {
            response.created.push({
              id: item.id_ordem?.toString() || null,
              id_app: item.id_app || null,
              code: item.ordem?.toString() || null,

              description: item.descricao_solicitacao || null,
              date_emission: item.log_date || null,
              date_request: item.data_hora_solicitacao || null,
              date_end: item.data_hora_encerramento || null,
              date_expected: item.data_prevista_termino || null,
              date_machine_stopped: item.data_equipamento_parou || null,
              date_machine_worked: item.data_equipamento_funcionou || null,
              branch_id: item.ID_filial?.toString() || null,
              requester_id: item.id_solicitante?.toString() || null,
              status_id: item.status_os?.toString() || null,
              equipment_id: item.id_equipamento?.toString() || null,
              type_maintenance_id: item.tipo_manutencao?.toString() || null,
              sector_executing_id: item.setor_executante?.toString() || null,
              hour_meter: Number(item.horimetro) || null,
              odometer: Number(item.odometro) || null,
              equipment_fail: item.observacoes || null,
              stopped_machine: item.maquina_parada === 1,
              technical_arrival: item.chegada_tecnico,
              technical_drive: item.data_acionamento_tecnico,
              executor_observation: item.observacoes_executante,
              maintenance_diagnostics: item.observacoes,
              classification_id: item?.classificacao?.toString() || null,
              solution: item.descricao_servico_realizado,
              rating: item.nota_avalicao_servico,
              priority_id: item?.prioridade?.toString() || null,
              maintainer_id: item.mantenedores || null,
            });
          } else {
            response.created[findIndex] = {
              id: item.id_ordem?.toString() || null,
              id_app: item.id_app || null,
              code: item.ordem?.toString() || null,
              description: item.descricao_solicitacao || null,
              date_emission: item.log_date || null,
              date_request: item.data_hora_solicitacao || null,
              date_end: item.data_hora_encerramento || null,
              date_expected: item.data_prevista_termino || null,
              date_machine_stopped: item.data_equipamento_parou || null,
              date_machine_worked: item.data_equipamento_funcionou || null,
              branch_id: item.ID_filial?.toString() || null,
              requester_id: item.id_solicitante?.toString() || null,
              status_id: item.status_os?.toString() || null,
              equipment_id: item.id_equipamento?.toString() || null,
              type_maintenance_id: item.tipo_manutencao?.toString() || null,
              sector_executing_id: item.setor_executante?.toString() || null,
              hour_meter: Number(item.horimetro) || null,
              odometer: Number(item.odometro) || null,
              equipment_fail: item.observacoes || null,
              stopped_machine: item.maquina_parada === 1,
              technical_arrival: item.chegada_tecnico,
              technical_drive: item.data_acionamento_tecnico,
              executor_observation: item.observacoes_executante,
              maintenance_diagnostics: item.observacoes,
              classification_id: item?.classificacao?.toString() || null,
              solution: item.descricao_servico_realizado,
              rating: item.nota_avalicao_servico,
              priority_id: item?.prioridade?.toString() || null,
              maintainer_id: item.mantenedores || null,
            };
          }
        } else {
          deletedIds.add(item.id_ordem.toString());
        }
      } else if (
        item.acao === 'INSERT' &&
        !updatedIds.has(item.id_ordem.toString()) &&
        !deletedIds.has(item.id_ordem.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_ordem.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_ordem?.toString() || null,
            id_app: item.id_app || null,
            code: item.ordem?.toString() || null,
            description: item.descricao_solicitacao || null,
            date_emission: item.log_date || null,
            created_at: item.created_at,
            date_request: item.data_hora_solicitacao || null,
            date_expected: item.data_prevista_termino || null,
            date_machine_stopped: item.data_equipamento_parou || null,
            date_machine_worked: item.data_equipamento_funcionou || null,
            date_end: item.data_hora_encerramento || null,
            branch_id: item.ID_filial?.toString() || null,
            request_id: item.id_solicitante?.toString() || null,
            status_id: item.status_os?.toString() || null,
            equipment_id: item.id_equipamento?.toString() || null,
            type_maintenance_id: item.tipo_manutencao?.toString() || null,
            sector_executing_id: item.setor_executante?.toString() || null,
            hour_meter: Number(item.horimetro) || null,
            odometer: Number(item.odometro) || null,
            equipment_fail: item.observacoes || null,
            stopped_machine: item.maquina_parada === 1,
            technical_arrival: item.chegada_tecnico,
            technical_drive: item.data_acionamento_tecnico,
            executor_observation: item.observacoes_executante,
            maintenance_diagnostics: item.observacoes,
            classification_id: item?.classificacao?.toString() || null,
            solution: item.descricao_servico_realizado,
            rating: item.nota_avalicao_servico,
            priority_id: item?.prioridade?.toString() || null,
            maintainer_id: item.mantenedores || null,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_ordem?.toString() || null,
            id_app: item.id_app || null,
            code: item.ordem?.toString() || null,
            description: item.descricao_solicitacao || null,
            date_emission: item.log_date || null,
            date_request: item.data_hora_solicitacao || null,
            date_end: item.data_hora_encerramento || null,
            date_expected: item.data_prevista_termino || null,
            date_machine_stopped: item.data_equipamento_parou || null,
            date_machine_worked: item.data_equipamento_funcionou || null,
            branch_id: item.ID_filial?.toString() || null,
            request_id: item.id_solicitante?.toString() || null,
            status_id: item.status_os?.toString() || null,
            equipment_id: item.id_equipamento?.toString() || null,
            type_maintenance_id: item.tipo_manutencao?.toString() || null,
            sector_executing_id: item.setor_executante?.toString() || null,
            hour_meter: Number(item.horimetro) || null,
            odometer: Number(item.odometro) || null,
            equipment_fail: item.observacoes || null,
            stopped_machine: item.maquina_parada === 1,
            technical_arrival: item.chegada_tecnico,
            technical_drive: item.data_acionamento_tecnico,
            executor_observation: item.observacoes_executante,
            maintenance_diagnostics: item.observacoes,
            classification_id: item?.classificacao?.toString() || null,
            solution: item.descricao_servico_realizado,
            rating: item.nota_avalicao_servico,
            priority_id: item?.prioridade?.toString() || null,
            maintainer_id: item.mantenedores || null,
          };
        }
      } else if (
        item.acao === 'UPDATE' &&
        !deletedIds.has(item.id_ordem.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id_ordem.toString(),
        );

        //console.log(response.created);

        const findInInsert = response.created.find(
          (value) => value.id === item.id_ordem?.toString(),
        );

        if (
          findInInsert &&
          this.dateService
            .dayjs(findInInsert.created_at)
            .diff(item.created_at) < 60000
        ) {
          //se passou de 1 min nao entra
          return;
        }

        if (findIndex === -1) {
          response.updated.push({
            id: item.id_ordem?.toString() || null,
            id_app: item.id_app || null,
            code: item.ordem?.toString() || null,
            description: item.descricao_solicitacao || null,
            date_emission: item.log_date || null,
            created_at: item.created_at,
            date_request: item.data_hora_solicitacao || null,
            date_end: item.data_hora_encerramento || null,
            date_expected: item.data_prevista_termino || null,
            date_machine_stopped: item.data_equipamento_parou || null,
            date_machine_worked: item.data_equipamento_funcionou || null,
            branch_id: item.ID_filial?.toString() || null,
            request_id: item.id_solicitante?.toString() || null,
            status_id: item.status_os?.toString() || null,
            equipment_id: item.id_equipamento?.toString() || null,
            type_maintenance_id: item.tipo_manutencao?.toString() || null,
            sector_executing_id: item.setor_executante?.toString() || null,
            hour_meter: Number(item.horimetro) || null,
            odometer: Number(item.odometro) || null,
            equipment_fail: item.observacoes || null,
            stopped_machine: item.maquina_parada === 1,
            technical_arrival: item.chegada_tecnico,
            technical_drive: item.data_acionamento_tecnico,
            executor_observation: item.observacoes_executante,
            maintenance_diagnostics: item.observacoes,
            classification_id: item?.classificacao?.toString() || null,
            solution: item.descricao_servico_realizado,
            rating: item.nota_avalicao_servico,
            priority_id: item?.prioridade?.toString() || null,
            maintainer_id: item.mantenedores || null,
          });
          updatedIds.add(item.id_ordem.toString());
        } else {
          response.updated[findIndex] = {
            id: item.id_ordem?.toString() || null,
            id_app: item.id_app || null,
            code: item.ordem?.toString() || null,
            description: item.descricao_solicitacao || null,
            date_emission: item.log_date || null,
            date_request: item.data_hora_solicitacao || null,
            date_end: item.data_hora_encerramento || null,
            date_expected: item.data_prevista_termino || null,
            date_machine_stopped: item.data_equipamento_parou || null,
            date_machine_worked: item.data_equipamento_funcionou || null,
            branch_id: item.ID_filial?.toString() || null,
            request_id: item.id_solicitante?.toString() || null,
            status_id: item.status_os?.toString() || null,
            equipment_id: item.id_equipamento?.toString() || null,
            type_maintenance_id: item.tipo_manutencao?.toString() || null,
            sector_executing_id: item.setor_executante?.toString() || null,
            hour_meter: Number(item.horimetro) || null,
            odometer: Number(item.odometro) || null,
            equipment_fail: item.observacoes || null,
            stopped_machine: item.maquina_parada === 1,
            technical_arrival: item.chegada_tecnico,
            technical_drive: item.data_acionamento_tecnico,
            executor_observation: item.observacoes_executante,
            maintenance_diagnostics: item.observacoes,
            classification_id: item?.classificacao?.toString() || null,
            solution: item.descricao_servico_realizado,
            rating: item.nota_avalicao_servico,
            priority_id: item?.prioridade?.toString() || null,
            maintainer_id: item.mantenedores || null,
          };
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value === item.id_ordem.toString(),
        );

        if (findIndex === -1) {
          response.deleted.push(item.id_ordem.toString() || null);

          deletedIds.add(item.id_ordem.toString());
        } else {
          response.deleted[findIndex] = item.id_ordem.toString();
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return response;
  }

  @UseGuards(AuthGuard)
  @Get('/material-service-order')
  async listMaterialServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const list =
      await this.logMaterialServiceOrderRepository.listLogMaterialOrder(
        user.branches,
        {
          log_date: {
            gte: startTimestamp,
          },
          ...(user.collaboratorId !== null &&
            user.typeAccess === 2 && {
              serviceOrder: {
                maintainers: {
                  some: {
                    id_colaborador: user.collaboratorId,
                  },
                },
              },
            }),
        },
      );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    list.forEach((data) => {
      const listData = {
        id: data.id_material_servico.toString(),
        id_app: data.id_app,
        service_order_id: data.id_ordem_servico.toString(),
        material_id: data.material.toString(),
        quantity: Number(data.quantidade),
        value: Number(data.valor_unidade),
        date_use: data.data_uso || null,
        n_serie_new: data.n_serie_novo,
        n_serie_old: data.n_serie_antigo,
      };

      if (!query.timestamp) {
        if (data.acao === 'DELETE') {
          deletedIds.add(data.id_material_servico.toString());
          return;
        }
        const findIndex = response.created.findIndex(
          (value) => value.id === listData.id,
        );

        if (findIndex === -1) {
          response.created.push(listData);
        } else {
          response.created[findIndex] = listData;
        }
      } else if (
        data.acao === 'INSERT' &&
        !updatedIds.has(data.id_material_servico.toString()) &&
        !deletedIds.has(data.id_material_servico.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === listData.id,
        );

        if (findIndex === -1) {
          response.created.push(listData);
        } else {
          response.created[findIndex] = listData;
        }
      } else if (
        data.acao === 'UPDATE' &&
        !deletedIds.has(data.id_material_servico.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === listData.id,
        );

        if (findIndex === -1) {
          response.updated.push(listData);
          updatedIds.add(data.id_material_servico.toString());
        } else {
          response.updated[findIndex] = listData;
        }
      } else if (data.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value.id === data.id_material_servico.toString(),
        );

        if (findIndex === -1) {
          response.deleted.push(data.id_material_servico.toString());
          deletedIds.add(data.id_material_servico.toString());
        } else {
          response.deleted[findIndex] = data.id_material_servico.toString();
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return response;
  }

  @UseGuards(AuthGuard)
  @Get('/list-link')
  async listLink(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const list = await this.logRequestServiceRepository.listByBranchesAndFilter(
      user.branches,
      {
        log_date: {
          gte: startTimestamp,
        },
      },
    );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    list.map((data) => {
      const listData = {
        id_request: data.requestService?.id?.toString() ?? '',
        id_app_request: data.requestService?.id_app?.toString() ?? '',
        id_service_order:
          data.requestService?.orderService?.ID?.toString() ?? '',
        id_app_order_service:
          data.requestService?.orderService?.id_app?.toString() ?? '',
        code_service_order:
          data.requestService?.orderService?.ordem?.toString() ?? '',
      };

      if (
        listData.id_request &&
        listData.id_app_request &&
        listData.id_service_order &&
        listData.id_app_order_service &&
        listData.code_service_order
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id_request === listData.id_request,
        );

        if (findIndex === -1) {
          response.created.push(listData);
        } else {
          response.created[findIndex] = listData;
        }
      }
    });

    return response;
  }
  @ApiResponse({
    type: FindUserResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/user')
  async findUser(@Req() req) {
    const user: IUserInfo = req.user;

    const response = {
      login: user.login,
      name: user.name,
      company: user.company.name,
      branch_id: user.branch.map((branch) => branch.id.toString()),
      collaborator_id: user.collaboratorId
        ? user.collaboratorId.toString()
        : null,
    };

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListOptionTaskResponseSwagger,
  })
  @Get('/task/list-option')
  async listOptionTask(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const allTaskOption = await this.logTaskOptionRepository.listByClient(
      user.clientId,
      {
        log_date: {
          gte: new Date(query.timestamp).toISOString(),
        },
      },
    );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    allTaskOption.forEach((item) => {
      if (!query.timestamp) {
        if (item.acao === 'DELETE') {
          return;
        }
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_tarefa_opcao.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_tarefa_opcao.toString(),
            id_app: item.id_app,
            description: item.descricao,
          });
        }
      } else if (
        item.acao === 'INSERT' &&
        !updatedIds.has(item.id_tarefa_opcao.toString()) &&
        !deletedIds.has(item.id_tarefa_opcao.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_tarefa_opcao.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_tarefa_opcao.toString(),
            id_app: item.id_app,
            description: item.descricao,
          });
        }
      } else if (
        item.acao === 'UPDATE' &&
        !deletedIds.has(item.id_tarefa_opcao.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id_tarefa_opcao.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: item.id_tarefa_opcao.toString(),
            id_app: item.id_app,
            description: item.descricao,
          });
          updatedIds.add(item.id_tarefa_opcao.toString());
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value === item.id_tarefa_opcao,
        );

        if (findIndex === -1) {
          response.deleted.push(item.id_tarefa_opcao);
          deletedIds.add(item.id_tarefa_opcao.toString());
        } else {
          response.deleted[findIndex] = item.id_tarefa_opcao;
        }
      }
    });

    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );

    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );

    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return { ...response };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListBoundTaskResponseSwagger,
  })
  @Get('/task/list-bound')
  async listBoundTask(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const filter = query.timestamp
      ? {
          log_date: {
            gte: new Date(query.timestamp).toISOString(),
          },
        }
      : {};

    const allTaskOption = await this.logTaskListOptionRepository.listByClient(
      user.clientId,
      filter,
    );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    allTaskOption.forEach((item) => {
      if (!query.timestamp) {
        if (item.acao === 'DELETE') {
          return;
        }

        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_tarefa_lista.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_tarefa_lista.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            option_id: item.id_tarefa_opcao.toString(),
          });
        } else {
          response.created[findIndex] = {
            id: item.id_tarefa_lista.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            option_id: item.id_tarefa_opcao.toString(),
          };
        }
      } else if (
        item.acao === 'INSERT' &&
        !updatedIds.has(item.id_tarefa_lista.toString()) &&
        !deletedIds.has(item.id_tarefa_lista.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_tarefa_lista.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_tarefa_lista.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            option_id: item.id_tarefa_opcao.toString(),
          });
        } else {
          response.created[findIndex] = {
            id: item.id_tarefa_lista.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            option_id: item.id_tarefa_opcao.toString(),
          };
        }
      } else if (
        item.acao === 'UPDATE' &&
        !deletedIds.has(item.id_tarefa_lista.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id_tarefa_lista.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: item.id_tarefa_lista.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            option_id: item.id_tarefa_opcao.toString(),
          });
          updatedIds.add(item.id_tarefa_lista.toString());
        } else {
          response.updated[findIndex] = {
            id: item.id_tarefa_lista.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            option_id: item.id_tarefa_opcao.toString(),
          };
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value === item.id_tarefa_lista,
        );

        if (findIndex === -1) {
          response.deleted.push(item.id_tarefa_lista);
          deletedIds.add(item.id_tarefa_lista.toString());
        } else {
          response.deleted[findIndex] = item.id_tarefa_lista;
        }
      }
    });

    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );

    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );

    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListTaskReturnResponseSwagger,
  })
  @Get('/task/list-return')
  async listTaskReturn(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const allTaskReturn =
      await this.logTaskServiceOrderReturnRepository.listByClient(
        user.clientId,
        {
          log_date: {
            gte: startTimestamp,
          },
        },
      );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    allTaskReturn.forEach((item) => {
      if (!query.timestamp) {
        if (item.acao === 'DELETE') {
          return;
        }
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_tarefa_retorno.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_tarefa_retorno.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            task_service_order_id: item.id_tarefa_servico.toString(),
            return_text: item?.retorno_texto,
            return_number: item?.retorno_numero,
            return_option:
              item?.taskReturn?.returnOption?.option.id?.toString() || null,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_tarefa_retorno.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            task_service_order_id: item.id_tarefa_servico.toString(),
            return_text: item?.retorno_texto,
            return_number: item?.retorno_numero,
            return_option:
              item?.taskReturn?.returnOption?.option.id?.toString() || null,
          };
        }
      } else if (
        item.acao === 'INSERT' &&
        !updatedIds.has(item.id_tarefa_retorno.toString()) &&
        !deletedIds.has(item.id_tarefa_retorno.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_tarefa_retorno.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_tarefa_retorno.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            task_service_order_id: item.id_tarefa_servico.toString(),
            return_text: item?.retorno_texto,
            return_number: item?.retorno_numero,
            return_option:
              item?.taskReturn?.returnOption?.option.id?.toString() || null,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_tarefa_retorno.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            task_service_order_id: item.id_tarefa_servico.toString(),
            return_text: item?.retorno_texto,
            return_number: item?.retorno_numero,
            return_option:
              item?.taskReturn?.returnOption?.option.id?.toString() || null,
          };
        }
      } else if (
        item.acao === 'UPDATE' &&
        !deletedIds.has(item.id_tarefa_retorno.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id_tarefa_retorno.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: item.id_tarefa_retorno.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            task_service_order_id: item.id_tarefa_servico.toString(),
            return_text: item?.retorno_texto,
            return_number: item?.retorno_numero,
            return_option:
              item?.taskReturn?.returnOption?.option.id?.toString() || null,
          });
          updatedIds.add(item.id_tarefa_retorno.toString());
        } else {
          response.updated[findIndex] = {
            id: item.id_tarefa_retorno.toString(),
            id_app: item.id_app,
            task_id: item.id_tarefa.toString(),
            task_service_order_id: item.id_tarefa_servico.toString(),
            return_text: item?.retorno_texto,
            return_number: item?.retorno_numero,
            return_option:
              item?.taskReturn?.returnOption?.option.id?.toString() || null,
          };
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value === item.id_tarefa_retorno,
        );

        if (findIndex === -1) {
          response.deleted.push(item.id_tarefa_retorno);
          deletedIds.add(item.id_tarefa_retorno.toString());
        } else {
          response.deleted[findIndex] = item.id_tarefa_retorno;
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return { ...response };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListAppointmentManualResponseSwagger,
  })
  @Get('/service/appointment-manual')
  async listAppointmentManual(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const allAppointmentManual =
      await this.logAppointmentServiceOrderRepository.listByBranch(
        user.branches,
        {
          log_date: {
            gte: startTimestamp,
          },
          id_tarefa_ordem_servico: null,
          ...(user.collaboratorId !== null &&
            user.typeAccess === 2 && {
              appointmentServiceOrder: {
                serviceOrder: {
                  maintainers: {
                    some: {
                      id_colaborador: user.collaboratorId,
                    },
                  },
                },
              },
            }),
        },
      );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    allAppointmentManual.forEach((item) => {
      if (!query.timestamp) {
        if (item.acao === 'DELETE') {
          return;
        }

        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_apontamento.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_apontamento.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem.toString(),
            maintainer_id: item?.id_colaborador?.toString() || null,
            description: item.descricao,
            start: item.data_hora_inicio,
            end: item.data_hora_termino,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_apontamento.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem.toString(),
            maintainer_id: item?.id_colaborador?.toString() || null,
            description: item.descricao,
            start: item.data_hora_inicio,
            end: item.data_hora_termino,
          };
        }
      } else if (
        item.acao === 'INSERT' &&
        !updatedIds.has(item.id_apontamento.toString()) &&
        !deletedIds.has(item.id_apontamento.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_apontamento.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_apontamento.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem.toString(),
            maintainer_id: item?.id_colaborador?.toString() || null,
            description: item.descricao,
            start: item.data_hora_inicio,
            end: item.data_hora_termino,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_apontamento.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem.toString(),
            maintainer_id: item?.id_colaborador?.toString() || null,
            description: item.descricao,
            start: item.data_hora_inicio,
            end: item.data_hora_termino,
          };
        }
      } else if (
        item.acao === 'UPDATE' &&
        !deletedIds.has(item.id_apontamento.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id_apontamento.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: item.id_apontamento.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem.toString(),
            maintainer_id: item?.id_colaborador?.toString() || null,
            description: item.descricao,
            start: item.data_hora_inicio,
            end: item.data_hora_termino,
          });
          updatedIds.add(item.id_apontamento.toString());
        } else {
          response.updated[findIndex] = {
            id: item.id_apontamento.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem.toString(),
            maintainer_id: item?.id_colaborador?.toString() || null,
            description: item.descricao,
            start: item.data_hora_inicio,
            end: item.data_hora_termino,
          };
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value.id === item.id_apontamento,
        );

        if (findIndex === -1) {
          response.deleted.push(item.id_apontamento);
          deletedIds.add(item.id_apontamento.toString());
        } else {
          response.deleted[findIndex] = item.id_apontamento;
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListAttachmentServiceOrderResponseSwagger,
  })
  @Get('/service-order/attach')
  async listAttachmentServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const data = await this.logAttachmentServiceOrderRepository.listByClient(
      user.clientId,
      {
        log_date: {
          gte: startTimestamp,
        },
        ...(user.collaboratorId !== null &&
          user.typeAccess === 2 && {
            serviceOrder: {
              maintainers: {
                some: {
                  id_colaborador: user.collaboratorId,
                },
              },
            },
          }),
      },
    );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set<string>();
    const deletedIds = new Set<string>();

    data.forEach((item) => {
      if (query.timestamp === null) {
        if (item.acao === 'DELETE') {
          return;
        }
        const findIndex = response.created.findIndex(
          (value) => value.id_app === item.id_app,
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app ?? null,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app ?? null,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          };
        }
      } else if (
        item.acao === 'INSERT' &&
        !updatedIds.has(item.id_anexo.toString()) &&
        !deletedIds.has(item.id_anexo.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id_app === item.id_app,
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app ?? null,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app ?? null,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          };
        }
      } else if (
        item.acao === 'UPDATE' &&
        !deletedIds.has(item.id_anexo.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id_app === item.id_app,
        );

        if (findIndex === -1) {
          response.updated.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app ?? null,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          });
          updatedIds.add(item.id_anexo.toString());
        } else {
          response.updated[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app ?? null,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          };
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value === item.id_app,
        );

        if (findIndex === -1) {
          response.deleted.push(item.id_app ?? null);
          deletedIds.add(item.id_anexo.toString());
        } else {
          response.deleted[findIndex] = item.id_app ?? null;
          deletedIds.add(item.id_anexo.toString());
        }
      }
    });

    // Remove duplicate IDs from created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remove duplicate IDs from created and updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListAttachmentServiceOrderResponseSwagger,
  })
  @Get('/service-order/list-attach')
  async listAttachByOrder(@Req() req) {
    const user: IUserInfo = req.user;
    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const data = await this.logAttachmentServiceOrderRepository.listByClient(
      user.clientId,
      {
        log_date: {
          gte: startTimestamp,
        },
      },
    );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    data.forEach((item) => {
      if (query.timestamp === null) {
        if (item.acao === 'DELETE') {
          return;
        }
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_anexo.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          };
        }
      } else if (item.acao === 'INSERT') {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_anexo.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          };
        }
      } else if (item.acao === 'UPDATE') {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id_anexo.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          });
        } else {
          response.updated[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            service_order_id: item.id_ordem_servico.toString(),
            src: item.url,
          };
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value === item.id_anexo.toString(),
        );

        if (findIndex === -1) {
          response.deleted.push(item.id_anexo.toString() || null);
        } else {
          response.deleted[findIndex] = item.id_anexo.toString() || null;
        }
      }
    });

    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListDisplacementResponseSwagger,
  })
  @Get('/service-order/:id/displacement')
  async listDisplacementByOrder(@Param('id') id: string) {
    const allDisplacement =
      await this.maintenanceDisplacementRepository.listByOrder(Number(id));

    const response = allDisplacement.map((displacement) => {
      return {
        id: displacement.id.toString(),
        start: displacement.inicio,
        end: displacement.fim,
        distance: displacement?.distance || 0,
        distance_going: displacement?.distance_going || 0,
        distance_return: displacement?.distance_return || 0,
        going: displacement.pathDisplacement
          .filter((value) => value.tipo === 0)
          .map((value) => {
            return {
              id: value.id.toString(),
              latitude: value.latitude,
              longitude: value.longitude,
            };
          }),
        return: displacement.pathDisplacement
          .filter((value) => value.tipo === 1)
          .map((value) => {
            return {
              id: value.id.toString(),
              latitude: value.latitude,
              longitude: value.longitude,
            };
          }),
      };
    });

    return {
      displacement: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListDisplacementResponseSwagger,
  })
  @Get('/service-order/displacement')
  async listDisplacement(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const allServiceOrderIdByTimeStamp =
      await this.logServiceOrderRepository.listOnlyServiceOrderIdByBranchesAndFilter(
        user.branches,
        {
          created_at: {
            gte: startTimestamp,
          },
          ...(user.collaboratorId !== null &&
            user.typeAccess === 2 && {
              serviceOrder: {
                maintainers: {
                  some: {
                    id_colaborador: user.collaboratorId,
                  },
                },
              },
            }),
        },
      );

    const ids = [];

    allServiceOrderIdByTimeStamp.forEach((item) => {
      const findIndex = ids.findIndex((value) => item.id_ordem === value);

      if (item.acao === 'DELETE') {
        return;
      }

      if (findIndex === -1) {
        ids.push(item.id_ordem);
      }
    });

    const allDisplacement =
      await this.maintenanceDisplacementRepository.listByServiceOrder(ids);

    const response = allDisplacement.map((displacement) => {
      return {
        id: displacement.id.toString(),
        service_order_id: displacement.serviceOrder.ID.toString(),
        start: displacement.inicio,
        end: displacement.fim,
        distance: displacement?.distance || 0,
        distance_going: displacement?.distance_going || 0,
        distance_return: displacement?.distance_return || 0,
        timestamp: displacement.log_date.getTime(),
        going: displacement.pathDisplacement
          .filter((value) => value.tipo === 0)
          .map((value) => {
            return {
              id: value.id.toString(),
              latitude: value.latitude,
              longitude: value.longitude,
              timestamp: value.log_date.getTime(),
            };
          }),
        return: displacement.pathDisplacement
          .filter((value) => value.tipo === 1)
          .map((value) => {
            return {
              id: value.id.toString(),
              latitude: value.latitude,
              longitude: value.longitude,
              timestamp: value.log_date.getTime(),
            };
          }),
      };
    });

    return {
      displacement: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/maintainer')
  async listMaintainerOrders(@Req() req): Promise<any> {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const list = await this.logServiceOrderMaintainer.listByMaintainerAndOrders(
      user.branches,
      query.timestamp
        ? {
            log_date: {
              gte: startTimestamp,
            },
          }
        : undefined,
    );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(
      response.updated.map((item) => item.id.toString()),
    );
    const deletedIds = new Set(
      response.deleted.map((item) => item.id.toString()),
    );

    list.forEach((data) => {
      if (!data.id_mantenedores_os) {
        return;
      }
      const listData = {
        id: data.id_mantenedores_os.toString(),
        id_app: data.id_app ? data.id_app.toString() : null,
        service_order_id: data.id_ordem_servico.toString(),
        maintainer_id: data.id_colaborador.toString(),
      };

      if (!query.timestamp || query.timestamp === null) {
        if (data.acao === 'DELETE') {
          deletedIds.add(listData.id);
          return;
        }

        const findIndex = response.created.findIndex(
          (value) => value.id === listData.id,
        );

        if (findIndex === -1) {
          response.created.push(listData);
        } else {
          response.created[findIndex] = listData;
        }
      } else {
        if (
          data.acao === 'INSERT' &&
          !updatedIds.has(listData.id) &&
          !deletedIds.has(listData.id)
        ) {
          const findIndex = response.created.findIndex(
            (value) => value.id === listData.id,
          );

          if (findIndex === -1) {
            response.created.push(listData);
          } else {
            response.created[findIndex] = listData;
          }
        } else if (data.acao === 'UPDATE' && !deletedIds.has(listData.id)) {
          const findIndex = response.updated.findIndex(
            (value) => value.id === listData.id,
          );

          if (findIndex === -1) {
            response.updated.push(listData);
            updatedIds.add(listData.id);
          } else {
            response.updated[findIndex] = listData;
          }
        } else if (data.acao === 'DELETE') {
          if (!data.id_mantenedores_os) {
            return;
          }

          const findIndex = response.deleted.findIndex(
            (value) => value.id === listData.id,
          );

          if (findIndex === -1) {
            response.deleted.push(data.id_mantenedores_os.toString());
            deletedIds.add(listData.id);
          } else {
            response.deleted[findIndex] = data.id_mantenedores_os.toString();
          }
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    // Garantir que todos os IDs em deleted sejam strings
    // response.deleted = response.deleted.map((item) => item);

    return response;
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: AppListTaskServiceOrderResponseSwagger,
  })
  @Get('/task-service-order')
  async listTaskServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.string().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? this.dateService.dayjs(query.timestamp).toDate()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const allTask = await this.logTaskServiceOrderRepository.listByBranch(
      user.branches,
      {
        serviceOrder: {
          ID_filial: {
            in: user.branches,
          },
          ...(user.collaboratorId !== null &&
            user.typeAccess === 2 && {
              maintainers: {
                some: {
                  id_colaborador: user.collaboratorId,
                },
              },
            }),
        },
        log_date: {
          gte: startTimestamp,
        },
      },
    );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    allTask.forEach((task) => {
      if (!query.timestamp) {
        if (task.taskServiceOrder === null || task.acao === 'DELETE') {
          deletedIds.add(task.id_tarefa_servico.toString());
          return;
        }

        const findIndex = response.created.findIndex(
          (item) => item.id === task.taskServiceOrder.id.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: task.taskServiceOrder.id.toString(),
            id_app: task.id_app,
            service_order_id: task.id_ordem_servico.toString(),
            status_id: task?.status_tarefa?.toString(),
            unity_id:
              task.taskServiceOrder?.id_unidade_medida?.toString() || null,
            periodicity:
              Number(task.taskServiceOrder?.periodicidade_uso) || null,
            observation: task.taskServiceOrder.observacao,
            task_id: task.tarefa.toString(),
            register_hour: task.taskServiceOrder.registerHour.map((value) => ({
              id: value.id.toString(),
              start_time: value.inicio,
              end_time: value.fim,
            })),
          });
        } else {
          response.created[findIndex] = {
            id: task.taskServiceOrder.id.toString(),
            id_app: task.id_app,
            service_order_id: task.id_ordem_servico.toString(),
            status_id: task?.status_tarefa?.toString(),
            unity_id:
              task.taskServiceOrder?.id_unidade_medida?.toString() || null,
            periodicity:
              Number(task.taskServiceOrder?.periodicidade_uso) || null,
            observation: task.taskServiceOrder.observacao,
            task_id: task.tarefa.toString(),
            register_hour: task.taskServiceOrder.registerHour.map((value) => ({
              id: value.id.toString(),
              start_time: value.inicio,
              end_time: value.fim,
            })),
          };
        }
      } else if (
        task.acao === 'INSERT' &&
        task.taskServiceOrder !== null &&
        !updatedIds.has(task.id_tarefa_servico.toString()) &&
        !deletedIds.has(task.id_tarefa_servico.toString())
      ) {
        const findIndex = response.created.findIndex(
          (item) => item.id === task.taskServiceOrder.id.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: task.id_tarefa_servico.toString(),
            id_app: task.id_app,
            service_order_id: task.id_ordem_servico.toString(),
            status_id: task?.status_tarefa?.toString(),
            unity_id:
              task.taskServiceOrder?.id_unidade_medida?.toString() || null,
            periodicity:
              Number(task.taskServiceOrder?.periodicidade_uso) || null,
            observation: task.taskServiceOrder.observacao,
            task_id: task.tarefa.toString(),
            register_hour: task.taskServiceOrder.registerHour.map((value) => ({
              id: value.id.toString(),
              start_time: value.inicio,
              end_time: value.fim,
            })),
          });
        } else {
          response.created[findIndex] = {
            id: task.id_tarefa_servico.toString(),
            id_app: task.id_app,
            service_order_id: task.id_ordem_servico.toString(),
            status_id: task?.status_tarefa?.toString(),
            unity_id:
              task.taskServiceOrder?.id_unidade_medida?.toString() || null,
            periodicity:
              Number(task.taskServiceOrder?.periodicidade_uso) || null,
            observation: task.taskServiceOrder.observacao,
            task_id: task.tarefa.toString(),
            register_hour: task.taskServiceOrder.registerHour.map((value) => ({
              id: value.id.toString(),
              start_time: value.inicio,
              end_time: value.fim,
            })),
          };
        }
      } else if (
        task.acao === 'UPDATE' &&
        task.taskServiceOrder !== null &&
        !deletedIds.has(task.id_tarefa_servico.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (item) => item.id === task.id_tarefa_servico.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: task.id_tarefa_servico.toString(),
            id_app: task.id_app,
            service_order_id: task.id_ordem_servico.toString(),
            status_id: task?.status_tarefa?.toString(),
            unity_id:
              task.taskServiceOrder?.id_unidade_medida?.toString() || null,
            periodicity:
              Number(task.taskServiceOrder?.periodicidade_uso) || null,
            observation: task.taskServiceOrder.observacao,
            task_id: task.tarefa.toString(),
            register_hour: task.taskServiceOrder.registerHour.map((value) => ({
              id: value.id.toString(),
              start_time: value.inicio,
              end_time: value.fim,
            })),
          });
          updatedIds.add(task.id_tarefa_servico.toString());
        } else {
          response.updated[findIndex] = {
            id: task.id_tarefa_servico.toString(),
            id_app: task.id_app,
            service_order_id: task.id_ordem_servico.toString(),
            status_id: task?.status_tarefa?.toString(),
            unity_id:
              task.taskServiceOrder?.id_unidade_medida?.toString() || null,
            periodicity:
              Number(task.taskServiceOrder?.periodicidade_uso) || null,
            observation: task.taskServiceOrder.observacao,
            task_id: task.tarefa.toString(),
            register_hour: task.taskServiceOrder.registerHour.map((value) => ({
              id: value.id.toString(),
              start_time: value.inicio,
              end_time: value.fim,
            })),
          };
        }
      } else if (task.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (item) => item === task.id_tarefa_servico.toString(),
        );

        if (findIndex === -1) {
          response.deleted.push(task.id_tarefa_servico.toString() || null);
          deletedIds.add(task.id_tarefa_servico.toString());
        } else {
          response.deleted[findIndex] =
            task.id_tarefa_servico.toString() || null;
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListAttachmentServiceOrderResponseSwagger,
  })
  @Get('/task-service-order/attach')
  async listAttachmentTaskService(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const data = await this.logAttachmentTaskServiceRepository.listByBranch(
      user.branches,
      {
        log_date: {
          gte: startTimestamp,
        },
        ...(user.collaboratorId !== null &&
          user.typeAccess === 2 && {
            taskService: {
              serviceOrder: {
                maintainers: {
                  some: {
                    id_colaborador: user.collaboratorId,
                  },
                },
              },
            },
          }),
      },
    );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    data.forEach((item) => {
      if (query.timestamp === null) {
        if (item.acao === 'DELETE') {
          deletedIds.add(item.id_anexo.toString());
          return;
        }

        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_anexo.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            task_service_order_id: item.id_tarefa_servico.toString(),
            service_order_id: item.taskService.serviceOrder.ID.toString(),
            src: item.url,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            task_service_order_id: item.id_tarefa_servico.toString(),
            service_order_id: item.taskService.serviceOrder.ID.toString(),
            src: item.url,
          };
        }
      } else if (
        item.acao === 'INSERT' &&
        !updatedIds.has(item.id_anexo.toString()) &&
        !deletedIds.has(item.id_anexo.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_anexo.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            task_service_order_id: item.id_tarefa_servico.toString(),
            service_order_id: item.taskService.serviceOrder.ID.toString(),
            src: item.url,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            task_service_order_id: item.id_tarefa_servico.toString(),
            service_order_id: item.taskService.serviceOrder.ID.toString(),
            src: item.url,
          };
        }
      } else if (
        item.acao === 'UPDATE' &&
        !deletedIds.has(item.id_anexo.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id_anexo.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            task_service_order_id: item.id_tarefa_servico.toString(),
            service_order_id: item.taskService.serviceOrder.ID.toString(),
            src: item.url,
          });
          updatedIds.add(item.id_anexo.toString());
        } else {
          response.updated[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app,
            task_service_order_id: item.id_tarefa_servico.toString(),
            service_order_id: item.taskService.serviceOrder.ID.toString(),
            src: item.url,
          };
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value === item.id_anexo.toString(),
        );

        if (findIndex === -1) {
          response.deleted.push(item.id_anexo.toString() || null);
          deletedIds.add(item.id_anexo.toString());
        } else {
          response.deleted[findIndex] = item.id_anexo.toString() || null;
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListRegisterHourOfTaskServiceResponseSwagger,
  })
  @Get('/task-service-order/register-hour')
  async listRegisterHourOfTaskServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();
    //console.log(startTimestamp);
    const allRegister =
      await this.logRegisterHourTaskServiceRepository.listByBranches(
        user.branches,
        {
          log_date: {
            gte: startTimestamp,
          },
          ...(user.collaboratorId !== null &&
            user.typeAccess === 2 && {
              registerHour: {
                taskServiceOrder: {
                  serviceOrder: {
                    maintainers: {
                      some: {
                        id_colaborador: user.collaboratorId,
                      },
                    },
                  },
                },
              },
            }),
        },
      );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    try {
      for await (const register of allRegister) {
        const noTimestamp =
          !query.timestamp ||
          query.timestamp === null ||
          query.timestamp === undefined;

        if (noTimestamp) {
          if (register.acao === 'DELETE') {
            return;
          }
          const findIndex = response.created.findIndex(
            (item) => item.id === register.id_registro.toString(),
          );

          if (findIndex === -1) {
            response.created.push({
              id: register.id_registro.toString(),
              id_app: register.id_app,
              service_order_id:
                register.registerHour.taskServiceOrder.serviceOrder.ID.toString(),
              task_service_order_id: register.id_tarefa_servico.toString(),
              start: register.inicio,
              end: register.fim,
            });
          } else {
            response.created[findIndex] = {
              id: register.id_registro.toString(),
              id_app: register.id_app,
              service_order_id:
                register.registerHour.taskServiceOrder.serviceOrder.ID.toString(),
              task_service_order_id: register.id_tarefa_servico.toString(),
              start: register.inicio,
              end: register.fim,
            };
          }
        } else {
          if (
            register.acao === 'INSERT' &&
            !updatedIds.has(register.id_registro.toString()) &&
            !deletedIds.has(register.id_registro.toString())
          ) {
            const findIndex = response.created.findIndex(
              (item) => item.id === register.id_registro.toString(),
            );

            if (findIndex === -1) {
              response.created.push({
                id: register.id_registro.toString(),
                id_app: register.id_app,
                service_order_id:
                  register.registerHour.taskServiceOrder.serviceOrder.ID.toString(),
                task_service_order_id: register.id_tarefa_servico.toString(),
                start: register.inicio,
                end: register.fim,
              });
            } else {
              response.created[findIndex] = {
                id: register.id_registro.toString(),
                id_app: register.id_app,
                service_order_id:
                  register.registerHour.taskServiceOrder.serviceOrder.ID.toString(),
                task_service_order_id: register.id_tarefa_servico.toString(),
                start: register.inicio,
                end: register.fim,
              };
            }
          } else if (
            register.acao === 'UPDATE' &&
            !deletedIds.has(register.id_registro.toString())
          ) {
            const findIndex = response.updated.findIndex(
              (item) => item.id === register.id_registro.toString(),
            );

            if (findIndex === -1) {
              response.updated.push({
                id: register.id_registro.toString(),
                id_app: register.id_app,
                service_order_id:
                  register.registerHour.taskServiceOrder.serviceOrder.ID.toString(),
                task_service_order_id: register.id_tarefa_servico.toString(),
                start: register.inicio,
                end: register.fim,
              });
              updatedIds.add(register.id_registro.toString());
            } else {
              response.updated[findIndex] = {
                id: register.id_registro.toString(),
                id_app: register.id_app,
                service_order_id:
                  register.registerHour.taskServiceOrder.serviceOrder.ID.toString(),
                task_service_order_id: register.id_tarefa_servico.toString(),
                start: register.inicio,
                end: register.fim,
              };
            }
          } else if (register.acao === 'DELETE') {
            const findIndex = response.deleted.findIndex(
              (item) => item.id === register.id_registro,
            );

            if (findIndex === -1) {
              response.deleted.push(register.id_registro);
              deletedIds.add(register.id_registro.toString());
            } else {
              response.deleted[findIndex] = register.id_registro;
            }
          }
        }
      }

      // Remover IDs duplicados dos arrays created
      response.created = response.created.filter(
        (item) => !updatedIds.has(item.id),
      );
      // Remover IDs duplicados dos arrays created e updated
      response.created = response.created.filter(
        (item) => !deletedIds.has(item.id),
      );
      response.updated = response.updated.filter(
        (item) => !deletedIds.has(item.id),
      );
    } catch (error) {
      console.log(error);
      throw new ConflictException(error);
    }

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListAttachmentRequestServiceResponseSwagger,
  })
  @Get('/request-service/:id/attach')
  async listAttachByRequest(@Req() req, @Param('id') id: string) {
    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const data = await this.logAttachmentRequestServiceRepository.listByRequest(
      Number(id),
      {
        log_date: {
          gte: startTimestamp,
        },
      },
    );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    data.forEach((item) => {
      if (query.timestamp === null) {
        if (item.acao === 'DELETE') {
          deletedIds.add(item.id_anexo.toString());
          return;
        }
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_anexo.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app || null,
            request_id: item.id_solicitacao.toString(),
            src: item.url,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app || null,
            request_id: item.id_solicitacao.toString(),
            src: item.url,
          };
        }
      } else if (
        item.acao === 'INSERT' &&
        !updatedIds.has(item.id_anexo.toString()) &&
        !deletedIds.has(item.id_anexo.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_anexo.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app || null,
            request_id: item.id_solicitacao.toString(),
            src: item.url,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app || null,
            request_id: item.id_solicitacao.toString(),
            src: item.url,
          };
        }
      } else if (
        item.acao === 'UPDATE' &&
        !deletedIds.has(item.id_anexo.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id_anexo.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: item.id_anexo.toString(),
            id_app: item.id_app || null,
            request_id: item.id_solicitacao.toString(),
            src: item.url,
          });
          updatedIds.add(item.id_anexo.toString());
        } else {
          response.updated[findIndex] = {
            id: item.id_anexo.toString(),
            id_app: item.id_app || null,
            request_id: item.id_solicitacao.toString(),
            src: item.url,
          };
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value.id === item.id_anexo,
        );

        if (findIndex === -1) {
          response.deleted.push(item.id_anexo);
          deletedIds.add(item.id_anexo.toString());
        } else {
          response.deleted[findIndex] = item.id_anexo;
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListAttachmentRequestServiceResponseSwagger,
  })
  @Get('/request-service/attach')
  async listAttachmentRequestService(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const data = await this.logAttachmentRequestServiceRepository.listByClient(
      user.clientId,
      {
        log_date: {
          gte: startTimestamp,
        },
      },
    );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    data.forEach((item) => {
      if (!item.id_anexo || item.id_anexo === null) {
        return;
      }

      if (!query.timestamp) {
        if (item.acao === 'DELETE') {
          deletedIds.add(item.id_anexo.toString());
          return;
        }
        const findIndex = response.created.findIndex(
          (value) => value.id === item?.id_anexo?.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item?.id_anexo?.toString(),
            request_id: item.id_solicitacao.toString(),
            id_app: item?.id_app || null,
            src: item.url,
          });
        }
      } else if (
        item.acao === 'INSERT' &&
        !updatedIds.has(item.id_anexo.toString()) &&
        !deletedIds.has(item.id_anexo.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item?.id_anexo?.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item?.id_anexo?.toString(),
            request_id: item.id_solicitacao.toString(),
            id_app: item?.id_app || null,
            src: item.url,
          });
        }
      } else if (
        item.acao === 'UPDATE' &&
        !deletedIds.has(item.id_anexo.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item?.id_anexo?.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: item?.id_anexo?.toString(),
            request_id: item.id_solicitacao.toString(),
            id_app: item?.id_app || null,
            src: item.url,
          });
          updatedIds.add(item.id_anexo.toString());
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value === item?.id_anexo?.toString(),
        );

        if (findIndex === -1) {
          response.deleted.push(item.id_anexo.toString());
          deletedIds.add(item.id_anexo.toString());
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/service-order/cost')
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async syncListCostServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;
    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    // // Buscar IDs das ordens de serviço que foram modificadas a partir do timestamp
    // const serviceOrders =
    //   await this.logServiceOrderRepository.listOnlyServiceOrderIdByBranchesAndFilter(
    //     user.branches, // Aqui você pode passar um array de filiais se necessário
    //     {
    //       log_date: { gte: startTimestamp },
    //     },
    //   );
    // console.log(serviceOrders);
    // // Extrair apenas os IDs em um array de números
    // const serviceOrderIds = serviceOrders.map((order) => order.id_ordem);

    // if (serviceOrderIds.length === 0) {
    //   return response; // Se não houver ordens de serviço, retorna resposta vazia
    // }

    // Buscar os custos associados às ordens de serviço encontradas
    const data = await this.logCostServiceOrderRepository.listByBranches(
      user.branches, // Agora passamos o array de IDs coletado automaticamente
      {
        log_date: { gte: startTimestamp },
        ...(user.collaboratorId !== null &&
          user.typeAccess === 2 && {
            costOrderService: {
              serviceOrder: {
                maintainers: {
                  some: {
                    id_colaborador: user.collaboratorId,
                  },
                },
              },
            },
          }),
      },
    );

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    data.forEach((obj) => {
      const newObj = {
        id: obj.id_custo.toString(),
        id_app: obj.id_app,
        service_order_id: obj.id_ordem_servico.toString(),
        description_cost_id: obj.id_descricao_custo?.toString() || null,
        quantity: Number(obj.quantidade),
        value_unity: Number(obj.valor_unitario),
        date_cost: obj.data_custo,
        observation: obj.observacoes,
      };

      if (!query.timestamp) {
        if (obj.acao === 'DELETE') {
          deletedIds.add(obj.id_custo.toString());
          return;
        }
        const findIndex = response.created.findIndex(
          (value) => value.id === newObj.id,
        );

        if (findIndex === -1) {
          response.created.push(newObj);
        } else {
          response.created[findIndex] = newObj;
        }
      } else if (
        obj.acao === 'INSERT' &&
        !updatedIds.has(obj.id_custo.toString()) &&
        !deletedIds.has(obj.id_custo.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === newObj.id,
        );

        if (findIndex === -1) {
          response.created.push(newObj);
        } else {
          response.created[findIndex] = newObj;
        }
      } else if (
        obj.acao === 'UPDATE' &&
        !deletedIds.has(obj.id_custo.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === newObj.id,
        );

        if (findIndex === -1) {
          response.updated.push(newObj);
          updatedIds.add(obj.id_custo.toString());
        } else {
          response.updated[findIndex] = newObj;
        }
      } else if (obj.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value.id === obj.id_custo.toString(),
        );

        if (findIndex === -1) {
          response.deleted.push(obj.id_custo.toString());
          deletedIds.add(obj.id_custo.toString());
        } else {
          response.deleted[findIndex] = obj.id_custo.toString();
        }
      }
    });

    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return response;
  }

  @UseGuards(AuthGuard)
  @Get('/signature')
  async listSignatureServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    const allLogServiceOrder =
      await this.logServiceOrderSignatureRepository.listByBranches(
        user.branches,
        {
          log_date: {
            gte: startTimestamp,
          },
          ...(user.collaboratorId !== null &&
            user.typeAccess === 2 && {
              signatureServiceOrder: {
                serviceOrder: {
                  maintainers: {
                    some: {
                      id_colaborador: user.collaboratorId,
                    },
                  },
                },
              },
            }),
        },
      );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    allLogServiceOrder.forEach((log) => {
      if (!query.timestamp) {
        if (log.acao === 'DELETE') {
          deletedIds.add(log.id_assinatura.toString());
          return;
        }

        const findIndex = response.created.findIndex(
          (value) => value.id === log.id_assinatura.toString(),
        );

        if (findIndex >= 0) {
          response.created[findIndex] = {
            id: log.id_assinatura.toString(),
            service_order_id: log.id_ordem_servico.toString(),
            id_app: log.id_app,
            name_client: log.nome_cliente,
            role_id: log.id_cargo?.toString() || null,
            name_technic: log.nome_tecnico,
            signed: log.status === 1,
            name_extra: log.nome_extra,
            url: log.url,
            date: log.data_assinatura,
          };
        } else {
          response.created.push({
            id: log.id_assinatura.toString(),
            id_app: log.id_app,
            service_order_id: log.id_ordem_servico.toString(),
            role_id: log.id_cargo?.toString() || null,
            name_client: log.nome_cliente,
            name_technic: log.nome_tecnico,
            signed: log.status === 1,
            name_extra: log.nome_extra,
            url: log.url,
            date: log.data_assinatura,
          });
        }
      } else if (
        log.acao === 'INSERT' &&
        !updatedIds.has(log.id_assinatura.toString()) &&
        !deletedIds.has(log.id_assinatura.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === log.id_assinatura.toString(),
        );

        if (findIndex >= 0) {
          response.created[findIndex] = {
            id: log.id_assinatura.toString(),
            service_order_id: log.id_ordem_servico.toString(),
            role_id: log.id_cargo?.toString() || null,
            id_app: log.id_app,
            name_client: log.nome_cliente,
            name_technic: log.nome_tecnico,
            signed: log.status === 1,
            name_extra: log.nome_extra,
            url: log.url,
            date: log.data_assinatura,
          };
        } else {
          response.created.push({
            id: log.id_assinatura.toString(),
            id_app: log.id_app,
            service_order_id: log.id_ordem_servico.toString(),
            role_id: log.id_cargo?.toString() || null,
            name_client: log.nome_cliente,
            name_technic: log.nome_tecnico,
            signed: log.status === 1,
            name_extra: log.nome_extra,
            url: log.url,
            date: log.log_date,
          });
        }
      } else if (
        log.acao === 'UPDATE' &&
        !deletedIds.has(log.id_assinatura.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === log.id_assinatura.toString(),
        );

        if (findIndex >= 0) {
          response.updated[findIndex] = {
            id: log.id_assinatura.toString(),
            service_order_id: log.id_ordem_servico.toString(),
            role_id: log.id_cargo?.toString() || null,
            id_app: log.id_app,
            name_client: log.nome_cliente,
            name_technic: log.nome_tecnico,
            signed: log.status === 1,
            name_extra: log.nome_extra,
            url: log.url,
            date: log.data_assinatura,
          };
        } else {
          response.updated.push({
            id: log.id_assinatura.toString(),
            id_app: log.id_app,
            service_order_id: log.id_ordem_servico.toString(),
            role_id: log.id_cargo?.toString() || null,
            name_client: log.nome_cliente,
            name_technic: log.nome_tecnico,
            signed: log.status === 1,
            name_extra: log.nome_extra,
            url: log.url,
            date: log.data_assinatura,
          });
          updatedIds.add(log.id_assinatura.toString());
        }
      } else if (log.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value.id === log.id_assinatura.toString(),
        );

        if (findIndex >= 0) {
          response.deleted[findIndex] = log.id_assinatura.toString();
        } else {
          response.deleted.push(log.id_assinatura.toString());
          deletedIds.add(log.id_assinatura.toString());
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }
  @UseGuards(AuthGuard)
  @Get('/dashboard-equipment')
  async listDashboardEquipment(@Req() req) {
    const user: IUserInfo = req.user;
    const allEquipments =
      await this.equipmentRepository.findByOrderAndEquipment(user.clientId);

    const total_equipments = allEquipments.length;

    const equipmentsWithClosedOrders = allEquipments.filter((equipment) => {
      const relatedOrders = equipment.orderService;
      if (relatedOrders.length === 0) {
        return true;
      }
      return relatedOrders.every(
        (order) => order.data_hora_encerramento !== null,
      );
    });

    const count_apto = equipmentsWithClosedOrders.length;
    return {
      total_equipments,
      count_apto,
    };
  }
  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListNoteStopResponseSwagger,
  })
  @ApiOkResponse({
    description: 'Success',
  })
  @Get('/list-note-stop')
  async listNoteStopForApp(@Req() req) {
    const user: IUserInfo = req.user;
    const querySchema = z.object({
      timestamp: z.coerce.date().optional(),
    });

    const query = querySchema.parse(req.query);

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp).toISOString()
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3).toISOString();

    // Alterado para retornar uma lista de registros
    const list = await this.logNoteStopServiceOrderRepository.findByMany(
      user.branches,
      {
        log_date: {
          gte: startTimestamp,
        },
        ...(user.collaboratorId !== null &&
          user.typeAccess === 2 && {
            serviceOrder: {
              maintainers: {
                some: {
                  id_colaborador: user.collaboratorId,
                },
              },
            },
          }),
      },
    );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    list.forEach((item) => {
      const listData = {
        id: item.id_apontamento_parada.toString(),
        id_app: item.id_app,
        service_order_id: item.id_ordem_servico.toString(),
        date_worked: item.data_hora_start
          ? new Date(item.data_hora_start).toISOString()
          : null,
        date_stop: item.data_hora_stop
          ? new Date(item.data_hora_stop).toISOString()
          : null,
        observations: item.observacoes?.toString() || null,
      };

      if (!query.timestamp) {
        if (item.acao === 'DELETE') {
          deletedIds.add(listData.id);
          return;
        }
        const findIndex = response.created.findIndex(
          (value) => value.id === listData.id,
        );
        if (findIndex === -1) {
          response.created.push(listData);
        } else {
          response.created[findIndex] = listData;
        }
      } else if (
        item.acao === 'INSERT' &&
        !updatedIds.has(listData.id) &&
        !deletedIds.has(listData.id)
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === listData.id,
        );
        if (findIndex === -1) {
          response.created.push(listData);
        } else {
          response.created[findIndex] = listData;
        }
      } else if (item.acao === 'UPDATE' && !deletedIds.has(listData.id)) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === listData.id,
        );
        if (findIndex === -1) {
          response.updated.push(listData);
          updatedIds.add(listData.id);
        } else {
          response.updated[findIndex] = listData;
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value.id === listData.id,
        );
        if (findIndex === -1) {
          response.deleted.push(listData.id);
          deletedIds.add(listData.id);
        } else {
          response.deleted[findIndex] = listData.id;
        }
      }
    });

    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id) && !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }
}
