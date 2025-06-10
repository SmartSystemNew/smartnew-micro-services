import { Prisma, sofman_cad_tipos_manutencao } from '@prisma/client';
import { ITypeMaintenance } from 'src/models/ITypeMaintenance';

export abstract class TypeMaintenanceRepository {
  abstract findByClientAndType(
    clientId: number,
    type: string,
  ): Promise<sofman_cad_tipos_manutencao | null>;
  abstract findById(id: number): Promise<ITypeMaintenance['findById'] | null>;

  abstract create(
    data: Prisma.sofman_cad_tipos_manutencaoUncheckedCreateInput,
  ): Promise<sofman_cad_tipos_manutencao>;

  abstract delete(id: number): Promise<boolean>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_cad_tipos_manutencaoWhereInput | any,
    fields?: string[],
  ): Promise<ITypeMaintenance['listByClient'][]>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_tipos_manutencaoUncheckedUpdateInput,
  ): Promise<sofman_cad_tipos_manutencao>;
}
