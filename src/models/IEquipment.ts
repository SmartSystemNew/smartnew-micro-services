import { Decimal } from '@prisma/client/runtime/library';

export interface IEquipment {
  create: {
    ID: number;
    ID_filial: number;
  };
  findByClientAndCode: {
    ID: number;
    ID_filial: number;
    equipamento_codigo: string;
    tag_vinculada: number | null;
    descricao: string;
    n_serie: string;
    garantia: string;
    data_compra: Date | null;
    observacoes: string;
    status_equipamento: string;
    chassi: string;
    placa: string;
    ano_fabricacao: Date | null;
    ano_modelo: Date | null;
    n_nota_fiscal: string | null;
    valor_aquisicao: Decimal | null;
    //imagem: Buffer | null;
    n_patrimonio: string | null;
    n_ct_finame: string | null;
    numero_crv: string | null;
    marca: string | null;
    modelo: string | null;
    fabricante: string | null;
    custo_hora: string | null;
    tipo_consumo: string | null;
    consumo_previsto: Decimal | null;
    limite_dia_unidade_medida: number | null;
    proprietario: string | null;
    cor: string | null;
    codigo_renavam: string | null;
    data_emisao_crv: Date | null;
    licenciamento: string | null;
    apolice_seguro: string | null;
    vencimento_apolice_seguro: Date | null;
    frota: string | null;
    ficha_tecnica: string | null;
    id_unidade_medida: number;
    branch: {
      ID: number;
      filial_numero: string;
      cnpj: string;
    };
    unityPlans: {
      id: number;
      unidade: string | null;
    } | null;
  };
  findByOrderAndEquipment: {
    ID: number;
    ID_familia: number;
    equipamento_codigo: string;
    descricao: string;
    status_equipamento: string;
    observacoes: string;
    marca: string;
    modelo: string;
    fabricante: string;
    custo_hora: string;
    tipo_consumo: string;
    proprietario: string;
    cor: string;
    ficha_tecnica: string;
    orderService: {
      ID: number;
      id_equipamento: number;
      ordem: string;
      equipamento: string;
      tipo_manutencao: number;
      tipo_equipamento: string;
      data_equipamento_funcionou: Date;
      data_equipamento_parou: Date;
      data_hora_encerramento: Date;
      data_inicio: Date;
      status_os: number;
      statusOrderService: {
        id: number;
        status: string;
        cor: string;
      };
    }[];
  };
  findByClientAndName: {
    ID: number;
    equipamento_codigo: string;
    descricao: string;
  };
  listByBranch: {
    ID: number;
    equipamento_codigo: string;
    descricao: string;
    n_serie: string;
    garantia: string;
    data_compra: Date | null;
    observacoes: string;
    status_equipamento: string;
    chassi: string;
    placa: string;
    ano_fabricacao: Date | null;
    ano_modelo: Date | null;
    n_nota_fiscal: string | null;
    valor_aquisicao: Decimal | null;
    //imagem: Buffer | null;
    tipo_consumo: string | null;
    branch: {
      ID: number;
      filial_numero: string | null;
    };
    costCenter: {
      ID: number;
      centro_custo: string;
      descricao: string;
    } | null;
    descriptionPlanMaintenance: {
      id: number;
    }[];
    fuelling: {
      id: number;
      quantidade: Decimal;
      contadorAtual: number | null;
    }[];
    family: {
      ID: number;
      familia: string;
    };
    typeEquipment: {
      ID: number;
      tipo_equipamento: string;
    } | null;
  };
  listFamily: {
    ID: number;
    equipamento_codigo: string;
    descricao: string;
    n_serie: string;
    garantia: string;
    data_compra: Date | null;
    observacoes: string;
    status_equipamento: string;
    chassi: string;
    placa: string;
    ano_fabricacao: Date | null;
    ano_modelo: Date | null;
    n_nota_fiscal: string | null;
    valor_aquisicao: Decimal | null;
    //imagem: Buffer | null;
    tipo_consumo: string | null;
    branch: {
      ID: number;
      filial_numero: string | null;
    };
    costCenter: {
      ID: number;
      centro_custo: string;
      descricao: string;
    } | null;
    fuelling: {
      id: number;
      quantidade: Decimal;
      contadorAtual: number | null;
    }[];
    family: {
      ID: number;
      familia: string;
    };
    typeEquipment: {
      ID: number;
      tipo_equipamento: string;
    } | null;
  };
  findByBranchAndCode: {
    ID: number;
    equipamento_codigo: string;
    descricao: string;
    branch: {
      ID: number;
      filial_numero: string;
    };
  };
  findById: {
    ID: number;
    equipamento_codigo: string;
    tag_vinculada: number | null;
    descricao: string;
    n_serie: string;
    garantia: string;
    data_compra: Date | null;
    observacoes: string;
    status_equipamento: string;
    chassi: string;
    placa: string;
    ano_fabricacao: Date | null;
    ano_modelo: Date | null;
    n_nota_fiscal: string | null;
    valor_aquisicao: Decimal | null;
    // imagem: Buffer | null;
    n_patrimonio: string | null;
    n_ct_finame: string | null;
    numero_crv: string | null;
    marca: string | null;
    modelo: string | null;
    fabricante: string | null;
    custo_hora: string | null;
    tipo_consumo: string | null;
    consumo_previsto: Decimal | null;
    limite_dia_unidade_medida: number | null;
    proprietario: string | null;
    cor: string | null;
    codigo_renavam: string | null;
    data_emisao_crv: Date | null;
    licenciamento: string | null;
    apolice_seguro: string | null;
    vencimento_apolice_seguro: Date | null;
    frota: string | null;
    ficha_tecnica: string | null;
    company: {
      ID: number;
      nome_fantasia: string | null;
      cnpj: string | null;
    } | null;
    branch: {
      ID: number;
      filial_numero: string | null;
    };
    costCenter: {
      ID: number;
      centro_custo: string;
      descricao: string;
    } | null;
    family: {
      ID: number;
      familia: string;
    };
    typeEquipment: {
      ID: number;
      tipo_equipamento: string;
    } | null;
    unityPlans: {
      id: number;
      unidade: string | null;
    } | null;
  };
  getDataUnitMetricFromPlan: {
    id: number;
    code: string;
    idBranch: number;
    idUnitMetric: number;
    unitType: string;
  };
  listEquipmentWithProspectScale: {
    ID: number;
    equipamento_codigo: string;
    descricao: string;
    prospectScale: {
      id: number;
      data_programada: Date;
      inicio: Date;
      termino: Date;
    }[];
  };
}
