export interface IMaterialStockWithDrawal {
  listWithdrawal: {
    id: number;
    id_cliente: number;
    id_filial: number;
    id_material: number;
    id_item: number;
    id_material_secondario: number;
    quantidade: number;
    log_date: Date;
    status: number | null;
    responsavel: string;
    url: string;
    branch: {
      ID: number;
      filial_numero: string;
    };
    material: {
      material: string;
      unidade: string;
      codigo_secundario: string;
      codigo_ncm: number;
    };
    itemBuy: {
      estoque: number;
      quantidade: number;
      buy: {
        id: number;
        numero: number;
      };
      compositionItem: {
        composicao: string;
        descricao: string;
        compositionGroup: {
          composicao: string;
          descricao: string;
          costCenter: {
            centro_custo: string;
            descricao: string;
          };
        };
      };
    };
    materialCodigo: {
      classificacao: number;
      codigo: string;
      especificacao: string;
      marca: string;
    };
  };
}
