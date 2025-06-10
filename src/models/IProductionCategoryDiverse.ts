export interface IProductionCategoryDiverseListByClient {
  id: number;
  nome: string;
  branch: {
    ID: number;
  };
  user: {
    login: string;
    name: string;
  };
}

export interface IProductionCategoryDiverseFindById {
  id: number;
  nome: string;
  branch: {
    ID: number;
  };
}
