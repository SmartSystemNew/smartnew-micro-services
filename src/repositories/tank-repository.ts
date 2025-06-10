import { Prisma, cadastro_tanque } from '@prisma/client';
import { ITank } from 'src/models/ITank';

export abstract class TankRepository {
  abstract findById(id: number): Promise<ITank['findById'] | null>;

  abstract findByClientAndModel(
    clientId: number,
    model: string,
  ): Promise<ITank['findByClientAndModel'] | null>;

  abstract create(
    data: Prisma.cadastro_tanqueUncheckedCreateInput,
  ): Promise<cadastro_tanque>;

  abstract delete(id: number): Promise<boolean>;

  abstract listByClientAndBranches(
    clientId: number,
    branches: number[],
    filter?: Prisma.cadastro_tanqueWhereInput,
  ): Promise<ITank['listByClientAndBranches'][]>;
  abstract listFuellingByBranches(
    branches: number[],
  ): Promise<ITank['listFuellingByBranches'][]>;

  abstract update(
    id: number,
    data: Prisma.cadastro_tanqueUncheckedUpdateInput,
  ): Promise<cadastro_tanque>;
}
