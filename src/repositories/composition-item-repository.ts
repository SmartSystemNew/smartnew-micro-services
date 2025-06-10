import { Prisma, smartnewsystem_composicao_item } from '@prisma/client';

export abstract class CompositionItemRepository {
  abstract findById(id: number): Promise<smartnewsystem_composicao_item | null>;

  abstract insert(
    data: Prisma.smartnewsystem_composicao_itemUncheckedCreateInput,
  ): Promise<smartnewsystem_composicao_item>;

  abstract update(
    data: Prisma.smartnewsystem_composicao_itemUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_composicao_item>;

  abstract delete(id: number): Promise<boolean>;
}
