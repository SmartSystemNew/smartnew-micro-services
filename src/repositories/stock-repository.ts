import { Prisma, sofman_entrada_estoque } from '@prisma/client';

export default abstract class StockRepository {
  abstract findByRequest(
    requestId: number,
  ): Promise<sofman_entrada_estoque | null>;
  abstract findByClientAndBranchAndProviderAndNumber(
    clientId: number,
    branchId: number,
    providerId: number,
    number: string,
  ): Promise<sofman_entrada_estoque | null>;
  abstract create(
    data: Prisma.sofman_entrada_estoqueUncheckedCreateInput,
  ): Promise<sofman_entrada_estoque>;

  abstract update(
    id: number,
    data: Prisma.sofman_entrada_estoqueUncheckedUpdateInput,
  ): Promise<sofman_entrada_estoque>;

  abstract delete(id: number): Promise<boolean>;
}
