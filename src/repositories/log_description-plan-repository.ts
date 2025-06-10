import { Prisma } from '@prisma/client';
import ILogDescriptionPlans from 'src/models/ILogDescriptionPlans';

export default abstract class LogDescriptionPlanRepository {
  abstract listByDescriptionPlans(
    clientId: number,
    filter?: Prisma.log_sofman_descricao_planos_prevWhereInput,
  ): Promise<ILogDescriptionPlans['listByDescriptionPlans'][]>;
}
