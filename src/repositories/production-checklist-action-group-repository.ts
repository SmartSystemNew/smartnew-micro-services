import {
  Prisma,
  smartnewsystem_producao_checklist_acao_grupo,
} from '@prisma/client';
import IProductionChecklistActionGroupInfoTable, {
  IProductionChecklistActionGroupListGroupByBranches,
  IProductionChecklistActionGroupUpdate,
} from 'src/models/IProductionChecklistActionGroup';

export abstract class ProductionChecklistActionGroupRepository {
  abstract countItems(
    clientId: number,
    branches: number[],
    filter:
      | Prisma.smartnewsystem_producao_checklist_acao_grupoWhereInput
      | undefined,
  ): Promise<number>;
  abstract listGroupByBranches(
    clientId: number,
    branches: number[],
  ): Promise<IProductionChecklistActionGroupListGroupByBranches[]>;
  abstract listGroupByBranch(
    clientId: number,
    branchId: number,
  ): Promise<IProductionChecklistActionGroupListGroupByBranches[]>;
  abstract create(
    data: Prisma.smartnewsystem_producao_checklist_acao_grupoUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_acao_grupo>;

  abstract findById(
    id: number,
  ): Promise<IProductionChecklistActionGroupInfoTable | null>;

  abstract infoTable(
    clientId: number,
    branches: number[],
    index: number,
    perPage: number,
    filter:
      | Prisma.smartnewsystem_producao_checklist_acao_grupoWhereInput
      | undefined,
  ): Promise<IProductionChecklistActionGroupInfoTable[]>;

  abstract infoTableNoPage(
    clientId: number,
    branches: number[],
    filter:
      | Prisma.smartnewsystem_producao_checklist_acao_grupoWhereInput
      | undefined,
  ): Promise<IProductionChecklistActionGroupInfoTable[]>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_producao_checklist_acao_grupoUncheckedUpdateInput,
  ): Promise<IProductionChecklistActionGroupUpdate>;
}
