import {
  Prisma,
  log_sofman_cad_status_solicitacoes_servico,
} from '@prisma/client';

export default abstract class LogStatusRequestServiceRepository {
  abstract listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_cad_status_solicitacoes_servicoWhereInput | null,
  ): Promise<log_sofman_cad_status_solicitacoes_servico[]>;
}
