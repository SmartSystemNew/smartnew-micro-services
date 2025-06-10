import { $Enums } from '@prisma/client';

export interface ICheckListPeriodFindById {
  id: number;
  id_item_checklist: number;
  observacao: string;
  status_item_nc: number;
  checkListItem: {
    checkListTask: {
      id: number;
      descricao: string;
    };
  };
  status: {
    id: number;
    descricao: string;
    icone: string;
    cor: $Enums.smartnewsystem_producao_checklist_status_cor;
    acao: boolean;
  } | null;
  statusAction: {
    id: number;
    descricao: string;
  } | null;
}

export interface ICheckListPeriodFindByPeriodId
  extends ICheckListPeriodFindById {
  img: {
    url: string;
  }[];
}

export interface ICheckListPeriodFindByResponsible {
  checklist: {
    login: string;
  };
}

export interface IChecklistPeriodListByBranchAndAction {
  id: number;
  log_date: Date;
  checklist: {
    id: number;
    equipment: {
      branch: {
        ID: number;
        filial_numero: string;
      };
      equipamento_codigo: string;
      descricao: string;
    } | null;
    location: {
      id: number;
      localizacao: string;
    } | null;
  };
  checkListItem: {
    checkListTask: {
      descricao: string;
    };
  };
  statusAction: {
    checkListTask: {
      descricao: string;
    };
  } | null;
}

export interface IFindById {
  id: number;
  id_registro_producao: number | null;
  id_checklist: number | null;
  log_date: Date;
  checklist: {
    equipment: {
      branch: {
        ID: number;
        filial_numero: string;
      } | null;
      ID: number;
      descricao: string;
      equipamento_codigo: string;
    };
    location: {
      id: number;
      tag: string | null;
      localizacao: string;
      branch: {
        ID: number;
        filial_numero: string;
      };
    } | null;
  };
  checkListItem: {
    checkListTask: {
      id: number;
      descricao: string;
    };
  };
}

export interface IGroupByBranchAndStatusActionNotGroup {
  branch: string;
  branchId: number;
  code: string;
  equipment: string;
  periodId: number;
  productionRegisterId: number;
  startDate: Date;
  task: string;
}

export interface IListByTaskAndEquipmentNotGroup {
  id: number;
  log_date: Date;
  checklist: {
    equipment: {
      branch: {
        filial_numero: string;
      };
      descricao: string;
      equipamento_codigo: string;
    } | null;
    location: {
      id: number;
      tag: string | null;
      localizacao: string;
      branch: {
        filial_numero: string;
      };
    } | null;
  };
  checkListItem: {
    checkListTask: {
      descricao: string;
    };
  };
}

export interface IListByTaskAndLocationNotGroup {
  id: number;
  log_date: Date;
  checklist: {
    equipment: {
      branch: {
        filial_numero: string;
      };
      descricao: string;
      equipamento_codigo: string;
    } | null;
    location: {
      id: number;
      tag: string | null;
      localizacao: string;
      branch: {
        filial_numero: string;
      };
    } | null;
  };
  checkListItem: {
    checkListTask: {
      descricao: string;
    };
  };
}

export interface ICheckListPeriod {
  groupByBranchAndStatusActionNotGroupFast: {
    id: number;
    id_checklist: number;
    log_date: Date;
    checkListItem: {
      checkListTask: {
        id: number;
        descricao: string;
      };
    };
    checklist: {
      location: {
        id: number;
        localizacao: string;
        branch: {
          ID: number;
          filial_numero: string;
        };
        tag: string | null;
      } | null;
      equipment: {
        branch: {
          ID: number;
          filial_numero: string;
        };
        descricao: string;
        ID: number;
        equipamento_codigo: string;
      } | null;
    };
    productionChecklistAction: {
      id: number;
      descricao: string;
      id_item: number;
      log_date: Date;
      responsavel: string | null;
      data_inicio: Date | null;
      data_fim: Date | null;
      data_fechamento: Date | null;
      id_registro_producao: number | null;
      descricao_acao: string;
      user: {
        login: string;
        name: string;
      };
    }[];
  };
  groupByBranchAndStatusActionNotGroupFastNoPage: {
    id: number;
    id_checklist: number;
    log_date: Date;
    checkListItem: {
      checkListTask: {
        id: number;
        descricao: string;
      };
    };
    checklist: {
      location: {
        id: number;
        localizacao: string;
        branch: {
          ID: number;
          filial_numero: string;
        };
        tag: string | null;
      } | null;
      equipment: {
        branch: {
          ID: number;
          filial_numero: string;
        };
        descricao: string;
        ID: number;
        equipamento_codigo: string;
      } | null;
    };
    productionChecklistAction: {
      id: number;
      descricao: string;
      id_item: number;
      log_date: Date;
      responsavel: string | null;
      data_inicio: Date | null;
      data_fim: Date | null;
      data_fechamento: Date | null;
      id_registro_producao: number | null;
      descricao_acao: string;
      user: {
        login: string;
        name: string;
      };
    }[];
  };
}
