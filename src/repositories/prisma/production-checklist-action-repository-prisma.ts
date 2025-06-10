import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_producao_checklist_acao } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { ProductionChecklistActionRepository } from '../production-checklist-action-repository';
import { IFindByProductionAndItem } from 'src/models/IProductionChecklistAction';

@Injectable()
export class ProductionChecklistActionRepositoryPrisma
  implements ProductionChecklistActionRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_producao_checklist_acao;

  async findByProductionAndItem(
    productionRegisterId: number,
    itemId: number,
  ): Promise<IFindByProductionAndItem | null> {
    const checkListAction = await this.table.findFirst({
      select: {
        id: true,
        descricao: true,
        id_item: true,
        log_date: true,
        responsavel: true,
        data_inicio: true,
        data_fim: true,
        data_fechamento: true,
        id_registro_producao: true,
        descricao_acao: true,
        user: {
          select: {
            login: true,
            name: true,
          },
        },
      },
      where: {
        id_registro_producao: productionRegisterId,
        id_item: itemId,
      },
    });

    return checkListAction;
  }

  async findByItemAndGroup(
    groupId: number,
    itemId: number,
  ): Promise<IFindByProductionAndItem | null> {
    const checkListAction = await this.table.findFirst({
      select: {
        id: true,
        descricao: true,
        id_item: true,
        log_date: true,
        responsavel: true,
        data_inicio: true,
        data_fim: true,
        data_fechamento: true,
        id_registro_producao: true,
        descricao_acao: true,
        user: {
          select: {
            login: true,
            name: true,
          },
        },
      },
      where: {
        id_grupo: groupId,
        id_item: itemId,
      },
    });

    return checkListAction;
  }

  async create(
    data: Prisma.smartnewsystem_producao_checklist_acaoUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_acao> {
    const checklistAction = await this.table.create({
      data,
    });

    return checklistAction;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_producao_checklist_acaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_producao_checklist_acao> {
    const checklistAction = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return checklistAction;
  }
}
