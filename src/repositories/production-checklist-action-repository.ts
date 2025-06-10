import { Prisma, smartnewsystem_producao_checklist_acao } from '@prisma/client';
import { IFindByProductionAndItem } from 'src/models/IProductionChecklistAction';

export abstract class ProductionChecklistActionRepository {
  abstract findByProductionAndItem(
    productionRegisterId: number,
    itemId: number,
  ): Promise<IFindByProductionAndItem | null>;

  abstract findByItemAndGroup(
    groupId: number,
    itemId: number,
  ): Promise<IFindByProductionAndItem | null>;

  abstract create(
    data: Prisma.smartnewsystem_producao_checklist_acaoUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_acao>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_producao_checklist_acaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_producao_checklist_acao>;
}
