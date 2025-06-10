import { IBuyStatus } from '../models/IBuyStatus';

export default abstract class BuyStatusRepository {
  abstract list(): Promise<IBuyStatus['list'][]>;
}
