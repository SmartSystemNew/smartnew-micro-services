import { Prisma, sofman_posto_combustivel } from '@prisma/client';
import { IFuelStation } from 'src/models/IFuelStation';

export abstract class FuelStationRepository {
  abstract findByClient(
    clientId: number,
  ): Promise<IFuelStation['findByClient'][]>;

  abstract findById(id: number): Promise<IFuelStation['findById'] | null>;

  abstract create(
    data: Prisma.sofman_posto_combustivelUncheckedCreateInput,
  ): Promise<sofman_posto_combustivel>;
}
