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
import PeriodicityBoundRepository from 'src/repositories/periodicity-bound-repository';
import PriorityServiceOrderRepository from 'src/repositories/priority-service-order-repository';
import { ModuleService } from 'src/service/module.service';
import CreateBody from './dtos/create-body';
import EquipmentRepository from 'src/repositories/equipment-repository';
import { MessageService } from 'src/service/message.service';
import { SectorExecutingRepository } from 'src/repositories/sector-executing-repository';
import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import DescriptionPlanningRepository from 'src/repositories/description-planning-repository';
import { FamilyRepository } from '../../../repositories/family-repository';
import CreateBodySwagger from './dtos/swagger/create-body-swagger';
import { z } from 'zod';
import TaskRepository from 'src/repositories/task-repository';
import TaskPlanningMaintenanceRepository from 'src/repositories/task-planning-maintenance-repository';
import CreateItemBody from './dtos/createItem-body';
import FindByIdResponseSwagger from './dtos/swagger/findById-response-swagger';
import ListTableResponseSwagger from './dtos/swagger/listTable-response-swagger';
import CreateItemBodySwagger from './dtos/swagger/createItem-body-swagger';
import InsertedResponseSwagger from 'src/models/swagger/inserted-response';
import UpdateItemBody from './dtos/updateItem-body';
import { CheckListRepository } from 'src/repositories/checklist-repository';
import UpdatedResponseSwagger from 'src/models/swagger/updated-response';
import UpdateSeqItemBody from './dtos/updateSeqItem-body';
import SmartChecklistRepository from 'src/repositories/smart-checklist-repository';
import ListChecklistResponseSwagger from './dtos/swagger/listChecklist-response-swagger';
import DescriptionPlanningService from 'src/service/descriptionPlanning.service';
import ServiceOrderRepository from 'src/repositories/service-order-repository';

@ApiTags('Maintenance - Planning')
@Controller('/maintenance/planning')
export default class PlanningController {
  constructor(
    private periodicityBoundRepository: PeriodicityBoundRepository,
    private moduleService: ModuleService,
    private priorityServiceOrderRepository: PriorityServiceOrderRepository,
    private equipmentRepository: EquipmentRepository,
    private sectorExecutingRepository: SectorExecutingRepository,
    private typeMaintenanceRepository: TypeMaintenanceRepository,
    private descriptionPlanningRepository: DescriptionPlanningRepository,
    private familyRepository: FamilyRepository,
    private taskRepository: TaskRepository,
    private taskPlanningMaintenanceRepository: TaskPlanningMaintenanceRepository,
    private checklistRepository: CheckListRepository,
    private smartChecklistRepository: SmartChecklistRepository,
    private descriptionPlanningService: DescriptionPlanningService,
    private serviceOrderRepository: ServiceOrderRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/list-periodicity')
  async listPeriodicity(@Req() req) {
    const user: IUserInfo = req.user;

    const allPeriods = await this.periodicityBoundRepository.list();

    const response = [];

    allPeriods.forEach((period) => {
      if (
        period.manutencao === 1 &&
        user.module.findIndex(
          (module) => module.id === this.moduleService.list.Manutenção,
        ) >= 0
      ) {
        response.push({
          value: period.id.toString(),
          label: period.descricao,
        });
      }
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-priority')
  async listPriority(@Req() req) {
    const user: IUserInfo = req.user;

    const allPriority = await this.priorityServiceOrderRepository.listByClient(
      user.clientId,
    );

    const response = [];

    allPriority.forEach((priority) => {
      response.push({
        value: priority.id.toString(),
        label: priority.descricao,
      });
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-task')
  async listTask(@Req() req) {
    const user: IUserInfo = req.user;

    const allTask = await this.taskRepository.listByClient(user.clientId);

    const response = [];

    allTask.forEach((priority) => {
      response.push({
        value: priority.id.toString(),
        label: priority.tarefa,
      });
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success',
    type: ListTableResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/')
  async listTable(@Req() req) {
    const user: IUserInfo = req.user;

    //console.log(req.query);

    const querySchema = z.object({
      index: z.coerce
        .string()
        .optional()
        .nullable()
        .transform((value) =>
          value === undefined || value === '' || value === null
            ? null
            : Number(value),
        ),
      perPage: z.coerce
        .string()
        .optional()
        .nullable()
        .transform((value) =>
          value === undefined || value === '' || value === null
            ? null
            : Number(value),
        ),
      equipment: z.string().optional().nullable(),
      sectorExecuting: z.string().optional().nullable(),
      typeMaintenance: z.string().optional().nullable(),
      periodicity: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      type: z.enum(['automatico', 'manual']).optional(),
    });

    const query = querySchema.parse(req.query);

    //console.log(query);
    const allDescriptionPlanning =
      await this.descriptionPlanningRepository.listByBranches(
        user.branches,
        query.index,
        query.perPage,
        {
          ...(query.equipment && {
            planningEquipment: {
              some: {
                equipment: {
                  OR: [
                    {
                      equipamento_codigo: {
                        contains: query.equipment,
                      },
                    },
                    {
                      descricao: {
                        contains: query.equipment,
                      },
                    },
                  ],
                },
              },
            },
          }),
          ...(query.sectorExecuting && {
            sectorExecutor: {
              descricao: {
                contains: query.sectorExecuting,
              },
            },
          }),
          ...(query.typeMaintenance && {
            typeMaintenance: {
              tipo_manutencao: {
                contains: query.typeMaintenance,
              },
            },
          }),
          ...(query.periodicity && {
            periodicity: {
              descricao: {
                contains: query.periodicity,
              },
            },
          }),
          ...(query.description && {
            descricao: query.description,
          }),
          ...(query.type && {
            processamento: query.type,
          }),
        },
      );

    const response = {};

    allDescriptionPlanning.forEach((descriptionPlanning) => {
      const familyName = descriptionPlanning?.family?.familia || 'SEM VINCULO';

      // Inicializa a chave no objeto se não existir
      if (!response[familyName]) {
        response[familyName] = [];
      }

      // Adiciona o item à chave correspondente
      response[familyName].push({
        id: descriptionPlanning.id,
        family: familyName,
        equipment: descriptionPlanning.planningEquipment.map((pe) => {
          return {
            value: pe.equipment.ID.toString(),
            label: `${pe.equipment.equipamento_codigo} - ${pe.equipment.descricao}`,
          };
        }),
        sectorExecutingId: descriptionPlanning.sectorExecutor?.descricao,
        typeMaintenanceId: descriptionPlanning.typeMaintenance.tipo_manutencao,
        periodicityId: descriptionPlanning?.periodicity?.descricao,
        valueDefault: descriptionPlanning.valor_padrao,
        description: descriptionPlanning.descricao,
        type: descriptionPlanning.processamento,
      });
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success',
    type: CreateBodySwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('/')
  async create(@Req() req, @Body() body: CreateBody) {
    const user: IUserInfo = req.user;

    const family = await this.familyRepository.findById(body.familyId);

    if (!family) {
      throw new NotFoundException(MessageService.Bound_family_not_found);
    }

    for await (const equipmentId of body.equipmentId) {
      const equipmentFound =
        await this.equipmentRepository.findById(equipmentId);

      if (!equipmentFound) {
        throw new NotFoundException(MessageService.Equipment_not_found);
      }
    }

    const sector = await this.sectorExecutingRepository.findById(
      Number(body.sectorExecutingId),
    );

    if (!sector) {
      throw new NotFoundException(
        MessageService.Maintenance_sector_executing_not_found,
      );
    }

    const typeMaintenance = await this.typeMaintenanceRepository.findById(
      Number(body.typeMaintenanceId),
    );

    if (!typeMaintenance) {
      throw new NotFoundException(
        MessageService.Maintenance_type_maintenance_not_found,
      );
    }

    const periodicity = await this.periodicityBoundRepository.findById(
      body.periodicityId,
    );

    if (!periodicity) {
      throw new NotFoundException(
        MessageService.Maintenance_periodicity_not_found,
      );
    }

    let branchId = 0;

    for await (const equipmentId of body.equipmentId) {
      const equipment = await this.equipmentRepository.findById(equipmentId);

      if (!equipment) {
        throw new NotFoundException({
          message: MessageService.Equipment_not_found,
          error: true,
        });
      }

      branchId = equipment.branch.ID;
    }

    const description = await this.descriptionPlanningRepository.create({
      id_cliente: user.clientId,
      id_familia: family.ID,
      id_filial: branchId,
      id_setor_executante: sector.Id,
      id_tipo_manutencao: typeMaintenance.ID,
      id_periocidade: periodicity.id,
      valor_padrao: body.valueDefault,
      valor_inicial: body.valueBase,
      data_padrao: body.dateDefault,
      data_inicio: body.dateInitial,
      processamento: body.type,
      descricao: body.description,
      incremento: Number(body.increment) >= 0 ? Number(body.increment) : null,
      log_user: user.login,
      planningEquipment: {
        createMany: {
          data: body.equipmentId.map((equipmentId) => {
            return {
              id_equipamento: equipmentId,
              id_cliente: user.clientId,
            };
          }),
        },
      },
    });

    return {
      id: description.id,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success',
  })
  @Get('/:id/grid')
  async findByIdGrid(@Req() req, @Param('id') id: string) {
    const descriptionPlanning =
      await this.descriptionPlanningRepository.findById(Number(id));

    if (!descriptionPlanning) {
      throw new NotFoundException(
        MessageService.Description_planning_id_not_found,
      );
    }

    const list = descriptionPlanning.taskPlanningMaintenance.map((item) => {
      return {
        id: item.id,
        seq: item.seq,
        increment: item.incremento_programacao ? 1 : 0,
        periodicity: item.periodicity
          ? {
              value: item.periodicity.id.toString(),
              label: item.periodicity.descricao,
            }
          : null,
        periodicityUse: item.periodicidade_uso,
        dateBase: item.data_base,
        valueBase: item.valor_base,
        dataInitial: item.data_inicio,
        task: {
          value: item.task.id.toString(),
          label: item.task.tarefa,
        },
        modelChecklist: item.modelChecklist
          ? {
              value: item.modelChecklist.id.toString(),
              label: item.modelChecklist.descricao,
            }
          : null,
      };
    });

    return {
      data: list,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success',
    type: FindByIdResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/:id')
  async findById(@Req() req, @Param('id') id: string) {
    const descriptionPlanning =
      await this.descriptionPlanningRepository.findById(Number(id));

    if (!descriptionPlanning) {
      throw new NotFoundException(
        MessageService.Description_planning_id_not_found,
      );
    }

    const response = {
      id: descriptionPlanning.id,
      family: descriptionPlanning?.family
        ? {
            value: descriptionPlanning.family.ID.toString(),
            label: descriptionPlanning.family.familia,
          }
        : null,
      equipment: descriptionPlanning.planningEquipment.map((pe) => {
        return {
          value: pe.equipment.ID.toString(),
          label: `${pe.equipment.equipamento_codigo} - ${pe.equipment.descricao}`,
        };
      }),
      sectorExecutingId: descriptionPlanning.sectorExecutor.Id.toString(),
      typeMaintenanceId: descriptionPlanning.typeMaintenance.ID.toString(),
      periodicityId: descriptionPlanning?.periodicity?.id.toString(),
      valueDefault: descriptionPlanning?.valor_padrao?.toString(),
      valueBase: descriptionPlanning.valor_inicial?.toString(),
      dateDefault: descriptionPlanning?.data_padrao || null,
      dateInitial: descriptionPlanning?.data_inicio || null,
      increment:
        descriptionPlanning.incremento !== null &&
        Number(descriptionPlanning.incremento) >= 0
          ? descriptionPlanning.incremento.toString()
          : null,
      description: descriptionPlanning.descricao,
      type: descriptionPlanning.processamento,
      enable: descriptionPlanning.status_programacao === 1,
      item: descriptionPlanning.taskPlanningMaintenance.map((item) => {
        return {
          id: item.id,
          seq: item.seq,
          periodicity: item.periodicity
            ? {
                value: item.periodicity.id.toString(),
                label: item.periodicity.descricao,
              }
            : null,
          periodicityUse: item.periodicidade_uso,
          dateBase: item.data_base,
          valueBase: item.valor_base,
          task: {
            value: item.task.id.toString(),
            label: item.task.tarefa,
          },
          modelChecklist: item.modelChecklist
            ? {
                value: item.modelChecklist.id.toString(),
                label: item.modelChecklist.descricao,
              }
            : null,
        };
      }),
    };

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success',
    type: CreateBodySwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put('/:id')
  async update(@Req() req, @Param('id') id: string, @Body() body: CreateBody) {
    const user: IUserInfo = req.user;

    const descriptionPlanning =
      await this.descriptionPlanningRepository.findById(Number(id));

    if (!descriptionPlanning) {
      throw new NotFoundException(
        MessageService.Description_planning_id_not_found,
      );
    }

    const family = await this.familyRepository.findById(body.familyId);

    if (!family) {
      throw new NotFoundException(MessageService.Bound_family_not_found);
    }

    for await (const equipmentId of body.equipmentId) {
      const equipmentFound =
        await this.equipmentRepository.findById(equipmentId);

      if (!equipmentFound) {
        throw new NotFoundException(MessageService.Equipment_not_found);
      }
    }

    const sector = await this.sectorExecutingRepository.findById(
      Number(body.sectorExecutingId),
    );

    if (!sector) {
      throw new NotFoundException(
        MessageService.Maintenance_sector_executing_not_found,
      );
    }

    const typeMaintenance = await this.typeMaintenanceRepository.findById(
      Number(body.typeMaintenanceId),
    );

    if (!typeMaintenance) {
      throw new NotFoundException(
        MessageService.Maintenance_type_maintenance_not_found,
      );
    }

    const periodicity = await this.periodicityBoundRepository.findById(
      body.periodicityId,
    );

    if (!periodicity) {
      throw new NotFoundException(
        MessageService.Maintenance_periodicity_not_found,
      );
    }

    const description = await this.descriptionPlanningRepository.update(
      descriptionPlanning.id,
      {
        id_familia: family.ID,
        id_setor_executante: sector.Id,
        id_tipo_manutencao: typeMaintenance.ID,
        id_periocidade: periodicity.id,
        valor_padrao: body.valueDefault,
        valor_inicial: body.valueBase,
        data_padrao: body.dateDefault,
        data_inicio: body.dateInitial,
        processamento: body.type,
        descricao: body.description,
        incremento: Number(body.increment) >= 0 ? Number(body.increment) : null,
        //status_programacao: body.enable ? 1 : 0,
        planningEquipment: {
          upsert: body.equipmentId.map((equipmentId) => {
            return {
              create: {
                id_equipamento: equipmentId,
                id_cliente: user.clientId,
              },
              update: {},
              where: {
                id_planejamento_id_equipamento: {
                  id_equipamento: equipmentId,
                  id_planejamento: descriptionPlanning.id,
                },
              },
            };
          }),
        },
      },
    );

    return {
      id: description.id,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const descriptionPlanning =
      await this.descriptionPlanningRepository.findById(Number(id));

    if (!descriptionPlanning) {
      throw new NotFoundException(
        MessageService.Description_planning_id_not_found,
      );
    }

    await this.descriptionPlanningRepository.delete(descriptionPlanning.id);

    return {
      deleted: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put('/:id/disable')
  async disable(@Req() req, @Param('id') id: string) {
    const bodySchema = z.object({
      enabled: z.boolean(),
    });

    const body = bodySchema.parse(req.body);

    const descriptionPlanning =
      await this.descriptionPlanningRepository.findById(Number(id));

    if (!descriptionPlanning) {
      throw new NotFoundException(
        MessageService.Description_planning_id_not_found,
      );
    }

    await this.descriptionPlanningRepository.update(descriptionPlanning.id, {
      status_programacao: body.enabled ? 1 : 0,
    });

    return {
      disable: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateItemBodySwagger,
  })
  @ApiOkResponse({
    type: InsertedResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('/:id/item')
  async createItem(
    @Req() req,
    @Param('id') id: string,
    @Body() body: CreateItemBody,
  ) {
    const user: IUserInfo = req.user;

    const descriptionPlanning =
      await this.descriptionPlanningRepository.findById(Number(id));

    if (!descriptionPlanning) {
      throw new NotFoundException(
        MessageService.Description_planning_id_not_found,
      );
    }

    const task = await this.taskRepository.findById(body.taskId);

    if (!task) {
      throw new NotFoundException(MessageService.Task_not_found);
    }

    if (body.modelId) {
      const model = await this.checklistRepository.findById(body.modelId);

      if (!model) {
        throw new NotFoundException(MessageService.CheckList_model_not_found);
      }
    }

    await this.taskPlanningMaintenanceRepository.insert({
      id_cliente: user.clientId,
      id_planejamento: descriptionPlanning.id,
      id_tarefa: task.id,
      id_modelo: body.modelId,
      id_periocidade: body.periodicity,
      incremento_programacao:
        body.increment === 1 ? true : body.increment === 0 ? false : null,
      periodicidade_uso: body.periodicityUse ? body.periodicityUse : 0,
      valor_base: body.valueBase,
      data_base: body.dateBase,
      data_inicio: body.dataInitial,
      log_user: user.login,
      seq: descriptionPlanning.taskPlanningMaintenance.length + 1,
    });

    return {
      inserted: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateItemBodySwagger,
  })
  @ApiOkResponse({
    type: InsertedResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put('/:id/item/:itemId')
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() body: UpdateItemBody,
  ) {
    const taskPlanning = await this.taskPlanningMaintenanceRepository.findById(
      Number(itemId),
    );

    if (!taskPlanning) {
      throw new NotFoundException(
        MessageService.task_planning_maintenance_id_not_found,
      );
    }

    const task = await this.taskRepository.findById(body.taskId);

    if (!task) {
      throw new NotFoundException(MessageService.Task_not_found);
    }

    await this.taskPlanningMaintenanceRepository.update(taskPlanning.id, {
      id_tarefa: task.id,
      id_periocidade: body.periodicity,
      id_modelo: body.modelId,
      periodicidade_uso: body.periodicityUse,
      valor_base: body.valueBase,
      data_base: body.dateBase,
      data_inicio: body.dataInitial,
      incremento_programacao:
        body.increment === 1 ? true : body.increment === 0 ? false : null,
    });

    return {
      update: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: UpdatedResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put('/:id/item/:itemId/seq')
  async updateSeqItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: UpdateSeqItemBody,
  ) {
    const taskPlanning = await this.taskPlanningMaintenanceRepository.findById(
      Number(itemId),
    );

    if (!taskPlanning) {
      throw new NotFoundException(
        MessageService.task_planning_maintenance_id_not_found,
      );
    }

    const descriptionPlanning =
      await this.descriptionPlanningRepository.findById(Number(id));

    if (!descriptionPlanning) {
      throw new NotFoundException(
        MessageService.Description_planning_id_not_found,
      );
    }

    const itemMovido = descriptionPlanning.taskPlanningMaintenance.find(
      (i) => i.id === taskPlanning.id,
    );

    if (!itemMovido) throw new Error('Item não encontrado');

    // Remove o item que será movido da lista
    const itensRestantes = descriptionPlanning.taskPlanningMaintenance.filter(
      (i) => i.id !== taskPlanning.id,
    );

    // Insere o item na nova posição
    itensRestantes.splice(body.seq - 1, 0, itemMovido);

    // Atualiza o campo 'sequencia' baseado na nova posição no array
    const updates = itensRestantes.map((item, index) => ({
      id: item.id,
      sequencia: index + 1,
    }));

    // Executa updates
    for (const u of updates) {
      await this.taskPlanningMaintenanceRepository.update(u.id, {
        seq: u.sequencia,
      });
    }

    // await this.taskPlanningMaintenanceRepository.update(taskPlanning.id, {
    //   seq: body.seq,
    // });

    return {
      update: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: InsertedResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete('/:id/item/:itemId')
  async deleteItem(@Param('itemId') itemId: string) {
    const taskPlanning = await this.taskPlanningMaintenanceRepository.findById(
      Number(itemId),
    );

    if (!taskPlanning) {
      throw new NotFoundException(
        MessageService.task_planning_maintenance_id_not_found,
      );
    }

    await this.taskPlanningMaintenanceRepository.delete(taskPlanning.id);

    return {
      update: true,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: ListChecklistResponseSwagger,
  })
  @Get('/:id/list-checklist')
  async listChecklist(@Param('id') id: string) {
    const descriptionPlanning =
      await this.descriptionPlanningRepository.findById(Number(id));

    if (!descriptionPlanning) {
      throw new NotFoundException(
        MessageService.Description_planning_id_not_found,
      );
    }

    const allChecklist =
      await this.smartChecklistRepository.listByDescriptionMaintenance(
        descriptionPlanning.id,
      );

    const response = [];

    allChecklist.forEach((item) => {
      const findIndex = response.findIndex(
        (value) => value.modelId === item.checklistXModel[0].model.id,
      );

      if (findIndex === -1) {
        response.push({
          modelId: item.checklistXModel[0].model.id,
          modelDescription: item.checklistXModel[0].model.descricao,
          checklist: [
            {
              id: item.id,
              equipment: `${item.serviceOrder.equipment.ID}-${item.serviceOrder.equipment.descricao}`,
              dateStart: item.data_hora_inicio,
              dateEnd: item.data_hora_encerramento,
              item: item.checkListPeriod.map((value) => {
                return {
                  id: value.id,
                  task: value.checkListItem.checkListTask.descricao,
                };
              }),
            },
          ],
        });
      } else {
        response[findIndex].checklist.push({
          id: item.id,
          equipment: `${item.serviceOrder.equipment.ID}-${item.serviceOrder.equipment.descricao}`,
          dateStart: item.data_hora_inicio,
          dateEnd: item.data_hora_encerramento,
          item: item.checkListPeriod.map((value) => {
            return {
              id: value.id,
              task: value.checkListItem.checkListTask.descricao,
            };
          }),
        });
      }
    });

    return {
      data: response,
    };
  }
}
