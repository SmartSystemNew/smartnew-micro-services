import { IBuyPriority } from 'src/models/IBuyPriority';

export default abstract class BuyPriorityRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<IBuyPriority['listByClient'][]>;

  abstract findById(id: number): Promise<IBuyPriority['findById'] | null>;
}
