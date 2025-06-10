import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { CheckListRepository } from 'src/repositories/checklist-repository';
import { CheckListCreateBody } from './dtos/create-body';
import { FamilyRepository } from 'src/repositories/family-repository';
import { MessageService } from 'src/service/message.service';
import { CheckListUpdateBody } from './dtos/update-body';
import { CheckListItemRepository } from 'src/repositories/checklist-item-repository';
import { CheckListCreateItemBody } from './dtos/createItem-body';
import { CheckListControlRepository } from 'src/repositories/checklist-control-repository';
import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
import LocationRepository from 'src/repositories/location-repository';
import { z } from 'zod';
import { ListTableQuery } from './dtos/listTable-query';
import { ListBoundQuery } from './dtos/listBound-query';
import ChecklistService from 'src/service/checklist.service';
import { DateService } from 'src/service/data.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import EquipmentRepository from 'src/repositories/equipment-repository';

@ApiTags('Smart List - Bound')
@ApiBearerAuth()
@Controller('/smart-list/bound')
export class BoundController {
  constructor(
    private checkListRepository: CheckListRepository,
    private familyRepository: FamilyRepository,
    private checkListItemRepository: CheckListItemRepository,
    private checkListControlRepository: CheckListControlRepository,
    private checkListPeriodRepository: CheckListPeriodRepository,
    private locationRepository: LocationRepository,
    private checklistService: ChecklistService,
    private dateService: DateService,
    private equipmentRepository: EquipmentRepository,
  ) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async listTable(@Req() req, @Query() query) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      filterText: z.string().optional(),
    });

    const request: ListTableQuery = querySchema.parse(query);

    const allBound = await this.checkListRepository.listByBranch(
      user.branches,
      request.filterText &&
        request.filterText !== null &&
        request.filterText !== 'null'
        ? {
            OR: [
              {
                descricao: {
                  contains: request.filterText,
                },
              },
              {
                location: {
                  tag: {
                    contains: request.filterText,
                  },
                },
              },
              {
                location: {
                  localizacao: {
                    contains: request.filterText,
                  },
                },
              },
              {
                familyEquipment: {
                  familia: {
                    contains: request.filterText,
                  },
                },
              },
            ],
          }
        : undefined,
    );

    return {
      bound: allBound.map((item) => {
        return {
          id: item.id,
          description: item.descricao,
          automatic: item.automatico === 1,
          periodicity: item.periocidade,
          periodicDate: item.data_base,
          anticipation: item.antecipacao,
          timer: item.hora_base,
          typePeriodicity: item.typePeriodicity && {
            value: item.typePeriodicity.id.toString(),
            text: item.typePeriodicity.descricao,
          },
          name: item.familyEquipment
            ? item.familyEquipment.familia
            : item.location.tag
            ? `${item.location.tag}-${item.location.localizacao}`
            : item.location.localizacao,
          item: item.checkListItens.map((item) => {
            return {
              id: item.id,
              task: {
                value: item.checkListTask.id.toString(),
                text: item.checkListTask.descricao,
              },
              control: {
                value: item.checkListControl.id.toString(),
                text: item.checkListControl.descricao,
              },
            };
          }),
        };
      }),
    };
  }

  @Get('/list-control')
  async listControl() {
    const allControl = await this.checkListControlRepository.list();

    return {
      control: allControl.map((item) => {
        return {
          id: item.id,
          description: item.descricao,
        };
      }),
    };
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async findById(@Param('id') id: number) {
    const checklist = await this.checkListRepository.findById(Number(id));

    if (!checklist) {
      throw new BadRequestException(MessageService.CheckList_not_found);
    }

    const response = {
      id: checklist.id,
      description: checklist.descricao,
      bound: checklist.familyEquipment
        ? {
            value: checklist.familyEquipment.ID.toString(),
            text: checklist.familyEquipment.familia,
          }
        : {
            value: checklist.location.id.toString(),
            text: checklist.location.tag
              ? `${checklist.location.tag}-${checklist.location.localizacao}`
              : checklist.location.localizacao,
          },
      automatic: checklist.automatico === 1,
      periodicity: checklist.periocidade,
      dateBase: checklist.data_base,
      anticipation: checklist.antecipacao,
      hora_base: checklist.hora_base,
      typePeriodicity: checklist.typePeriodicity && {
        value: checklist.typePeriodicity.id.toString(),
        text: checklist.typePeriodicity.descricao,
      },
      checklistItens: checklist.checkListItens.map((item) => {
        return {
          id: item.id,
          checkListControl: {
            value: item.checkListControl.id.toString(),
            text: item.checkListControl.descricao,
          },
          checkListTask: {
            value: item.checkListTask.id.toString(),
            text: item.checkListTask.descricao,
          },
        };
      }),
      boundPeriodicity: checklist.boundPeriodicity.map((period) => {
        return {
          id: period.id,
          equipment: period.equipment && {
            value: period.equipment.ID.toString(),
            text: period.equipment.equipamento_codigo,
          },
          diverse: period.diverse && {
            value: period.diverse.id.toString(),
            text: period.diverse.localizacao,
          },
        };
      }),
    };

    return {
      data: response,
    };
  }

  @Post('/')
  @UseGuards(AuthGuard)
  async create(@Req() req, @Body() body: CheckListCreateBody) {
    const user: IUserInfo = req.user;

    const { type } = body;

    // let family = { ID: null };

    //let location = { id: null };

    if (type === 'family' && body.familyId) {
      for await (const familyId of body.familyId) {
        const family = await this.familyRepository.findById(Number(familyId));

        if (!family) {
          throw new ForbiddenException(MessageService.Bound_family_not_found);
        }
      }

      for await (const familyId of body.familyId) {
        const validFamilyUnique =
          await this.checkListRepository.findByFamilyAndDescription(
            Number(familyId),
            body.description,
          );

        if (validFamilyUnique) {
          // throw new ForbiddenException(
          //   MessageService.Bound_family_already_exist,
          // );
          continue;
        }

        await this.checkListRepository.create({
          id_familia: Number(familyId),
          id_localizacao: null,
          descricao: body.description,
          automatico: body.automatic ? 1 : 0,
          periocidade: body.dateBase
            ? this.dateService.dayjs(body.dateBase).date()
            : body.periodicity,
          tipo_periocidade: body.typePeriodicity,
          data_base: this.dateService.dayjs(body.dateBase).toDate(),
          antecipacao: body.anticipation,
          hora_base: body.horaBase,
          verifica_finalizado: body.finalize ? 1 : 0,
          log_user: user.login,
          checkListItens: {
            createMany: {
              data: body.task.map((task) => {
                return {
                  id_controle: body.control,
                  id_tarefa: task,
                };
              }),
            },
          },
        });
      }
    } else if (type === 'diverse' && body.diverseId) {
      for await (const diverseId of body.diverseId) {
        const location = await this.locationRepository.findById(
          Number(diverseId),
        );

        if (!location) {
          throw new ForbiddenException(MessageService.Bound_location_not_found);
        }
      }

      for await (const diverseId of body.diverseId) {
        const validLocationUnique =
          await this.checkListRepository.findByLocationAndDescription(
            Number(diverseId),
            body.description,
          );

        if (validLocationUnique) {
          // throw new ForbiddenException(
          //   MessageService.Bound_location_already_exist,
          // );
          continue;
        }

        await this.checkListRepository.create({
          id_familia: null,
          id_localizacao: Number(diverseId),
          descricao: body.description,
          automatico: body.automatic ? 1 : 0,
          periocidade: body.periodicity,
          data_base: body.dateBase,
          antecipacao: body.anticipation,
          hora_base: body.horaBase,
          log_user: user.login,
          checkListItens: {
            createMany: {
              data: body.task.map((task) => {
                return {
                  id_controle: body.control,
                  id_tarefa: task,
                };
              }),
            },
          },
        });
      }
    }

    return { inserted: true };
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() body: CheckListUpdateBody) {
    const checklist = await this.checkListRepository.findById(Number(id));

    if (!checklist) {
      throw new ForbiddenException(MessageService.CheckList_not_found);
    }

    await this.checkListRepository.update(
      {
        descricao: body.description || checklist.descricao,
        automatico:
          body.automatic !== null
            ? body.automatic
              ? 1
              : 0
            : checklist.automatico,
        periocidade: body.dateBase
          ? body.dateBase
            ? this.dateService.dayjs(body.dateBase).date()
            : body.periodicity || checklist.periocidade
          : checklist.periocidade,
        tipo_periocidade:
          body.typePeriodicity || checklist?.typePeriodicity?.id || null,
        data_base: body.dateBase
          ? this.dateService.dayjs(body.dateBase).toDate()
          : checklist.data_base,
        antecipacao: body.anticipation || checklist.antecipacao,
        hora_base: body.horaBase || checklist.hora_base,
        verifica_finalizado: body.finalize
          ? body.finalize
            ? 1
            : 0
          : checklist.verifica_finalizado,
      },
      Number(id),
    );

    if (body.automatic) {
      await this.checklistService.startCronJobForModel(Number(id));
    } else {
      await this.checklistService.stopCronJobForModel(Number(id));
    }

    return {
      updated: true,
    };
  }

  @Post('/:id/cronJob/:equipmentId')
  //@UseGuards(AuthGuard)
  async cronJob(
    @Param('id') id: string,
    @Param('equipmentId') equipmentId: string,
  ) {
    const checklist = await this.checkListRepository.findById(Number(id));

    if (!checklist) {
      throw new ForbiddenException(MessageService.CheckList_not_found);
    }

    const equipment = await this.equipmentRepository.findById(
      Number(equipmentId),
    );

    if (!equipment) {
      throw new ForbiddenException(MessageService.Equipment_not_found);
    }

    const cronJob = await this.checklistService.createJob(
      equipment.ID,
      checklist.id,
    );

    return {
      cronJob,
    };
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    const checkListPeriod =
      await this.checkListPeriodRepository.findByCheckList(Number(id));

    if (checkListPeriod != null) {
      throw new ForbiddenException(MessageService.CheckList_have_bound);
    }

    await this.checkListRepository.delete(Number(id));

    return {
      deleted: true,
    };
  }

  @Get('/:id/item')
  async listBound(@Param('id') id: string, @Query() query: ListBoundQuery) {
    const allItems = await this.checkListItemRepository.listByCheckList(
      Number(id),
      query.filterText &&
        query.filterText !== null &&
        query.filterText !== 'null'
        ? {
            OR: [
              {
                checkListTask: {
                  descricao: {
                    contains: query.filterText,
                  },
                },
              },
              {
                checkListControl: {
                  descricao: {
                    contains: query.filterText,
                  },
                },
              },
            ],
          }
        : undefined,
    );

    return {
      list: allItems.map((item) => {
        return {
          id: item.id,
          description: item.checkListTask.descricao,
          control: item.checkListControl.descricao,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Post('/:id/item')
  async creteItem(
    @Req() req,
    @Param('id') id: string,
    @Body() body: CheckListCreateItemBody,
  ) {
    const user: IUserInfo = req.user;
    //console.log(user);
    const response = [];

    for await (const taskId of body.task) {
      const findExist =
        await this.checkListItemRepository.findByCheckListAndTask(
          Number(id),
          Number(taskId),
        );

      if (!findExist) {
        const item = await this.checkListItemRepository.create({
          id_checklist: Number(id),
          id_tarefa: Number(taskId),
          id_controle: body.controlId,
          log_user: user.login,
        });

        response.push(item);
      }
    }

    return response;
  }

  @Delete('/:id/item/:itemId')
  async deleteItem(@Param('itemId') itemId: string) {
    const checkListPeriod =
      await this.checkListPeriodRepository.findByCheckListItem(Number(itemId));

    if (checkListPeriod) {
      throw new ForbiddenException(MessageService.CheckListItem_have_bound);
    }
    try {
      await this.checkListItemRepository.delete(Number(itemId));
    } catch (err) {
      throw new BadRequestException(MessageService.SYSTEM_bank_delete);
    }

    return {
      deleted: true,
    };
  }
}
