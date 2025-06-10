export interface IBuyElevation {
  listByBranch: {
    id: number;
    nivel: number;
    status_aprovador: boolean;
    branch: {
      ID: number;
      filial_numero: string;
    };
    user: {
      name: string;
      login: string;
    };
  };
  listByBranches: {
    id: number;
    nivel: number;
    status_aprovador: boolean;
    branch: {
      ID: number;
      filial_numero: string;
    };
    user: {
      name: string;
      login: string;
    };
  };
}
