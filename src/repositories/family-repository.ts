import { cadastro_de_familias_de_equipamento, Prisma } from '@prisma/client';
import { IFamily } from 'src/models/IFamily';

export abstract class FamilyRepository {
  abstract listByBranches(
    branches: number[],
  ): Promise<IFamily['listByBranches'][]>;
  abstract listByClient(
    clientId: number,
    filter?: Prisma.cadastro_de_familias_de_equipamentoWhereInput | null,
  ): Promise<IFamily['listByClient'][]>;

  abstract findById(id: number): Promise<IFamily['listByClient'] | null>;

  abstract findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<cadastro_de_familias_de_equipamento | null>;

  abstract insert({
    clientId,
    branchId,
    family,
  }: {
    clientId: number;
    branchId?: number;
    family: string;
  }): Promise<cadastro_de_familias_de_equipamento>;
}
