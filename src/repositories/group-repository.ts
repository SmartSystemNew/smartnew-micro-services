import { sec_groups } from '@prisma/client';

export default abstract class GroupRepository {
  abstract listByClient(clientId: number): Promise<sec_groups[]>;
}
