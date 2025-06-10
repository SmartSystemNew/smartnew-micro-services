export interface IBuyPriority {
  listByClient: {
    id: number;
    name: string;
    prazo: number;
  };
  findById: {
    id: number;
    name: string;
    prazo: number;
  };
}
