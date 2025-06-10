import { Prisma } from '@prisma/client';
import ILogDescriptionMaintenancePlanning from 'src/models/ILogDescriptionMaintenancePlanning';

export default abstract class LogDescriptionMaintenancePlanningRepository {
  abstract listByWhere(
    clientId: number,
    branches: number[],
    filter?: Prisma.log_sofman_descricao_planejamento_manutencaoWhereInput,
  ): Promise<ILogDescriptionMaintenancePlanning['listByWhere'][]>;
}
