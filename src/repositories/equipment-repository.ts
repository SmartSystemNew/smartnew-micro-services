import { Prisma, cadastro_de_equipamentos } from '@prisma/client';
import { IEquipment } from 'src/models/IEquipment';

export default abstract class EquipmentRepository {
  abstract create(
    data: Prisma.cadastro_de_equipamentosUncheckedCreateInput,
  ): Promise<IEquipment['create']>;

  abstract findByBranchAndCode(
    branchId: number,
    code: string,
  ): Promise<IEquipment['findByBranchAndCode'] | null>;

  abstract findByClientAndCode(
    clientId: number,
    code: string,
  ): Promise<IEquipment['findByClientAndCode'] | null>;

  abstract findByOrderAndEquipment(
    clientId: number,
  ): Promise<IEquipment['findByOrderAndEquipment'][] | null>;

  abstract getDataUnitMetricFromPlan(
    idClient: number,
    code: string,
  ): Promise<IEquipment['getDataUnitMetricFromPlan'][] | null>;

  abstract findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<IEquipment['findByClientAndName'] | null>;

  abstract listByBranch(
    branchId: number[],
    filter?: Prisma.cadastro_de_equipamentosWhereInput | undefined,
  ): Promise<IEquipment['listByBranch'][]>;

  abstract listFamily(
    familyId: number[],
    filter?: Prisma.cadastro_de_equipamentosWhereInput | undefined,
  ): Promise<IEquipment['listFamily'][]>;

  abstract findById(id: number): Promise<IEquipment['findById'] | null>;

  abstract update(
    id: number,
    data: Prisma.cadastro_de_equipamentosUncheckedUpdateInput,
  ): Promise<cadastro_de_equipamentos>;

  abstract delete(id: number): Promise<boolean>;

  abstract listEquipmentWithProspectScale(
    clientId: number,
    branchId: number[],
    filter?: Prisma.cadastro_de_equipamentosWhereInput | null,
  ): Promise<IEquipment['listEquipmentWithProspectScale'][]>;
}
