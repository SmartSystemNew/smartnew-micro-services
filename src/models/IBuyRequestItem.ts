export default interface IBuyRequestItem {
  findById: {
    id: number;
    log_date: Date;
    quotationItem: {
      id: number;
      quantidade: number;
      valor: number;
      item: {
        id: number;
        material: {
          id: number;
          material: string;
        };
      };
    };
    status: {
      id: number;
      status: string;
      icone: string;
      finaliza: number;
      cancelado: number;
    };
    user: {
      login: string;
      name: string;
    };
  };
  listBuyRequest: {
    id: number;
    log_date: Date;
    quotationItem: {
      id: number;
      quantidade: number;
      valor: number;
      item: {
        id: number;
        material: {
          id: number;
          material: string;
        };
      };
    };
    status: {
      id: number;
      status: string;
      icone: string;
      finaliza: number;
      cancelado: number;
    };
    user: {
      login: string;
      name: string;
    };
  };
}
