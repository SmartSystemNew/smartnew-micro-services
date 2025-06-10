import { $Enums, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export default interface IMaterialBound {
  listByMaterialAndCode: {
    id: number;
    codigo: string;
    id_material: number;
    marca: string;
    classificacao: number;
    especificacao: string;
    id_cliente: number;
    estoque_max: Decimal;
    estoque_min: Decimal;
    material: {
      id: number;
      material: string;
    };
    smartnewsystem_material_estoque: {
      id: number;
      quantidade: number;
      id_material: number;
      status: number;
    }[];
  };
  listById: {
    id: number;
    codigo: string;
    marca: string | null;
    especificacao: string | null;
    classificacao: number | null;
    id_cliente: number;
    id_material: number;
    material: {
      id: number;
      codigo: string;
      material: string;
      unidade: string | null;
      id_categoria?: number;
      id_cliente: number;
      localizacao: string;
      observacao: string;
      ativo: number;
      estoque_min: Decimal;
      estoque_max: Decimal;
      tipo: $Enums.sofman_cad_materiais_tipo;
      codigo_ncm: number;
      codigo_secundario: string;
    };
    stockIn?: {
      id: number;
      numero_serie: string;
      quantidade: Decimal;
      valor_unitario: Decimal;
    }[];
    materialServiceOrder?: {
      id: number;
      codigo: string;
      quantidade: Decimal;
      valor_unidade: Decimal;
    }[];
  };
  listByClient: {
    id: number;
    codigo: string;
    marca: string | null;
    especificacao: string | null;
    classificacao: number | null;
    id_cliente: number;
    id_material: number;
    estoque_max: Decimal | null;
    estoque_min: Decimal | null;
    material: {
      id: number;
      codigo: string;
      material: string;
      unidade: string | null;
      localizacao: string;
      observacao: string;
      ativo: number;
      tipo: $Enums.sofman_cad_materiais_tipo;
      codigo_ncm: number;
      log_user: string | null;
      categoryMaterial: {
        id: number;
        descricao: string;
      } | null;
      branch: {
        ID: number;
        razao_social: string;
      } | null;
      location: {
        id: number;
        localizacao: string;
      } | null;
    };
    // stockIn?: {
    //   id: number;
    //   numero_serie: string;
    //   quantidade: Decimal;
    //   valor_unitario: Decimal;
    // }[];
    // materialServiceOrder?: {
    //   id: number;
    //   codigo: string;
    //   quantidade: Decimal;
    //   valor_unidade: Decimal;
    // }[];
  };

  listByTypeMaterial: {
    id: number;
    codigo: string;
    marca: string | null;
    especificacao: string | null;
    classificacao: number | null;
    id_cliente: number;
    id_material: number;
    estoque_max: Decimal | null;
    estoque_min: Decimal | null;
    material: {
      id: number;
      codigo: string;
      material: string;
      unidade: string | null;
      localizacao: string;
      observacao: string;
      ativo: number;
      tipo: $Enums.sofman_cad_materiais_tipo;
      codigo_ncm: number;
      log_user: string | null;
      categoryMaterial: {
        id: number;
        descricao: string;
      } | null;
      branch: {
        ID: number;
        razao_social: string;
      } | null;
    };
    // stockIn?: {
    //   id: number;
    //   numero_serie: string;
    //   quantidade: Decimal;
    //   valor_unitario: Decimal;
    // }[];
    // materialServiceOrder?: {
    //   id: number;
    //   codigo: string;
    //   quantidade: Decimal;
    //   valor_unidade: Decimal;
    // }[];
  };

  findByMaterial: {
    id: number;
    codigo: string;
    marca: string | null;
    especificacao: string | null;
    classificacao: number | null;
    id_cliente: number;
    id_material: number;
    material: {
      id: number;
      codigo: string;
      material: string;
      unidade: string | null;
      id_categoria?: number;
      id_cliente: number;
      localizacao: string;
      observacao: string;
      ativo: number;
      estoque_min: Decimal;
      estoque_max: Decimal;
      tipo: $Enums.sofman_cad_materiais_tipo;
      codigo_ncm: number;
      codigo_secundario: string;
    };
    stockIn?: {
      id: number;
      numero_serie: string;
      quantidade: Decimal;
      valor_unitario: Decimal;
    }[];
    materialServiceOrder?: {
      id: number;
      codigo: string;
      quantidade: Decimal;
      valor_unidade: Decimal;
    }[];
  };
  listForReportStockByClient: {
    id: number;
    id_cliente: number;
    codigo?: string;
    marca?: string;
    especificacao?: string;
    classificacao?: number;
    material: {
      id: number;
      material: string;
      unidade: string | null;
      ativo: number;
      valor: Prisma.Decimal;
      Valor_venda: Prisma.Decimal;
      fator: Prisma.Decimal;
      estoque_min?: Prisma.Decimal;
      estoque_max?: Prisma.Decimal;
      estoque_real: Prisma.Decimal;
      localizacao?: string;
      log_date: Date;
      log_user?: string;
      sessao_id?: string;
      DataEstoqueMin?: Date;
      id_categoria?: number;
      categoryMaterial: {
        id: number;
        descricao: string;
      };
      company: {
        ID: number;
        razao_social: string;
      };
    };
    stockIn?: {
      id: number;
      numero_serie: string;
      quantidade: Decimal;
      data_entrada: Date | null;
      valor_unitario: Decimal;
    }[];
    materialServiceOrder?: {
      id: number;
      codigo: string;
      data_uso: Date | null;
      valor_unidade: Decimal;
      quantidade: Decimal;
    }[];
  };
}
