import {
  Prisma,
  smartnewsystem_abastecimento_controle_usuario,
} from '@prisma/client';
import { IFuellingControlUser } from 'src/models/IFuellingControlUser';

export abstract class FuellingControlUserRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<IFuellingControlUser['listByClient'][]>;

  abstract listByBranches(
    branchId: number[],
  ): Promise<IFuellingControlUser['listByBranches'][]>;
  abstract findByLogin(
    login: string,
  ): Promise<IFuellingControlUser['findByLogin'] | null>;

  abstract findById(
    id: number,
  ): Promise<IFuellingControlUser['findById'] | null>;

  abstract listDriverByBranch(
    branchId: number,
  ): Promise<IFuellingControlUser['listDriverByBranch'][]>;

  abstract listSupplierByBranch(
    branchId: number,
  ): Promise<IFuellingControlUser['listSupplierByBranch'][]>;

  abstract create(
    data: Prisma.smartnewsystem_abastecimento_controle_usuarioUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_controle_usuario>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_controle_usuarioUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_controle_usuario>;

  abstract delete(id: number): Promise<boolean>;
}
