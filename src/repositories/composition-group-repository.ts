import { Prisma, smartnewsystem_composicao_grupo } from '@prisma/client';

export abstract class CompositionGroupRepository {
  abstract insert(
    data: Prisma.smartnewsystem_composicao_grupoUncheckedCreateInput,
  ): Promise<smartnewsystem_composicao_grupo>;

  abstract update(
    data: Prisma.smartnewsystem_composicao_grupoUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_composicao_grupo>;

  abstract delete(id: number): Promise<boolean>;
}
