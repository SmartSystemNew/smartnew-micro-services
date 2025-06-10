import { Prisma, sofman_abastecimento } from '@prisma/client';
import { IFuelling } from 'src/models/IFuelling';

export abstract class FuellingRepository {
  abstract create(
    data: Prisma.sofman_abastecimentoUncheckedCreateInput,
  ): Promise<sofman_abastecimento>;

  abstract delete(id: number): Promise<boolean>;

  abstract countListByBranchesPerPage(
    branches: number[],
    perPage: number,
    index: number,
  ): Promise<number>;

  abstract countListByBranches(branches: number[]): Promise<number>;

  abstract listByBranchesPerPage(
    branches: number[],
    perPage: number,
    index: number,
  ): Promise<IFuelling['listByBranches'][]>;

  abstract listByBranches(
    branches: number[],
    perPage?: number | null,
    index?: number | null,
    filter?: Prisma.sofman_abastecimentoWhereInput | null,
  ): Promise<IFuelling['listByBranches'][]>;

  abstract listByEquipmentInBranches(
    branches: number[],
    date?: {
      start: Date;
      end: Date;
    } | null,
  ): Promise<IFuelling['listByEquipmentInBranches'][]>;

  abstract listByFilter(
    clientId: number,
    filter?: Prisma.sofman_abastecimentoWhereInput | null,
  ): Promise<IFuelling['listByFilter'][]>;

  abstract listByCompartmentTrain(
    compartmentId: number,
  ): Promise<sofman_abastecimento[]>;

  abstract listByCompartmentTank(
    compartmentId: number,
  ): Promise<sofman_abastecimento[]>;

  abstract findById(id: number): Promise<IFuelling['findById'] | null>;

  abstract listByEquipmentAndDriver(
    equipmentId: number | null,
    driver: string,
  ): Promise<IFuelling['listByEquipmentAndDriver'][]>;

  abstract listByEquipmentAndSupplier(
    supplier: string,
  ): Promise<IFuelling['listByEquipmentAndSupplier'][]>;

  abstract listByEquipmentAndDriverAndDate(
    equipmentId: number | null,
    driver: string,
    dateFrom: Date,
  ): Promise<IFuelling['listByEquipmentAndDriver'][]>;

  abstract listByEquipmentAndSupplierAndDate(
    supplier: string,
    dateFrom: Date,
  ): Promise<IFuelling['listByEquipmentAndSupplier'][]>;

  abstract update(
    id: number,
    data: Prisma.sofman_abastecimentoUncheckedUpdateInput,
  ): Promise<sofman_abastecimento>;
}
