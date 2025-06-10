export interface IFindLogin {
  login: string;
  name: string;
  id_cliente: number;
  tipo_acesso?: number;
  id_mantenedor: number | null;
  pswd: string;
  company: {
    ID: number;
    nome_fantasia: string;
    razao_social: string;
    cnpj: string;
  };
  managerUserBound: {
    companyBound: {
      ID: number;
      nome_fantasia: string;
      razao_social: string;
      cnpj: string;
    };
  }[];
  boundBank: {
    id: number;
    bank: {
      id: number;
      nome: string;
    };
  }[];
}

export interface IFindGroup {
  group_id: number;
  group: {
    description: string;
    groupModule: {
      ID: number;
      priv_access: string;
      module: {
        id: number;
      };
    }[];
  };
}

export interface IUserInfo {
  name: string | null;
  login: string;
  clientId: number;
  typeAccess?: number;
  collaboratorId: number | null;
  company: {
    id: number;
    name: string;
    cnpj: string;
  };
  group: {
    description: string;
    id: number;
  };
  branches: number[];
  branch: {
    id: number;
    cnpj: string;
    name: string;
  }[];
  module: {
    id: number;
    nome: string;
  }[];
}

export interface IListUserByClient {
  login: string;
  name: string;
}

export interface IListUserByClientAndActive {
  login: string;
  name: string;
}

export interface IFindByLogin {
  id_cliente?: number;
  login: string;
  name: string;
  id_mantenedor?: number | null;
  company: {
    ID: number;
    nome_fantasia: string;
    razao_social: string;
  };
}
