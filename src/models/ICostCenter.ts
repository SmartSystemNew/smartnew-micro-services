export interface ICostCenter {
  listCostCenter: {
    ID: number;
    centro_custo: string;
    descricao: string;
  };
  listCostCenterActive: {
    ID: number;
    centro_custo: string;
    descricao: string;
  };
  byClient: {
    ID: number;
    centro_custo: string;
    descricao: string;
    descriptionCostCenter: {
      descricao_centro_custo: string;
      branch: {
        filial_numero: string;
      };
    };
  };
  byBranch: {
    ID: number;
    centro_custo: string;
    descricao: string;
    descriptionCostCenter: {
      descricao_centro_custo: string;
      branch: {
        filial_numero: string;
      };
    };
  };
  byDescription: {
    ID: number;
    centro_custo: string;
    descricao: string;
    descriptionCostCenter: {
      descricao_centro_custo: string;
      branch: {
        filial_numero: string;
      };
    };
  };
  findById: {
    ID: number;
    centro_custo: string;
    descricao: string;
    descriptionCostCenter: {
      descricao_centro_custo: string;
      branch: {
        filial_numero: string;
      };
    };
  };
  findByDescriptionAndCodeAndName: {
    ID: number;
    centro_custo: string;
    descricao: string;
    descriptionCostCenter: {
      descricao_centro_custo: string;
      branch: {
        filial_numero: string;
      };
    };
  };
  findByDescriptionAndName: {
    ID: number;
    centro_custo: string;
    descricao: string;
    descriptionCostCenter: {
      descricao_centro_custo: string;
      branch: {
        filial_numero: string;
      };
    };
  };
}
