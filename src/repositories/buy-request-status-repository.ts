import { smartnewsystem_compras_pedido_status } from '@prisma/client';

export default abstract class BuyRequestStatusRepository {
  abstract listClient(
    clientId: number,
  ): Promise<smartnewsystem_compras_pedido_status[]>;

  abstract findById(id: number): Promise<smartnewsystem_compras_pedido_status>;
}
