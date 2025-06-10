import {
  smartnewsystem_compras_controle_cotacao,
  Prisma,
} from '@prisma/client';

export default abstract class BuyControlQuotationRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<smartnewsystem_compras_controle_cotacao | null>;

  abstract create(
    data: Prisma.smartnewsystem_compras_controle_cotacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_compras_controle_cotacao>;
}
