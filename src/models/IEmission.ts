import {
  smartnewsystem_financeiro_emissao,
  smartnewsystem_financeiro_emissao_itens,
  smartnewsystem_financeiro_titulo_pagamento,
} from '@prisma/client';

export interface IEmissionItem extends smartnewsystem_financeiro_emissao_itens {
  installmentFinance: smartnewsystem_financeiro_titulo_pagamento;
}

export interface IEmission {
  findById: {
    id: number;
    data_vencimento: Date;
    pago: number;
    bank: {
      id: number;
      nome: string;
      saldo: number;
    };
    emissionItem: {
      installmentFinance: {
        id: number;
        vencimento: Date;
        valor_parcela: number;
        finance: {
          financeControl: {
            issuePay: {
              ID: number;
              razao_social: string;
            } | null;
            senderPay: {
              ID: number;
              filial_numero: string;
            } | null;
            issueReceive: {
              ID: number;
              filial_numero: string;
            } | null;
            senderReceive: {
              ID: number;
              razao_social: string;
            } | null;
          };
        };
      };
    }[];
  };
  update: smartnewsystem_financeiro_emissao & {
    emissionItem: IEmissionItem[];
  };
}
