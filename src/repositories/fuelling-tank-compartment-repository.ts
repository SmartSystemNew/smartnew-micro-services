import {
  Prisma,
  smartnewsystem_abastecimento_tanque_combustivel,
} from '@prisma/client';
import IFuellingTankCompartment from 'src/models/IFuellingTankCompartment';

export default abstract class FuellingTankCompartmentRepository {
  abstract findByTank(
    tankId: number,
  ): Promise<IFuellingTankCompartment['findByTank'][]>;

  abstract findById(
    id: number,
  ): Promise<IFuellingTankCompartment['findById'] | null>;

  abstract create(
    data: Prisma.smartnewsystem_abastecimento_tanque_combustivelUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_tanque_combustivel>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_tanque_combustivelUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_tanque_combustivel>;

  abstract delete(id: number): Promise<boolean>;
}
