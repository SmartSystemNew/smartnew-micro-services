export interface IRequestService {
  findById: {
    id: number;
    codigo_solicitacao: string;
    assunto: string;
    mensagem: string;
    prioridade: string;
    data_inicio: Date;
    data_termino: Date;
    log_date: Date;
    orderService: {
      ID: number;
      ordem: string;
      descricao_solicitacao: string;
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
    };
    sectorExecutor: {
      Id: number;
      descricao: string;
    } | null;
    statusRequest: {
      id: number;
      descricao: string;
    } | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    } | null;
  };
  findByIdApp: {
    id: number;
    codigo_solicitacao: string;
    assunto: string;
    mensagem: string;
    prioridade: string;
    data_inicio: Date;
    data_termino: Date;
    log_date: Date;
    orderService: {
      ID: number;
      ordem: string;
      descricao_solicitacao: string;
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
    };
    sectorExecutor: {
      Id: number;
      descricao: string;
    } | null;
    statusRequest: {
      id: number;
      descricao: string;
    } | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    } | null;
  };
  listByClient: {
    id: number;
    assunto: string;
    mensagem: string;
    prioridade: string;
    data_inicio: Date;
    data_termino: Date;
    log_date: Date;
    orderService: {
      ID: number;
      ordem: string;
      descricao_solicitacao: string;
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
    };
    sectorExecutor: {
      Id: number;
      descricao: string;
    } | null;
    statusRequest: {
      id: number;
      descricao: string;
    } | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    } | null;
  };
  listByBranches: {
    id: number;
    assunto: string;
    mensagem: string;
    prioridade: string;
    data_inicio: Date;
    data_termino: Date;
    log_date: Date;
    orderService: {
      ID: number;
      ordem: string;
      descricao_solicitacao: string;
    } | null;
    branch: {
      ID: number;
      filial_numero: string;
    };
    sectorExecutor: {
      Id: number;
      descricao: string;
    } | null;
    statusRequest: {
      id: number;
      descricao: string;
    } | null;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
    } | null;
  };
}
