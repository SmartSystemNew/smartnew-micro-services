import { Prisma, smartnewsystem_abastecimento_controle } from '@prisma/client';
import IFuellingControl from 'src/models/IFuellingControl';

export default abstract class FuellingControlRepository {
  abstract findById(
    id: number,
  ): Promise<IFuellingControl['listByClient'] | null>;
  abstract listByClient(
    clientId: number,
  ): Promise<IFuellingControl['listByClient'] | null>;

  abstract create(
    data: Prisma.smartnewsystem_abastecimento_controleUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_controle>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_controleUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_controle>;

  abstract delete(id: number): Promise<boolean>;
}
