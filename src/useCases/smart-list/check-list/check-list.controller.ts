import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { BuyNumberFiscalRepository } from 'src/repositories/buy-number-fiscal-repository';
import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
import { CheckListStatusActionRepository } from 'src/repositories/checklist-status-action-repository';
import { CheckListStatusRepository } from 'src/repositories/checklist-status-repository';
import { ProductionRegisterRepository } from 'src/repositories/production-register-repository';
import SmartChecklistRepository from 'src/repositories/smart-checklist-repository';
import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { MessageService } from 'src/service/message.service';
import { z } from 'zod';
import { DeleteAttachBody } from './dtos/deleteAttach-body';
import { FindByIdBody } from './dtos/findById-body';
import { findByIdResponse } from './dtos/findById-response';
import { InfoTableQuery } from './dtos/infoTable-query';
import { TaskByIdQuery } from './dtos/taskById-query';
import { UpdateTaskBody } from './dtos/updateTask-body';
import RegisterAutomaticBody from './dtos/registerAutomatic-body';
import ChecklistService from 'src/service/checklist.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

//import { IUserInfo } from 'src/models/IUser';
@ApiTags('Smart List - Check List')
@ApiBearerAuth()
@Controller('/smart-list/check-list')
export class CheckListController {
  constructor(
    private productionRegisterRepository: ProductionRegisterRepository,
    private smartChecklistRepository: SmartChecklistRepository,
    private checkListPeriodRepository: CheckListPeriodRepository,
    private checkListStatusRepository: CheckListStatusRepository,
    private checkListStatusActionRepository: CheckListStatusActionRepository,
    private buyNumberFiscalRepository: BuyNumberFiscalRepository,
    private checklistService: ChecklistService,
    private userRepository: UserRepository,
    private env: ENVService,
    private fileService: FileService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async infoTable(@Request() req, @Query() query: InfoTableQuery) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      index: z.coerce.number().optional(),
      perPage: z.coerce.number().optional(),
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

    // const whereOpt =
    //   filterText === '' || filterText === null || filterText === undefined
    //     ? {
    //         AND: {
    //           OR: [
    //             {
    //               equipment: {
    //                 ID_filial: {
    //                   in: user.branches,
    //                 },
    //               },
    //               OR: [
    //                 {
    //                   data_hora_inicio: {
    //                     gte: dateFrom ? new Date(dateFrom) : new Date(),
    //                     lte: dateTo ? new Date(dateTo) : new Date(),
    //                   },
    //                 },
    //                 {
    //                   data_hora_encerramento: {
    //                     equals: null,
    //                   },
    //                 },
    //               ],
    //             },
    //             {
    //               location: {
    //                 id_filial: {
    //                   in: user.branches,
    //                 },
    //               },
    //               OR: [
    //                 {
    //                   data_hora_encerramento: {
    //                     lte: dateTo ? new Date(dateTo) : new Date(),
    //                   },
    //                 },
    //                 {
    //                   data_hora_encerramento: {
    //                     equals: null,
    //                   },
    //                 },
    //               ],
    //               data_hora_inicio: {
    //                 gte: dateFrom ? new Date(dateFrom) : new Date('1970-01-01'),
    //                 lte: dateTo ? new Date(dateTo) : new Date(),
    //               },
    //             },
    //           ],
    //         },
    //       }
    //     : {
    //         AND: {
    //           OR: [
    //             {
    //               equipment: {
    //                 ID_filial: {
    //                   in: user.branches,
    //                 },
    //               },
    //               OR: [
    //                 {
    //                   data_hora_encerramento: {
    //                     lte: dateTo ? new Date(dateTo) : new Date(),
    //                   },
    //                 },
    //                 {
    //                   data_hora_encerramento: {
    //                     equals: null,
    //                   },
    //                 },
    //               ],
    //             },
    //             {
    //               location: {
    //                 id_filial: {
    //                   in: user.branches,
    //                 },
    //               },
    //               OR: [
    //                 {
    //                   data_hora_encerramento: {
    //                     lte: dateTo ? new Date(dateTo) : new Date(),
    //                   },
    //                 },
    //                 {
    //                   data_hora_encerramento: {
    //                     equals: null,
    //                   },
    //                 },
    //               ],
    //               data_hora_inicio: {
    //                 gte: dateFrom ? new Date(dateFrom) : new Date('1970-01-01'),
    //                 lte: dateTo ? new Date(dateTo) : new Date(),
    //               },
    //             },
    //           ],
    //         },
    //         OR: [
    //           {
    //             checklistXModel: {
    //               every: {
    //                 model: {
    //                   descricao: {
    //                     contains: filterText,
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //           {
    //             equipment: {
    //               OR: [
    //                 {
    //                   descricao: {
    //                     contains: filterText,
    //                   },
    //                 },
    //                 {
    //                   equipamento_codigo: {
    //                     contains: filterText,
    //                   },
    //                 },
    //               ],
    //             },
    //           },
    //           {
    //             user: {
    //               OR: [
    //                 {
    //                   name: {
    //                     contains: filterText,
    //                   },
    //                 },
    //                 {
    //                   login: {
    //                     contains: filterText,
    //                   },
    //                 },
    //               ],
    //             },
    //           },
    //           {
    //             period: {
    //               turno: {
    //                 contains: filterText,
    //               },
    //             },
    //           },
    //           {
    //             id: {
    //               equals: Number(filterText) || -1,
    //             },
    //           },
    //         ],
    //       };

    const allProductionRegister =
      index === null
        ? await this.smartChecklistRepository.listAllByClient(
            user.clientId,
            // filterText || '',
            // dateFrom || '',
            // dateTo || '',
            {
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
      {},
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
      pageCount: Math.ceil(pageCount / perPage),
      rows: response,
    };
  }

  @Post('/register-automatic')
  @UseGuards(AuthGuard)
  async registerAutomatic(@Body() body: RegisterAutomaticBody) {
    await this.checklistService.createJob(body.equipmentId, body.modelId);

    return {
      message: 'Cron Jobs scheduled successfully',
    };
  }

  @Get('/find-by-id')
  async findById(
    @Query() query: FindByIdBody,
  ): Promise<{ response: findByIdResponse }> {
    const { productionId } = query;

    const productionRegister = await this.smartChecklistRepository.findById(
      Number(productionId),
    );

    if (!productionRegister) {
      throw new ForbiddenException(MessageService.Production_not_found);
    }

    const response: findByIdResponse = {
      id: productionRegister.id,
      status: productionRegister.status ? 'open' : 'close',
      startDate: productionRegister.data_hora_inicio,
      endDate: productionRegister.data_hora_encerramento,
      model: productionRegister?.checklistXModel[0]?.model.descricao || '',
      item: productionRegister.equipment
        ? productionRegister.equipment.equipamento_codigo != ''
          ? `${productionRegister.equipment.equipamento_codigo}-${productionRegister.equipment.descricao}`
          : productionRegister.equipment.descricao
        : productionRegister.location.tag
        ? `${productionRegister.location.tag}-${productionRegister.location.localizacao}`
        : productionRegister.location.localizacao,
      //equipment: productionRegister.equipment
      // ? productionRegister.equipment.equipamento_codigo != ''
      //   ? `${productionRegister.equipment.equipamento_codigo}-${productionRegister.equipment.descricao}`
      //   : productionRegister.equipment.descricao
      // : null,
      //location: productionRegister.location
      // ? productionRegister.location.tag
      //   ? `${productionRegister.location.tag}-${productionRegister.location.localizacao}`
      //   : productionRegister.location.localizacao
      // : null,
      user: productionRegister.user.name,
      tasks: [],
    };

    const allCheckListPeriod =
      await this.checkListPeriodRepository.listByChecklistId(
        productionRegister.id,
      );

    for await (const checklistPeriod of allCheckListPeriod) {
      response.tasks.push({
        id: checklistPeriod.id,
        description: checklistPeriod.checkListItem.checkListTask.descricao,
        answer: checklistPeriod.status
          ? {
              id: checklistPeriod.status.id,
              description: checklistPeriod.status.descricao,
              color: checklistPeriod.status.cor,
              icon: checklistPeriod.status.icone,
              observation: checklistPeriod.observacao,
              children: checklistPeriod.statusAction
                ? {
                    id: checklistPeriod.statusAction.id,
                    description: checklistPeriod.statusAction.descricao,
                  }
                : null,
            }
          : null,
      });
    }

    return {
      response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-status')
  async listStatus(@Request() req) {
    const { user } = req;

    const status = await this.checkListStatusRepository.listByClient(
      user.clientId,
    );

    return {
      status: status.map((item) => {
        return {
          id: item.id,
          description: item.descricao,
          icon: item.icone,
          color: item.cor,
          action: item.acao,
          control: item.checkListControl.descricao,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/task-by-id')
  async taskById(@Request() req, @Query() query: TaskByIdQuery) {
    const { taskId } = query;
    const { user } = req;

    const URLSYSTEM = this.env.URL_IMAGE;

    // if (this.env.NODE_ENV === 'production') {
    //   URLSYSTEM = 'https://www.smartnewservices.com.br/sistemas/_lib/img';
    // }

    const checklistPeriodRegister =
      await this.checkListPeriodRepository.listByPeriodId(taskId);

    if (!checklistPeriodRegister) {
      throw new BadRequestException(MessageService.Task_id_not_found);
    }

    const answersRegister = await this.checkListStatusRepository.listByClient(
      user.clientId,
    );

    const childrenRegister =
      await this.checkListStatusActionRepository.listByTask(
        checklistPeriodRegister.checkListItem.checkListTask.id,
      );

    const img: {
      url: string;
    }[] = [];

    let errorImg: {
      message: string;
    } | null = null;

    if (checklistPeriodRegister.status?.acao) {
      try {
        try {
          const path = `${this.env.FILE_PATH}/checkList/task_${checklistPeriodRegister.id}`;

          const fileList = this.fileService.list(path);

          fileList.forEach((fileItem) => {
            img.push({
              url: `${URLSYSTEM}/checkList/task_${checklistPeriodRegister.id}/${fileItem}`,
            });
          });
        } catch (error) {}
      } catch (error) {
        errorImg = {
          message: MessageService.SYSTEM_FTP_IMG_ERROR_CONNECT,
        };
      }
    }

    const response = {
      id: checklistPeriodRegister.id,
      observation: checklistPeriodRegister.observacao,
      answer: answersRegister
        .map((option) => ({
          id: option.id,
          type: option.checkListControl.descricao,
          description: option.descricao,
          color: option.cor,
          icon: option.icone,
          child:
            option.acao && childrenRegister.length > 0
              ? childrenRegister
                  .map((item) => ({
                    id: item.id,
                    description: item.descricao,
                  }))
                  .find(
                    (item) =>
                      item.id === checklistPeriodRegister.status_item_nc,
                  )
              : {},
        }))
        .find((opt) => opt.id === checklistPeriodRegister?.status?.id),
      // answer: answersRegister.find(opt => opt.id === checklistPeriodRegister.status)
      options: answersRegister.map((option) => ({
        id: option.id,
        type: option.checkListControl.descricao,
        description: option.descricao,
        color: option.cor,
        icon: option.icone,
        action: option.acao,
        children:
          option.acao && childrenRegister.length > 0
            ? childrenRegister.map((item) => ({
                id: item.id,
                description: item.descricao,
              }))
            : [],
      })),
      images: img,
      error: errorImg,
    };

    return response;
  }

  @Put('/update-task/:id')
  async updateTask(@Param('id') id: string, @Body() body: UpdateTaskBody) {
    const { answerId, childId, newImages, observation, removedImages } = body;

    const checklistPeriod = await this.checkListPeriodRepository.listByPeriodId(
      Number(id),
    );
    if (!checklistPeriod) {
      throw new BadRequestException(MessageService.Task_id_not_found);
    }

    await this.checkListPeriodRepository.update(checklistPeriod.id, {
      status_item: answerId,
      status_item_nc: childId || null,
      observacao: observation,
    });

    let errorImg: {
      message: string;
    } | null = null;

    try {
      const path = `${this.env.FILE_PATH}/checkList/task_${checklistPeriod.id}`;

      if (newImages?.length) {
        for await (const img of newImages) {
          try {
            const buffer = Buffer.from(img.base64, 'base64');
            const tempFileName = `${new Date().toISOString()}.jpg`;

            this.fileService.write(path, tempFileName, buffer);
          } catch (error) {}
        }
      }

      if (removedImages?.length) {
        for await (const img of removedImages) {
          try {
            this.fileService.delete(`/www/${img}`);
          } catch (error) {}
        }
      }
    } catch (error) {
      errorImg = {
        message: MessageService.SYSTEM_FTP_IMG_DELETE_CONNECT,
      };
    }

    return {
      updated: true,
      error: errorImg,
    };
  }

  @Post('/insert-attach/:id')
  @UseInterceptors(FileInterceptor('file'))
  async insertAttach(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const path = `${this.env.FILE_PATH}/checkList/task_${id}`;
    const buffer = Buffer.from(file.originalname, 'latin1');
    const utf8String = buffer.toString('utf-8');
    const file_name = utf8String
      .replace(/ç/g, 'c') // Substituir 'ç' por 'c'
      .replace(/[\s-]+/g, '_'); // Substituir espaços e '-' por '_'

    file.originalname = file_name;

    await this.fileService.write(path, file.originalname, file.buffer);

    const nodes_permission = ['production', 'dev'];
    const path_dynamic = nodes_permission.includes(this.env.NODE_ENV)
      ? this.env.URL_IMAGE
      : this.env.FILE_PATH;
    const path_base = `${path_dynamic}/checkList/task_${id}`;

    const url = `${path_base}/${file.originalname}`;
    return {
      insert: true,
      url: url,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/delete-attach/:id')
  async deleteAttach(
    // @Request() req,
    // @Param('id') id: string,
    @Body() body: DeleteAttachBody,
  ) {
    // const user: IUserInfo = req.user;

    // const period = await this.checkListPeriodRepository.findResponsible(
    //   Number(id),
    // );

    // if (user.login !== period.productionRegister.login) {
    //   throw new ForbiddenException(MessageService.User_not_permission);
    // }

    const path = `${this.env.FILE_PATH}/checkList/${body.urlFile}`;
    this.fileService.delete(path);

    return {
      delete: true,
    };
  }

  @Get('/list-attach-all')
  async listAttachAll() {
    const startDate = new Date('2023-06-01');
    const allNumbers = await this.buyNumberFiscalRepository.list(1, startDate);

    const response: any[] = [];

    for await (const item of allNumbers) {
      for await (const finance of item.requestProvider) {
        if (
          finance.id_finance &&
          response.findIndex(
            (val) => val.id_financeiro == finance.id_finance,
          ) == -1
        ) {
          const path = `/www/erp/_lib/img/financeiro/id_${finance.id_finance}`;

          const listAll = this.fileService.list(path);

          for await (const file of listAll) {
            const sysPath = `${this.env.FILE_PATH}/financeiro/id_${finance.id_finance}`;
            const listSys = this.fileService.list(sysPath);

            let exists = false;

            for await (const fileSys of listSys) {
              if (fileSys === file) {
                exists = true;
              }
            }

            if (!exists) {
              this.fileService.move(`${path}/${file}`, `${sysPath}/${file}`);
            }
          }

          response.push({
            id_pedido: item.id,
            id_financeiro: finance.id_finance,
            anexos: listAll.length,
            data_fechamento: item.buy.fechamento.toLocaleDateString('pt-BR'),
          });
        }
      }
    }

    return response;
  }

  @Get('/list-user')
  async listUser() {
    const clientIdFix = 1;

    const users = await this.userRepository.listUserByClient(clientIdFix);

    const response = [];

    for await (const item of users) {
      const group = await this.userRepository.findGroup(item.login);

      response.push({
        login: item.login,
        nome: item.name,
        grupo: group?.group?.description || '',
      });
    }

    return response;
  }

  @Delete('/:id')
  async deleteChecklist(@Param('id') id: string) {
    const productionRegister = await this.smartChecklistRepository.findById(
      Number(id),
    );

    if (!productionRegister) {
      throw new ForbiddenException(MessageService.Production_not_found);
    }

    const validActionInChecklist = productionRegister.checkListPeriod.some(
      (value) => value.productionChecklistAction.length > 0,
    );

    if (validActionInChecklist) {
      throw new ForbiddenException(
        MessageService.Production_has_action_in_checklist,
      );
    }

    const deleteChecklist =
      await this.smartChecklistRepository.deleteInTransaction(
        productionRegister.id,
      );

    if (!deleteChecklist) {
      throw new InternalServerErrorException(
        MessageService.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      deleted: true,
    };
  }
}
