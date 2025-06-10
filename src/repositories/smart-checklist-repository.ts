import { Prisma, smartnewsystem_checklist } from '@prisma/client';
import { ISmartChecklist } from 'src/models/ISmartChecklist';

export default abstract class SmartChecklistRepository {
  abstract listByClient(
    clientId: number,
    index: number,
    perPage: number,
    // filterText: string,
    // dateFrom: string,
    // dateTo: string,
    filter: ISmartChecklist['IWhere'],
  ): Promise<ISmartChecklist['listByClient'][]>;

  abstract listAllByClient(
    clientId: number,
    // filterText: string,
    // dateFrom: string,
    // dateTo: string,
    where: ISmartChecklist['IWhere'],
  ): Promise<ISmartChecklist['listAllByClient'][]>;

  abstract countListByClient(
    clientId: number,
    // filterText: string,
    // dateFrom: string,
    // dateTo: string,
    where: ISmartChecklist['IWhere'],
  ): Promise<number>;

  abstract deleteInTransaction(id: number): Promise<boolean>;
  abstract findById(id: number): Promise<ISmartChecklist['findById'] | null>;

  abstract findByServiceOrderId(
    serviceOrderId: number,
  ): Promise<ISmartChecklist['findByServiceOrderId'][]>;

  abstract create(
    data: Prisma.smartnewsystem_checklistUncheckedCreateInput,
  ): Promise<smartnewsystem_checklist>;

  abstract createTransaction(
    clientId: number,
    login: string,
    equipment: { id: number; branchId: number } | null,
    location: { id: number; branchId: number } | null,
    serviceOrderId: number,
    periodId: number | null,
    modelId: number,
    hourMeter: number | null,
    odometer: number | null,
    kilometer: number | null,
  ): Promise<{
    errorMessage: string;
    created: boolean;
    id: number | null;
  }>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_checklistUncheckedUpdateInput,
  ): Promise<smartnewsystem_checklist>;

  abstract delete(id: number): Promise<boolean>;

  abstract listByDescriptionMaintenance(
    descriptionMaintenanceId: number,
  ): Promise<ISmartChecklist['listByDescriptionMaintenance'][]>;
}
