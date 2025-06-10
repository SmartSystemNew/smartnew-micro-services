import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export default interface IServiceOrder {
  listByClient: {
    ID: number;
    id_app: string;
    ordem: string;
    ordem_vinculada: string;
    descricao_solicitacao: string;
    descricao_servico_realizado: string;
    observacoes: string;
    observacoes_executante: string;
    retorno_checklist: string;
    localizacao: string;
    observacoes_cliente: string;
    data_inicio: Date;
    data_hora_solicitacao: Date;
    data_prevista_termino: Date;
    data_hora_encerramento: Date;
    data_equipamento_parou: Date;
    data_acionamento_tecnico: Date;
    data_equipamento_funcionou: Date;
    log_date: Date;
    fechada: string;
    solicitante: string;
    id_solicitante: number;
    emissor: string;
    maquina_parada: number;
    chegada_tecnico: Date;
    mantenedores: string | null;
    equipment: {
      ID: number;
      modelo: string;
      localizacao: string;
      equipamento_codigo: string;
      descricao: string;
      family: {
        familia: string;
      };
      // classification: {
      //   descricao: string;
      // } | null;
      building: {
        predio: string;
      } | null;
      sector: {
        setor: string;
      } | null;
      department: {
        departamento: string;
      } | null;
      criticalityEquipment: {
        descricao: string;
      } | null;
    };
    sectorExecutor: {
      descricao: string;
    } | null;
    classOrderService: {
      descricao: string;
    } | null;
    priorityOrderService: {
      descricao: string;
    } | null;
    failureCause: {
      descricao: string;
    } | null;
    statusOrderService: {
      status: string;
    } | null;
    typeMaintenance: {
      tipo_manutencao: string;
    } | null;
    building: {
      predio: string;
    } | null;
    sector: {
      setor: string;
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    } | null;
    costCenter: {
      centro_custo: string;
      descricao: string;
    } | null;
    department: {
      departamento: string;
    } | null;
    requester: {
      id: number;
      nome: string;
    } | null;
  };
  listByMaintenairs: {
    ID: number;
    ordem: string;
    ordem_vinculada: string;
    descricao_solicitacao: string;
    descricao_servico_realizado: string;
    observacoes: string;
    observacoes_executante: string;
    retorno_checklist: string;
    localizacao: string;
    observacoes_cliente: string;
    data_inicio: Date;
    data_hora_solicitacao: Date;
    data_prevista_termino: Date;
    data_hora_encerramento: Date;
    data_equipamento_parou: Date;
    data_acionamento_tecnico: Date;
    data_equipamento_funcionou: Date;
    log_date: Date;
    fechada: string;
    solicitante: string;
    id_solicitante: number;
    emissor: string;
    maquina_parada: number;
    chegada_tecnico: Date;
    equipment: {
      ID: number;
      modelo: string;
      localizacao: string;
      equipamento_codigo: string;
      descricao: string;
      family: {
        familia: string;
      };
      building: {
        predio: string;
      } | null;
      sector: {
        setor: string;
      } | null;
      department: {
        departamento: string;
      } | null;
      criticalityEquipment: {
        descricao: string;
      } | null;
    };
    sectorExecutor: {
      descricao: string;
    } | null;
    // classOrderService: {
    //   descricao: string;
    // } | null;
    priorityOrderService: {
      descricao: string;
    } | null;
    failureCause: {
      descricao: string;
    } | null;
    statusOrderService: {
      status: string;
    } | null;
    typeMaintenance: {
      tipo_manutencao: string;
    } | null;
    building: {
      predio: string;
    } | null;
    sector: {
      setor: string;
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    } | null;
    costCenter: {
      centro_custo: string;
      descricao: string;
    } | null;
    department: {
      departamento: string;
    } | null;
    requester: {
      id: number;
      nome: string;
    } | null;
  };
  listByWhere: {
    ID: number;
    ordem: string;
    ordem_vinculada: string;
    descricao_solicitacao: string;
    descricao_servico_realizado: string;
    observacoes: string;
    observacoes_executante: string;
    retorno_checklist: string;
    localizacao: string;
    observacoes_cliente: string;
    data_inicio: Date;
    data_hora_solicitacao: Date;
    data_prevista_termino: Date;
    data_hora_encerramento: Date;
    data_equipamento_parou: Date;
    data_acionamento_tecnico: Date;
    data_equipamento_funcionou: Date;
    log_date: Date;
    fechada: string;
    solicitante: string;
    id_solicitante: number;
    emissor: string;
    maquina_parada: number;
    chegada_tecnico: Date;
    status_execucao: number | null;
    equipment: {
      ID: number;
      modelo: string;
      localizacao: string;
      equipamento_codigo: string;
      descricao: string;
      family: {
        familia: string;
      };
      typeEquipment: {
        tipo_equipamento: string;
      } | null;
      classification: {
        descricao: string;
      } | null;
      building: {
        predio: string;
      } | null;
      sector: {
        setor: string;
      } | null;
      department: {
        departamento: string;
      } | null;
      criticalityEquipment: {
        descricao: string;
      } | null;
    };
    sectorExecutor: {
      descricao: string;
    } | null;
    // classOrderService: {
    //   descricao: string;
    // } | null;
    priorityOrderService: {
      descricao: string;
    } | null;
    failureCause: {
      descricao: string;
    } | null;
    statusOrderService: {
      status: string;
    } | null;
    typeMaintenance: {
      tipo_manutencao: string;
    } | null;
    building: {
      predio: string;
    } | null;
    sector: {
      setor: string;
    } | null;
    company: {
      ID: number;
      razao_social: string;
    };
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    } | null;
    costCenter: {
      centro_custo: string;
      descricao: string;
    } | null;
    department: {
      departamento: string;
    } | null;
    requester: {
      id: number;
      nome: string;
    } | null;
  };
  findByWhere: {
    ID: number;
    ordem: string;
    ordem_vinculada: string;
    descricao_solicitacao: string;
    descricao_servico_realizado: string;
    observacoes: string;
    observacoes_executante: string;
    retorno_checklist: string;
    localizacao: string;
    observacoes_cliente: string;
    data_inicio: Date;
    data_hora_solicitacao: Date;
    data_prevista_termino: Date;
    data_hora_encerramento: Date;
    data_equipamento_parou: Date;
    data_acionamento_tecnico: Date;
    data_equipamento_funcionou: Date;
    log_date: Date;
    fechada: string;
    solicitante: string;
    id_solicitante: number;
    emissor: string;
    maquina_parada: number;
    chegada_tecnico: Date;
    status_execucao: number | null;
    equipment: {
      ID: number;
      modelo: string;
      localizacao: string;
      equipamento_codigo: string;
      descricao: string;
      family: {
        familia: string;
      };
      typeEquipment: {
        tipo_equipamento: string;
      } | null;
      classification: {
        descricao: string;
      } | null;
      building: {
        predio: string;
      } | null;
      sector: {
        setor: string;
      } | null;
      department: {
        departamento: string;
      } | null;
      criticalityEquipment: {
        descricao: string;
      } | null;
    };
    sectorExecutor: {
      descricao: string;
    } | null;
    // classOrderService: {
    //   descricao: string;
    // } | null;
    priorityOrderService: {
      descricao: string;
    } | null;
    failureCause: {
      descricao: string;
    } | null;
    statusOrderService: {
      status: string;
    } | null;
    typeMaintenance: {
      tipo_manutencao: string;
    } | null;
    building: {
      predio: string;
    } | null;
    sector: {
      setor: string;
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    } | null;
    company: {
      ID: number;
      razao_social: string;
    };
    costCenter: {
      centro_custo: string;
      descricao: string;
    } | null;
    department: {
      departamento: string;
    } | null;
    requester: {
      id: number;
      nome: string;
    } | null;
  };
  graficPerformanceIndicatorsKPIS: {
    Familia: string;
    DF: number;
    MTBF: number;
    MTTR: number;
    Paradas: number;
    tempo_corretiva: number;
    tempo_prev: number;
  };
  findById: {
    ID: number;
    ID_cliente: number;
    ID_filial: number;
    ordem: string;
    hh_previsto: Prisma.Decimal;
    horimetro: Prisma.Decimal;
    odometro: Prisma.Decimal;
    log_date: Date;
    descricao_solicitacao: string;
    observacoes: string;
    descricao_servico_realizado: string;
    observacoes_executante: string;
    ordem_vinculada: string;
    maquina_parada: number;
    solicitante: string;
    id_solicitante: number;
    servico_pendente: string;
    possui_anexo: string;
    data_hora_solicitacao: Date;
    data_equipamento_parou: Date;
    data_prevista_termino: Date;
    data_equipamento_funcionou: Date;
    status_os: number;
    id_ordem_pai: number;
    mantenedores: string;
    data_acionamento_tecnico: Date | null;
    chegada_tecnico: Date | null;
    nota_avalicao_servico: number | null;
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    };
    company: {
      ID: number;
      razao_social: string;
    };
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
      n_serie: string;
    };
    materialServiceOrder: {
      id: number;
      quantidade: Decimal;
      valor_unidade: Decimal;
      materials: {
        id: number;
        material: string;
      };
      materialCodigo: {
        id: number;
      };
    }[];
    maintainers: {
      id: number;
      id_colaborador: number;
    }[];
    justifyStatus: {
      id: number;
      login: string;
      id_ordem_servico: number;
      id_status_antigo: number;
      status_old_service_order: {
        cor: string;
        cor_font: string;
        status: string;
      };
      id_status_novo: number;
      status_new_service_order: {
        cor: string;
        cor_font: string;
        status: string;
      };
      justificativa: string;

      log_date: Date;
    }[];
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    sectorExecutor: {
      Id: number;
      descricao: string;
    };
    priorityOrderService: {
      id: number;
      descricao: string;
    } | null;
    classOrderService: {
      id: number;
      descricao: string;
    } | null;
  };
  findByIdAndRequest: {
    ID: number;
    ID_cliente: number;
    ID_filial: number;
    ordem: string;
    hh_previsto: Prisma.Decimal;
    horimetro: Prisma.Decimal;
    odometro: Prisma.Decimal;
    log_date: Date;
    log_date_timestamp: number;
    descricao_solicitacao: string;
    observacoes: string;
    descricao_servico_realizado: string;
    observacoes_executante: string;
    ordem_vinculada: string;
    maquina_parada: number;
    solicitante: string;
    id_solicitante: number;
    servico_pendente: string;
    possui_anexo: string;
    data_hora_solicitacao: Date;
    data_hora_solicitacao_timestamp: number;
    data_equipamento_parou: Date;
    data_prevista_termino: Date;
    data_equipamento_funcionou: Date;
    status_os: number;
    id_ordem_pai: number;
    mantenedores: string;
    data_acionamento_tecnico: Date | null;
    chegada_tecnico: Date | null;
    nota_avalicao_servico: number | null;
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    };
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
      n_serie: string;
    };
    materialServiceOrder: {
      id: number;
      materials: {
        id: number;
        material: string;
      };
      materialCodigo: {
        id: number;
      };
    }[];
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    sectorExecutor: {
      Id: number;
      descricao: string;
    };
    priorityOrderService: {
      id: number;
      descricao: string;
    } | null;
    classOrderService: {
      id: number;
      descricao: string;
    } | null;
  };
  listByBranch: {
    ID: number;
    ordem: string;
    descricao_solicitacao: string;
    log_date: Date;
    mantenedores: string;
    data_hora_solicitacao: Date;
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    data_hora_encerramento: Date;
    maintainers: {
      id: number;
      collaborator: {
        id: number;
        nome: string;
      };
    }[];
    equipment: {
      descricao: string;
      ID: number;
      equipamento_codigo: string;
    };
  };
  listServiceOrder: {
    ID: number;
    ordem: string;
    descricao_solicitacao: string;
    data_hora_solicitacao: Date;
    data_hora_solicitacao_timestamp: number;
    data_prevista_termino: Date;
    data_hora_encerramento: Date;
    log_date: Date;
    log_date_timestamp: number;
    solicitante: string;
    id_solicitante: number;
    id_planejamento_manutencao: number | null;
    emissor: string;
    fechada: string;
    maquina_parada: number | null;
    localizacao: string | null;
    observacoes: string | null;
    observacoes_cliente: string | null;
    observacoes_executante: string | null;
    nota_avalicao_servico: number | null;
    data_equipamento_parou: Date | null;
    data_equipamento_funcionou: Date | null;
    data_acionamento_tecnico: Date | null;
    chegada_tecnico: Date | null;
    orderService: {
      ID: number;
      ordem: string;
      descricao_solicitacao: string;
    } | null;
    equipment: {
      equipamento_codigo: string;
      descricao: string;
      family: {
        ID: number;
        familia: string;
      };
      typeEquipment: {
        ID: number;
        tipo_equipamento: string;
      } | null;
    };
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    statusOrderService: {
      id: number;
      status: string;
      cor: string | null;
      finalizacao: number;
      requer_justificativa: string;
    };
    justifyStatus: {
      id: number;
      login: string;
      id_ordem_servico: number;
      id_status_antigo: number;
      status_old_service_order: {
        cor: string;
        cor_font: string;
        status: string;
      };
      id_status_novo: number;
      status_new_service_order: {
        cor: string;
        cor_font: string;
        status: string;
      };
      justificativa: string;

      log_date: Date;
    }[];
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    };
    requester: {
      id: number;
      nome: string;
    } | null;
    note: {
      id: number;
      data_hora_inicio: Date;
      data_hora_termino: Date | null;
      employee: {
        id: number;
        valor_hora: number;
        nome: string;
      };
    }[];
    noteStop: {
      id: number;
      data_hora_start: Date;
      data_hora_stop: Date | null;
    }[];
    failureAnalysis: {
      id: number;
      failureCause: {
        id: number;
        descricao: string;
      } | null;
      failureAction: {
        id: number;
        descricao: string;
      } | null;
    }[];
    materialServiceOrder: {
      id: number;
      quantidade: Decimal;
      valor_unidade: Decimal;
    }[];
    maintainers: {
      id: number;
      collaborator: {
        id: number;
        nome: string;
      };
    }[];
  };
  listServiceOrderByKanban: {
    ID: number;
    ordem: string;
    data_hora_solicitacao: Date;
    log_date: Date;
    descricao_solicitacao: string;
    data_prevista_termino: Date;
    branch: {
      ID: number;
      filial_numero: string;
    };
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
      family: {
        ID: number;
        familia: string;
      };
      typeEquipment: {
        ID: number;
        tipo_equipamento: string;
      } | null;
    };
    statusOrderService: {
      id: number;
      status: string;
      cor: string;
    };
  };
  listForStatusTable: {
    ID: number;
    data_prevista_termino: Date | null;
    data_hora_encerramento: Date | null;
  };
  listPositionMaterial: {
    ID: number;
    ordem: string;
    descricao_solicitacao: string;
    data_hora_solicitacao: Date;
    data_hora_solicitacao_timestamp: number;
    data_prevista_termino: Date;
    data_hora_encerramento: Date;
    log_date: Date;
    log_date_timestamp: number;
    solicitante: string;
    id_solicitante: number;
    emissor: string;
    fechada: string;
    maquina_parada: number | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    };
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    };
    materialServiceOrder: {
      materials: {
        id: number;
        id_filial: number;
        codigo?: string;
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
        stockIn?: {
          id: number;
          numero_serie: string;
        }[];
      };
    }[];
  };
  listOrdensMaintainer: {
    ID: number;
    ordem: string;
    descricao_solicitacao: string;
    data_hora_solicitacao: Date;
    data_hora_solicitacao_timestamp: number;
    data_prevista_termino: Date;
    data_hora_encerramento: Date;
    log_date: Date;
    log_date_timestamp: number;
    solicitante: string;
    id_solicitante: number;
    emissor: string;
    fechada: string;
    maquina_parada: number | null;
    equipment: {
      equipamento_codigo: string;
      descricao: string;
    };
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    statusOrderService: {
      id: number;
      status: string;
      cor: string | null;
      finalizacao: number;
      requer_justificativa: string;
    };
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    };
    taskServiceOrder: {
      id: number;
      registerHour: {
        id: number;
        inicio: Date | null;
        fim: Date | null;
      }[];
    }[];
  };
  listOrdersCalendarTypeMaintenance: {
    ID: number;
    ordem: string;
    data_hora_solicitacao: Date;
    data_hora_solicitacao_timestamp: number;
    data_hora_encerramento: Date;
    log_date: Date;
    log_date_timestamp: number;
    statusOrderService: {
      id: number;
      status: string;
      cor: string;
    };
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    };
  };

  listOrdersCalendar: {
    ID: number;
    ordem: string;
    equipamento: string;
    data_inicio: Date;
    log_date: Date;
    data_hora_encerramento: Date;
    statusOrderService: {
      id: number;
      status: string;
      cor: string | null;
    };
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
  };
  listServiceOrderWithFilter: {
    ID: number;
    ordem: string;
    descricao_solicitacao: string;
    data_hora_solicitacao: Date;
    data_hora_solicitacao_timestamp: number;
    data_prevista_termino: Date;
    data_hora_encerramento: Date;
    log_date: Date;
    log_date_timestamp: number;
    solicitante: string;
    id_solicitante: number;
    emissor: string;
    fechada: string;
    maquina_parada: number | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    };
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    sectorExecutor: {
      Id: number;
      descricao: string;
    } | null;
    statusOrderService: {
      id: number;
      status: string;
      cor: string | null;
      finalizacao: number;
      requer_justificativa: string;
    };
    justifyStatus: {
      id: number;
      login: string;
      id_ordem_servico: number;
      id_status_antigo: number;
      status_old_service_order: {
        cor: string;
        cor_font: string;
        status: string;
      };
      id_status_novo: number;
      status_new_service_order: {
        cor: string;
        cor_font: string;
        status: string;
      };
      justificativa: string;

      log_date: Date;
    }[];
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    };
    requester: {
      id: number;
      nome: string;
    } | null;
    requestOrderService: {
      id: number;
    }[];
  };
  findByCodeAndEquipment: {
    ID: number;
    ID_cliente: number;
    ID_filial: number;
    ordem: string;
    hh_previsto: Prisma.Decimal;
    horimetro: Prisma.Decimal;
    odometro: Prisma.Decimal;
    log_date: Date;
    log_date_timestamp: number | null;
    descricao_solicitacao: string;
    observacoes: string;
    descricao_servico_realizado: string;
    observacoes_executante: string;
    ordem_vinculada: string;
    maquina_parada: number;
    solicitante: string;
    servico_pendente: string;
    possui_anexo: string;
    data_hora_solicitacao: Date;
    data_hora_solicitacao_timestamp: number | null;
    data_equipamento_parou: Date;
    data_prevista_termino: Date;
    data_equipamento_funcionou: Date;
    data_inicio: Date;
    data_hora_encerramento: Date;
    status_os: number;
    id_ordem_pai: number;
    mantenedores: string;
    id_solicitante: number;
    prioridade: number | null;
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    };
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
      n_serie: string;
      registerEquipment: {
        id: number;
        horimetro: Decimal | null;
        quilometragem: Decimal | null;
      } | null;
      registerEquipmentAction: {
        id: number;
        horimetro: boolean | null;
        quilometragem: boolean | null;
        turno: boolean | null;
      } | null;
    };
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    sectorExecutor: {
      Id: number;
      descricao: string;
    };
    requester: {
      id: number;
      nome: string;
    } | null;
  };
  serviceOrderById: {
    ID: number;
    ID_cliente: number;
    ID_filial: number;
    ordem: string;
    hh_previsto: Prisma.Decimal;
    horimetro: Prisma.Decimal;
    odometro: Prisma.Decimal;
    log_date: Date;
    log_date_timestamp: number | null;
    descricao_solicitacao: string;
    observacoes: string;
    descricao_servico_realizado: string;
    observacoes_executante: string;
    ordem_vinculada: string;
    maquina_parada: number;
    solicitante: string;
    servico_pendente: string;
    possui_anexo: string;
    data_hora_solicitacao: Date;
    data_hora_solicitacao_timestamp: number | null;
    data_equipamento_parou: Date;
    data_prevista_termino: Date;
    data_equipamento_funcionou: Date;
    data_inicio: Date;
    data_hora_encerramento: Date;
    status_os: number;
    id_ordem_pai: number;
    mantenedores: string;
    id_solicitante: number;
    prioridade: number | null;
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    };
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
      n_serie: string;
      registerEquipment: {
        id: number;
        horimetro: Decimal | null;
        quilometragem: Decimal | null;
      } | null;
      registerEquipmentAction: {
        id: number;
        horimetro: boolean | null;
        quilometragem: boolean | null;
        turno: boolean | null;
      } | null;
    };
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    sectorExecutor: {
      Id: number;
      descricao: string;
    };
    requester: {
      id: number;
      nome: string;
    } | null;
    noteStop: {
      id: number;
      data_hora_start: Date | null;
      data_hora_stop: Date | null;
    }[];
    note: {
      id: number;
    }[];
    justifyStatus: {
      id: number;
      justificativa: string;
      status_new_service_order: {
        id: number;
        status: string;
      };
    }[];
  };

  stopRecordTypeMaintenance: {
    ID: number;
    ordem: string;
    data_hora_solicitacao: Date;
    data_prevista_termino: Date;
    data_hora_encerramento: Date;
    data_equipamento_parou: Date;
    data_equipamento_funcionou: Date;
    data_inicio: Date;
    log_date: Date;
    fechada: string;
    typeMaintenance: {
      ID: number;
      tipo_manutencao: string;
    };
    statusOrderService: {
      id: number;
      status: string;
      finalizacao: number;
    };
    branch: {
      ID: number;
      filial_numero: string;
      razao_social: string;
    };
  };
  countOrderServiceGroupEquipmentWithNoteStop: {
    equipmentId: number;
    count: number;
  };
}
