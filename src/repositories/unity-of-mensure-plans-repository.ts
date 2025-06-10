import { sofman_unidade_medida_planos_prev, Prisma } from '@prisma/client';

export default abstract class UnityOfMensurePlansRepository {
  abstract findByClient(
    clientId: number,
  ): Promise<sofman_unidade_medida_planos_prev[]>;

  abstract findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<sofman_unidade_medida_planos_prev | null>;

  abstract insert(
    data: Prisma.sofman_unidade_medida_planos_prevUncheckedCreateInput,
  ): Promise<sofman_unidade_medida_planos_prev>;
}
