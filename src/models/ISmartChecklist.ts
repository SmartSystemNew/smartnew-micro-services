import { Prisma } from '@prisma/client';

export interface ISmartChecklist {
  listByClient: {
    id: number;
    data_hora_inicio: Date;
    data_hora_encerramento: Date;
    status: number | null;
    checklistXModel: {
      model: {
        id: number;
        descricao: string;
      };
    }[];
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    };
    location: {
      id: number;
      tag: string | null;
      localizacao: string;
    };
    period: {
      turno: string;
    };
    user: {
      name: string;
      login: string;
    };
  };
  listAllByClient: {
    id: number;
    data_hora_inicio: Date;
    data_hora_encerramento: Date;
    status: number | null;
    checklistXModel: {
      model: {
        id: number;
        descricao: string;
      };
    }[];
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    };
    location: {
      id: number;
      tag: string | null;
      localizacao: string;
    };
    period: {
      turno: string;
    };
    user: {
      name: string;
      login: string;
    };
  };
  findById: {
    id: number;
    data_hora_inicio: Date;
    data_hora_encerramento: Date;
    status: number;
    checkListPeriod: {
      id: number;
      observacao: string | null;
      status: {
        id: number;
        descricao: string;
      } | null;
      statusAction: {
        id: number;
        descricao: string;
      } | null;
      productionChecklistAction: {
        id: number;
      }[];
      checkListItem: {
        id: number;
        checkListTask: {
          id: number;
          descricao: string;
          checkListStatusAction: {
            id: number;
            descricao: string;
            checkListControl: {
              id: number;
              descricao: string;
            };
            checkListStatus: {
              id: number;
              descricao: string;
            };
          }[];
        };
      };
    }[];
    checklistXModel: {
      model: {
        id: number;
        descricao: string;
      };
    }[];
    checklistActionGroup: {
      id: number;
    }[];
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    };
    location: {
      id: number;
      tag: string | null;
      localizacao: string;
    };
    period: {
      turno: string;
    };
    user: {
      name: string;
      login: string;
    };
  };
  findByServiceOrderId: {
    id: number;
    data_hora_inicio: Date;
    data_hora_encerramento: Date;
    status: number;
    checkListPeriod: {
      id: number;
      productionChecklistAction: {
        id: number;
      }[];
    }[];
    checklistXModel: {
      model: {
        id: number;
        descricao: string;
      };
    }[];
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    };
    location: {
      id: number;
      tag: string | null;
      localizacao: string;
    };
    period: {
      turno: string;
    };
    user: {
      name: string;
      login: string;
    };
  };
  IWhere: Prisma.smartnewsystem_checklistWhereInput;
  listByDescriptionMaintenance: {
    id: number;
    data_hora_inicio: Date;
    data_hora_encerramento: Date;
    serviceOrder: {
      equipment: {
        descricao: string;
        ID: number;
        equipamento_codigo: string;
      };
      ID: number;
      ordem: string;
    };
    checklistXModel: {
      id: number;
      model: {
        id: number;
        descricao: string;
      };
    }[];
    checkListPeriod: {
      id: number;
      checkListItem: {
        id: number;
        checkListTask: {
          id: number;
          descricao: string;
        };
      };
    }[];
  };
}
