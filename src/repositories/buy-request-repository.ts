import { Prisma, smartnewsystem_compras_numeros_fiscais } from '@prisma/client';
import IBuyRequest from 'src/models/IBuyRequest';

export default abstract class BuyRequestRepository {
  abstract countByBranches(
    branches: number[],
    filter?: Prisma.smartnewsystem_compras_numeros_fiscaisWhereInput | null,
  ): Promise<number>;
  abstract listByBranches(
    branches: number[],
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.smartnewsystem_compras_numeros_fiscaisWhereInput | null,
  ): Promise<IBuyRequest['listTable'][]>;

  abstract findById(id: number): Promise<IBuyRequest['findById'] | null>;

  abstract listByBuy(buyId: number): Promise<IBuyRequest['listByBuy'][]>;

  abstract create(
    data: Prisma.smartnewsystem_compras_numeros_fiscaisUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_numeros_fiscais>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_numeros_fiscaisUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_numeros_fiscais>;

  abstract delete(id: number): Promise<boolean>;
}
