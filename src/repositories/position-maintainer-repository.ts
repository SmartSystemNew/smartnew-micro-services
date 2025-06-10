import { Prisma, sofman_cad_cargos_mantenedores } from '@prisma/client';
import { IPositionMaintainer } from 'src/models/IPositionMaintainer';

export default abstract class PositionMaintainerRepository {
  abstract findById(id: number): Promise<IPositionMaintainer['findById']>;

  abstract list(
    clientId: number,
    filters?: Prisma.sofman_cad_cargos_mantenedoresWhereInput | null,
  ): Promise<IPositionMaintainer['list']>;

  abstract create(
    data: Prisma.sofman_cad_cargos_mantenedoresUncheckedCreateInput,
  ): Promise<sofman_cad_cargos_mantenedores>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_cargos_mantenedoresUncheckedUpdateInput,
  ): Promise<sofman_cad_cargos_mantenedores>;

  abstract delete(id: number): Promise<boolean>;
}
