import { Prisma, smartnewsystem_abastecimento_entrada } from '@prisma/client';
import IInputFuel from 'src/models/IInputFuel';

export default abstract class FuellingInputFuelRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<IInputFuel['listByClient'][]>;

  abstract findByClientAndFiscalAndProvider(
    clientId: number,
    fiscal: string,
    providerId: number,
  ): Promise<IInputFuel['findByClientAndFiscalAndProvider'] | null>;

  abstract findById(id: number): Promise<IInputFuel['findById'] | null>;

  abstract create(
    data: Prisma.smartnewsystem_abastecimento_entradaUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_entrada>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_entradaUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_entrada>;

  abstract delete(id: number): Promise<boolean>;
}
