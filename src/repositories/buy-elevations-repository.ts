import {
  Prisma,
  smartnewsystem_compras_controle_alcadas,
} from '@prisma/client';
import { IBuyElevation } from 'src/models/IBuyElevations';

export default abstract class BuyElevationsRepository {
  abstract listElevations(
    branch: number,
  ): Promise<smartnewsystem_compras_controle_alcadas[]>;
  abstract create(
    data: Prisma.smartnewsystem_compras_controle_alcadasUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_controle_alcadas>;
  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_controle_alcadasUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_controle_alcadas>;
  abstract delete(id: number): Promise<boolean>;

  abstract findByFilial(clientId: number): Promise<any[]>;

  abstract listByBranch(
    branch_id: number,
  ): Promise<IBuyElevation['listByBranch'][]>;

  abstract listByBranches(
    branchesId: number[],
  ): Promise<IBuyElevation['listByBranches'][]>;
}
