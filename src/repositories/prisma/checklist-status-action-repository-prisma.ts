import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  CheckListStatusActionFindById,
  CheckListStatusActionListByTaskAndStatus,
} from 'src/models/ICheckListStatusAction';
import { CheckListStatusActionRepository } from '../checklist-status-action-repository';
import {
  Prisma,
  smartnewsystem_producao_checklist_status_acao,
} from '@prisma/client';

@Injectable()
export class CheckListStatusActionRepositoryPrisma
  implements CheckListStatusActionRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_producao_checklist_status_acao;

  async findById(id: number): Promise<CheckListStatusActionFindById | null> {
    const status = await this.table.findUnique({
      select: {
        id: true,
        descricao: true,
        impeditivo: true,
        checkListStatus: {
          select: {
            id: true,
            descricao: true,
          },
        },
        checkListControl: {
          select: {
            id: true,
            descricao: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return status;
  }

  async listByTask(taskId: number): Promise<CheckListStatusActionFindById[]> {
    const status = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
        impeditivo: true,
        checkListStatus: {
          select: {
            id: true,
            descricao: true,
          },
        },
        checkListControl: {
          select: {
            id: true,
            descricao: true,
          },
        },
      },
      where: {
        id_tarefa: {
          equals: taskId,
        },
      },
    });

    return status;
  }

  async listByTaskAndStatus(
    taskId: number,
    statusId: number,
  ): Promise<CheckListStatusActionListByTaskAndStatus[]> {
    const statusAction = await this.table.findMany({
      include: {
        checkListControl: true,
      },
      where: {
        id_tarefa: taskId,
        id_status: statusId,
      },
    });

    return statusAction;
  }

  async create(
    data: Prisma.smartnewsystem_producao_checklist_status_acaoUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_status_acao> {
    const status = await this.table.create({
      data,
    });

    return status;
  }

  async update(
    data: Prisma.smartnewsystem_producao_checklist_status_acaoUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_producao_checklist_status_acao> {
    const statusAction = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return statusAction;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
