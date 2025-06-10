import { Decimal } from '@prisma/client/runtime/library';

export default interface ILogTaskServiceOrder {
  listByBranch: {
    id: number;
    id_app: string;
    acao: string;
    id_ordem_servico: number;
    id_tarefa_servico: number;
    tarefa: number;
    status_tarefa: string;
    taskServiceOrder: {
      id: number;
      id_unidade_medida: number | null;
      periodicidade_uso: Decimal | null;
      observacao: string | null;
      registerHour: {
        id: number;
        inicio: Date;
        fim: Date;
      }[];
    };
  };
}
