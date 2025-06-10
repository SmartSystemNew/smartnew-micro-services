import { Prisma, log_controle_de_ordens_de_servico } from '@prisma/client';
import ILogServiceOrder from 'src/models/ILogServiceOrder';

export default abstract class LogServiceOrderRepository {
  abstract listByBranchesAndFilter(
    branches: number[],
    filter?: Prisma.log_controle_de_ordens_de_servicoWhereInput | null,
  ): Promise<log_controle_de_ordens_de_servico[]>;

  abstract listOnlyServiceOrderIdByBranchesAndFilter(
    branches: number[],
    filter?: Prisma.log_controle_de_ordens_de_servicoWhereInput | null,
  ): Promise<ILogServiceOrder['listOnlyServiceOrderIdByBranchesAndFilter'][]>;
}
