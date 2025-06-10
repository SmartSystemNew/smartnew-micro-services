import { Prisma, log_sofman_unidade_medida_planos_prev } from '@prisma/client';

export default abstract class LogUnityOfMensurePlansRepository {
  abstract listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_unidade_medida_planos_prevWhereInput | null,
  ): Promise<log_sofman_unidade_medida_planos_prev[]>;
}
