export default interface IProductionChecklistActionGroupInfoTable {
  id: number;
  numero: number;
  titulo: string | null;
  data_inicio: Date;
  data_fim: Date | null;
  data_concluida: Date | null;
  descricao_acao: string;
  descricao: string;
  user: {
    login: string;
    name: string;
  } | null;
  productionChecklistActionItems: {
    id: number;
    checklistPeriod: {
      id: number;
      log_date: Date;
      checkListItem: {
        checkListTask: {
          descricao: string;
        };
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
        descricao: string;
        equipamento_codigo: string;
        branch: {
          ID: number;
          filial_numero: string;
        };
      } | null;
    };
  }[];
}

export interface IProductionChecklistActionGroupListGroupByBranches {
  id: number;
  titulo: string | null;
}

export interface IProductionChecklistActionGroupUpdate {
  id: number;
  numero: number;
  titulo: string | null;
  data_inicio: Date;
  data_fim: Date | null;
  data_concluida: Date | null;
  descricao_acao: string;
  descricao: string;
  user: {
    login: string;
    name: string;
  } | null;
  productionChecklistActionItems: {
    id: number;
    checklistPeriod: {
      id: number;
      log_date: Date;
      checkListItem: {
        checkListTask: {
          descricao: string;
        };
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
        descricao: string;
        equipamento_codigo: string;
        branch: {
          ID: number;
          filial_numero: string;
        };
      };
    };
  }[];
}
