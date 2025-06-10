import { $Enums } from '@prisma/client';

export default interface IFinanceBank {
  listByClient: {
    id: number;
    id_cliente: number;
    nome: string;
    //dono: number;
    numero_conta: number;
    digito: number;
    agencia: number;
    digito_agencia: number;
    saldo: number;
    negativo: number;
    status: $Enums.smartnewsystem_financeiro_bancos_status;
  };
  findById: {
    id: number;
    id_cliente: number;
    nome: string;
    //dono: number;
    numero_conta: number;
    digito: number;
    agencia: number;
    digito_agencia: number;
    saldo: number;
    negativo: number;
    status: $Enums.smartnewsystem_financeiro_bancos_status;
  };
}
