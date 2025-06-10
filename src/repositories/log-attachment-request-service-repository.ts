import { Prisma, log_sofman_anexos_solicitacoes } from '@prisma/client';

export default abstract class LogAttachmentRequestServiceRepository {
  abstract last(): Promise<log_sofman_anexos_solicitacoes>;
  abstract listByRequest(
    requestId: number,
    filter?: Prisma.log_sofman_anexos_solicitacoesWhereInput | null,
  ): Promise<log_sofman_anexos_solicitacoes[]>;

  abstract update(
    id: number,
    data: Prisma.log_sofman_anexos_solicitacoesUncheckedUpdateInput,
  ): Promise<log_sofman_anexos_solicitacoes>;

  abstract listByClient(
    clientId: number,
    filter?: Prisma.log_sofman_anexos_solicitacoesWhereInput | null,
  ): Promise<log_sofman_anexos_solicitacoes[]>;
}
