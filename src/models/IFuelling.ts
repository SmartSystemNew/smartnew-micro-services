import { Decimal } from '@prisma/client/runtime/library';

export interface IFuelling {
  listByBranches: {
    id: number;
    numero_nota_fiscal: string | null;
    numero_requisicao: string | null;
    data_abastecimento: Date;
    valorUN: Decimal;
    quantidade: Decimal;
    observacoes: string | null;
    tipo: string;
    contadorAtual: number | null;
    contadorAnterior: number | null;
    consumo_realizado: Decimal | null;
    hodometro_anterior: number | null;
    hodometro_tanque: number | null;
    branch: {
      ID: number;
      filial_numero: string | null;
    };
    equipment: {
      ID: number;
      equipamento_codigo: string | null;
      descricao: string | null;
      consumo_previsto: Decimal | null;
      tipo_consumo: string;
      typeEquipment: {
        ID: number;
        tipo_equipamento: string;
      } | null;
      family: {
        ID: number;
        familia: string;
      };
    };
    driver: {
      login: string;
      name: string;
    } | null;
    supplier: {
      login: string;
      name: string;
    } | null;
    user: {
      login: string;
      name: string;
    };
    fuelStation: {
      id: number;
      descricao: string;
    } | null;
    provider: {
      ID: number;
      nome_fantasia: string;
    } | null;
    fuel: {
      id: number;
      descricao: string;
    };
    tank: {
      id_tanque: number;
      tanque: string;
      modelo: string;
    } | null;
    tankFuelling: {
      id: number;
      fuel: {
        id: number;
        descricao: string;
      };
      capacidade: number;
    } | null;
    train: {
      id: number;
      tag: string;
      placa: string;
    } | null;
    trainFuelling: {
      id: number;
      capacidade: number;
      fuel: {
        id: number;
        descricao: string;
      };
    } | null;
  };
  listByEquipmentInBranches: {
    id: number;
    numero_nota_fiscal: string | null;
    numero_requisicao: string | null;
    data_abastecimento: Date;
    valorUN: Decimal;
    quantidade: Decimal;
    observacoes: string | null;
    tipo: string;
    contadorAtual: number | null;
    contadorAnterior: number | null;
    consumo_realizado: Decimal | null;
    hodometro_anterior: number | null;
    hodometro_tanque: number | null;
    branch: {
      ID: number;
      filial_numero: string | null;
    };
    equipment: {
      ID: number;
      equipamento_codigo: string | null;
      descricao: string | null;
      consumo_previsto: Decimal | null;
      tipo_consumo: string;
      typeEquipment: {
        ID: number;
        tipo_equipamento: string;
      } | null;
      family: {
        ID: number;
        familia: string;
      };
    };
    driver: {
      login: string;
      name: string;
    } | null;
    supplier: {
      login: string;
      name: string;
    } | null;
    user: {
      login: string;
      name: string;
    };
    fuelStation: {
      id: number;
      descricao: string;
    } | null;
    provider: {
      ID: number;
      nome_fantasia: string;
    } | null;
    fuel: {
      id: number;
      descricao: string;
    };
    tank: {
      id_tanque: number;
      tanque: string;
      modelo: string;
    } | null;
    tankFuelling: {
      id: number;
      fuel: {
        id: number;
        descricao: string;
      };
      capacidade: number;
    } | null;
    train: {
      id: number;
      tag: string;
      placa: string;
    } | null;
    trainFuelling: {
      id: number;
      capacidade: number;
      fuel: {
        id: number;
        descricao: string;
      };
    } | null;
  };
  listByFilter: {
    id: number;
    numero_nota_fiscal: string | null;
    numero_requisicao: string | null;
    data_abastecimento: Date;
    valorUN: Decimal;
    quantidade: Decimal;
    observacoes: string | null;
    tipo: string;
    contadorAtual: number | null;
    contadorAnterior: number | null;
    consumo_realizado: Decimal | null;
    hodometro_anterior: number | null;
    hodometro_tanque: number | null;
    branch: {
      ID: number;
      filial_numero: string | null;
    };
    equipment: {
      ID: number;
      equipamento_codigo: string | null;
      descricao: string | null;
      consumo_previsto: Decimal | null;
      tipo_consumo: string;
      typeEquipment: {
        ID: number;
        tipo_equipamento: string;
      } | null;
      family: {
        ID: number;
        familia: string;
      };
    };
    driver: {
      login: string;
      name: string;
    } | null;
    supplier: {
      login: string;
      name: string;
    } | null;
    user: {
      login: string;
      name: string;
    };
    fuelStation: {
      id: number;
      descricao: string;
    } | null;
    provider: {
      ID: number;
      nome_fantasia: string;
    } | null;
    fuel: {
      id: number;
      descricao: string;
    };
    tank: {
      id_tanque: number;
      tanque: string;
      modelo: string;
    } | null;
    tankFuelling: {
      id: number;
      fuel: {
        id: number;
        descricao: string;
      };
      capacidade: number;
    } | null;
    train: {
      id: number;
      tag: string;
      placa: string;
    } | null;
    trainFuelling: {
      id: number;
      capacidade: number;
      fuel: {
        id: number;
        descricao: string;
      };
    } | null;
  };
  findById: {
    id: number;
    numero_nota_fiscal: string;
    numero_requisicao: string;
    data_abastecimento: Date;
    valorUN: Decimal;
    quantidade: Decimal;
    observacoes: string;
    tipo: string;
    contadorAtual: number | null;
    contadorAnterior: number | null;
    consumo_realizado: Decimal | null;
    hodometro_anterior: number | null;
    hodometro_tanque: number | null;
    id_compartimento_comboio: number | null;
    id_compartimento_tanque: number | null;
    train: {
      id: number;
      tag: string;
      placa: string;
    } | null;
    trainFuelling: {
      id: number;
      capacidade: number;
      fuel: {
        id: number;
        descricao: string;
      };
    } | null;
    tank: {
      id_tanque: number;
      tanque: string;
      modelo: string;
    } | null;
    tankFuelling: {
      id: number;
      capacidade: number;
      fuel: {
        id: number;
        descricao: string;
      };
    } | null;
    user: {
      login: string;
      name: string;
    } | null;
    driver: {
      login: string;
      name: string;
    } | null;
    supplier: {
      login: string;
      name: string;
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
    } | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
      tipo_consumo: string;
    } | null;
    fuelStation: {
      id: number;
      descricao: string;
    } | null;
    provider: {
      ID: number;
      nome_fantasia: string;
    } | null;
    fuel: {
      id: number;
      descricao: string;
    };
  };
  listByEquipmentAndDriver: {
    id: number;
    numero_nota_fiscal: string;
    numero_requisicao: string;
    data_abastecimento: Date;
    valorUN: Decimal;
    quantidade: Decimal;
    observacoes: string;
    tipo: string;
    contadorAtual: number | null;
    contadorAnterior: number | null;
    consumo_realizado: Decimal | null;
    hodometro_anterior: number | null;
    hodometro_tanque: number | null;
    driver: {
      login: string;
      name: string;
    } | null;
    supplier: {
      login: string;
      name: string;
    } | null;
    user: {
      login: string;
      name: string;
    } | null;
    train: {
      id: number;
      tag: string;
      placa: string | null;
    } | null;
    trainFuelling: {
      id: number;
      fuel: {
        id: number;
        descricao: string;
      };
    } | null;
    tank: {
      id_tanque: number;
      tanque: string;
      modelo: string;
    } | null;
    tankFuelling: {
      id: number;
      fuel: {
        id: number;
        descricao: string;
      };
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
      company: {
        ID: number;
        razao_social: string;
      };
    } | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    } | null;
    fuelStation: {
      id: number;
      descricao: string;
    } | null;
    provider: {
      ID: number;
      nome_fantasia: string;
    } | null;
    fuel: {
      id: number;
      descricao: string;
    };
  };
  listByEquipmentAndSupplier: {
    id: number;
    numero_nota_fiscal: string;
    numero_requisicao: string;
    data_abastecimento: Date;
    valorUN: Decimal;
    quantidade: Decimal;
    observacoes: string;
    tipo: string;
    contadorAtual: number | null;
    contadorAnterior: number | null;
    consumo_realizado: Decimal | null;
    hodometro_anterior: number | null;
    hodometro_tanque: number | null;
    driver: {
      login: string;
      name: string;
    } | null;
    supplier: {
      login: string;
      name: string;
    } | null;
    user: {
      login: string;
      name: string;
    } | null;
    train: {
      id: number;
      tag: string;
      placa: string | null;
    } | null;
    trainFuelling: {
      id: number;
      fuel: {
        id: number;
        descricao: string;
      };
    } | null;
    tank: {
      id_tanque: number;
      tanque: string;
      modelo: string;
    } | null;
    tankFuelling: {
      id: number;
      fuel: {
        id: number;
        descricao: string;
      };
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
      company: {
        ID: number;
        razao_social: string;
      };
    } | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    } | null;
    fuelStation: {
      id: number;
      descricao: string;
    } | null;
    provider: {
      ID: number;
      nome_fantasia: string;
    } | null;
    fuel: {
      id: number;
      descricao: string;
    };
  };
}
