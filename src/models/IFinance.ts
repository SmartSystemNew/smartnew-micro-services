import {
  $Enums,
  smartnewsystem_financeiro_descricao_titulos,
  smartnewsystem_financeiro_descricao_titulos_status,
} from '@prisma/client';

export interface IFinancePrisma
  extends smartnewsystem_financeiro_descricao_titulos {}

export type IFinanceStatus =
  | 'ABERTO'
  | 'PROCESSANDO'
  | 'FECHADO'
  | 'AGUARDANDO_PEDIDO';

smartnewsystem_financeiro_descricao_titulos_status;
export interface IFinance {
  findById: {
    id: number;
    id_cliente: number;
    id_filial: number;
    emitente: number;
    remetente: number;
    direcao: $Enums.smartnewsystem_financeiro_descricao_titulos_direcao;
    documento_numero: string;
    log_user: string;
    log_date: Date;
    numero_fiscal: string;
    descricao: string;
    frequencia_fixa: number;
    frequencia_pagamento: number;
    documento_valor: number;
    chave: string;
    status: IFinanceStatus;
    total_acrescimo: number;
    total_desconto: number;
    acrescimo_desconto: number;
    total_liquido: number;
    parcelar: number | null;
    quantidade_parcela: number | null;
    data_vencimento: Date | null;
    data_emissao: Date | null;
    data_lancamento: Date | null;
    bankTransferPay: {
      id: number;
      data_transferencia: Date;
    } | null;
    bankTransferReceive: {
      id: number;
      data_transferencia: Date;
    } | null;
    documentType: {
      id: number;
      descricao: string;
    };
    paymentType: {
      id: number;
      descricao: string;
    };
    financeControl: {
      id: number;
      issuePay: {
        ID: number;
        razao_social: string;
      };
      senderPay: {
        ID: number;
        filial_numero: string;
      };
      issueReceive: {
        ID: number;
        filial_numero: string;
      };
      senderReceive: {
        ID: number;
        razao_social: string;
      };
    };
    installmentFinance: {
      id: number;
      parcela: number;
      valor_a_pagar: number;
      valor_parcela: number;
      status: number;
    }[];
    registerTribute: {
      id: number;
      valor: number;
      tipo: $Enums.smartnewsystem_financeiro_registro_tributo_tipo;
      tribute: {
        id: number;
        descricao: string;
      };
    }[];
    requestProvider: {
      id: number;
      id_pedido: number;
    }[];
  };
  listFinanceByClient: {
    id: number;
    emitente: number;
    remetente: number;
    direcao: $Enums.smartnewsystem_financeiro_descricao_titulos_direcao;
    financeControl: {
      id: number;
      issuePay: {
        ID: number;
        razao_social: string;
      };
      senderPay: {
        ID: number;
        filial_numero: string;
      };
      issueReceive: {
        ID: number;
        filial_numero: string;
      };
      senderReceive: {
        ID: number;
        razao_social: string;
      };
    } | null;
  };
  listByClientAndStatus: {
    id: number;
    documento_numero: string;
    numero_fiscal: string;
    data_emissao: Date;
    financeControl: {
      issuePay: {
        ID: number;
        razao_social: string;
      };
      senderPay: {
        ID: number;
        filial_numero: string;
      };
      issueReceive: {
        ID: number;
        filial_numero: string;
      };
      senderReceive: {
        ID: number;
        razao_social: string;
      };
    };
  };
  listByFilterDynamic: {
    id: number;
    documento_numero: string;
    numero_fiscal: string;
    data_emissao: Date;
    financeControl: {
      issuePay: {
        razao_social: string;
      };
      senderPay: {
        filial_numero: string;
      };
      issueReceive: {
        filial_numero: string;
      };
      senderReceive: {
        razao_social: string;
      };
    };
  };
}
