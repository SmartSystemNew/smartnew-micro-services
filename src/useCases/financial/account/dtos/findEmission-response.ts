export interface findEmissionResponse {
  group: {
    id: number;
    dueDate: Date;
    payment: {
      id: number;
      provider: string;
      dueDate: Date;
      value: number;
    }[];
    bankId: number;
    // bank: {
    //   id: number;
    //   name: string;
    //   balance: number;
    // };
    pay: boolean;
  }[];
  withOut: {
    provider: string;
    dueDate: Date;
    value: number;
  }[];
}
