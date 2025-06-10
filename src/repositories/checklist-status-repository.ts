import { CheckListStatusFindById } from 'src/models/ICheckListStatus';

export abstract class CheckListStatusRepository {
  abstract findById(id: number): Promise<CheckListStatusFindById | null>;
  abstract listByClient(clientId: number): Promise<CheckListStatusFindById[]>;
}
