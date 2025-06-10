import { Decimal } from '@prisma/client/runtime/library';

export default interface ILogMaterialServiceOrder {
  listLogMaterialOrder: {
    id: number;
    id_app: string;
    id_material_servico: number | null;
    acao: string;
    id_ordem_servico: number;
    material: number;
    quantidade: Decimal;
    valor_total: Decimal;
    valor_unidade: Decimal;
    data_uso: Date;
    n_serie_novo: string;
    n_serie_antigo: string;
    log_date: Date;
  };
}
