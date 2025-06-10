import { Prisma, smartnewsystem_compras_solicitacao } from '@prisma/client';
import IBuy from 'src/models/IBuy';

export default abstract class BuyRepository {
  abstract createRequest(
    clientId: number,
    buyId: number,
    hasFinance: boolean,
    login: string,
  ): Promise<IBuy['createRequest']>;
  abstract countListByClientAndFilterRaw(
    clientId: number,
    filter?: string,
  ): Promise<number>;
  abstract listByClientAndFilterRaw(
    clientId: number,
    index: number | null,
    perPage: number | null,
    filter?: string,
  ): Promise<IBuy['listByClientAndFilterRaw'][]>;
  abstract listByClientAndFilter(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.smartnewsystem_compras_solicitacaoWhereInput,
  ): Promise<IBuy['listByClientAndFilter'][]>;

  abstract listByClientAndFilterGrid(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.smartnewsystem_compras_solicitacaoWhereInput,
  ): Promise<IBuy['listByClientAndFilterGrid'][]>;

  abstract listByClientAndDateClose(
    clientId: number,
    date: Date,
  ): Promise<smartnewsystem_compras_solicitacao[]>;
  abstract findById(id: number): Promise<IBuy['findById'] | null>;

  abstract findByIdAndProviderQuotation(
    id: number,
    providerId: number,
  ): Promise<IBuy['findByIdAndProviderQuotation'] | null>;

  abstract listByBuyAndFinishProvider(
    id: number,
    providerId: number,
  ): Promise<IBuy['listByBuyAndFinishProvider']>;

  abstract create(
    data: Prisma.smartnewsystem_compras_solicitacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_solicitacao>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_solicitacaoUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_solicitacao>;

  abstract delete(id: number): Promise<boolean>;
}
