import { Prisma } from '@prisma/client';
import ILogEmployees from 'src/models/ILogEmployees';

export default abstract class LogEmployeesRepository {
  abstract listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_cad_colaboradoresWhereInput | null,
  ): Promise<ILogEmployees['listByClient'][]>;
}
