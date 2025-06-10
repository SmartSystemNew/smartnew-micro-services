import { smartnewsystem_compras_solicitacao } from '@prisma/client';

export abstract class BuyNumberFiscalRepository {
  abstract list(
    clientId: number,
    startDate: Date,
  ): Promise<
    ({
      requestProvider: {
        id: number;
        id_pedido: number;
        id_fornecedor: number;
        id_finance?: number;
      }[];
    } & {
      buy: smartnewsystem_compras_solicitacao;
    } & {
      id: number;
      id_compra: number;
    })[]
  >;
}
