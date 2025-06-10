import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ICheckListTaskListByCheckList } from 'src/models/ICheckListItem';
import { CheckListItemRepository } from '../checklist-item-repository';
import {
  Prisma,
  smartnewsystem_producao_checklist_itens,
} from '@prisma/client';

@Injectable()
export class CheckListItemRepositoryPrisma implements CheckListItemRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_producao_checklist_itens;

  async findByCheckListAndTask(
    checklistId: number,
    taskId: number,
  ): Promise<smartnewsystem_producao_checklist_itens | null> {
    const item = await this.table.findFirst({
      where: {
        id_checklist: checklistId,
        id_tarefa: taskId,
      },
    });

    return item;
  }

  async listByTask(
    taskId: number,
  ): Promise<smartnewsystem_producao_checklist_itens[]> {
    const task = await this.table.findMany({
      where: {
        id_tarefa: taskId,
      },
    });

    return task;
  }

  async listByCheckList(
    checkListId: number,
    filter:
      | Prisma.smartnewsystem_producao_checklist_itensWhereInput
      | undefined,
  ): Promise<ICheckListTaskListByCheckList[]> {
    const items = await this.table.findMany({
      select: {
        id: true,
        checkListTask: true,
        checkListControl: true,
      },
      where: {
        id_checklist: checkListId,
        ...filter,
      },
    });

    return items;
  }

  async create(
    data: Prisma.smartnewsystem_producao_checklist_itensUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_itens> {
    const item = await this.table.create({
      data,
    });

    return item;
  }

  async update(
    data: Prisma.smartnewsystem_producao_checklist_itensUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_producao_checklist_itens> {
    const item = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return item;
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
