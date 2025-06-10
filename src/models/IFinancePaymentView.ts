import { $Enums } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export default interface IFinancePaymentView {
  infoTable: {
    id: number;
    id_cliente: number;
    id_titulo: number;
    documento_numero: string;
    numero_fiscal: string;
    data_emissao: Date;
    emitente: string | null;
    remetente: string | null;
    vencimento: Date;
    prorrogacao: Date;
    valor_a_pagar: number;
    valor_parcela: number;
    parcela: number;
    status: number;
    descricao: string;
    totalItem: number;
    id_pedido: number;
    numero: number;
    data_vencimento: Date;
    tipo_pagamento_id: number;
    tipo_pagamento: string;
    banco_id: number;
    banco_nome: string;
    finance: {
      id: number;
      documento_numero: string;
      numero_fiscal: string;
      data_emissao: Date;
      emitente: number;
      remetente: number;
      total_liquido: number;
      quantidade_parcela: number | null;
      registerTribute: {
        id: number;
        tipo: string;
        valor: number;
        tribute: {
          id: number;
          descricao: string;
        };
      }[];
      items: {
        quantidade: Decimal | null;
        preco_unitario: Decimal | null;
        id_insumo: number | null;
        vinculo: $Enums.smartnewsystem_financeiro_titulos_dados_vinculo | null;
        compositionItem: {
          id: number;
          composicao: string | null;
          descricao: string | null;
          compositionGroup: {
            id: number | null;
            composicao: string | null;
            descricao: string | null;
            costCenter: {
              ID: number | null;
              centro_custo: string | null;
              descricao: string | null;
            };
          };
        };
        material: {
          id: number | null;
          material: string | null;
        } | null;
        input: {
          id: number | null;
          insumo: string | null;
        } | null;
      }[];
      installmentFinance: {
        id: number;
      }[];
    };
  };
  infoTableNoPage: {
    id: number;
    id_cliente: number;
    id_titulo: number;
    documento_numero: string;
    numero_fiscal: string;
    data_emissao: Date;
    emitente: string | null;
    remetente: string | null;
    vencimento: Date;
    prorrogacao: Date;
    valor_a_pagar: number;
    valor_parcela: number;
    parcela: number;
    status: number;
    descricao: string;
    totalItem: number;
    id_pedido: number;
    numero: number;
    data_vencimento: Date;
    tipo_pagamento_id: number;
    tipo_pagamento: string;
    banco_id: number;
    banco_nome: string;
    finance: {
      id: number;
      documento_numero: string;
      numero_fiscal: string;
      data_emissao: Date;
      emitente: number;
      remetente: number;
      total_liquido: number;
      quantidade_parcela: number | null;
      registerTribute: {
        id: number;
        tipo: string;
        valor: number;
        tribute: {
          id: number;
          descricao: string;
        };
      }[];
      items: {
        quantidade: Decimal | null;
        preco_unitario: Decimal | null;
        id_insumo: number | null;
        vinculo: $Enums.smartnewsystem_financeiro_titulos_dados_vinculo | null;
        compositionItem: {
          id: number;
          composicao: string | null;
          descricao: string | null;
          compositionGroup: {
            id: number | null;
            composicao: string | null;
            descricao: string | null;
            costCenter: {
              ID: number | null;
              centro_custo: string | null;
              descricao: string | null;
            };
          };
        };
        material: {
          id: number | null;
          material: string | null;
        } | null;
        input: {
          id: number | null;
          insumo: string | null;
        } | null;
      }[];
    };
  };
}
