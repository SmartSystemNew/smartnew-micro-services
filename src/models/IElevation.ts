export interface IElevation {
  findById: {
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
