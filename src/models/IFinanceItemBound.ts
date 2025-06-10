export interface IFinanceItemBound {
  findById: {
    id: number;
    equipment: {
      descricao: string;
      equipamento_codigo: string;
    };
    order: {
      ordem: string;
      descricao_solicitacao: string;
    };
  };
  findByItem: {
    id: number;
    equipment: {
      descricao: string;
      equipamento_codigo: string;
    };
    order: {
      ordem: string;
      descricao_solicitacao: string;
    };
  };
  insert: {
    id: number;
    equipment: {
      descricao: string;
      equipamento_codigo: string;
    };
    order: {
      ordem: string;
      descricao_solicitacao: string;
    };
  };
  update: {
    id: number;
    equipment: {
      descricao: string;
      equipamento_codigo: string;
    };
    order: {
      ordem: string;
      descricao_solicitacao: string;
    };
  };
}
