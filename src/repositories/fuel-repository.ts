import { Prisma, sofman_combustivel } from '@prisma/client';
import { IFuel } from 'src/models/IFuel';

export abstract class FuelRepository {
  abstract listByClient(clientId: number): Promise<IFuel['listByClient'][]>;
  abstract findById(id: number): Promise<IFuel['findById'] | null>;
  abstract create(
    data: Prisma.sofman_combustivelUncheckedCreateInput,
  ): Promise<sofman_combustivel>;
  abstract update(
    id: number,
    data: Prisma.sofman_combustivelUncheckedUpdateInput,
  ): Promise<sofman_combustivel>;
  abstract delete(id: number): Promise<sofman_combustivel>;
}
