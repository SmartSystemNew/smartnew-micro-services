import { Prisma, smartnewsystem_producao_checklist } from '@prisma/client';
import { ICheckList, ICheckListListByClient } from 'src/models/ICheckList';

export abstract class CheckListRepository {
  abstract findById(id: number): Promise<ICheckList['findById'] | null>;
  abstract findByFamilyAndDescription(
    familyId: number,
    description: string,
  ): Promise<ICheckList['findByFamilyAndDescription'] | null>;

  abstract findByLocationAndDescription(
    locationId: number,
    description: string,
  ): Promise<ICheckList['findByLocationAndDescription'] | null>;

  abstract listByClient(clientId: number): Promise<ICheckListListByClient[]>;

  abstract listByBranch(
    branches: number[],
    filter?: Prisma.smartnewsystem_producao_checklistWhereInput | undefined,
  ): Promise<ICheckListListByClient[]>;

  abstract listByFamily(
    familyId: number,
  ): Promise<smartnewsystem_producao_checklist[]>;

  abstract listByLocation(
    locationId: number,
  ): Promise<smartnewsystem_producao_checklist[]>;

  abstract create(
    data: Prisma.smartnewsystem_producao_checklistUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist>;

  abstract update(
    data: Prisma.smartnewsystem_producao_checklistUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_producao_checklist>;

  abstract delete(id: number): Promise<boolean>;
}
