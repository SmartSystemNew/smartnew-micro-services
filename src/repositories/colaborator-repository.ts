import { Prisma, sofman_cad_colaboradores } from '@prisma/client';

export default abstract class ColaboratorRepository {
  abstract ListByClient(
    clientId: number,
    filter?: Prisma.sofman_cad_colaboradoresWhereInput | null,
  ): Promise<sofman_cad_colaboradores[]>;

  abstract findByIdAndClient(
    collaboratorId: number,
    clientId: number,
  ): Promise<sofman_cad_colaboradores | null>;

  abstract findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<sofman_cad_colaboradores | null>;

  abstract create(
    data: Prisma.sofman_cad_colaboradoresUncheckedCreateInput,
  ): Promise<sofman_cad_colaboradores>;
}
