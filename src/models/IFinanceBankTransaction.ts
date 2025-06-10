import { $Enums } from '@prisma/client';

export default interface IFinanceBankTransaction {
  listByClient: {
    id: number;
    id_banco: number;
    id_emissao: number;
    valor: number;
    data_lancamento: Date;
    tipo: $Enums.smartnewsystem_financeiro_banco_movimentacao_tipo;
    bank: {
      id: number;
      nome: string;
      agencia: number;
    };
  };
  listByBank: {
    id: number;
    id_banco: number;
    id_emissao: number;
    valor: number;
    data_lancamento: Date;
    tipo: $Enums.smartnewsystem_financeiro_banco_movimentacao_tipo;
    bank: {
      id: number;
      nome: string;
      agencia: number;
    };
  };
}
