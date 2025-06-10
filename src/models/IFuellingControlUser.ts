export interface IFuellingControlUser {
  listByBranches: {
    id: number;
    motorista: number;
    abastecedor: number;
    codigo: string;
    branch: {
      ID: number;
      filial_numero: string;
    };
    user: {
      name: string;
      login: string;
    };
  };
  listByClient: {
    id: number;
    motorista: number;
    abastecedor: number;
    codigo: string;
    branch: {
      ID: number;
      filial_numero: string;
    };
    user: {
      name: string;
      login: string;
    };
    train: {
      id: number;
      placa: string | null;
      tag: string | null;
    } | null;
  };
  findById: {
    id: number;
    motorista: number;
    abastecedor: number;
    codigo: string;
    branch: {
      ID: number;
      filial_numero: string;
    };
    user: {
      name: string;
      login: string;
    };
  };
  findByLogin: {
    id: number;
    motorista: number;
    abastecedor: number;
    codigo: string;
    branch: {
      ID: number;
      filial_numero: string;
    };
    train: {
      id: number;
      tag: string;
      placa: string;
    } | null;
    user: {
      name: string;
      login: string;
    };
  };
  listDriverByBranch: {
    user: {
      name: string;
      login: string;
    };
  };
  listSupplierByBranch: {
    user: {
      name: string;
      login: string;
    };
  };
}
