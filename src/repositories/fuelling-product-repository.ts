import { Prisma, sofman_combustivel } from '@prisma/client';
import IFuellingProduct from 'src/models/IFuellingProduct';

export default abstract class FuellingProductRepository {
  abstract findByClientAndName(
    clientId: number,
    description: string,
  ): Promise<IFuellingProduct['findByClientAndName'] | null>;
  abstract findById(id: number): Promise<IFuellingProduct['findById'] | null>;
  abstract listByClient(
    clientId: number,
    where?: Prisma.sofman_combustivelWhereInput | null,
  ): Promise<IFuellingProduct['listByClient'][]>;

  abstract create(
    data: Prisma.sofman_combustivelUncheckedCreateInput,
  ): Promise<sofman_combustivel>;

  abstract update(
    id: number,
    data: Prisma.sofman_combustivelUncheckedUpdateInput,
  ): Promise<sofman_combustivel>;

  abstract delete(id: number): Promise<boolean>;
}
