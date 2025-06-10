import {
  Prisma,
  smartnewsystem_compras_cotacao_selecionada,
} from '@prisma/client';
import IBuyQuotationSelected from 'src/models/IBuyQuotationSelected';

export default abstract class BuyQuotationSelectedRepository {
  abstract listByBuy(
    buyId: number,
  ): Promise<IBuyQuotationSelected['listByBuy'][]>;

  abstract create(
    data: Prisma.smartnewsystem_compras_cotacao_selecionadaUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_cotacao_selecionada>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_compras_cotacao_selecionadaUncheckedUpdateInput,
  ): Promise<smartnewsystem_compras_cotacao_selecionada>;

  abstract deleteByBuy(buyId: number): Promise<boolean>;
  abstract delete(id: number): Promise<boolean>;
}
