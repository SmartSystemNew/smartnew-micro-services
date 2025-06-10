import { Prisma, sofman_cad_componentes } from '@prisma/client';
import { IComponents } from 'src/models/IComponents';

export abstract class ComponentsRepository {
  abstract findById(id: number): Promise<IComponents['findById'] | null>;

  abstract create(
    data: Prisma.sofman_cad_componentesUncheckedCreateInput,
  ): Promise<sofman_cad_componentes>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_componentesUncheckedUpdateInput,
  ): Promise<sofman_cad_componentes>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_cad_componentesWhereInput | any,
    fields?: string[],
  ): Promise<IComponents['listByClient'][]>;
}
