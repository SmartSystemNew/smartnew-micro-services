import {
  Prisma,
  sofman_cad_descricao_custos_ordem_servico,
} from '@prisma/client';
import { IDescriptionCostServiceOrder } from 'src/models/IDescriptionCostServiceOrder';

export abstract class DescriptionCostServiceOrderRepository {
  abstract findById(
    id: number,
  ): Promise<IDescriptionCostServiceOrder['findById'] | null>;

  abstract create(
    data: Prisma.sofman_cad_descricao_custos_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_cad_descricao_custos_ordem_servico>;

  abstract delete(id: number): Promise<boolean>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_descricao_custos_ordem_servicoUncheckedUpdateInput,
  ): Promise<sofman_cad_descricao_custos_ordem_servico>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_cad_descricao_custos_ordem_servicoWhereInput | any,
    fields?: string[],
  ): Promise<IDescriptionCostServiceOrder['listByClient'][]>;
}
