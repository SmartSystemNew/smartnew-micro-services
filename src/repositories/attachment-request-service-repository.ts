import { Prisma, sofman_anexos_solicitacoes } from '@prisma/client';

export default abstract class AttachmentRequestServiceRepository {
  abstract update(
    id: number,
    data: Prisma.sofman_anexos_solicitacoesUncheckedUpdateInput,
  ): Promise<sofman_anexos_solicitacoes>;
  abstract findById(id: number): Promise<sofman_anexos_solicitacoes | null>;
  abstract create(
    data: Prisma.sofman_anexos_solicitacoesUncheckedCreateInput,
  ): Promise<sofman_anexos_solicitacoes>;

  abstract listRequest(
    requestId: number,
  ): Promise<sofman_anexos_solicitacoes[]>;

  abstract delete(id: number): Promise<boolean>;
}
