import { $Enums } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface IFinancePayment {
  findById: {
    id: number;
    parcela: number;
    status: number;
    vencimento: Date;
    valor_a_pagar: number;
    acrescimo: number;
    motivo_acrescimo: string;
    desconto: number;
    motivo_desconto: string;
    valor_parcela: number;
    prorrogacao: Date;
    statusPay: {
      id: number;
      descricao: string;
    };
    finance: {
      id: number;
      direcao: $Enums.smartnewsystem_financeiro_descricao_titulos_direcao;
      documento_numero: string;
      numero_fiscal: string;
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
    emissionItem: {
      emission: {
        id: number;
        pago: number;
        bank: {
          id: number;
          nome: string;
          saldo: number;
        };
      };
    } | null;
  };
  findByIds: {
    id: number;
    parcela: number;
    vencimento: Date;
    valor_a_pagar: number;
    acrescimo: number;
    motivo_acrescimo: string;
    desconto: number;
    motivo_desconto: string;
    valor_parcela: number;
    prorrogacao: Date;
    finance: {
      id: number;
      direcao: $Enums.smartnewsystem_financeiro_descricao_titulos_direcao;
      documento_numero: string;
      numero_fiscal: string;
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
    emissionItem: {
      emission: {
        id: number;
        pago: number;
        data_vencimento: Date;
        id_banco: number;
        bank: {
          id: number;
          nome: string;
          saldo: number;
        };
      };
    } | null;
  };
  findIfWithEmission: {
    id: number;
    parcela: number;
    vencimento: Date;
    valor_a_pagar: number;
    motivo_acrescimo: string;
    motivo_desconto: string;
    valor_parcela: number;
    prorrogacao: Date;
    finance: {
      id: number;
      direcao: $Enums.smartnewsystem_financeiro_descricao_titulos_direcao;
      documento_numero: string;
      numero_fiscal: string;
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
    emissionItem: {
      emission: {
        id: number;
        pago: number;
      };
    } | null;
  };
  findByFinance: {
    id: number;
    parcela: number;
    vencimento: Date;
    valor_a_pagar: number;
    acrescimo: number;
    desconto: number;
    valor_parcela: number;
    prorrogacao: Date;
    status: number;
    statusPay: {
      id: number;
      descricao: string;
    };
    emissionItem: {
      emission: {
        data_vencimento: Date | null;
        pago: number;
      };
    } | null;
    emissionTaxation: {
      tipo: $Enums.smartnewsystem_financeiro_emissao_tributos_tipo;
      valor: number;
      observacao: string;
    }[];
  };
}

export interface IGroupByDate {
  _sum: {
    valor_parcela: number;
  };
  id_titulo: number;
}

export interface IListFinanceByDateAndDirection {
  finance: {
    id: number;
  };
}

export interface IListItemsByDateAndDirectionAndDescriptionCostCenter {
  id: number;
  vencimento: Date;
  prorrogacao: Date | null;
  parcela: number;
  valor_parcela: number;
  emissionItem: {
    id: number;
    emission: {
      id: number;
      data_vencimento: Date | null;
    };
  } | null;
  finance: {
    id: number;
    documento_numero: string;
    numero_fiscal: string;
    data_emissao: Date;
    total_liquido: number | null;
    observacoes: string | null;
    quantidade_parcela: number | null;
    remetente: number;
    emitente: number;
    paymentType: {
      id: number;
      descricao: string;
    };
    financeControl: {
      issuePay: {
        nome_fantasia: string;
      } | null;
      senderPay: {
        nome_fantasia: string;
      } | null;
      issueReceive: {
        nome_fantasia: string;
      } | null;
      senderReceive: {
        nome_fantasia: string;
      } | null;
    };
    items: {
      id: number;
      total: Decimal;
      id_insumo: number | null;
      vinculo: $Enums.smartnewsystem_financeiro_titulos_dados_vinculo | null;
      compositionItem: {
        id: number;
        descricao: string;
        composicao: string;
        compositionGroup: {
          id: number;
          descricao: string;
          composicao: string;
          costCenter: {
            ID: number;
            centro_custo: string | null;
            descricao: string | null;
            descriptionCostCenter: {
              id: number;
              descricao_centro_custo: string | null;
              branch: {
                ID: number;
                filial_numero: string | null;
              };
            };
          };
        };
      };
      material: {
        material: string;
      } | null;
      input: {
        insumo: string;
      } | null;
      equipment: {
        ID: number;
        equipamento_codigo: string | null;
        descricao: string | null;
      } | null;
      order: {
        ID: number;
        ordem: string | null;
        descricao_solicitacao: string | null;
        equipment: {
          ID: number;
          equipamento_codigo: string | null;
          descricao: string | null;
        } | null;
      } | null;
    }[];
  };
}

export interface IListTotalPaymentTemplate {
  totalSplit: number;
  financeId: number;
  totalFinance: number | Decimal;
}

export interface IItemFindTemplate {
  compositionItemId: number;
  compositionGroupId: number;
  totalItem: number | Decimal;
  compositionItemCode: string;
  compositionItemDescription: string;
  compositionGroupCode: string;
  compositionGroupDescription: string;
  itemId: number;
  costCenterId: number;
  costCenterCode: string;
  costCenterDescription: string;
  branchDescription: string;
  branchId: number;
}

export interface IRawGroupByDateByDirectionAndCostCenter {
  totalSplit: number;
  financeId: number;
  totalFinance: number | Decimal;
  compositionItemId: number;
  compositionGroupId: number;
  totalItem: number | Decimal;
  compositionItemCode: string;
  compositionItemDescription: string;
  compositionGroupCode: string;
  compositionGroupDescription: string;
  itemId: number;
  costCenterId: number;
  costCenterCode: string;
  costCenterDescription: string;
  branchDescription: string;
  branchId: number;
}

export interface IListViewExpressByDateAndClient {
  prorrogacao: Date | null;
  vencimento: Date;
  parcela: number;
  valor_parcela: number | Decimal;
  valor_a_pagar: number | Decimal;
  id: number;
  numero_fiscal: string;
  remetente: string;
  emitente: string;
  total: number | Decimal;
  composition_item_id: number;
  composition_item_descricao: string;
  composition_item_composicao: string;
  composition_group_id: number;
  composition_group_descricao: string;
  composition_group_composicao: string;
  costCenter_ID: number;
  costCenter_code: string | null;
  costCenter_descricao: string | null;
  descriptionCostCenter_id: number;
  descriptionCostCenter_name: string;
  branch_id: number;
  branch_name: string;
  material: string;
  insumo: string;
  data_vencimento: Date;
}

export interface IListViewReceiveByDateAndClient {
  prorrogacao: Date | null;
  vencimento: Date;
  data_vencimento: Date;
  parcela: number;
  valor_parcela: number | Decimal;
  valor_a_pagar: number | Decimal;
  id: number;
  numero_fiscal: string;
  remetente: string;
  emitente: string;
  total: number | Decimal;
  composition_item_id: number;
  composition_item_descricao: string;
  composition_item_composicao: string;
  composition_group_id: number;
  composition_group_descricao: string;
  composition_group_composicao: string;
  costCenter_ID: number;
  costCenter_code: string | null;
  costCenter_descricao: string | null;
  descriptionCostCenter_id: number;
  descriptionCostCenter_name: string;
  branch_id: number;
  branch_name: string;
  material: string;
  insumo: string;
}
