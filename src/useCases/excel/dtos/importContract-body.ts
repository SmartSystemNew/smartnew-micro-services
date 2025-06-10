export class ImportContractBody {
  clientId: number;
  contrato: number;
  sync: string | null;
  filial: string;
  fornecedor: string;
  'tipo contrato': string;
  'data inicial': Date;
  'data final': Date;
  observacao: string | null;
  children: {
    contrato: number;
    tipo: string;
    insumo: string;
    escopo: string | null;
    equipamento: string | null;
    unidade: string;
    preco: number;
    quantidade: number;
  }[];
}
