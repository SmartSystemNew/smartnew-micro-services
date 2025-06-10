export interface IProductionRegisterListByClient {
  id: number;
  data_hora_inicio: Date;
  data_hora_encerramento: Date;
  status: number;
  equipment: {
    ID: number;
    equipamento_codigo: string;
    descricao: string;
  };
  period: {
    turno: string;
  };
  user: {
    login: string;
    name: string;
  };
}
