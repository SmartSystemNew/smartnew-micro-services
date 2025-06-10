import { Prisma, cadastro_de_centros_de_custo } from '@prisma/client';
import { ICostCenter } from 'src/models/ICostCenter';

export abstract class CostCenterRepository {
  abstract countByDescription(descriptionId: number): Promise<number>;

  abstract byClient(clientId: number): Promise<ICostCenter['byDescription'][]>;

  abstract byBranches(
    branches: number[],
    filter?: Prisma.cadastro_de_centros_de_custoWhereInput | null,
  ): Promise<ICostCenter['byBranch'][]>;

  abstract byDescription(
    descriptionId: number,
  ): Promise<ICostCenter['byDescription'][]>;

  abstract delete(id: number): Promise<boolean>;

  abstract findById(id: number): Promise<ICostCenter['findById']>;

  abstract findByDescriptionAndCodeAndName(
    descriptionId: number,
    code: string,
    name: string,
  ): Promise<ICostCenter['findByDescriptionAndCodeAndName'] | null>;

  abstract findByDescriptionAndName(
    descriptionId: number,
    name: string,
  ): Promise<ICostCenter['findByDescriptionAndName'] | null>;

  abstract insert(
    data: Prisma.cadastro_de_centros_de_custoUncheckedCreateInput,
  ): Promise<cadastro_de_centros_de_custo>;

  abstract listCostCenter(
    range: number[],
  ): Promise<ICostCenter['listCostCenter'][]>;

  abstract listCostCenterActive(
    range: number[],
  ): Promise<ICostCenter['listCostCenterActive'][]>;

  abstract update(
    data: Prisma.cadastro_de_centros_de_custoUncheckedUpdateInput,
    id: number,
  ): Promise<cadastro_de_centros_de_custo>;
}
