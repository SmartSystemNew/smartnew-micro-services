import {
  UseGuards,
  Get,
  Req,
  Param,
  Query,
  NotFoundException,
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import SmartChecklistRepository from 'src/repositories/smart-checklist-repository';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';
import ListChecklistQuery from './dtos/listChecklist-query';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import ListChecklistQuerySwagger from './dtos/swagger/listChecklist-query-swagger';
import { ListChecklistResponseSwagger } from './dtos/swagger/listChecklist-response-swagger';
import CreateBoundChecklistBody from './dtos/createBoundChecklist-body';
import EquipmentRepository from 'src/repositories/equipment-repository';
import LocationRepository from 'src/repositories/location-repository';
import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
import { IUserInfo } from 'src/models/IUser';
import { CheckListRepository } from 'src/repositories/checklist-repository';
import CheckListTurnRepository from 'src/repositories/checklist-turn-repository';
import CreateBoundChecklistBodySwagger from './dtos/swagger/createBoundChecklist-body-swagger';
import RegisterTurnRepository from 'src/repositories/register-turn-repository';
import SelectResponseSwagger from 'src/models/swagger/select-response-swagger';
import UpdateChecklistBody from './dtos/updateChecklist-body';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';

@ApiTags('Maintenance - Service Order - Check List')
@ApiBearerAuth()
@Controller('/maintenance/service-order/:id_service_order/check-list')
export default class ChecklistServiceOrderController {
  constructor(
    private envService: ENVService,
    private fileService: FileService,
    private serviceOrderRepository: ServiceOrderRepository,
    private smartChecklistRepository: SmartChecklistRepository,
    private equipmentRepository: EquipmentRepository,
    private locationRepository: LocationRepository,
    private checkListTurnRepository: CheckListTurnRepository,
    private checkListModelRepository: CheckListRepository,
    private checkListPeriodRepository: CheckListPeriodRepository,
    private registerTurnRepository: RegisterTurnRepository,
  ) {}
  @UseGuards(AuthGuard)
  @ApiQuery({
    type: ListChecklistQuerySwagger,
  })
  @ApiResponse({
    description: 'List de Checklist vinculados a Ordem de Serviço',
    type: ListChecklistResponseSwagger,
  })
  @Get('/')
  async listChecklist(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Query() query: ListChecklistQuery,
  ) {
    const user = req.user;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const querySchema = z.object({
      index: z.coerce
        .string()
        .transform((value) =>
          value === '' || undefined ? null : Number(value),
        )
        .optional(),
      perPage: z.coerce
        .string()
        .transform((value) =>
          value === '' || undefined ? null : Number(value),
        )
        .optional(),
      filterText: z.string().optional(),
      dateFrom: z.coerce
        .string()
        .transform((value) => (value.length ? new Date(value) : null))
        .optional(),
      dateTo: z.coerce
        .string()
        .transform((value) => (value.length ? new Date(value) : null))
        .optional(),
    });

    const { index, perPage, filterText, dateFrom, dateTo } =
      querySchema.parse(query);

    const allProductionRegister =
      index === undefined || index === null
        ? await this.smartChecklistRepository.listAllByClient(
            user.clientId,
            // filterText || '',
            // dateFrom || '',
            // dateTo || '',
            {
              id_ordem_servico: serviceOrder.ID,
              AND: {
                OR: [
                  {
                    equipment: {
                      ID_filial: {
                        in: user.branches,
                      },
                      ...(filterText && {
                        OR: [
                          {
                            equipamento_codigo: {
                              contains: filterText,
                            },
                          },
                          {
                            descricao: {
                              contains: filterText,
                            },
                          },
                        ],
                      }),
                    },
                  },
                  {
                    location: {
                      id_filial: {
                        in: user.branches,
                      },
                      ...(filterText && {
                        OR: [
                          {
                            localizacao: {
                              contains: filterText,
                            },
                          },
                        ],
                      }),
                    },
                  },
                  {
                    ...(filterText && {
                      OR: [
                        {
                          checklistXModel: {
                            some: {
                              model: {
                                descricao: {
                                  contains: filterText,
                                },
                              },
                            },
                          },
                        },
                        {
                          period: {
                            turno: {
                              contains: filterText,
                            },
                          },
                        },
                      ],
                    }),
                  },
                ],
                // ...(filterText && {
                //   OR: [
                //     {
                //       checklistXModel: {
                //         some: {
                //           model: {
                //             descricao: {
                //               contains: filterText,
                //             },
                //           },
                //         },
                //       },
                //     },
                //     {
                //       period: {
                //         turno: {
                //           contains: filterText,
                //         },
                //       },
                //     },
                //   ],
                // }),
                data_hora_inicio: {
                  gte: dateFrom || new Date('1970-01-01'),
                  lte: dateTo || new Date(),
                },
              },
            },
          )
        : await this.smartChecklistRepository.listByClient(
            user.clientId,
            index,
            perPage,
            // filterText || '',
            // dateFrom || '',
            // dateTo || '',
            {
              id_ordem_servico: serviceOrder.ID,
              AND: {
                OR: [
                  {
                    equipment: {
                      ID_filial: {
                        in: user.branches,
                      },
                      ...(filterText && {
                        OR: [
                          {
                            equipamento_codigo: {
                              contains: filterText,
                            },
                          },
                          {
                            descricao: {
                              contains: filterText,
                            },
                          },
                        ],
                      }),
                    },
                  },
                  {
                    location: {
                      id_filial: {
                        in: user.branches,
                      },
                      ...(filterText && {
                        OR: [
                          {
                            localizacao: {
                              contains: filterText,
                            },
                          },
                        ],
                      }),
                    },
                  },
                  {
                    ...(filterText && {
                      OR: [
                        {
                          checklistXModel: {
                            some: {
                              model: {
                                descricao: {
                                  contains: filterText,
                                },
                              },
                            },
                          },
                        },
                        {
                          period: {
                            turno: {
                              contains: filterText,
                            },
                          },
                        },
                      ],
                    }),
                  },
                ],
                // ...(filterText && {
                //   OR: [
                //     {
                //       checklistXModel: {
                //         some: {
                //           model: {
                //             descricao: {
                //               contains: filterText,
                //             },
                //           },
                //         },
                //       },
                //     },
                //     {
                //       period: {
                //         turno: {
                //           contains: filterText,
                //         },
                //       },
                //     },
                //   ],
                // }),
                data_hora_inicio: {
                  gte: dateFrom || new Date('1970-01-01'),
                  lte: dateTo || new Date(),
                },
              },
            },
          );

    const pageCount = await this.smartChecklistRepository.countListByClient(
      user.clientId,
      // filterText || '',
      // dateFrom || '',
      // dateTo || '',
      {
        id_ordem_servico: serviceOrder.ID,
      },
    );

    const response = allProductionRegister.map((item) => {
      return {
        id: item.id,
        status: item.status ? 'open' : 'close',
        startDate: item.data_hora_inicio,
        endDate: item.data_hora_encerramento,
        model: item.checklistXModel[0]?.model.descricao || '',
        item: item.equipment
          ? item.equipment.equipamento_codigo != ''
            ? `${item.equipment.equipamento_codigo}-${item.equipment.descricao}`
            : item.equipment.descricao
          : item.location.tag
          ? `${item.location.tag}-${item.location.localizacao}`
          : item.location.localizacao,
        // equipment: item.equipment
        //   ? item.equipment.equipamento_codigo != ''
        //     ? `${item.equipment.equipamento_codigo}-${item.equipment.descricao}`
        //     : item.equipment.descricao
        //   : null,
        // location: item.location ? item.location.localizacao : null,
        user: item.user ? item.user.name : '',
        period: item.period?.turno || '',
      };
    });

    return {
      rows: response,
      pageCount: pageCount,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'Lista de Turnos por filial disponíveis',
    type: SelectResponseSwagger,
  })
  @Get('/list-turn')
  async listTurn(@Param('id_service_order') id_service_order: string) {
    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const allTurn = await this.registerTurnRepository.listByBranch(
      serviceOrder.ID_filial,
    );

    const response = allTurn.map((item) => {
      return {
        value: item.id.toString(),
        label: item.turno,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    type: CreateBoundChecklistBodySwagger,
    description: 'Cria um checklist da ordem de serviço',
  })
  @Post('/')
  async createBoundChecklist(
    @Req() req,
    @Param('id_service_order') id_service_order: string,
    @Body() body: CreateBoundChecklistBody,
  ) {
    const user: IUserInfo = req.user;

    const serviceOrder = await this.serviceOrderRepository.findById(
      Number(id_service_order),
    );

    if (!serviceOrder) {
      throw new NotFoundException(MessageService.Service_order_id_not_found);
    }

    const equipmentFound = {
      id: null,
      branchId: null,
    };

    if (body.equipmentId && body.equipmentId !== null) {
      const equipment = await this.equipmentRepository.findById(
        body.equipmentId,
      );

      if (!equipment) {
        throw new NotFoundException(MessageService.Equipment_not_found);
      }

      equipmentFound.id = equipment.ID;
      equipmentFound.branchId = equipment.branch.ID;
    }

    if (equipmentFound.id === null) {
      throw new BadRequestException(
        MessageService.CheckList_equipment_and_location_not_found,
      );
    }

    let periodId = null;

    if (body.periodId && body.periodId !== null) {
      const period = await this.checkListTurnRepository.findById(body.periodId);

      if (!period) {
        throw new NotFoundException(MessageService.CheckList_turn_not_found);
      }

      periodId = period.id;
    }

    const model = await this.checkListModelRepository.findById(body.modelId);

    if (!model) {
      throw new NotFoundException(MessageService.CheckList_model_not_found);
    }

    const create = await this.smartChecklistRepository.createTransaction(
      user.clientId,
      user.login,
      equipmentFound.id !== null ? equipmentFound : null,
      null,
      serviceOrder.ID,
      periodId,
      model.id,
      body.hourMeter,
      body.odometer,
      body.kilometer,
    );

    if (!create.created) {
      throw new InternalServerErrorException(create.errorMessage);
    }

    return {
      created: create.created,
      id: create.id,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:checklistId')
  async findByChecklist(@Param('checklistId') checklistId: string) {
    const checklist = await this.smartChecklistRepository.findById(
      Number(checklistId),
    );

    if (!checklist) {
      throw new NotFoundException(MessageService.CheckList_not_found);
    }

    const allTask = checklist.checkListPeriod.map((item) => {
      return {
        id: item.id,
        task: {
          id: item.checkListItem.checkListTask.id,
          description: item.checkListItem.checkListTask.descricao,
          children: item.checkListItem.checkListTask.checkListStatusAction.map(
            (action) => {
              return {
                id: action.id,
                description: action.descricao,
                control: {
                  id: action.checkListControl.id,
                  description: action.checkListControl.descricao,
                },
                status: {
                  id: action.checkListStatus.id,
                  description: action.checkListStatus.descricao,
                },
              };
            },
          ),
        },
        answer: item.status
          ? {
              value: item.status.id.toString(),
              label: item.status.descricao,
            }
          : null,
        observation: item.observacao,
      };
    });

    return {
      data: allTask,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/:checklistId')
  async updateChecklist(
    @Param('checklistId') checklistId: string,
    @Body() body: UpdateChecklistBody,
  ) {
    const checklist = await this.smartChecklistRepository.findById(
      Number(checklistId),
    );

    if (!checklist) {
      throw new NotFoundException(MessageService.CheckList_not_found);
    }

    for await (const item of body.checklist) {
      await this.checkListPeriodRepository.update(item.id, {
        status_item: item.answer,
        status_item_nc: item.children || null,
        observacao: item.observation,
      });
    }

    return {
      updated: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:checklistId')
  async deleteChecklist(@Param('checklistId') checklistId: string) {
    const checklist = await this.smartChecklistRepository.findById(
      Number(checklistId),
    );

    if (!checklist) {
      throw new NotFoundException(MessageService.CheckList_not_found);
    }

    if (checklist.checklistActionGroup.length > 0) {
      throw new BadRequestException(MessageService.CheckList_has_action);
    }

    await this.smartChecklistRepository.deleteInTransaction(checklist.id);

    return {
      deleted: true,
    };
  }
}
