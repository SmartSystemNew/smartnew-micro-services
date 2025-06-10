import { sofman_cad_categorias_materiais, Prisma } from '@prisma/client';

export default abstract class CategoryMaterialRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<sofman_cad_categorias_materiais[]>;
  abstract findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<sofman_cad_categorias_materiais | null>;

  abstract create(
    data: Prisma.sofman_cad_categorias_materiaisUncheckedCreateInput,
  ): Promise<sofman_cad_categorias_materiais>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_categorias_materiaisUncheckedUpdateInput,
  ): Promise<sofman_cad_categorias_materiais>;

  abstract delete(id: number): Promise<boolean>;
}
