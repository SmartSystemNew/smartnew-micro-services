import { Prisma, cadastro_de_filiais } from '@prisma/client';
import { IBranch, IBranchFindById } from 'src/models/IBranch';

export abstract class BranchRepository {
  abstract create(
    data: Prisma.cadastro_de_filiaisUncheckedCreateInput,
  ): Promise<cadastro_de_filiais>;
  abstract findById(id: number): Promise<IBranchFindById | null>;
  abstract listByIds(id: number[]): Promise<IBranch['listByIds'][]>;

  abstract findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<IBranch['findByClientAndName'] | null>;

  abstract findByClientAndCNPJ(
    clientId: number,
    cnpj: string,
  ): Promise<IBranch['findByClientAndCNPJ'] | null>;
}
