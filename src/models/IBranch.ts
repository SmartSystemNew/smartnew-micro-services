export interface IBranch {
  listByIds: {
    ID: number;
    filial_numero: string;
    nome_fantasia: string;
    cnpj: string;
  };
  findByClientAndName: {
    ID: number;
    filial_numero: string;
    nome_fantasia: string;
    cnpj: string;
  };
  findByClientAndCNPJ: {
    ID: number;
    filial_numero: string;
    nome_fantasia: string;
    cnpj: string;
  };
  listByClientAndUserForPage: {
    branch: {
      ID: number;
      filial_numero: string;
      cnpj: string;
    };
  };
}

export interface IBranchByUser {
  id_filial: number;
  branch: {
    filial_numero: string;
    cnpj: string;
  };
}

export interface IListByClientAndBranch {
  user: {
    login: string;
    name: string;
  };
}

export interface IBranchFindById {
  ID: number;
  filial_numero: string;
  nome_fantasia: string;
  cnpj: string;
  company: {
    ID: number;
    razao_social: string;
    cnpj: string;
  };
}
