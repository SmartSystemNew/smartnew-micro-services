import { Prisma, sofman_cad_localizacoes } from '@prisma/client';
import { ILocation } from 'src/models/ILocation';

export default abstract class LocationRepository {
  abstract findByBranch(
    branches: number[],
    filter?: Prisma.sofman_cad_localizacoesWhereInput | undefined,
  ): Promise<ILocation['findByBranch'][]>;

  abstract findByFilter(
    filter?: Prisma.sofman_cad_localizacoesWhereInput | undefined,
  ): Promise<ILocation['findByFilter'] | null>;

  abstract findByBranchAndTag(
    branchId: number,
    tag: string,
  ): Promise<sofman_cad_localizacoes | null>;

  abstract findById(id: number): Promise<ILocation['findById'] | null>;

  abstract create(
    data: Prisma.sofman_cad_localizacoesUncheckedCreateInput,
  ): Promise<ILocation['create']>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_localizacoesUncheckedUpdateInput,
  ): Promise<sofman_cad_localizacoes>;

  abstract delete(id: number): Promise<boolean>;
}
