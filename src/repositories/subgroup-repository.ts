import { Prisma, sofman_subgrupos } from '@prisma/client';
import { ISubGroup } from 'src/models/ISubGroup';

export abstract class SubGroupRepository {
  abstract findById(id: number): Promise<ISubGroup['findById'] | null>;

  abstract create(
    data: Prisma.sofman_subgruposUncheckedCreateInput,
  ): Promise<sofman_subgrupos>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_subgruposUncheckedUpdateInput,
  ): Promise<sofman_subgrupos>;

  abstract listByBranches(
    branch: number[],
    filters?: Prisma.sofman_subgruposWhereInput | any,
    fields?: string[],
  ): Promise<ISubGroup['listByBranches'][]>;
}
