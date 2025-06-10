import { Prisma } from '@prisma/client';
import ILogEquipment from 'src/models/ILogEquipment';

export default abstract class LogEquipmentRepository {
  abstract listByBranches(
    branches: number[],
    filter?: Prisma.log_cadastro_de_equipamentosWhereInput | null,
  ): Promise<ILogEquipment['listByBranches'][]>;
}
