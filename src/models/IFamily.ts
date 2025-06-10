export interface IFamily {
  listByClient: {
    ID: number;
    ID_cliente: number;
    ID_filial: number;
    familia: string;
    observacoes: string | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    }[];
  };
  listByBranches: {
    ID: number;
    familia: string;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    }[];
  };
}
