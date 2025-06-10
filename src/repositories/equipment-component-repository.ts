import { Prisma, sofman_componente_equipamento } from '@prisma/client';
import { IEquipmentComponent } from 'src/models/IEquipmentComponent';

export abstract class EquipmentComponentRepository {
  abstract findByEquipment(
    equipmentId: number,
  ): Promise<IEquipmentComponent['findByEquipment'][]>;

  abstract create(
    data: Prisma.sofman_componente_equipamentoUncheckedCreateInput,
  ): Promise<sofman_componente_equipamento>;

  abstract findById(
    id: number,
  ): Promise<IEquipmentComponent['findById'] | null>;

  abstract update(
    id: number,
    data: Prisma.sofman_componente_equipamentoUncheckedUpdateInput,
  ): Promise<sofman_componente_equipamento>;

  abstract delete(id: number): Promise<boolean>;
}
