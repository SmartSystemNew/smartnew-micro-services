import { Prisma, smartnewsystem_compras_pedidos_falta } from '@prisma/client';

export default abstract class BuyRequestFaultRepository {
  abstract create(
    data: Prisma.smartnewsystem_compras_pedidos_faltaUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_pedidos_falta>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_pedidos_faltaUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_pedidos_falta>;

  abstract delete(id: number): Promise<boolean>;
}
