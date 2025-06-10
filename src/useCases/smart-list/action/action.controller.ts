import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
//import * as dayjs from 'dayjs';
import dayjs from 'dayjs';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
import { ProductionChecklistActionGroupRepository } from 'src/repositories/production-checklist-action-group-repository';
import { ProductionChecklistActionRepository } from 'src/repositories/production-checklist-action-repository';
import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { MessageService } from 'src/service/message.service';
import editGroupBody from './dtos/editGroup-body';
import IExportPDFResponse from './dtos/exportPDF-response';
import { InfoTableQuery } from './dtos/infoTable-query';
import {
  InfoTableGroupResponse,
  InfoTableResponse,
} from './dtos/infoTable-response';
import { InsertActionBody } from './dtos/insertAction-body';
import { InsertActionGroupBody } from './dtos/insertActionGroup-body';
import { ResponsibleQuery } from './dtos/responsible-query';
import { ResponsibleResponse } from './dtos/responsible-response';
import { updatePathBody } from './dtos/updatePath-body';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Smart List - Action')
@ApiBearerAuth()
@Controller('/smart-list/action')
export class ActionController {
  constructor(
    private userRepository: UserRepository,
    private env: ENVService,
    private fileService: FileService,
    private checklistPeriodRepository: CheckListPeriodRepository,
    private productionChecklistActionRepository: ProductionChecklistActionRepository,
    private productionChecklistActionGroupRepository: ProductionChecklistActionGroupRepository,
    private branchesByUserRepository: BranchesByUserRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async infoTable(
    @Req() req,
    @Query()
    query: InfoTableQuery,
  ) {
    const user: IUserInfo = req.user;

    // const checklistPeriod =
    //   await this.checklistPeriodRepository.listByBranchAndStatusActionNotGroup(
    //     user.branches,
    //     query.index ? Number(query.index) : 0,
    //     query.perPage ? Number(query.perPage) : 10,
    //   );

    const checklistPeriodFast = query.index
      ? await this.checklistPeriodRepository.groupByBranchAndStatusActionNotGroupFast(
          user.branches,
          Number(query.index),
          Number(query.perPage),
          query.filterText &&
            query.filterText !== null &&
            query.filterText !== 'null'
            ? {
                AND: {
                  OR: [
                    {
                      checklist: {
                        equipment: {
                          equipamento_codigo: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                    {
                      checklist: {
                        equipment: {
                          descricao: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                    {
                      checklist: {
                        equipment: {
                          branch: {
                            filial_numero: {
                              contains: query.filterText,
                            },
                          },
                        },
                      },
                    },
                    {
                      checkListItem: {
                        checkListTask: {
                          descricao: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                    {
                      productionChecklistAction: {
                        some: {
                          user: {
                            name: {
                              contains: query.filterText,
                            },
                          },
                        },
                      },
                    },
                    {
                      productionChecklistAction: {
                        some: {
                          descricao: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                    {
                      productionChecklistAction: {
                        some: {
                          descricao_acao: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                  ],
                },
              }
            : undefined,
        )
      : await this.checklistPeriodRepository.groupByBranchAndStatusActionNotGroupFastNoPage(
          user.branches,
          query.filterText &&
            query.filterText !== null &&
            query.filterText !== 'null'
            ? {
                AND: {
                  OR: [
                    {
                      checklist: {
                        equipment: {
                          equipamento_codigo: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                    {
                      checklist: {
                        equipment: {
                          descricao: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                    {
                      checklist: {
                        equipment: {
                          branch: {
                            filial_numero: {
                              contains: query.filterText,
                            },
                          },
                        },
                      },
                    },
                    {
                      checkListItem: {
                        checkListTask: {
                          descricao: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                    {
                      productionChecklistAction: {
                        some: {
                          user: {
                            name: {
                              contains: query.filterText,
                            },
                          },
                        },
                      },
                    },
                    {
                      productionChecklistAction: {
                        some: {
                          descricao: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                    {
                      productionChecklistAction: {
                        some: {
                          descricao_acao: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                  ],
                },
              }
            : undefined,
        );

    //return checklistPeriodFast;

    // const checklistPeriod = query.index
    //   ? await this.checklistPeriodRepository.groupByBranchAndStatusActionNotGroup(
    //       user.login,
    //       user.clientId,
    //       Number(query.index) * Number(query.perPage),
    //       Number(query.perPage),
    //     )
    //   : await this.checklistPeriodRepository.groupByBranchAndStatusActionNotGroupNoPage(
    //       user.login,
    //       user.clientId,
    //     );

    const response: InfoTableResponse[] = [];

    // const countItems =
    //   await this.checklistPeriodRepository.countGroupByBranchAndStatusActionNotGroup(
    //     user.login,
    //     user.clientId,
    //   );

    const countItems =
      await this.checklistPeriodRepository.countGroupByBranchAndStatusActionNotGroupFast(
        user.branches,
        query.filterText &&
          query.filterText !== null &&
          query.filterText !== 'null'
          ? {
              AND: {
                OR: [
                  {
                    checklist: {
                      equipment: {
                        equipamento_codigo: {
                          contains: query.filterText,
                        },
                      },
                    },
                  },
                  {
                    checklist: {
                      equipment: {
                        descricao: {
                          contains: query.filterText,
                        },
                      },
                    },
                  },
                  {
                    checklist: {
                      equipment: {
                        branch: {
                          filial_numero: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                  },
                  {
                    checkListItem: {
                      checkListTask: {
                        descricao: {
                          contains: query.filterText,
                        },
                      },
                    },
                  },
                  {
                    productionChecklistAction: {
                      some: {
                        user: {
                          name: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                  },
                  {
                    productionChecklistAction: {
                      some: {
                        descricao: {
                          contains: query.filterText,
                        },
                      },
                    },
                  },
                  {
                    productionChecklistAction: {
                      some: {
                        descricao_acao: {
                          contains: query.filterText,
                        },
                      },
                    },
                  },
                ],
              },
            }
          : undefined,
      );

    for await (const item of checklistPeriodFast) {
      // const actionItem =
      //   await this.productionChecklistActionRepository.findByProductionAndItem(
      //     item.productionRegisterId,
      //     item.periodId,
      //   );
      const { productionChecklistAction } = item;
      // response.push({
      //   id: item.id,
      //   actionId: productionChecklistAction.length
      //     ? productionChecklistAction[0].id
      //     : null,
      //   equipment: `${item.checklist.equipment.equipamento_codigo} - ${item.checklist.equipment.descricao}`,
      //   location: '',
      //   branch: item.branch,
      //   branchId: item.branchId,
      //   responsible: actionItem
      //     ? {
      //         ...actionItem.user,
      //       }
      //     : null,
      //   startDate: item.startDate,
      //   description: actionItem ? actionItem.descricao : null,
      //   endDate: actionItem ? actionItem.data_fim : null,
      //   task: item.task,
      //   doneAt: actionItem ? actionItem.data_fechamento : null,
      //   descriptionAction: actionItem ? actionItem.descricao_acao : null,
      //   status: actionItem
      //     ? actionItem.data_fechamento
      //       ? 'CONCLUÍDO'
      //       : dayjs(actionItem.data_fim).isBefore(Date())
      //       ? 'VENCIDO'
      //       : 'EM ANDAMENTO'
      //     : 'EM ABERTO',
      // });

      response.push({
        id: item.id,
        actionId: productionChecklistAction.length
          ? productionChecklistAction[0].id
          : null,
        item: item.checklist.equipment
          ? `${item.checklist.equipment.equipamento_codigo} - ${item.checklist.equipment.descricao}`
          : item.checklist.location.tag
          ? `${item.checklist.location.tag}-${item.checklist.location.localizacao}`
          : item.checklist.location.localizacao,
        // equipment: item.checklist.equipment
        //   ? `${item.checklist.equipment.equipamento_codigo} - ${item.checklist.equipment.descricao}`
        //   : '',
        // location: item.checklist.location
        //   ? item.checklist.location.tag
        //     ? `${item.checklist.location.tag}-${item.checklist.location.localizacao}`
        //     : item.checklist.location.localizacao
        //   : '',
        branch: item.checklist.equipment
          ? item.checklist.equipment.branch.filial_numero
          : item.checklist.location.branch.filial_numero,
        branchId: item.checklist.equipment
          ? item.checklist.equipment.branch.ID
          : item.checklist.location.branch.ID,
        responsible: productionChecklistAction.length
          ? {
              ...productionChecklistAction[0].user,
            }
          : null,
        startDate: item.log_date,
        description: productionChecklistAction.length
          ? productionChecklistAction[0].descricao
          : null,
        endDate: productionChecklistAction.length
          ? productionChecklistAction[0].data_fim
          : null,
        task: item.checkListItem.checkListTask.descricao,
        doneAt: productionChecklistAction.length
          ? productionChecklistAction[0].data_fechamento
          : null,
        descriptionAction: productionChecklistAction.length
          ? productionChecklistAction[0].descricao_acao
          : null,
        status: productionChecklistAction.length
          ? productionChecklistAction[0].data_fechamento
            ? 'CONCLUÍDO'
            : dayjs(productionChecklistAction[0].data_fim).isBefore(Date())
            ? 'VENCIDO'
            : 'EM ANDAMENTO'
          : 'EM ABERTO',
      });
    }

    return {
      rows: response,
      pageCount: Math.ceil(countItems / query.perPage),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/group')
  async infoTableGroup(
    @Req() req,
    @Query()
    query: InfoTableQuery,
  ) {
    const user: IUserInfo = req.user;
    const index = query.index ? Number(query.index) * Number(query.perPage) : 0;
    const perPage = query.perPage ? Number(query.perPage) : 10;

    const checklistPeriod =
      query.index != null
        ? await this.productionChecklistActionGroupRepository.infoTable(
            user.clientId,
            user.branches,
            index,
            perPage,
            query.filterText &&
              query.filterText !== null &&
              query.filterText !== 'null'
              ? {
                  AND: {
                    OR: [
                      {
                        checklist: {
                          equipment: {
                            equipamento_codigo: {
                              contains: query.filterText,
                            },
                          },
                        },
                      },
                      {
                        checklist: {
                          equipment: {
                            descricao: {
                              contains: query.filterText,
                            },
                          },
                        },
                      },
                      {
                        checklist: {
                          equipment: {
                            branch: {
                              filial_numero: {
                                contains: query.filterText,
                              },
                            },
                          },
                        },
                      },
                      {
                        user: {
                          name: {
                            contains: query.filterText,
                          },
                        },
                      },
                      {
                        titulo: {
                          contains: query.filterText,
                        },
                      },
                      {
                        productionChecklistActionItems: {
                          some: {
                            checklist: {
                              checkListPeriod: {
                                some: {
                                  checkListItem: {
                                    checkListTask: {
                                      descricao: {
                                        contains: query.filterText,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },

                      {
                        descricao: {
                          contains: query.filterText,
                        },
                      },
                      {
                        descricao_acao: {
                          contains: query.filterText,
                        },
                      },
                    ],
                  },
                }
              : undefined,
          )
        : await this.productionChecklistActionGroupRepository.infoTableNoPage(
            user.clientId,
            user.branches,
            query.filterText &&
              query.filterText !== null &&
              query.filterText !== 'null'
              ? {
                  AND: {
                    OR: [
                      {
                        checklist: {
                          equipment: {
                            equipamento_codigo: {
                              contains: query.filterText,
                            },
                          },
                        },
                      },
                      {
                        checklist: {
                          equipment: {
                            descricao: {
                              contains: query.filterText,
                            },
                          },
                        },
                      },
                      {
                        checklist: {
                          equipment: {
                            branch: {
                              filial_numero: {
                                contains: query.filterText,
                              },
                            },
                          },
                        },
                      },
                      {
                        user: {
                          name: {
                            contains: query.filterText,
                          },
                        },
                      },
                      {
                        titulo: {
                          contains: query.filterText,
                        },
                      },
                      {
                        productionChecklistActionItems: {
                          some: {
                            checklist: {
                              checkListPeriod: {
                                some: {
                                  checkListItem: {
                                    checkListTask: {
                                      descricao: {
                                        contains: query.filterText,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },

                      {
                        descricao: {
                          contains: query.filterText,
                        },
                      },
                      {
                        descricao_acao: {
                          contains: query.filterText,
                        },
                      },
                    ],
                  },
                }
              : undefined,
          );

    const response: InfoTableGroupResponse[] = [];

    const countItems =
      await this.productionChecklistActionGroupRepository.countItems(
        user.clientId,
        user.branches,
        query.filterText &&
          query.filterText !== null &&
          query.filterText !== 'null'
          ? {
              AND: {
                OR: [
                  {
                    checklist: {
                      equipment: {
                        equipamento_codigo: {
                          contains: query.filterText,
                        },
                      },
                    },
                  },
                  {
                    checklist: {
                      equipment: {
                        descricao: {
                          contains: query.filterText,
                        },
                      },
                    },
                  },
                  {
                    checklist: {
                      equipment: {
                        branch: {
                          filial_numero: {
                            contains: query.filterText,
                          },
                        },
                      },
                    },
                  },
                  {
                    user: {
                      name: {
                        contains: query.filterText,
                      },
                    },
                  },
                  {
                    titulo: {
                      contains: query.filterText,
                    },
                  },
                  {
                    productionChecklistActionItems: {
                      some: {
                        checklist: {
                          checkListPeriod: {
                            some: {
                              checkListItem: {
                                checkListTask: {
                                  descricao: {
                                    contains: query.filterText,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  {
                    descricao: {
                      contains: query.filterText,
                    },
                  },
                  {
                    descricao_acao: {
                      contains: query.filterText,
                    },
                  },
                ],
              },
            }
          : undefined,
      );

    for await (const item of checklistPeriod) {
      response.push({
        id: item.id,
        code: item.numero,
        item: item.productionChecklistActionItems[0].checklist.equipment
          ? `${item.productionChecklistActionItems[0].checklist.equipment.equipamento_codigo} - ${item.productionChecklistActionItems[0].checklist.equipment.descricao}`
          : item.productionChecklistActionItems[0].checklist.location.tag
          ? `${item.productionChecklistActionItems[0].checklist.location.tag}-${item.productionChecklistActionItems[0].checklist.location.localizacao}`
          : item.productionChecklistActionItems[0].checklist.location
              .localizacao,
        // equipment: item.productionChecklistActionItems[0].checklist.equipment
        //   ? `${item.productionChecklistActionItems[0].checklist.equipment.equipamento_codigo} - ${item.productionChecklistActionItems[0].checklist.equipment.descricao}`
        //   : '',
        // location: item.productionChecklistActionItems[0].checklist.location
        //   ? item.productionChecklistActionItems[0].checklist.location.tag
        //     ? `${item.productionChecklistActionItems[0].checklist.location.tag}-${item.productionChecklistActionItems[0].checklist.location.localizacao}`
        //     : item.productionChecklistActionItems[0].checklist.location
        //         .localizacao
        //   : '',
        branch: item.productionChecklistActionItems[0].checklist.equipment
          ? item.productionChecklistActionItems[0].checklist.equipment.branch
              .filial_numero
          : item.productionChecklistActionItems[0].checklist.location.branch
              .filial_numero,
        responsible: item.user
          ? {
              ...item.user,
            }
          : null,
        title: item.titulo,
        task: item.productionChecklistActionItems[0].checklistPeriod
          .checkListItem.checkListTask.descricao,
        startDate: item.data_inicio,
        endDate: item.data_fim,
        doneAt: item.data_concluida,
        description: item.descricao,
        descriptionAction: item.descricao_acao,
        status: item.data_concluida
          ? item.data_concluida
            ? 'CONCLUÍDO'
            : dayjs(item.data_fim).isBefore(Date())
            ? 'VENCIDO'
            : 'EM ANDAMENTO'
          : 'EM ABERTO',
      });
    }

    return {
      rows: response,
      pageCount: Math.ceil(countItems / perPage),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-group/:branchId')
  async listGroup(@Req() req, @Param('branchId') branchId: string) {
    const user: IUserInfo = req.user;

    const checklistPeriod =
      await this.productionChecklistActionGroupRepository.listGroupByBranch(
        user.clientId,
        Number(branchId),
      );

    const response: { id: number; title: string }[] = checklistPeriod.map(
      (item) => {
        return {
          id: item.id,
          title: item.titulo,
        };
      },
    );

    return {
      groups: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async insertAction(@Body() body: InsertActionBody) {
    const checklistPeriod = await this.checklistPeriodRepository.findById(
      body.itemId,
    );

    if (!checklistPeriod) {
      throw new ForbiddenException(MessageService.ChecklistAction_itemId);
    }

    const checklistActionVerify =
      await this.productionChecklistActionRepository.findByProductionAndItem(
        checklistPeriod.id_checklist,
        checklistPeriod.id,
      );

    if (checklistActionVerify) {
      throw new ForbiddenException(
        MessageService.ChecklistAction_duplicate_item,
      );
    }

    const checklistAction =
      await this.productionChecklistActionRepository.create({
        id_grupo: body.groupId,
        id_checklist: checklistPeriod.id_checklist,
        id_item: checklistPeriod.id,
        descricao: body.description,
        responsavel: body.responsible,
        data_inicio: checklistPeriod.log_date,
        data_fim: body.deadline,
      });

    const user = await this.userRepository.findByLogin(
      checklistAction.responsavel,
    );

    return {
      id: checklistPeriod.id,
      actionId: checklistAction.id,
      //equipment: `${checklistPeriod.checklist.equipment.equipamento_codigo} - ${checklistPeriod.checklist.equipment.descricao}`,
      item: checklistPeriod.checklist.equipment
        ? `${checklistPeriod.checklist.equipment.equipamento_codigo} - ${checklistPeriod.checklist.equipment.descricao}`
        : checklistPeriod.checklist.location.tag
        ? `${checklistPeriod.checklist.location.tag}-${checklistPeriod.checklist.location.localizacao}`
        : checklistPeriod.checklist.location.localizacao,
      branch: checklistPeriod.checklist.equipment
        ? checklistPeriod.checklist.equipment.branch.filial_numero
        : checklistPeriod.checklist.location.branch.filial_numero,
      responsible: { ...user },
      startDate: checklistPeriod.log_date,
      description: checklistAction.descricao,
      endDate: checklistAction.data_fim,
      task: checklistPeriod.checkListItem.checkListTask.descricao,
      doneAt: checklistAction.data_fechamento,
      descriptionAction: checklistAction.descricao_acao,
      status: checklistAction.data_fechamento
        ? 'CONCLUÍDO'
        : dayjs(checklistAction.data_fim).isBefore(Date())
        ? 'VENCIDO'
        : 'EM ANDAMENTO',
    };
  }

  @UseGuards(AuthGuard)
  @Post('/group')
  async insertActionGroup(@Req() req, @Body() body: InsertActionGroupBody) {
    const user: IUserInfo = req.user;

    const checklistActionGroup =
      await this.productionChecklistActionGroupRepository.create({
        id_cliente: user.clientId,
        responsavel: body.responsible,
        titulo: body.title ? body.title : null,
        descricao: body.description,
        data_inicio: dayjs().toDate(),
        data_fim: dayjs(body.deadline).toDate(),
        numero: 1,
      });

    for await (const item of body.itemsId) {
      const checklistPeriod =
        await this.checklistPeriodRepository.findById(item);

      if (!checklistPeriod) {
        throw new ForbiddenException(MessageService.ChecklistAction_itemId);
      }

      // const checklistActionVerify =
      //   await this.productionChecklistActionRepository.findByProductionAndItem(
      //     checklistPeriod.id_registro_producao,
      //     checklistPeriod.id,
      //   );

      // if (checklistActionVerify) {
      //   throw new ForbiddenException(
      //     MessageService.ChecklistAction_duplicate_item,
      //   );
      // }

      await this.productionChecklistActionRepository.create({
        id_grupo: checklistActionGroup.id,
        id_checklist: checklistPeriod.id_checklist,
        id_item: checklistPeriod.id,
        descricao: body.description,
        responsavel: body.responsible,
        data_inicio: checklistPeriod.log_date,
        data_fim: dayjs(body.deadline).toDate(),
      });
    }

    const newChecklistActionGroup =
      await this.productionChecklistActionGroupRepository.findById(
        checklistActionGroup.id,
      );

    if (!newChecklistActionGroup) {
      throw new NotFoundException(MessageService.ChecklistAction_groupId);
    }

    return {
      id: newChecklistActionGroup.id,
      code: newChecklistActionGroup.numero,
      // equipment: newChecklistActionGroup.productionChecklistActionItems.map(
      //   (value) =>
      //     `${value.checklist.equipment.equipamento_codigo} - ${value.checklist.equipment.descricao}`,
      // ),
      // branch: newChecklistActionGroup.productionChecklistActionItems.map(
      //   (value) => value.checklist.equipment.branch.filial_numero,
      // ),
      responsible: newChecklistActionGroup.user
        ? {
            ...newChecklistActionGroup.user,
          }
        : null,
      title: newChecklistActionGroup.titulo,
      task: newChecklistActionGroup.productionChecklistActionItems[0]
        .checklistPeriod.checkListItem.checkListTask.descricao,
      endDate: newChecklistActionGroup.data_fim,
      doneAt: newChecklistActionGroup.data_concluida,
      description: newChecklistActionGroup.descricao,
      descriptionAction: newChecklistActionGroup.descricao_acao,
      status: newChecklistActionGroup.data_concluida
        ? newChecklistActionGroup.data_concluida
          ? 'CONCLUÍDO'
          : dayjs(newChecklistActionGroup.data_fim).isBefore(Date())
          ? 'VENCIDO'
          : 'EM ANDAMENTO'
        : 'EM ABERTO',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/responsible')
  async responsible(@Req() req, @Query() query: ResponsibleQuery) {
    const user: IUserInfo = req.user;

    let branchId = 0;

    if (query.type === 'without-action') {
      const checklistPeriod = await this.checklistPeriodRepository.findById(
        Number(query.itemId),
      );

      if (!checklistPeriod) {
        throw new NotFoundException(MessageService.ChecklistAction_itemId);
      }

      branchId = checklistPeriod.checklist.equipment
        ? checklistPeriod.checklist.equipment.branch.ID
        : checklistPeriod.checklist.location.branch.ID;
    } else {
      const checklistActionGroup =
        await this.productionChecklistActionGroupRepository.findById(
          Number(query.itemId),
        );

      if (!checklistActionGroup) {
        throw new NotFoundException(MessageService.ChecklistAction_itemId);
      }

      branchId = checklistActionGroup.productionChecklistActionItems[0]
        .checklist.equipment
        ? checklistActionGroup.productionChecklistActionItems[0].checklist
            .equipment.branch.ID
        : checklistActionGroup.productionChecklistActionItems[0].checklist
            .location.branch.ID;
    }

    const users = await this.branchesByUserRepository.listByClientAndBranch(
      user.clientId,
      branchId,
    );

    const response: ResponsibleResponse[] = users.map((item) => {
      return {
        login: item.user.login,
        name: item.user.name,
      };
    });

    return { responsible: response };
  }

  @UseGuards(AuthGuard)
  @Put('/')
  async updateAction(@Body() body: InsertActionBody) {
    const checklistAction =
      await this.productionChecklistActionRepository.update(body.actionId, {
        responsavel: body.responsible,
        data_fim: body.deadline,
        descricao: body.description,
        data_fechamento: body.doneAt,
        descricao_acao: body.descriptionAction,
      });

    const checklistPeriod = await this.checklistPeriodRepository.findById(
      Number(checklistAction.id_item),
    );

    const user = await this.userRepository.findByLogin(
      checklistAction.responsavel,
    );

    return {
      id: checklistPeriod.id,
      actionId: checklistAction.id,
      equipment: `${checklistPeriod.checklist.equipment.equipamento_codigo} - ${checklistPeriod.checklist.equipment.descricao}`,
      branch: checklistPeriod.checklist.equipment.branch.filial_numero,
      responsible: { ...user },
      startDate: checklistPeriod.log_date,
      description: checklistAction.descricao,
      endDate: checklistAction.data_fim,
      task: checklistPeriod.checkListItem.checkListTask.descricao,
      doneAt: checklistAction.data_fechamento,
      descriptionAction: checklistAction.descricao_acao,
      status: checklistAction.data_fechamento
        ? 'CONCLUÍDO'
        : dayjs(checklistAction.data_fim).isBefore(Date())
        ? 'VENCIDO'
        : 'EM ANDAMENTO',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/attach/:id')
  async listPath(@Param('id') id: string) {
    const response: {
      img: {
        url: string;
      }[];
      errorImg: any;
    } = {
      img: [],
      errorImg: false,
    };

    const img: {
      url: string;
    }[] = [];

    try {
      const path = `${this.env.FILE_PATH}/checkListAction/groupAction_${id}`;

      const fileList = this.fileService.list(path);
      fileList.forEach((fileItem) => {
        img.push({
          url: `https://www.smartnewservices.com.br/sistemas/_lib/img/checkListAction/groupAction_${id}/${fileItem}`,
        });
      });
    } catch (error) {
      console.log(error);
      response.errorImg = {
        message: MessageService.SYSTEM_FTP_IMG_ERROR_CONNECT,
      };
    }

    response.img = img;
    return response;
  }

  @Post('/insert-attach/:id')
  @UseInterceptors(FileInterceptor('file'))
  async insertAttach(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const path = `${this.env.FILE_PATH}/checkListAction/groupAction_${id}`;

    this.fileService.write(path, file.originalname, file.buffer);

    return {
      insert: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/delete-attach/:id')
  async deleteAttach(
    // @Request() req,
    // @Param('id') id: string,
    @Body() body: updatePathBody,
  ) {
    const path = `../${body.urlFile}`;

    this.fileService.delete(path);

    return {
      delete: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/group/:id')
  async findGroupById(@Param('id') id: string) {
    const newChecklistActionGroup =
      await this.productionChecklistActionGroupRepository.findById(Number(id));

    if (!newChecklistActionGroup) {
      throw new NotFoundException(MessageService.ChecklistAction_groupId);
    }

    return {
      info: {
        id: newChecklistActionGroup.id,
        code: newChecklistActionGroup.numero,
        // equipment: newChecklistActionGroup.productionChecklistActionItems.map(
        //   (value) =>
        //     `${value.checklist.equipment.equipamento_codigo} - ${value.checklist.equipment.descricao}`,
        // ),
        // branch: newChecklistActionGroup.productionChecklistActionItems.map(
        //   (value) => value.checklist.equipment.branch.filial_numero,
        // ),
        responsible: newChecklistActionGroup.user
          ? {
              ...newChecklistActionGroup.user,
            }
          : null,
        title: newChecklistActionGroup.titulo,
        startDate: newChecklistActionGroup.data_inicio,
        endDate: newChecklistActionGroup.data_fim,
        doneAt: newChecklistActionGroup.data_concluida,
        description: newChecklistActionGroup.descricao,
        descriptionAction: newChecklistActionGroup.descricao_acao,
        status: newChecklistActionGroup.data_concluida
          ? newChecklistActionGroup.data_concluida
            ? 'CONCLUÍDO'
            : dayjs(newChecklistActionGroup.data_fim).isBefore(Date())
            ? 'VENCIDO'
            : 'EM ANDAMENTO'
          : 'EM ABERTO',
      },
      items: newChecklistActionGroup.productionChecklistActionItems.map(
        (value) => {
          return {
            id: value.id,
            task: value.checklistPeriod.checkListItem.checkListTask.descricao,
            equipment: value.checklist.equipment
              ? `${value.checklist.equipment.equipamento_codigo} - ${value.checklist.equipment.descricao}`
              : value.checklist.location.tag
              ? `${value.checklist.location.tag}-${value.checklist.location.localizacao}`
              : value.checklist.location.localizacao,
            branch: value.checklist.equipment
              ? value.checklist.equipment.branch.filial_numero
              : value.checklist.location.branch.filial_numero,
            startDate: value.checklistPeriod.log_date,
          };
        },
      ),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/item/:itemId')
  async findByItemId(@Req() req, @Param('itemId') itemId: string) {
    const checklistPeriod = await this.checklistPeriodRepository.findById(
      Number(itemId),
    );

    if (!checklistPeriod) {
      throw new NotFoundException(MessageService.ChecklistAction_itemId);
    }

    const allItems = checklistPeriod.checklist.equipment
      ? await this.checklistPeriodRepository.listByTaskAndEquipmentNotGroup(
          checklistPeriod.checkListItem.checkListTask.id,
          checklistPeriod.checklist.equipment.ID,
        )
      : await this.checklistPeriodRepository.listByTaskAndLocationNotGroup(
          checklistPeriod.checkListItem.checkListTask.id,
          checklistPeriod.checklist.location.id,
        );

    return {
      info: {
        id: checklistPeriod.id,
        code: null,
        equipment: checklistPeriod.checklist.equipment
          ? `${checklistPeriod.checklist.equipment.equipamento_codigo} - ${checklistPeriod.checklist.equipment.descricao}`
          : checklistPeriod.checklist.location.tag
          ? `${checklistPeriod.checklist.location.tag} - ${checklistPeriod.checklist.location.localizacao}`
          : checklistPeriod.checklist.location.localizacao,
        branch: checklistPeriod.checklist.equipment
          ? checklistPeriod.checklist.equipment.branch.filial_numero
          : checklistPeriod.checklist.location.branch.filial_numero,
        responsible: null,
        title: null,
        startDate: dayjs().toDate(),
        endDate: null,
        doneAt: null,
        description: null,
        descriptionAction: null,
        status: 'EM ABERTO',
      },
      items: allItems.map((value) => {
        return {
          id: value.id,
          task: value.checkListItem.checkListTask.descricao,
          equipment: value.checklist.equipment
            ? `${value.checklist.equipment.equipamento_codigo} - ${value.checklist.equipment.descricao}`
            : value.checklist.location.tag
            ? `${value.checklist.location.tag}-${value.checklist.location.localizacao}`
            : value.checklist.location.localizacao,
          branch: value.checklist.equipment
            ? value.checklist.equipment.branch.filial_numero
            : value.checklist.location.branch.filial_numero,
          startDate: value.log_date,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Post('/group/:id')
  async insertItem(
    @Param('id') id: number,
    @Body() body: { itemsId: number[] },
  ) {
    const checklistActionGroup =
      await this.productionChecklistActionGroupRepository.findById(Number(id));

    if (!checklistActionGroup) {
      throw new NotFoundException(MessageService.ChecklistAction_groupId);
    }

    for await (const item of body.itemsId) {
      const checklistPeriod =
        await this.checklistPeriodRepository.findById(item);

      if (!checklistPeriod) {
        throw new ForbiddenException(MessageService.ChecklistAction_itemId);
      }

      // const checklistActionVerify =
      //   await this.productionChecklistActionRepository.findByProductionAndItem(
      //     checklistPeriod.id_registro_producao,
      //     checklistPeriod.id,
      //   );

      // if (checklistActionVerify) {
      //   throw new ForbiddenException(
      //     MessageService.ChecklistAction_duplicate_item,
      //   );
      // }

      let find = false;

      checklistActionGroup.productionChecklistActionItems.forEach((value) => {
        if (
          value.checklist.equipment.branch.ID ===
          checklistPeriod.checklist.equipment.branch.ID
        ) {
          find = true;
        }
      });

      if (!find) {
        throw new NotFoundException(
          MessageService.ChecklistAction_item_not_branch,
        );
      }

      await this.productionChecklistActionRepository.create({
        id_grupo: checklistActionGroup.id,
        id_checklist: checklistPeriod.id_checklist,
        id_item: checklistPeriod.id,
        descricao: checklistActionGroup.descricao,
        responsavel: checklistActionGroup.user.login,
        data_inicio: checklistPeriod.log_date,
        data_fim: checklistActionGroup.data_fim,
      });
    }

    return { inserted: true };
  }

  @UseGuards(AuthGuard)
  @Put('/group/:id')
  async editGroup(@Param('id') id: string, @Body() body: editGroupBody) {
    const checklistActionGroup =
      await this.productionChecklistActionGroupRepository.findById(Number(id));

    if (!checklistActionGroup) {
      throw new NotFoundException(MessageService.ChecklistAction_groupId);
    }

    const newChecklistActionGroup =
      await this.productionChecklistActionGroupRepository.update(
        checklistActionGroup.id,
        {
          data_fim: body.deadline,
          data_concluida: body?.doneAt,
          descricao: body.description,
          descricao_acao: body?.descriptionAction,
          responsavel: body.responsible,
        },
      );

    return {
      id: newChecklistActionGroup.id,
      code: newChecklistActionGroup.numero,
      // equipment: newChecklistActionGroup.productionChecklistActionItems.map(
      //   (value) =>
      //     `${value.checklist.equipment.equipamento_codigo} - ${value.checklist.equipment.descricao}`,
      // ),
      // branch: newChecklistActionGroup.productionChecklistActionItems.map(
      //   (value) => value.checklist.equipment.branch.filial_numero,
      // ),
      responsible: newChecklistActionGroup.user
        ? {
            ...newChecklistActionGroup.user,
          }
        : null,
      title: newChecklistActionGroup.titulo,
      task: newChecklistActionGroup.productionChecklistActionItems[0]
        .checklistPeriod.checkListItem.checkListTask.descricao,
      endDate: newChecklistActionGroup.data_fim,
      doneAt: newChecklistActionGroup.data_concluida,
      description: newChecklistActionGroup.descricao,
      descriptionAction: newChecklistActionGroup.descricao_acao,
      status: newChecklistActionGroup.data_concluida
        ? newChecklistActionGroup.data_concluida
          ? 'CONCLUÍDO'
          : dayjs(newChecklistActionGroup.data_fim).isBefore(Date())
          ? 'VENCIDO'
          : 'EM ANDAMENTO'
        : 'EM ABERTO',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/group/pdf/:groupId')
  async exportPDF(@Param('groupId') groupId: string, @Req() req) {
    const user: IUserInfo = req.user;

    const checklistActionGroup =
      await this.productionChecklistActionGroupRepository.findById(
        Number(groupId),
      );

    if (!checklistActionGroup) {
      throw new NotFoundException(MessageService.ChecklistAction_groupId);
    }

    const response: IExportPDFResponse = {
      description: checklistActionGroup.descricao,
      responsible: checklistActionGroup.user.name,
      logo: `https://www.smartnewservices.com.br/sistemas/_lib/img/img_os/img_${user.clientId}.jpg`,
      status: checklistActionGroup.data_concluida
        ? checklistActionGroup.data_concluida
          ? 'CONCLUÍDO'
          : dayjs(checklistActionGroup.data_fim).isBefore(Date())
          ? 'VENCIDO'
          : 'EM ANDAMENTO'
        : 'EM ABERTO',
      deadline: checklistActionGroup.data_fim,
      pendencies: checklistActionGroup.productionChecklistActionItems.map(
        (item) => {
          return {
            attach: [''],
            createdAt: item.checklistPeriod.log_date,
            equipment: `${item.checklist.equipment.equipamento_codigo} - ${item.checklist.equipment.descricao}`,
            verify: item.checklistPeriod.checkListItem.checkListTask.descricao,
          };
        },
      ),
      done: {
        doneAt: checklistActionGroup.data_concluida,
        descriptionAction: checklistActionGroup.descricao_acao,
        attach: [''],
      },
    };

    return response;
  }

  @Get('/list-attach-checklist-by-group/:groupId')
  async listAttachChecklistByGroup(@Param('groupId') groupId: string) {
    const checklistActionGroup =
      await this.productionChecklistActionGroupRepository.findById(
        Number(groupId),
      );

    if (!checklistActionGroup) {
      throw new NotFoundException(MessageService.ChecklistAction_groupId);
    }
    const img: { url: string }[] = [];

    for await (const items of checklistActionGroup.productionChecklistActionItems) {
      try {
        const path = `${this.env.FILE_PATH}/checkList/task_${items.checklistPeriod.id}`;
        const fileList = this.fileService.list(path);

        fileList.forEach((fileItem) => {
          img.push({
            url: `${this.env.URL_IMAGE}/checkList/task_${items.checklistPeriod.id}/${fileItem}`,
          });
        });
      } catch (error) {}
    }

    return img;
  }

  @Get('/list-attach-checklist-by-periodId/:periodId')
  async listAttachChecklistByPeriodId(@Param('periodId') periodId: string) {
    const checklistPeriod = await this.checklistPeriodRepository.findById(
      Number(periodId),
    );

    if (!checklistPeriod) {
      throw new NotFoundException(MessageService.ChecklistAction_itemId);
    }

    const allItems =
      await this.checklistPeriodRepository.listByTaskAndEquipmentNotGroup(
        checklistPeriod.checkListItem.checkListTask.id,
        checklistPeriod.checklist.equipment.ID,
      );

    const img: { url: string }[] = [];

    for await (const item of allItems) {
      try {
        const path = `${this.env.FILE_PATH}/checkList/task_${item.id}`;
        const fileList = this.fileService.list(path);

        fileList.forEach((fileItem) => {
          img.push({
            url: `${this.env.URL_IMAGE}/checkList/task_${item.id}/${fileItem}`,
          });
        });
      } catch (error) {}
    }

    return img;
  }
}
