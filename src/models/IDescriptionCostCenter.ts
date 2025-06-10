export interface IDescriptionCostCenter {
  listByClient: {
    id: number;
    descricao_centro_custo: string;
    branch: {
      filial_numero: string;
    };
  };
  listByClientComplete: {
    id: number;
    descricao_centro_custo: string;
    costCenter: {
      ID: number;
      centro_custo: string;
      descricao: string;
      compositionGroup: {
        id: number;
        descricao: string;
        composicao: string;
        compositionGroupItem: {
          id: number;
          descricao: string;
          composicao: string;
        }[];
      }[];
    }[];
  };
  listByBranchesComplete: {
    id: number;
    descricao_centro_custo: string;
    costCenter: {
      ID: number;
      centro_custo: string;
      descricao: string;
      compositionGroup: {
        id: number;
        descricao: string;
        composicao: string;
        compositionGroupItem: {
          id: number;
          descricao: string;
          composicao: string;
        }[];
      }[];
    }[];
  };
  listByBranch: {
    id: number;
    descricao_centro_custo: string;
    branch: {
      filial_numero: string;
    };
  };
  findById: {
    id: number;
    descricao_centro_custo: string;
    branch: {
      filial_numero: string;
    };
  };
  findByBranchAndName: {
    id: number;
    descricao_centro_custo: string;
  };
}
