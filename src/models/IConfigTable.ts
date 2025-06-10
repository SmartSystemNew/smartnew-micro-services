import { Prisma } from '@prisma/client';

export default interface IConfigTable {
  listByUserOnly: {
    user: string | null;
    id: number;
    id_cliente: number;
    configuracao: Prisma.JsonValue;
    nome_tela: string;
    nome_tabela: string;
    log_user: string;
    log_date: Date;
  };
}
