import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
//import * as sharp from 'sharp';
import sharp from 'sharp';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import AttachmentRequestServiceRepository from 'src/repositories/attachment-request-service-repository';
import AttachmentTaskServiceRepository from 'src/repositories/attachment-task-service-repository';
import { AttachmentsServiceOrderRepository } from 'src/repositories/attachments-service-order-repository';
import { CostServiceOrderRepository } from 'src/repositories/cost-service-order-repository';
import EquipmentRepository from 'src/repositories/equipment-repository';
import LogAttachmentRequestServiceRepository from 'src/repositories/log-attachment-request-service-repository';
import LogMaintenanceAppointmentManualRepository from 'src/repositories/log-maintenance-appointment-manual-repository';
import LogServiceOrderMaintainerRepository from 'src/repositories/log-service-order-maintainer-repository';
import LogServiceOrderSignatureRepository from 'src/repositories/log-service-order-signature-repository';
import LogTaskServiceOrderReturnRepository from 'src/repositories/log-task-service-order-return-repository';
import MaintenanceAppointmentManualRepository from 'src/repositories/maintenance-appointment-manual-repository';
import MaintenanceDisplacementRepository from 'src/repositories/maintenance-displacement-repository';
import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
import { NoteServiceOrderRepository } from 'src/repositories/note-service-order-repository';
import { NoteStopServiceOrderRepository } from 'src/repositories/note-stop-service-order-repository';
import NumberRequestServiceRepository from 'src/repositories/number-request-service-repository';
import RegisterHourTaskServiceRepository from 'src/repositories/register-hour-task-service-repository';
import RequestServiceRepository from 'src/repositories/request-service-repository';
import ServiceOrderMaintainerRepository from 'src/repositories/service-order-maintainer-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import ServiceOrderSignatureRepository from 'src/repositories/service-order-signature-repository';
import TaskRepository from 'src/repositories/task-repository';
import TaskServiceOrderRepository from 'src/repositories/task-service-order-repository';
import TaskServiceOrderReturnRepository from 'src/repositories/task-service-order-return-repository';
import { DateService } from 'src/service/data.service';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';
import CreateAttachmentBodySwagger from '../dtos/swagger/createAttachment-body-swagger';
import CreateSignatureServiceOrderAttachmentBodySwagger from '../dtos/swagger/createSignatureServiceOrderAttachment-body-swagger';
import ListNoteStopResponseSwagger from '../dtos/swagger/listNoteStop-response-swagger';
import SyncAppointmentManualBodySwagger from '../dtos/swagger/syncAppointmentManual-body-swagger';
import SyncAppointmentManualResponseSwagger from '../dtos/swagger/syncAppointmentManual-response-swagger';
import SyncDisplacementBodySwagger from '../dtos/swagger/syncDisplacement-body-swagger';
import SyncDisplacementResponseSwagger from '../dtos/swagger/syncDisplacement-response-swagger';
import SyncNoteStopBodySwagger from '../dtos/swagger/syncNoteStop-body-swagger';
import SyncTaskReturnBodySwagger from '../dtos/swagger/syncTaskReturn-body-swagger';
import SyncTaskReturnResponseSwagger from '../dtos/swagger/syncTaskReturn-response-swagger';
import SyncTaskServiceOrderBodySwagger from '../dtos/swagger/syncTaskServiceOrder-body-swagger';

@ApiTags('App Sync Maintenance Service Order')
@ApiBearerAuth()
@Controller('/maintenance/service-order/app/sync')
export default class SyncAppServiceOrderController {
  constructor(
    private serviceOrderRepository: ServiceOrderRepository,
    private serviceOrderMaintainer: ServiceOrderMaintainerRepository,
    private logServiceOrderMaintainer: LogServiceOrderMaintainerRepository,
    private materialServiceOrder: MaterialServiceOrderRepository,
    private requestServiceRepository: RequestServiceRepository,
    private attachmentsServiceOrderRepository: AttachmentsServiceOrderRepository,
    private logAttachmentRequestServiceRepository: LogAttachmentRequestServiceRepository,
    private envService: ENVService,
    private dateService: DateService,
    private fileService: FileService,
    private numberRequestServiceRepository: NumberRequestServiceRepository,
    private equipmentRepository: EquipmentRepository,
    private attachmentRequestServiceRepository: AttachmentRequestServiceRepository,
    private taskServiceOrderRepository: TaskServiceOrderRepository,
    private maintenanceAppointmentManualRepository: MaintenanceAppointmentManualRepository,
    private logMaintenanceAppointmentManualRepository: LogMaintenanceAppointmentManualRepository,
    private taskServiceOrderReturnRepository: TaskServiceOrderReturnRepository,
    private registerHourTaskServiceRepository: RegisterHourTaskServiceRepository,
    private costServiceOrderRepository: CostServiceOrderRepository,
    private noteServiceOrder: NoteServiceOrderRepository,
    private noteStopServiceOrderRepository: NoteStopServiceOrderRepository,
    private attachmentTaskServiceRepository: AttachmentTaskServiceRepository,
    private taskRepository: TaskRepository,
    private maintenanceDisplacementRepository: MaintenanceDisplacementRepository,
    private logTaskServiceOrderReturnRepository: LogTaskServiceOrderReturnRepository,
    private serviceOrderSignatureRepository: ServiceOrderSignatureRepository,
    private logServiceOrderSignatureRepository: LogServiceOrderSignatureRepository,
  ) {}
  @UseGuards(AuthGuard)
  @Post('/service-order')
  async syncServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      created: z
        .array(
          z.object({
            id: z.string(),
            //code: z.string(),
            description: z.string(),
            date_emission: z.coerce.date(),
            date_request: z.coerce.date().nullable().optional(),
            date_expected: z.coerce.date().nullable().optional(),
            date_machine_stopped: z.coerce.date().nullable().optional(),
            date_machine_worked: z.coerce.date().nullable().optional(),
            date_end: z.coerce.date().nullable().optional(),
            branch_id: z.string(),
            request_id: z.coerce.string().optional(),
            requester_id: z.coerce.number().optional(),
            status_id: z.coerce.number(),
            equipment_id: z.coerce.number(),
            type_maintenance_id: z.coerce.number(),
            sector_executing_id: z.coerce.number(),
            priority_id: z.coerce.number().optional(),
            hour_meter: z.coerce.number().optional(),
            odometer: z.coerce.number().optional(),
            classification_id: z.coerce.number().nullable(),
            solution: z
              .union([z.string(), z.null()])
              .optional()
              .transform((val) => (val === 'null' || !val ? null : val)),
            rating: z
              .union([z.number(), z.null()])
              .optional()
              .transform((val) =>
                val === null || val === undefined ? null : val,
              ),
            technical_arrival: z.coerce.date().optional().nullable(),
            stopped_machine: z.coerce.boolean().optional(),
            technical_drive: z.coerce.date().optional().nullable(),
            executor_observation: z
              .union([z.string(), z.null()])
              .optional()
              .transform((val) => (val === 'null' || !val ? null : val)),
            maintenance_diagnostics: z
              .union([z.string(), z.null()])
              .optional()
              .transform((val) => (val === 'null' || !val ? null : val)),
          }),
        )
        .optional(),
      updated: z
        .array(
          z.object({
            id: z.coerce.number(),
            //code: z.string(),
            description: z.string(),
            date_emission: z.coerce.date().nullable().optional(),
            date_request: z.coerce.date().nullable().optional(),
            date_expected: z.coerce.date().nullable().optional(),
            date_machine_stopped: z.coerce.date().nullable().optional(),
            date_machine_worked: z.coerce.date().nullable().optional(),
            date_end: z.coerce.date().nullable().optional(),
            branch_id: z.string(),
            request_id: z.coerce.string().optional(),
            requester_id: z.coerce.number().optional(),
            status_id: z.coerce.number(),
            equipment_id: z.coerce.number(),
            type_maintenance_id: z.coerce.number(),
            sector_executing_id: z.coerce.number(),
            priority_id: z.coerce.number().optional(),
            hour_meter: z.coerce.number().optional(),
            odometer: z.coerce.number().optional(),
            classification_id: z.coerce.number().nullable(),
            solution: z
              .union([z.string(), z.null()])
              .optional()
              .transform((val) => (val === 'null' || !val ? null : val)),
            rating: z
              .union([z.number(), z.null()])
              .optional()
              .transform((val) =>
                val === null || val === undefined ? null : val,
              ),
            technical_arrival: z.coerce.date().optional().nullable(),
            stopped_machine: z.coerce.boolean().optional(),
            technical_drive: z.coerce.date().optional().nullable(),
            executor_observation: z
              .union([z.string(), z.null()])
              .optional()
              .transform((val) => (val === 'null' || !val ? null : val)),
            maintenance_diagnostics: z
              .union([z.string(), z.null()])
              .optional()
              .transform((val) => (val === 'null' || !val ? null : val)),
          }),
        )
        .optional(),
      deleted: z.array(z.coerce.number()).optional(),
    });

    const { created, updated, deleted } = bodySchema.parse(req.body);

    const response: {
      created?:
        | {
            id: string;
            code: string;
            id_app: string;
          }[]
        | null;
      sync: boolean;
    } = {
      created: [],
      sync: false,
    };

    try {
      if (created.length > 0) {
        for await (const order of created) {
          // const serviceOrder =
          //   await this.serviceOrderRepository.findByCodeAndEquipment(
          //     user.clientId,
          //     order.code,
          //     Number(order.equipment_id),
          //   );

          const equipment = await this.equipmentRepository.findById(
            Number(order.equipment_id),
          );

          if (true) {
            const newOrder = await this.serviceOrderRepository.create({
              ID_cliente: user.clientId,
              id_app: order.id,
              ID_filial: equipment.branch.ID,
              id_equipamento: equipment.ID,
              //ordem: order.code,
              descricao_solicitacao: order.description,
              log_date: order.date_emission,
              data_hora_solicitacao: order.date_request,
              data_prevista_termino: order.date_expected,
              data_hora_encerramento: order.date_end,
              tipo_manutencao: Number(order.type_maintenance_id),
              setor_executante: Number(order.sector_executing_id),
              prioridade: Number(order.priority_id),
              horimetro: Number(order.hour_meter),
              odometro: Number(order.odometer),
              status_os: Number(order.status_id),
              id_solicitante: order.requester_id || null,
              log_user: user.login,
              classificacao: order.classification_id || null,
              descricao_servico_realizado: order.solution || null,
              nota_avalicao_servico: order.rating || null,
              chegada_tecnico: order.technical_arrival ?? null,
              maquina_parada: order.stopped_machine ? 1 : 0,
              data_equipamento_parou: order.date_machine_stopped || null,
              data_equipamento_funcionou: order.date_machine_worked || null,
              data_acionamento_tecnico: order.technical_drive ?? null,
              observacoes_executante: order.executor_observation || null,
              observacoes: order.maintenance_diagnostics || null,
            });

            response.created.push({
              id: newOrder.ID.toString(),
              code: newOrder.ordem,
              id_app: order.id.toString(),
            });
          }
        }
      }
      if (updated.length > 0) {
        for await (const order of updated) {
          const equipment = await this.equipmentRepository.findById(
            Number(order.equipment_id),
          );

          await this.serviceOrderRepository.update(order.id, {
            ID_filial: equipment.branch.ID,
            id_equipamento: equipment.ID,
            descricao_solicitacao: order.description,
            data_hora_solicitacao: order.date_request,
            data_prevista_termino: order.date_expected,
            data_hora_encerramento: order.date_end,
            tipo_manutencao: Number(order.type_maintenance_id),
            setor_executante: Number(order.sector_executing_id),
            prioridade: Number(order.priority_id),
            horimetro: Number(order.hour_meter),
            odometro: Number(order.odometer),
            status_os: Number(order.status_id),
            id_solicitante: order.requester_id || null,
            classificacao: order.classification_id || null,
            descricao_servico_realizado: order.solution || null,
            nota_avalicao_servico: order.rating || null,
            chegada_tecnico: order.technical_arrival ?? null,
            maquina_parada: order.stopped_machine ? 1 : 0,
            data_equipamento_parou: order.date_machine_stopped || null,
            data_equipamento_funcionou: order.date_machine_worked || null,
            data_acionamento_tecnico: order.technical_drive ?? null,
            observacoes_executante: order.executor_observation || null,
            observacoes: order.maintenance_diagnostics || null,
          });
        }
      }
      if (deleted.length > 0) {
        for await (const id of deleted) {
          await this.serviceOrderRepository.delete(id);
        }
      }
    } catch (error) {
      console.log(error);
      throw new ConflictException(error);
    }

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateAttachmentBodySwagger,
  })
  @Post('/service-order/:id/attach')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  @UseInterceptors(FileInterceptor('file'))
  async createAttachment(
    @Req() req,
    @Param('id') id: string,
    @Body('id_app') id_app: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user: IUserInfo = req.user;

    const serviceOrder = await this.serviceOrderRepository.findById(Number(id));

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    if (!file) {
      throw new BadRequestException(MessageService.Attachments_file_required);
    }

    try {
      if (file) {
        const nodes_permission = ['production', 'dev'];
        const path_remote = nodes_permission.includes(this.envService.NODE_ENV)
          ? this.envService.URL_IMAGE
          : this.envService.FILE_PATH;
        const path_local = this.envService.FILE_PATH;
        const path_local_img = `${path_local}/service_order/id_${id}`;
        const path_remote_img = `${path_remote}/service_order/id_${id}`;

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
          // Para outros formatos, apenas salva o arquivo original
          this.fileService.write(
            path_local_img,
            file.originalname,
            file.buffer,
          );
        }

        await this.attachmentsServiceOrderRepository.create({
          id_app: id_app,
          id_cliente: user.clientId,
          id_ordem_servico: serviceOrder.ID,
          nome_anexo: file.originalname,
          url: `${path_remote_img}/${file.originalname}`,
          log_user: user.login,
        });

        return {
          sync: true,
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateAttachmentBodySwagger,
  })
  @Delete('/service-order/:id/attach')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({
    description: MessageService.Service_order_id_not_found,
  })
  async deleteAttachmentServiceOrder(@Req() req, @Param('id') id: string) {
    const bodySchema = z.object({
      id: z.array(z.number()),
    });

    const body = bodySchema.parse(req.body);

    const serviceOrder = await this.serviceOrderRepository.findById(Number(id));

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    try {
      for await (const attachId of body.id) {
        const attach =
          await this.attachmentsServiceOrderRepository.findById(attachId);

        if (!attach) {
          throw new NotFoundException(MessageService.Attachments_file_required);
        }

        await this.attachmentsServiceOrderRepository.delete(attach.id);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateAttachmentBodySwagger,
  })
  @Post('/request-service/:id/attach')
  @UseInterceptors(FileInterceptor('file'))
  async createAttachmentRequestService(
    @Req() req,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      id_app: z.coerce.string().nullable().optional(),
    });

    const body = bodySchema.parse(req.body);

    let requestService = null;

    if (Number(id) > 0) {
      requestService = await this.requestServiceRepository.findById(Number(id));
    } else {
      requestService = await this.requestServiceRepository.findByIdApp(id);
    }

    if (!requestService) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    if (!file) {
      throw new BadRequestException(MessageService.Attachments_file_required);
    }

    try {
      if (file) {
        const nodes_permission = ['production', 'dev'];
        const path_remote = nodes_permission.includes(this.envService.NODE_ENV)
          ? this.envService.URL_IMAGE
          : this.envService.FILE_PATH;
        const path_local = this.envService.FILE_PATH;
        const path_local_img = `${path_local}/request_service/id_${id}`;
        const path_remote_img = `${path_remote}/request_service/id_${id}`;

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

        const attachment = await this.attachmentRequestServiceRepository.create(
          {
            id_solicitacao: requestService.id,
            nome_anexo: file.originalname,
            id_app: body?.id_app || null,
            url: `${path_remote_img}/${file.originalname}`,
            log_user: user.login,
          },
        );

        return {
          sync: true,
          id: attachment.id,
          id_app: attachment.id_app,
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/request-service/:requestId/attach/:id')
  async deleteAttachmentRequestService(
    @Param('requestId') requestId: string,
    @Param('id') id: string,
  ) {
    const requestService = await this.requestServiceRepository.findById(
      Number(requestId),
    );

    if (!requestService) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const attachment = await this.attachmentRequestServiceRepository.findById(
      Number(id),
    );

    try {
      await this.attachmentRequestServiceRepository.delete(attachment.id);

      const logAttachment =
        await this.logAttachmentRequestServiceRepository.last();

      await this.logAttachmentRequestServiceRepository.update(
        logAttachment.id,
        {
          log_date: new Date(),
        },
      );

      const path_local = this.envService.FILE_PATH;

      const path_local_img = `${path_local}/request_service/id_${requestService.id}/${attachment.nome_anexo}`;

      this.fileService.delete(path_local_img);

      return {
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateAttachmentBodySwagger,
  })
  @Post('/task-service-order/:id/attach')
  @UseInterceptors(FileInterceptor('file'))
  async createAttachmentTaskService(
    @Req() req,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const bodySchema = z.object({
      id_app: z.coerce.string().nullable().optional(),
    });

    const body = bodySchema.parse(req.body);

    let taskService = null;

    if (Number(id) > 0) {
      taskService = await this.taskServiceOrderRepository.findById(Number(id));
    } else {
      taskService = await this.taskServiceOrderRepository.findByWhere({
        id_app: id,
      });
    }

    const isSolicitationValid = await this.taskServiceOrderRepository.findById(
      taskService.id,
    );

    if (!isSolicitationValid) {
      throw new NotFoundException(
        'The referenced solicitation ID does not exist.',
      );
    }

    if (!taskService) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    if (!file) {
      throw new BadRequestException(MessageService.Attachments_file_required);
    }

    try {
      if (file) {
        const nodes_permission = ['production', 'dev'];
        const path_remote = nodes_permission.includes(this.envService.NODE_ENV)
          ? this.envService.URL_IMAGE
          : this.envService.FILE_PATH;
        const path_local = this.envService.FILE_PATH;
        const path_local_img = `${path_local}/service_order/id_${taskService.serviceOrder.ID}/task/id_${taskService.id}`;
        const path_remote_img = `${path_remote}/service_order/id_${taskService.serviceOrder.ID}/task/id_${taskService.id}`;

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

        const url = `${path_remote_img}/${file.originalname}`;

        if (url.length > 255) {
          throw new BadRequestException(
            'Generated URL exceeds the maximum length allowed.',
          );
        }

        const isTaskServiceValid =
          await this.taskServiceOrderRepository.findById(taskService.id);

        if (!isTaskServiceValid) {
          throw new NotFoundException(
            'Task Service not found in the related table.',
          );
        }

        const attachment = await this.attachmentTaskServiceRepository.create({
          id_tarefa_servico: taskService.id,
          id_app: body?.id_app || null,
          anexo: file.originalname,
          url: `${path_remote_img}/${file.originalname}`,
        });

        return {
          sync: true,
          id: attachment.id,
          id_app: attachment.id_app,
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete/task-service-order/:taskId/attach/:id')
  async deleteAttachmentsByTaskService(
    @Req() _req,
    @Param('taskId') taskId: string,
    @Param('id') id: string,
  ) {
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

      const path_local = this.envService.FILE_PATH;
      const path_local_img = `${path_local}/service_order/id_${taskServiceOrder.serviceOrder.ID}/task/id_${taskId}/${attachment.anexo}`;

      this.fileService.delete(path_local_img);

      return {
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete/task-service-order/attach')
  async deleteAllAttachmentsByTaskService(@Req() req) {
    const bodySchema = z.object({
      ids: z.array(z.number()),
    });

    const body = bodySchema.parse(req.body);

    try {
      for await (const attachmentId of body.ids) {
        const attachment = await this.attachmentTaskServiceRepository.findById(
          Number(attachmentId),
        );

        await this.attachmentTaskServiceRepository.delete(Number(attachmentId));

        //const nodes_permission = ['production', 'dev'];

        const path_local = this.envService.FILE_PATH;

        const path_local_img = `${path_local}/service_order/id_${attachment.taskService.serviceOrder.ID}/task/id_${attachment.taskService.id}/${attachment.anexo}`;

        this.fileService.delete(path_local_img);
      }

      return {
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/request-service')
  async syncRequestService(@Req() req) {
    const user: IUserInfo = req.user;

    const bodySchema = z.object({
      created: z
        .array(
          z.object({
            id: z.string(),
            email: z.coerce.string(),
            equipment_id: z.coerce.number(),
            //code: z.string(),
            problem_id: z.coerce.number(),
            priority_id: z.coerce.number(),
            stopped_machine: z.coerce.boolean().optional().nullable(),
            subject: z.string().optional().nullable(),
            description: z.string(),
            status: z.coerce.number().optional().nullable(),
            date_emission: z.coerce.date().optional().nullable(),
            date_expected: z.coerce.date().optional().nullable(),
            date_machine_stopped: z.coerce.date().optional().nullable(),
            service_order_id: z.coerce.string().optional().nullable(),
          }),
        )
        .optional(),
      updated: z
        .array(
          z.object({
            id: z.string(),
            //branch_id: z.coerce.number(),
            email: z.coerce.string(),
            //code: z.string(),
            equipment_id: z.coerce.number(),
            problem_id: z.coerce.number(),
            priority_id: z.coerce.number(),
            stopped_machine: z.coerce.boolean().optional(),
            subject: z.string().optional().nullable(),
            description: z.string(),
            status: z.coerce.number().optional(),
            date_emission: z.coerce.date(),
            date_expected: z.coerce.date().optional().nullable(),
            date_machine_stopped: z.coerce.date().optional().nullable(),
            service_order_id: z.coerce.string().optional().nullable(),
          }),
        )
        .optional(),
      deleted: z.array(z.coerce.number()).optional(),
    });

    const { created, updated, deleted } = bodySchema.parse(req.body);

    const response: {
      created?:
        | {
            id: string;
            id_app: string;
          }[]
        | null;
      sync: boolean;
    } = {
      created: [],
      sync: false,
    };

    try {
      if (created.length > 0) {
        for await (const request of created) {
          const equipment = await this.equipmentRepository.findById(
            request.equipment_id,
          );

          if (!equipment) {
            throw new NotFoundException(MessageService.Equipment_not_found);
          }

          let findMaxNumber =
            await this.numberRequestServiceRepository.countByClientAndBranch(
              user.clientId,
              equipment.branch.ID,
            );

          if (!findMaxNumber || findMaxNumber === 0) {
            findMaxNumber =
              await this.requestServiceRepository.countByClientAndBranch(
                user.clientId,
                equipment.branch.ID,
              );
          }

          let serviceOrderId = null;

          if (request.service_order_id) {
            if (Number(request.service_order_id)) {
              const serviceOrder =
                await this.serviceOrderRepository.findByWhere({
                  ID: Number(request.service_order_id),
                });

              if (!serviceOrder) {
                throw new NotFoundException(
                  MessageService.Service_order_id_not_found,
                );
              }

              serviceOrderId = serviceOrder.ID;
            } else {
              const serviceOrder =
                await this.serviceOrderRepository.findByWhere({
                  id_app: request.service_order_id,
                });

              if (!serviceOrder) {
                throw new NotFoundException(
                  MessageService.Service_order_id_not_found,
                );
              }
              serviceOrderId = serviceOrder.ID;
            }
          }

          const newRequest = await this.requestServiceRepository.create({
            id_app: request.id,
            id_cliente: user.clientId,
            id_contato_filial: user.login,
            //solicitante: request.email,
            id_filial: equipment.branch.ID,
            codigo_solicitacao: (findMaxNumber + 1).toString().padStart(6, '0'),
            id_equipamento: request.equipment_id,
            id_problema: request.problem_id,
            prioridade: request.priority_id.toString(),
            maquina_parada:
              request.stopped_machine !== null
                ? request.stopped_machine
                  ? 1
                  : 0
                : null,
            assunto: request.subject,
            mensagem: request.description,
            status: request.status,
            log_date: request.date_emission,
            data_prevista: request.date_expected,
            data_equipamento_parou: request.date_machine_stopped || null,
            ordem_servico: serviceOrderId,
          });

          await this.numberRequestServiceRepository.create({
            id_cliente: user.clientId,
            id_filial: equipment.branch.ID,
            numero: findMaxNumber + 1,
          });

          if (typeof serviceOrderId === 'number') {
            await this.serviceOrderRepository.update(serviceOrderId, {
              id_solicitacao_servico: newRequest.id,
            });
          }

          response.created.push({
            id: newRequest.id.toString(),
            id_app: request.id.toString(),
          });
        }
      }
      if (updated.length > 0) {
        for await (const request of updated) {
          const equipment = await this.equipmentRepository.findById(
            request.equipment_id,
          );

          if (!equipment) {
            throw new NotFoundException(MessageService.Equipment_not_found);
          }

          let requestServiceId = null;

          let numberRequest: string | number = '';

          if (Number(request.id) > 0) {
            const requestService = await this.requestServiceRepository.findById(
              Number(request.id),
            );

            if (!requestService) {
              throw new NotFoundException(
                MessageService.Request_service_order_id_not_found,
              );
            }

            requestServiceId = requestService.id;

            if (requestService.branch.ID !== equipment.branch.ID) {
              numberRequest =
                await this.numberRequestServiceRepository.countByClientAndBranch(
                  user.clientId,
                  equipment.branch.ID,
                );

              numberRequest = (numberRequest + 1).toString().padStart(6, '0');

              await this.numberRequestServiceRepository.create({
                id_cliente: user.clientId,
                id_filial: equipment.branch.ID,
                numero: Number(numberRequest),
              });
            }
          } else {
            const requestService =
              await this.requestServiceRepository.findByIdApp(request.id);

            if (!requestService) {
              throw new NotFoundException(
                MessageService.Request_service_order_id_not_found,
              );
            }

            requestServiceId = requestService.id;

            if (requestService.branch.ID !== equipment.branch.ID) {
              numberRequest =
                await this.numberRequestServiceRepository.countByClientAndBranch(
                  user.clientId,
                  equipment.branch.ID,
                );

              numberRequest = (numberRequest + 1).toString().padStart(6, '0');

              await this.numberRequestServiceRepository.create({
                id_cliente: user.clientId,
                id_filial: equipment.branch.ID,
                numero: Number(numberRequest),
              });
            }
          }

          let serviceOrderId = null;

          if (request.service_order_id) {
            if (Number(request.service_order_id)) {
              const serviceOrder =
                await this.serviceOrderRepository.findByWhere({
                  ID: Number(request.service_order_id),
                });

              if (!serviceOrder) {
                throw new NotFoundException(
                  MessageService.Service_order_id_not_found,
                );
              }

              serviceOrderId = serviceOrder.ID;
            } else {
              const serviceOrder =
                await this.serviceOrderRepository.findByWhere({
                  id_app: request.service_order_id,
                });

              if (!serviceOrder) {
                throw new NotFoundException(
                  MessageService.Service_order_id_not_found,
                );
              }
              serviceOrderId = serviceOrder.ID;
            }
          }

          await this.requestServiceRepository.update(requestServiceId, {
            id_contato_filial: request.email,
            //codigo_solicitacao: numberRequest,
            id_filial: equipment.branch.ID,
            id_equipamento: request.equipment_id,
            id_problema: request.problem_id,
            prioridade: request.priority_id.toString(),
            ordem_servico: serviceOrderId,
            maquina_parada:
              request.stopped_machine !== null
                ? request.stopped_machine
                  ? 1
                  : 0
                : null,
            assunto: request.subject,
            mensagem: request.description,
            status: request.status,
            log_date: request.date_emission,
            data_prevista: request.date_expected,
            data_equipamento_parou: request.date_machine_stopped || null,
          });

          if (typeof serviceOrderId === 'number') {
            await this.serviceOrderRepository.update(serviceOrderId, {
              id_solicitacao_servico: requestServiceId,
            });
          }
        }
      }
      if (deleted.length > 0) {
        for await (const requestId of deleted) {
          const requestService =
            await this.requestServiceRepository.findByIdApp(
              requestId.toString(),
            );

          if (!requestService) {
            throw new NotFoundException(
              MessageService.Request_service_order_id_not_found,
            );
          }

          if (requestService.orderService) {
            throw new ConflictException(
              MessageService.Request_service_order_not_delete_bound,
            );
          }

          await this.requestServiceRepository.delete(Number(requestId));
        }
      }
    } catch (error) {
      console.log(error);
      throw new ConflictException(error);
    }

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/maintainer')
  async syncMaintainers(@Req() req) {
    const schemaBody = z.object({
      created: z.array(
        z.object({
          id: z.string().optional(),
          service_order_id: z.string(),
          maintainer_id: z.string(),
        }),
      ),
      updated: z.array(
        z.object({
          id: z.string().optional(),
          service_order_id: z.string(),
          maintainer_id: z.string(),
        }),
      ),
      deleted: z.array(z.coerce.number()),
    });

    const body = schemaBody.parse(req.body);

    const response = {
      created: [] as { id: string; id_app: string }[],
      updated: [] as { id: string; id_app: string }[],
      deleted: [] as string[],
    };

    try {
      for (const obj of body.created) {
        if (Number(obj.service_order_id)) {
          const serviceOrder = await this.serviceOrderRepository.findById(
            Number(obj.service_order_id),
          );

          if (serviceOrder) {
            const findDuplicate =
              await this.serviceOrderMaintainer.findByOrderAndCollaborator(
                serviceOrder.ID,
                Number(obj.maintainer_id),
              );

            if (!findDuplicate) {
              const newObj = await this.serviceOrderMaintainer.create({
                id_ordem_servico: Number(obj.service_order_id),
                id_app: obj.id,
                id_colaborador: Number(obj.maintainer_id),
              });

              const newObjLog = await this.logServiceOrderMaintainer.last({
                id_ordem_servico: Number(obj.service_order_id),
              });

              await this.logServiceOrderMaintainer.update(newObjLog.id, {
                log_date: new Date(),
              });

              response.created.push({
                id: newObj.id.toString(),
                id_app: obj.id,
              });

              const allCollaboratorInServiceOrder =
                await this.serviceOrderMaintainer.listByService(
                  Number(obj.service_order_id),
                );

              await this.serviceOrderRepository.update(
                Number(obj.service_order_id),
                {
                  mantenedores: allCollaboratorInServiceOrder
                    .map((maintainer) => maintainer.id_colaborador)
                    .join(','),
                },
              );
            }
          }
        } else {
          const serviceOrder = await this.serviceOrderRepository.findByWhere({
            id_app: obj.service_order_id,
          });

          if (serviceOrder) {
            const findDuplicate =
              await this.serviceOrderMaintainer.findByOrderAndCollaborator(
                serviceOrder.ID,
                Number(obj.maintainer_id),
              );

            if (!findDuplicate) {
              const newObj = await this.serviceOrderMaintainer.create({
                id_ordem_servico: serviceOrder.ID,
                id_app: obj.id,
                id_colaborador: Number(obj.maintainer_id),
              });

              const newObjLog = await this.logServiceOrderMaintainer.last({
                id_ordem_servico: serviceOrder.ID,
              });

              await this.logServiceOrderMaintainer.update(newObjLog.id, {
                log_date: new Date(),
              });

              response.created.push({
                id: newObj.id.toString(),
                id_app: obj.id,
              });

              const allCollaboratorInServiceOrder =
                await this.serviceOrderMaintainer.listByService(
                  serviceOrder.ID,
                );

              await this.serviceOrderRepository.update(serviceOrder.ID, {
                mantenedores: allCollaboratorInServiceOrder
                  .map((maintainer) => maintainer.id_colaborador)
                  .join(','),
              });
            }
          }
        }
      }

      for (const obj of body.updated) {
        const updateObj =
          await this.serviceOrderMaintainer.updateOrderAndCollaborattor(
            Number(obj.id),
            {
              id_ordem_servico: Number(obj.service_order_id),
              id_colaborador: Number(obj.maintainer_id),
            },
          );

        const newObjLog = await this.logServiceOrderMaintainer.last({
          id_ordem_servico: Number(obj.service_order_id),
        });

        await this.logServiceOrderMaintainer.update(newObjLog.id, {
          log_date: new Date(),
        });

        response.updated.push({
          id: updateObj.id.toString(),
          id_app: obj.id,
        });

        const allCollaboratorInServiceOrder =
          await this.serviceOrderMaintainer.listByService(
            Number(obj.service_order_id),
          );

        await this.serviceOrderRepository.update(Number(obj.service_order_id), {
          mantenedores: allCollaboratorInServiceOrder
            .map((maintainer) => maintainer.id_colaborador)
            .join(','),
        });
      }

      for (const id of body.deleted) {
        await this.serviceOrderMaintainer.delete(Number(id));

        const newObjLog = await this.logServiceOrderMaintainer.last();

        await this.logServiceOrderMaintainer.update(newObjLog.id, {
          log_date: new Date(),
        });

        const maintenanceServiceOrder =
          await this.serviceOrderMaintainer.findById(id);

        const allCollaboratorInServiceOrder =
          await this.serviceOrderMaintainer.listByService(
            maintenanceServiceOrder.id_ordem_servico,
          );

        await this.serviceOrderRepository.update(
          maintenanceServiceOrder.id_ordem_servico,
          {
            mantenedores: allCollaboratorInServiceOrder
              .map((maintainer) => maintainer.id_colaborador)
              .join(','),
          },
        );
      }
    } catch (error) {
      console.error(error);

      throw new ConflictException('Deu erro aqui');
    }

    return response;
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: SyncTaskServiceOrderBodySwagger,
  })
  @Post('/task-service-order')
  async syncTaskServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const schemaBody = z.object({
      created: z.array(
        z.object({
          id: z.string(),
          task_id: z.string(),
          service_order_id: z.string(),
          status_id: z.string().optional().nullable(),
          unity_id: z.coerce.number().optional(),
          periodicity: z.coerce.number().optional(),
          observation: z.string().optional().nullable(),
          // register_hour: z.array(
          //   z.object({
          //     id: z.string(),
          //     start: z.date(),
          //     end: z.date(),
          //   }),
          // ),
        }),
      ),
      updated: z.array(
        z.object({
          id: z.string(),
          task_id: z.string(),
          service_order_id: z.string(),
          status_id: z.string().optional().nullable(),
          unity_id: z.coerce.number().optional(),
          periodicity: z.coerce.number().optional(),
          observation: z.string().optional().nullable(),
          // register_hour: z.array(
          //   z.object({
          //     id: z.string(),
          //     start: z.date(),
          //     end: z.date(),
          //   }),
          // ),
        }),
      ),
      deleted: z.array(z.number()),
    });

    const body = schemaBody.parse(req.body);

    const response: {
      created?:
        | {
            id: string;
            id_app: string;
          }[]
        | null;
      sync: boolean;
    } = {
      created: [],
      sync: false,
    };

    try {
      for await (const task of body.created) {
        const findTask = await this.taskRepository.findById(
          Number(task.task_id),
        );

        let serviceOrder = null;

        if (Number(task.service_order_id) > 0) {
          serviceOrder = await this.serviceOrderRepository.findById(
            Number(task.service_order_id),
          );
        } else {
          serviceOrder = await this.serviceOrderRepository.findByWhere({
            id_app: task.service_order_id,
          });
        }

        const newTask = await this.taskServiceOrderRepository.create({
          id_cliente: user.clientId,
          id_app: task.id,
          id_ordem_servico: serviceOrder.ID,
          tarefa: Number(task.task_id),
          status_tarefa: task.status_id ? Number(task.status_id) : null,
          id_unidade_medida: task.unity_id,
          periodicidade_uso: task.periodicity,
          observacao: task.observation,
          note: {
            create: {
              id_cliente: user.clientId,
              id_filial: serviceOrder.ID_filial,
              id_ordem: serviceOrder.ID,
              id_equipamento: serviceOrder.equipment.ID,
              id_colaborador: user?.collaboratorId || null,
              log_user: user.login,
              log_date: new Date(),
              descricao: findTask.tarefa,
            },
          },
          // registerHour: {
          //   createMany: {
          //     data: task.register_hour.map((register) => {
          //       return {
          //         inicio: register.start,
          //         fim: register.end,
          //       };
          //     }),
          //   },
          // },
        });

        response.created.push({
          id: newTask.id.toString(),
          id_app: task.id.toString(),
        });
      }

      for await (const task of body.updated) {
        await this.taskServiceOrderRepository.update(Number(task.id), {
          tarefa: Number(task.task_id),
          status_tarefa: task.status_id ? Number(task.status_id) : null,
          id_unidade_medida: task.unity_id,
          periodicidade_uso: task.periodicity,
          observacao: task.observation,
          // registerHour: {
          //   createMany: {
          //     data: task.register_hour.map((register) => {
          //       return {
          //         inicio: register.start,
          //         fim: register.end,
          //       };
          //     }),
          //   },
          // },
        });
      }

      for await (const taskId of body.deleted) {
        await this.taskServiceOrderRepository.delete(Number(taskId));
      }
    } catch (error) {}

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/task-service-order/register-hour')
  async syncTaskServiceRegisterHour(@Req() req) {
    const schemaBody = z.object({
      created: z.array(
        z.object({
          id: z.string(),
          task_service_order_id: z.string(),
          start: z.coerce.date(),
          end: z
            .string()
            .transform((value) =>
              value === '' || value === null ? null : new Date(value),
            )
            .nullable()
            .optional(),
        }),
      ),
      updated: z.array(
        z.object({
          id: z.string(),
          task_service_order_id: z.string(),
          start: z.coerce.date(),
          end: z
            .string()
            .transform((value) =>
              value === '' || value === null ? null : new Date(value),
            )
            .nullable()
            .optional(),
        }),
      ),
      deleted: z.array(z.number()),
    });

    const body = schemaBody.parse(req.body);

    const response = {
      created: [],
      sync: false,
    };

    try {
      for await (const register of body.created) {
        let taskServiceOrderId = null;
        let startDate = new Date(register.start);
        let endDate = register.end ? new Date(register.end) : null;

        let taskServiceOrder = null;

        if (Number(register.task_service_order_id) > 0) {
          taskServiceOrder = await this.taskServiceOrderRepository.findByWhere({
            id: Number(register.task_service_order_id),
          });

          taskServiceOrderId = taskServiceOrder.id;
        } else {
          taskServiceOrder = await this.taskServiceOrderRepository.findByWhere({
            id_app: register.task_service_order_id,
          });

          taskServiceOrderId = taskServiceOrder.id;
        }

        if (taskServiceOrder.registerHour.length) {
          startDate = taskServiceOrder.registerHour[0].inicio || startDate;
          endDate =
            register.end ||
            taskServiceOrder.registerHour[
              taskServiceOrder.registerHour.length - 1
            ].fim ||
            null;
        }

        if (endDate && startDate > endDate) {
          endDate = new Date(startDate.getTime() + 1000);
        }

        const registerHour =
          await this.registerHourTaskServiceRepository.create({
            id_tarefa_servico: taskServiceOrderId,
            id_app: register.id,
            inicio: startDate,
            fim: endDate,
          });

        const findNote =
          await this.noteServiceOrder.findByTaskServiceOrder(
            taskServiceOrderId,
          );

        if (findNote) {
          await this.noteServiceOrder.update(findNote.id, {
            data_hora_inicio: startDate,
            data_hora_termino: endDate,
          });
        }

        response.created.push({
          id: registerHour.id.toString(),
          id_app: register.id.toString(),
        });
      }

      for await (const register of body.updated) {
        let startDate = new Date(register.start);
        let endDate = register.end ? new Date(register.end) : null;

        const registerHour =
          Number(register.id) > 0
            ? await this.registerHourTaskServiceRepository.findById(
                Number(register.id),
              )
            : await this.registerHourTaskServiceRepository.findByWhere({
                id_app: register.id,
              });

        await this.registerHourTaskServiceRepository.update(registerHour.id, {
          inicio: startDate,
          fim: endDate,
        });

        const taskServiceOrder =
          await this.taskServiceOrderRepository.findByWhere({
            id: Number(register.task_service_order_id),
          });

        if (taskServiceOrder.registerHour.length) {
          startDate = taskServiceOrder.registerHour[0].inicio || startDate;
          endDate =
            register.end ||
            taskServiceOrder.registerHour[
              taskServiceOrder.registerHour.length - 1
            ].fim ||
            null;
        }

        if (endDate && startDate > endDate) {
          endDate = new Date(startDate.getTime() + 1000);
        }

        const findNote = await this.noteServiceOrder.findByTaskServiceOrder(
          taskServiceOrder.id,
        );

        if (findNote) {
          await this.noteServiceOrder.update(findNote.id, {
            data_hora_inicio: startDate,
            data_hora_termino: endDate,
          });
        }
      }

      for await (const registerId of body.deleted) {
        await this.registerHourTaskServiceRepository.delete(Number(registerId));

        const taskServiceOrder = await this.taskServiceOrderRepository.findById(
          Number(registerId),
        );

        let startDate = null;
        let endDate = null;

        if (taskServiceOrder.registerHour.length) {
          startDate = taskServiceOrder.registerHour[0].inicio || null;
          endDate =
            taskServiceOrder.registerHour[
              taskServiceOrder.registerHour.length - 1
            ].fim || null;
        }

        if (endDate && startDate > endDate) {
          endDate = new Date(startDate.getTime() + 1000);
        }

        const findNote = await this.noteServiceOrder.findByTaskServiceOrder(
          taskServiceOrder.id,
        );

        if (findNote) {
          await this.noteServiceOrder.update(findNote.id, {
            data_hora_inicio: startDate,
            data_hora_termino: endDate,
          });
        }
      }

      response.sync = true;
    } catch (error) {
      throw new BadRequestException(error);
    }

    return response;
  }

  @UseGuards(AuthGuard)
  @Post('/material-service-order')
  async createMaterialServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const schemaBody = z.object({
      created: z.array(
        z.object({
          id: z.string(),
          service_order_id: z.string().optional(),
          material_id: z.string(),
          quantity: z.number(),
          value: z.number(),
          date_use: z.string().nullable().optional(),
          n_serie_new: z.string().nullable().optional(),
          n_serie_old: z.string().nullable().optional(),
        }),
      ),
      updated: z.array(
        z.object({
          id: z.string(),
          material_id: z.string(),
          quantity: z.number(),
          value: z.number(),
          date_use: z.string().nullable().optional(),
          n_serie_new: z.string().nullable().optional(),
          n_serie_old: z.string().nullable().optional(),
        }),
      ),
      deleted: z.array(z.string()),
    });

    const body = schemaBody.parse(req.body);

    const response = {
      created: [] as { id: string; id_app: string }[],
      updated: [] as { id: string; id_app: string }[],
      deleted: [] as string[],
    };

    for await (const obj of body.created) {
      let serviceOrder = null;

      if (Number(obj.service_order_id) > 0) {
        serviceOrder = await this.serviceOrderRepository.findById(
          Number(obj.service_order_id),
        );
      } else {
        serviceOrder = await this.serviceOrderRepository.findByWhere({
          id_app: obj.service_order_id,
        });
      }

      const newObj = await this.materialServiceOrder.create({
        id_cliente: user.clientId,
        id_app: obj.id,
        id_ordem_servico: serviceOrder.ID,
        material: Number(obj.material_id),
        quantidade: Number(obj.quantity),
        valor_unidade: Number(obj.value),
        data_uso: obj.date_use || null,
        n_serie_novo: obj.n_serie_new || null,
        n_serie_antigo: obj.n_serie_old || null,
      });

      response.created.push({
        id: newObj.id.toString(),
        id_app: obj.id,
      });
    }

    for (const obj of body.updated) {
      //console.log(obj);
      const updatedObj = await this.materialServiceOrder.update(
        Number(obj.id),
        {
          material: Number(obj.material_id),
          quantidade: obj.quantity,
          valor_unidade: obj.value,
          data_uso: obj.date_use || null,
          n_serie_novo: obj.n_serie_new || null,
          n_serie_antigo: obj.n_serie_old || null,
        },
      );

      response.updated.push({
        id: updatedObj.id.toString(),
        id_app: obj.id,
      });
    }

    for (const id of body.deleted) {
      await this.materialServiceOrder.delete(Number(id));
      response.deleted.push(id);
    }

    return response;
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: SyncNoteStopBodySwagger,
  })
  @ApiResponse({
    description: 'Success',
    type: ListNoteStopResponseSwagger,
  })
  @Post('/note-stop')
  async createNoteStop(@Req() req) {
    const user: IUserInfo = req.user;

    const schemaBody = z.object({
      created: z.array(
        z.object({
          id: z.string(),
          service_order_id: z.string().optional(),
          date_worked: z.string().nullable().optional(),
          date_stop: z.string().nullable().optional(),
          observations: z.string().nullable().optional(),
        }),
      ),
      updated: z.array(
        z.object({
          id: z.string(),
          date_worked: z.string().nullable().optional(),
          date_stop: z.string().nullable().optional(),
          observations: z.string().nullable().optional(),
        }),
      ),
      deleted: z.array(z.string()),
    });

    const body = schemaBody.parse(req.body);

    const response = {
      created: [] as { id: string; id_app: string }[],
      updated: [] as { id: string; id_app: string }[],
      deleted: [] as string[],
    };

    for await (const obj of body.created) {
      let serviceOrder = null;

      if (Number(obj.service_order_id) > 0) {
        serviceOrder = await this.serviceOrderRepository.findById(
          Number(obj.service_order_id),
        );
      } else {
        serviceOrder = await this.serviceOrderRepository.findByWhere({
          id_app: obj.service_order_id,
        });
      }

      const newObj = await this.noteStopServiceOrderRepository.create({
        log_user: user.login,
        id_app: obj.id,
        id_ordem_servico: serviceOrder.ID,
        data_hora_start: obj.date_worked ? new Date(obj.date_worked) : null,
        data_hora_stop: obj.date_stop ? new Date(obj.date_stop) : null,
        observacoes: obj.observations || null,
      });

      response.created.push({
        id: newObj.id.toString(),
        id_app: obj.id,
      });
    }

    for (const obj of body.updated) {
      const updatedObj = await this.noteStopServiceOrderRepository.update(
        Number(obj.id),
        {
          data_hora_start: obj.date_worked ? new Date(obj.date_worked) : null,
          data_hora_stop: obj.date_stop ? new Date(obj.date_stop) : null,
          observacoes: obj.observations || null,
        },
      );

      response.updated.push({
        id: updatedObj.id.toString(),
        id_app: obj.id,
      });
    }

    for (const id of body.deleted) {
      await this.noteStopServiceOrderRepository.delete(Number(id));
      response.deleted.push(id);
    }

    return response;
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: SyncAppointmentManualBodySwagger,
  })
  @ApiResponse({
    type: SyncAppointmentManualResponseSwagger,
  })
  @Post('/service/appointment-manual')
  async syncAppointmentManual(@Req() req) {
    const schemaBody = z.object({
      created: z.array(
        z.object({
          id: z.string(),
          service_order_id: z.coerce.string(),
          maintainer_id: z.coerce.number().optional(),
          description: z.string().optional(),
          start: z.coerce.date().optional(),
          end: z
            .string()
            .transform((value) =>
              value === '' || value === null ? null : new Date(value),
            )
            .nullable()
            .optional(),
        }),
      ),
      updated: z.array(
        z.object({
          id: z.string(),
          service_order_id: z.coerce.string(),
          maintainer_id: z.coerce.number().optional(),
          description: z.string().optional(),
          start: z.coerce.date().optional(),
          end: z
            .string()
            .transform((value) =>
              value === '' || value === null ? null : new Date(value),
            )
            .nullable()
            .optional(),
        }),
      ),
      deleted: z.array(z.string()),
    });

    const body = schemaBody.parse(req.body);

    const response = {
      created: [] as { id: string; id_app: string }[],
      sync: false,
    };

    try {
      for await (const obj of body.created) {
        let serviceOrderId: {
          ID: number;
          company: {
            ID: number;
          };
          branch: {
            ID: number;
          };
        } | null = null;

        if (Number(obj.service_order_id) > 0) {
          const serviceOrder = await this.serviceOrderRepository.findById(
            Number(obj.service_order_id),
          );

          serviceOrderId = serviceOrder ? serviceOrder : null;
        } else {
          const serviceOrder = await this.serviceOrderRepository.findByWhere({
            id_app: obj.service_order_id,
          });
          serviceOrderId = serviceOrder ? serviceOrder : null;
        }

        if (!serviceOrderId) {
          throw new NotFoundException(
            MessageService.Service_order_id_not_found,
          );
        }

        const newAppointment = await this.noteServiceOrder.create({
          id_cliente: serviceOrderId?.company?.ID,
          id_filial: serviceOrderId?.branch?.ID,
          id_ordem: serviceOrderId.ID,
          tempo_real:
            this.dateService
              .dayjs(obj.end)
              .diff(this.dateService.dayjs(obj.start), 'minute') / 60,
          id_colaborador: obj.maintainer_id || null,
          descricao: obj.description || null,
          id_app: obj.id,
          data_hora_inicio: obj.start,
          data_hora_termino: obj.end,
        });

        response.created.push({
          id: newAppointment.id.toString(),
          id_app: obj.id,
        });
      }

      for await (const obj of body.updated) {
        await this.noteServiceOrder.update(Number(obj.id), {
          descricao: obj.description || null,
          data_hora_inicio: obj.start,
          data_hora_termino: obj.end,
        });
      }

      for await (const obj of body.deleted) {
        await this.maintenanceAppointmentManualRepository.delete(Number(obj));
      }

      response.sync = true;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: SyncTaskReturnBodySwagger,
  })
  @ApiResponse({
    type: SyncTaskReturnResponseSwagger,
  })
  @Post('/task/return')
  async syncTaskReturn(@Req() req) {
    const schemaBody = z.object({
      created: z.array(
        z.object({
          id: z.string(),
          task_service_order_id: z.string(),
          task_id: z.string(),
          return_text: z.string().optional().nullable(),
          return_number: z.number().optional().nullable(),
          return_option: z.coerce.number().optional().nullable(),
        }),
      ),
      updated: z.array(
        z.object({
          id: z.string(),
          task_service_order_id: z.string(),
          task_id: z.string(),
          return_text: z.string().optional().nullable(),
          return_number: z.number().optional().nullable(),
          return_option: z.coerce.number().optional().nullable(),
        }),
      ),
      deleted: z.array(z.string()),
    });

    const body = schemaBody.parse(req.body);

    const response: {
      created: { id: string; id_app: string }[];
      sync: boolean;
    } = {
      created: [],
      sync: false,
    };

    for await (const obj of body.created) {
      //console.log(obj);
      let task_service_order_id = null;

      let optionReturn = null;

      if (Number(obj.task_service_order_id) > 0) {
        const taskServiceOrder =
          await this.taskServiceOrderRepository.findByWhere({
            id: Number(obj.task_service_order_id),
          });

        task_service_order_id = taskServiceOrder.id;

        const task = await this.taskRepository.findById(
          Number(taskServiceOrder.task.id),
        );

        if (obj.return_option) {
          optionReturn = task.taskList.find(
            (value) => value.option.id === obj.return_option,
          ).id;
        }
      } else {
        const taskServiceOrder =
          await this.taskServiceOrderRepository.findByWhere({
            id_app: obj.task_service_order_id,
          });

        task_service_order_id = taskServiceOrder.id;

        const task = await this.taskRepository.findById(
          Number(taskServiceOrder.task.id),
        );

        if (obj.return_option) {
          optionReturn = task.taskList.find(
            (value) => value.option.id === obj.return_option,
          ).id;
        }
      }

      const newTaskReturn = await this.taskServiceOrderReturnRepository.create({
        id_tarefa_servico: task_service_order_id,
        id_app: obj.id,
        id_tarefa: Number(obj.task_id),
        retorno_texto: obj.return_text,
        retorno_numero: obj.return_number,
        retorno_opcao: optionReturn,
      });

      const log = await this.logTaskServiceOrderReturnRepository.last({
        id_tarefa_servico: Number(task_service_order_id),
      });

      await this.logTaskServiceOrderReturnRepository.update(log.id, {
        log_date: new Date(),
      });

      response.created.push({
        id: newTaskReturn.id.toString(),
        id_app: obj.id.toString(),
      });
    }

    for await (const obj of body.updated) {
      let optionReturn = null;

      if (Number(obj.task_service_order_id) > 0) {
        const taskServiceOrder =
          await this.taskServiceOrderRepository.findByWhere({
            id: Number(obj.task_service_order_id),
          });

        //task_service_order_id = taskServiceOrder.id;

        const task = await this.taskRepository.findById(
          Number(taskServiceOrder.task.id),
        );

        if (obj.return_option) {
          optionReturn = task.taskList.find(
            (value) => value.option.id === obj.return_option,
          ).id;
        }
      } else {
        const taskServiceOrder =
          await this.taskServiceOrderRepository.findByWhere({
            id_app: obj.task_service_order_id,
          });

        //task_service_order_id = taskServiceOrder.id;

        const task = await this.taskRepository.findById(
          Number(taskServiceOrder.task.id),
        );

        if (obj.return_option) {
          optionReturn = task.taskList.find(
            (value) => value.option.id === obj.return_option,
          ).id;
        }
      }

      await this.taskServiceOrderReturnRepository.update(Number(obj.id), {
        retorno_texto: obj.return_text,
        retorno_numero: obj.return_number,
        retorno_opcao: optionReturn,
      });

      const log = await this.logTaskServiceOrderReturnRepository.last({
        id_tarefa_servico: Number(obj.task_service_order_id),
      });

      await this.logTaskServiceOrderReturnRepository.update(log.id, {
        log_date: new Date(),
      });
    }

    for await (const obj of body.deleted) {
      const taskReturn = await this.taskServiceOrderReturnRepository.findById(
        Number(obj),
      );

      await this.taskServiceOrderReturnRepository.delete(Number(obj));

      const log = await this.logTaskServiceOrderReturnRepository.last({
        id_tarefa_servico: Number(taskReturn.id_tarefa_servico),
      });

      await this.logTaskServiceOrderReturnRepository.update(log.id, {
        log_date: new Date(),
      });
    }

    response.sync = true;

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: SyncDisplacementBodySwagger,
  })
  @ApiResponse({
    type: SyncDisplacementResponseSwagger,
  })
  @Post('/service-order/displacement')
  async syncDisplacement(@Req() req) {
    const schemaBody = z.object({
      created: z.array(
        z.object({
          id: z.string(),
          service_order_id: z.coerce.string(),
          start: z.coerce.number().optional(),
          end: z.coerce.number().optional(),
          distance: z.string().optional().nullable(),
          distance_going: z.string().optional().nullable(),
          distance_return: z.string().optional().nullable(),
          timestamp: z
            .number()
            .transform((value) => new Date(value))
            .optional()
            .nullable(),
          going: z.array(
            z.object({
              latitude: z.coerce.number(),
              longitude: z.coerce.number(),
              timestamp: z
                .number()
                .transform((value) => new Date(value))
                .optional()
                .nullable(),
            }),
          ),
          return: z.array(
            z.object({
              latitude: z.coerce.number(),
              longitude: z.coerce.number(),
              timestamp: z
                .number()
                .transform((value) => new Date(value))
                .optional()
                .nullable(),
            }),
          ),
        }),
      ),
      updated: z.array(
        z.object({
          id: z.string(),
          service_order_id: z.coerce.number(),
          start: z.coerce.number().optional(),
          end: z.coerce.number().optional(),
          distance: z.string().optional().nullable(),
          distance_going: z.string().optional().nullable(),
          distance_return: z.string().optional().nullable(),
          going: z.array(
            z.object({
              latitude: z.coerce.number(),
              longitude: z.coerce.number(),
            }),
          ),
          return: z.array(
            z.object({
              latitude: z.coerce.number(),
              longitude: z.coerce.number(),
            }),
          ),
        }),
      ),
      deleted: z.array(z.coerce.number()),
    });

    const body = schemaBody.parse(req.body);

    const response: {
      created: { id: string; id_app: string }[];
      sync: boolean;
    } = {
      created: [],
      sync: false,
    };

    for await (const obj of body.created) {
      const path = obj.going.map((g) => {
        return {
          ...g,
          type: 0,
        };
      });

      path.push(
        ...obj.return.map((r) => {
          return {
            ...r,
            type: 1,
          };
        }),
      );

      let serviceOrder = null;

      if (Number(obj.service_order_id) > 0) {
        serviceOrder = await this.serviceOrderRepository.findById(
          Number(obj.service_order_id),
        );
      } else {
        serviceOrder = await this.serviceOrderRepository.findByWhere({
          id_app: obj.service_order_id,
        });
      }

      const newDisplacement =
        await this.maintenanceDisplacementRepository.create({
          id_ordem_servico: serviceOrder.ID,
          id_app: obj.id,
          inicio: obj.start,
          fim: obj.end,
          distance: obj.distance,
          distance_going: obj.distance_going,
          distance_return: obj.distance_return,
          log_date: obj.timestamp,
          pathDisplacement: {
            createMany: {
              data: path.map((p) => ({
                tipo: p.type,
                latitude: p.latitude,
                longitude: p.longitude,
                log_date: p.timestamp,
              })),
            },
          },
        });

      response.created.push({
        id: newDisplacement.id.toString(),
        id_app: obj.id.toString(),
      });
    }

    for await (const obj of body.updated) {
      const path = obj.going.map((g) => {
        return {
          ...g,
          type: 0,
        };
      });

      path.push(
        ...obj.return.map((r) => {
          return {
            ...r,
            type: 1,
          };
        }),
      );

      await this.maintenanceDisplacementRepository.update(Number(obj.id), {
        inicio: obj.start,
        fim: obj.end,
        distance: obj.distance,
        distance_going: obj.distance_going,
        distance_return: obj.distance_return,
        pathDisplacement: {
          deleteMany: {
            id_deslocamento: Number(obj.id),
          },
          createMany: {
            data: path.map((p) => ({
              tipo: p.type,
              latitude: p.latitude,
              longitude: p.longitude,
            })),
          },
        },
      });
    }

    for await (const obj of body.deleted) {
      await this.maintenanceDisplacementRepository.delete(Number(obj));
    }

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/service-order/cost')
  async syncServiceOrderCost(@Req() req) {
    const schemaBody = z.object({
      created: z.array(
        z.object({
          id: z.string(),
          description_cost_id: z.coerce.number(),
          quantity: z.number(),
          value_unity: z.number(),
          date_cost: z.string(),
          observation: z.string().optional().nullable(),
          service_order_id: z.string(),
        }),
      ),
      updated: z.array(
        z.object({
          id: z.string(),
          description_cost_id: z.coerce.number().optional(),
          quantity: z.number().optional(),
          value_unity: z.number().optional(),
          date_cost: z.string().optional(),
          observation: z.string().optional().nullable(),
        }),
      ),
      deleted: z.array(z.number()),
    });

    const body = schemaBody.parse(req.body);

    const response: {
      created: {
        id: number;
        id_app: string;
      }[];
      updated: number[];
      deleted: number[];
    } = {
      created: [],
      updated: [],
      deleted: [],
    };

    for await (const obj of body.created) {
      let serviceOrder = {
        ID: null,
      };

      if (Number(obj.service_order_id) > 0) {
        serviceOrder = await this.serviceOrderRepository.findById(
          Number(obj.service_order_id),
        );

        if (!serviceOrder) {
          throw new NotFoundException(
            MessageService.Service_order_id_not_found,
          );
        }
      } else {
        serviceOrder = await this.serviceOrderRepository.findByWhere({
          id_app: obj.service_order_id,
        });

        if (!serviceOrder) {
          throw new NotFoundException(
            MessageService.Service_order_id_not_found,
          );
        }
      }

      const newCost = await this.costServiceOrderRepository.create({
        id_ordem_servico: serviceOrder.ID,
        id_app: obj.id.toString(),
        id_descricao_custo: obj.description_cost_id,
        quantidade: obj.quantity,
        valor_unitario: obj.value_unity,
        custo: obj.quantity * obj.value_unity,
        data_custo: new Date(obj.date_cost),
        observacoes: obj.observation,
      });

      response.created.push({
        id: newCost.id,
        id_app: obj.id.toString(),
        // idDescriptionCost: obj.description_cost_id,
        //descricao:
        //String(newCost.id_descricao_custo) || 'Descrição não encontrada',
      });
    }

    for await (const obj of body.updated) {
      const existingCost = await this.costServiceOrderRepository.findById(
        Number(obj.id),
      );

      if (!existingCost) {
        throw new NotFoundException(`Cost ID ${obj.id} not found`);
      }

      await this.costServiceOrderRepository.update(Number(obj.id), {
        id_descricao_custo: obj.description_cost_id,
        quantidade: obj.quantity,
        valor_unitario: obj.value_unity,
        custo: obj.quantity * obj.value_unity,
        data_custo: obj.date_cost ? new Date(obj.date_cost) : undefined,
        observacoes: obj.observation,
      });

      response.updated.push(Number(obj.id));
    }

    for await (const id of body.deleted) {
      await this.costServiceOrderRepository.delete(id);
      response.deleted.push(id);
    }

    return response;
  }

  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateSignatureServiceOrderAttachmentBodySwagger,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('/service-order/signature')
  async syncSignature(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const schemaBody = z.object({
      created: z
        .object({
          id: z.string(),
          service_order_id: z.string(),
          position_id: z.number().optional(),
          name_client: z.string().nullable().optional(),
          name_technic: z.string().nullable().optional(),
          signed: z.boolean().nullable().optional(),
          name_extra: z.string().nullable().optional(),
          role_id: z.string().optional().nullable(),
          date: z
            .string()
            .transform((value) =>
              value === '' || value === null ? null : new Date(value),
            ),
        })
        .optional()
        .nullable(),
      updated: z
        .object({
          id: z.string(),
          service_order_id: z.string(),
          position_id: z.number().optional(),
          name_client: z.string().nullable().optional(),
          name_technic: z.string().nullable().optional(),
          signed: z.boolean().nullable().optional(),
          name_extra: z.string().nullable().optional(),
          role_id: z.string().optional().nullable(),
          date: z
            .string()
            .transform((value) =>
              value === '' || value === null ? null : new Date(value),
            ),
        })
        .optional()
        .nullable(),
      deleted: z.array(z.number()),
    });

    const { created, updated, deleted } = req.body;

    const body = schemaBody.parse({
      created: JSON.parse(created),
      updated: JSON.parse(updated),
      deleted: JSON.parse(deleted),
    });

    const response: {
      created: {
        id: number;
        id_app: string;
      }[];
      updated: number[];
      deleted: number[];
    } = {
      created: [],
      updated: [],
      deleted: [],
    };

    if (body.created) {
      let url = '';

      let serviceOrder = { ID: null };

      if (Number(body.created.service_order_id) > 0) {
        serviceOrder = await this.serviceOrderRepository.findById(
          Number(body.created.service_order_id),
        );

        if (!serviceOrder) {
          throw new NotFoundException(
            MessageService.Service_order_id_not_found,
          );
        }
      } else {
        serviceOrder = await this.serviceOrderRepository.findByWhere({
          id_app: body.created.service_order_id,
        });

        if (!serviceOrder) {
          throw new NotFoundException(
            MessageService.Service_order_id_not_found,
          );
        }
      }

      const newSignature = await this.serviceOrderSignatureRepository.create({
        id_app: body.created.id,
        id_ordem_servico: Number(body.created.service_order_id),
        nome_cliente: body.created.name_client,
        nome_tecnico: body.created.name_technic,
        nome_extra: body.created.name_extra,
        id_cargo: Number(body.created.role_id),
        status: body.created.signed ? 1 : 0,
        url,
        data_assinatura: body.created.date,
      });

      if (file) {
        const nodes_permission = ['production', 'dev'];

        const path_remote = nodes_permission.includes(this.envService.NODE_ENV)
          ? this.envService.URL_IMAGE
          : this.envService.FILE_PATH;
        const path_local = this.envService.FILE_PATH;
        const path_local_img = `${path_local}/service_order/id_${serviceOrder.ID}/signature/id_${newSignature.id}`;
        const path_remote_img = `${path_remote}/service_order/id_${serviceOrder.ID}/signature/id_${newSignature.id}`;

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

        url = `${path_remote_img}/${file.originalname}`;

        await this.serviceOrderSignatureRepository.update(newSignature.id, {
          url,
        });

        const logSignature =
          await this.logServiceOrderSignatureRepository.findLastBySignature(
            newSignature.id,
          );

        await this.logServiceOrderSignatureRepository.update(logSignature.id, {
          acao: 'INSERT',
        });
      }

      response.created.push({
        id: newSignature.id,
        id_app: body.created.id,
      });
    } else if (body.updated) {
      let url = '';

      let serviceOrder = { ID: null };

      if (Number(body.created.service_order_id) > 0) {
        serviceOrder = await this.serviceOrderRepository.findById(
          Number(body.created.service_order_id),
        );

        if (!serviceOrder) {
          throw new NotFoundException(
            MessageService.Service_order_id_not_found,
          );
        }
      } else {
        serviceOrder = await this.serviceOrderRepository.findByWhere({
          id_app: body.created.service_order_id,
        });

        if (!serviceOrder) {
          throw new NotFoundException(
            MessageService.Service_order_id_not_found,
          );
        }
      }

      const signature = await this.serviceOrderSignatureRepository.findById(
        Number(body.updated.id),
      );

      if (signature) {
        throw new NotFoundException(
          MessageService.Maintenance_sector_executing_not_found,
        );
      }

      if (file) {
        const nodes_permission = ['production', 'dev'];

        const path_remote = nodes_permission.includes(this.envService.NODE_ENV)
          ? this.envService.URL_IMAGE
          : this.envService.FILE_PATH;
        const path_local = this.envService.FILE_PATH;
        const path_local_img = `${path_local}/service_order/id_${serviceOrder.ID}/signature/id_${signature.id}`;
        const path_remote_img = `${path_remote}/service_order/id_${serviceOrder.ID}/signature/id_${signature.id}`;

        const allAttach = this.fileService.list(path_remote_img);

        for await (const attach of allAttach) {
          this.fileService.delete(attach);
        }

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

        url = `${path_remote_img}/${file.originalname}`;
      }

      await this.serviceOrderSignatureRepository.update(signature.id, {
        nome_cliente: body.created.name_client,
        nome_tecnico: body.created.name_technic,
        nome_extra: body.created.name_extra,
        id_cargo: Number(body.created.role_id),
        status: body.created.signed ? 1 : 0,
        url,
        data_assinatura: body.created.date,
      });
    } else if (body.deleted) {
      for await (const id of body.deleted) {
        await this.serviceOrderSignatureRepository.delete(id);
      }
    }

    return response;
  }
}
