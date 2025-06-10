import {
  Prisma,
  smartnewsystem_producao_checklist_turno,
} from '@prisma/client';
import {
  ICheckListPeriod,
  ICheckListPeriodFindById,
  ICheckListPeriodFindByResponsible,
  IChecklistPeriodListByBranchAndAction,
  IFindById,
  IGroupByBranchAndStatusActionNotGroup,
  IListByTaskAndEquipmentNotGroup,
  IListByTaskAndLocationNotGroup,
} from 'src/models/ICheckListPeriod';

export abstract class CheckListPeriodRepository {
  abstract create(
    data: Prisma.smartnewsystem_producao_checklist_turnoUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist_turno>;
  abstract findByCheckList(
    checkListId: number,
  ): Promise<smartnewsystem_producao_checklist_turno | null>;

  abstract findByCheckListItem(
    checkListItemId: number,
  ): Promise<smartnewsystem_producao_checklist_turno | null>;

  abstract findById(id: number): Promise<IFindById | null>;

  abstract findByTask(
    taskId: number,
  ): Promise<smartnewsystem_producao_checklist_turno | null>;

  abstract countListByBranchAndStatusAction(
    branchId: number[],
  ): Promise<number>;

  abstract countListByBranchAndStatusActionAndNotGroup(
    branchId: number[],
  ): Promise<number>;

  abstract findByStatusAction(
    statusAction: number,
  ): Promise<smartnewsystem_producao_checklist_turno | null>;

  abstract listByProductionId(
    productionId: number,
  ): Promise<ICheckListPeriodFindById[]>;

  abstract listByBranchAndStatusAction(
    branchId: number[],
    index: number,
    perPage: number,
  ): Promise<IChecklistPeriodListByBranchAndAction[]>;

  abstract listByTaskAndEquipmentNotGroup(
    taskId: number,
    equipmentId: number,
  ): Promise<IListByTaskAndEquipmentNotGroup[]>;

  abstract listByTaskAndLocationNotGroup(
    taskId: number,
    locationId: number,
  ): Promise<IListByTaskAndLocationNotGroup[]>;

  abstract groupByBranchAndStatusActionNotGroup(
    login: string,
    clientId: number,
    index: number,
    perPage: number,
  ): Promise<IGroupByBranchAndStatusActionNotGroup[]>;

  abstract groupByBranchAndStatusActionNotGroupFast(
    branches: number[],
    index: number,
    perPage: number,
    filter:
      | Prisma.smartnewsystem_producao_checklist_turnoWhereInput
      | undefined,
  ): Promise<ICheckListPeriod['groupByBranchAndStatusActionNotGroupFast'][]>;

  abstract groupByBranchAndStatusActionNotGroupFastNoPage(
    branches: number[],
    filter:
      | Prisma.smartnewsystem_producao_checklist_turnoWhereInput
      | undefined,
  ): Promise<
    ICheckListPeriod['groupByBranchAndStatusActionNotGroupFastNoPage'][]
  >;

  abstract countGroupByBranchAndStatusActionNotGroupFast(
    branches: number[],
    filter:
      | Prisma.smartnewsystem_producao_checklist_turnoWhereInput
      | undefined,
  ): Promise<number>;

  abstract groupByBranchAndStatusActionNotGroupNoPage(
    login: string,
    clientId: number,
  ): Promise<IGroupByBranchAndStatusActionNotGroup[]>;

  abstract countGroupByBranchAndStatusActionNotGroup(
    login: string,
    clientId: number,
  ): Promise<number>;

  abstract listByBranchAndStatusActionNotGroup(
    branchId: number[],
    index: number,
    perPage: number,
  ): Promise<IChecklistPeriodListByBranchAndAction[]>;
  abstract listByBranchAndAction(
    branchId: number[],
  ): Promise<IChecklistPeriodListByBranchAndAction[]>;
  abstract update(
    id: number,
    data: Prisma.smartnewsystem_producao_checklist_turnoUncheckedUpdateInput,
  ): Promise<smartnewsystem_producao_checklist_turno>;

  abstract delete(id: number): Promise<boolean>;

  abstract listByPeriodId(
    periodId: number,
  ): Promise<ICheckListPeriodFindById | null>;

  abstract listByChecklistId(
    checklistId: number,
  ): Promise<ICheckListPeriodFindById[]>;

  abstract findResponsible(
    id: number,
  ): Promise<ICheckListPeriodFindByResponsible>;
}
