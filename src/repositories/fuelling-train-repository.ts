import { Prisma, smartnewsystem_abastecimento_comboio } from '@prisma/client';
import { IFuellingTrain } from 'src/models/IFuellingTrain';

export default abstract class FuellingTrainRepository {
  abstract listByBranches(
    branches: number[],
    filter?: Prisma.smartnewsystem_abastecimento_comboioWhereInput,
  ): Promise<IFuellingTrain['listByBranches'][]>;

  abstract findById(id: number): Promise<IFuellingTrain['findById'] | null>;

  abstract findByClientAndTag(
    clientId: number,
    tag: string,
  ): Promise<IFuellingTrain['findById'] | null>;

  abstract listFuellingByBranches(
    branches: number[],
  ): Promise<IFuellingTrain['listFuellingByBranches'][]>;

  abstract create(
    data: Prisma.smartnewsystem_abastecimento_comboioUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_comboio>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_comboioUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_comboio>;

  abstract delete(id: number): Promise<boolean>;
}
