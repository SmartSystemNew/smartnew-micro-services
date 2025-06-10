import { Decimal } from '@prisma/client/runtime/library';

export default interface ICustoDiversos {
  gridCustoDiversos: {
    id: number;
    id_ordem_servico: number;
    id_cliente: number;
    ID_filial: number;
    cliente: string;
    descricao_custo: string;
    unidade: string;
    quantidade: number;
    equipamento: string;
    familia_equipamento: string;
    tipo_equipamento: string;
    ordem: number;
    ordem_vinculada: number;
    fechada: string;
    data_custo: Date;
    mesano: string;
    valor_unitario: Decimal;
    custo_total: Decimal;
    observacoes: string;
    setor_executante: string;
    status: string;
  };
}
