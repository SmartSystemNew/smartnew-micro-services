import { Prisma } from '@prisma/client';
import ILogRequestService from 'src/models/ILogRequestService';

export default abstract class LogRequestServiceRepository {
  abstract listByBranchesAndFilter(
    branches: number[],
    filter?: Prisma.log_sofman_solicitacoes_servicoWhereInput | null,
  ): Promise<ILogRequestService['listByBranchesAndFilter'][]>;
}
