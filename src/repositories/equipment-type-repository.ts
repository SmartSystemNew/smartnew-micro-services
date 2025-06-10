import { cadastro_de_tipos_de_equipamentos, Prisma } from '@prisma/client';

export abstract class EquipmentTypeRepository {
  abstract findById(
    id: number,
  ): Promise<cadastro_de_tipos_de_equipamentos | null>;

  abstract findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<cadastro_de_tipos_de_equipamentos | null>;

  abstract listByClient(
    clientId: number,
    filter?: Prisma.cadastro_de_tipos_de_equipamentosWhereInput | null,
  ): Promise<cadastro_de_tipos_de_equipamentos[]>;
}
