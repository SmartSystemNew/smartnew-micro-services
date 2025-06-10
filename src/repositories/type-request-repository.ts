import { sofman_cad_tipo_solicitacao, Prisma } from '@prisma/client';

export default abstract class TypeRequestRepository {
  abstract listByClient(
    clientId: number,
    filter?: Prisma.sofman_cad_tipo_solicitacaoWhereInput | null,
  ): Promise<sofman_cad_tipo_solicitacao[]>;

  abstract create(
    data: Prisma.sofman_cad_tipo_solicitacaoUncheckedCreateInput,
  ): Promise<sofman_cad_tipo_solicitacao>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_tipo_solicitacaoUncheckedUpdateInput,
  ): Promise<sofman_cad_tipo_solicitacao>;

  abstract delete(id: number): Promise<boolean>;
}
