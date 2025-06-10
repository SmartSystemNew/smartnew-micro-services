import { Prisma, sofman_materiais_ordem_servico } from '@prisma/client';
import { IMaterialServiceOrder } from 'src/models/IMaterialServiceOrder';

export abstract class MaterialServiceOrderRepository {
  abstract findById(
    id: number,
  ): Promise<IMaterialServiceOrder['findById'] | null>;

  abstract create(
    data: Prisma.sofman_materiais_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_materiais_ordem_servico>;

  abstract createMaterialOrder(
    data: Prisma.sofman_materiais_ordem_servicoUncheckedCreateInput,
  ): Promise<IMaterialServiceOrder['createMaterialOrder']>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_materiais_ordem_servicoUncheckedUpdateInput,
  ): Promise<sofman_materiais_ordem_servico>;

  abstract listByServiceOrder(
    idServiceOrder: number,
    filters?: Prisma.sofman_materiais_ordem_servicoWhereInput | any,
    fields?: string[],
  ): Promise<IMaterialServiceOrder['listByServiceOrder'][]>;

  abstract listByMaterialOrderService(
    branches: number[],
    filter?: Prisma.sofman_materiais_ordem_servicoWhereInput | null,
  ): Promise<IMaterialServiceOrder['listByMaterialOrderService'][]>;

  abstract sumGroupByMaterial(
    clientId: number,
    date: Date,
    materialId?: number[] | null,
  ): Promise<{ id_material: number; quantity: number }[]>;

  abstract sumGroupByMaterialSecondary(
    clientId: number,
    date: Date,
    materialId?: number[] | null,
  ): Promise<{ id_codigo: number; quantity: number }[]>;
}
