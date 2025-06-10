import { IProductionRegisterListByClient } from 'src/models/IProductionRegister';

export abstract class ProductionRegisterRepository {
  abstract listByClient(
    clientId: number,
    index: number,
    perPage: number,
    filterText: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<IProductionRegisterListByClient[]>;

  abstract listAllByClient(
    clientId: number,
    filterText: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<IProductionRegisterListByClient[]>;

  abstract findById(
    id: number,
  ): Promise<IProductionRegisterListByClient | null>;

  abstract countListByClient(
    clientId: number,
    filterText: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<number>;
}
