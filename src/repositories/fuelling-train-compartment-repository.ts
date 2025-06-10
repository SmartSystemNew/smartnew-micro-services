import {
  Prisma,
  smartnewsystem_abastecimento_comboio_combustivel,
} from '@prisma/client';
import IFuellingTrainCompartment from 'src/models/IFuellingTrainCompartment';

export default abstract class FuellingTrainCompartmentRepository {
  abstract findById(
    id: number,
  ): Promise<IFuellingTrainCompartment['findById'] | null>;

  abstract create(
    data: Prisma.smartnewsystem_abastecimento_comboio_combustivelUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_comboio_combustivel>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_comboio_combustivelUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_comboio_combustivel>;

  abstract delete(id: number): Promise<boolean>;
}
