import {
  Body,
  ConflictException,
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
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { CheckListTaskRepository } from 'src/repositories/checklist-task-repository';
import { InsertBody } from './dtos/insert-body';
import { CheckListStatusActionRepository } from 'src/repositories/checklist-status-action-repository';
import { CreateStatusBody } from './dtos/createStatus-body';
import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
import { MessageService } from 'src/service/message.service';
import { InfoTableQuery } from './dtos/infoTable-query';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Smart List - Task')
@ApiBearerAuth()
@Controller('/smart-list/task')
export class TaskController {
  constructor(
    private checkListTaskRepository: CheckListTaskRepository,
    private checkListStatusActionRepository: CheckListStatusActionRepository,
    private checkListPeriodRepository: CheckListPeriodRepository,
  ) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async infoTable(@Request() req, @Query() query: InfoTableQuery) {
    const user: IUserInfo = req.user;

    const allTask = await this.checkListTaskRepository.listByClient(
      user.clientId,
      query.filterText &&
        query.filterText !== null &&
        query.filterText !== 'null'
        ? {
            OR: [
              {
                descricao: {
                  contains: query.filterText,
                },
              },
            ],
          }
        : undefined,
    );

    return {
      task: allTask.map((item) => {
        return {
          id: item.id,
          description: item.descricao,
        };
      }),
    };
  }

  @Post('/')
  @UseGuards(AuthGuard)
  async insert(@Req() req, @Body() body: InsertBody) {
    const user: IUserInfo = req.user;

    const task = await this.checkListTaskRepository.create({
      id_cliente: user.clientId,
      descricao: body.description,
      log_user: user.login,
    });

    return {
      task,
    };
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() body: InsertBody) {
    await this.checkListTaskRepository.update(
      {
        descricao: body.description,
      },
      Number(id),
    );

    return {
      updated: true,
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    const task = await this.checkListTaskRepository.findById(Number(id));

    if (!task) {
      throw new NotFoundException(MessageService.Task_not_found);
    }

    if (task.checkListItens.length > 0) {
      throw new ConflictException(MessageService.Task_not_delete);
    }

    await this.checkListTaskRepository.delete(Number(id));

    return {
      deleted: true,
    };
  }

  @Get('/:id/statusAction')
  async listStatusActionAll(@Param('id') taskId: string) {
    const allStatusAction =
      await this.checkListStatusActionRepository.listByTask(Number(taskId));

    return {
      data: allStatusAction.map((item) => {
        return {
          id: item.id,
          description: item.descricao,
          impediment: item.impeditivo,
          status: {
            id: item.checkListStatus.id,
            description: item.checkListStatus.descricao,
          },
          control: {
            id: item.checkListControl.id,
            description: item.checkListControl.descricao,
          },
        };
      }),
    };
  }

  @Get('/:id/statusAction/:statusId')
  async listStatusAction(
    @Param('id') taskId: string,
    @Param('statusId') statusId: string,
  ) {
    const allStatusAction =
      await this.checkListStatusActionRepository.listByTaskAndStatus(
        Number(taskId),
        Number(statusId),
      );

    return {
      statusAction: allStatusAction.map((item) => {
        return {
          id: item.id,
          description: item.descricao,
          impediment: item.impeditivo,
          control: {
            id: item.checkListControl.id,
            description: item.checkListControl.descricao,
          },
        };
      }),
    };
  }

  @Post('/:id/statusAction/:statusId')
  async createStatus(
    @Param('id') taskId: string,
    @Param('statusId') statusId: string,
    @Body() body: CreateStatusBody,
  ) {
    const statusAction = await this.checkListStatusActionRepository.create({
      id_tarefa: Number(taskId),
      id_status: Number(statusId),
      id_controle: body.controlId,
      descricao: body.description,
      impeditivo: body.impediment,
    });

    return {
      statusAction,
    };
  }

  @Put('/:id/statusAction/:statusId/:actionId')
  async updateStatus(
    @Param('actionId') actionId: string,
    @Body() body: CreateStatusBody,
  ) {
    await this.checkListStatusActionRepository.update(
      {
        descricao: body.description,
        id_controle: body.controlId,
        impeditivo: body.impediment,
      },
      Number(actionId),
    );

    return {
      updated: true,
    };
  }

  @Delete('/:id/statusAction/:statusId/:actionId')
  async deleteStatus(@Param('actionId') actionId: string) {
    const checkListPeriod =
      await this.checkListPeriodRepository.findByStatusAction(Number(actionId));

    if (checkListPeriod != null) {
      throw new ForbiddenException(MessageService.Task_statusAction_have_bound);
    }

    await this.checkListStatusActionRepository.delete(Number(actionId));

    return {
      deleted: true,
    };
  }
}
