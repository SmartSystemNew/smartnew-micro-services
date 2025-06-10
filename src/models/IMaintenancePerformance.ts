export default interface IMaintenancePerformance {
  gridIndicatorPerformanceMaintenance: {
    Data: string;
    cliente: string;
    equipamento: string;
    localizacao: string;
    familia: string;
    tipo_equipamento: string;
    DISPONIBILIDADE: number;
    MTBF: number;
    MTTR: number;
    TempoPrevistoFuncionamento: number;
    TempoManutencao: number;
    OrdensServico: number;
  };
  gridPerformance: {
    ID: number;
    ordem: string;
    data_hora_solicitacao: Date;
    data_acionamento_tecnico: Date | null;
    chegada_tecnico: Date | null;
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
      };
    };
    noteStop: {
      id_equipamento: number;
      id: number;
      id_ordem_servico: number;
      data_hora_stop: Date;
      data_hora_start: Date;
    }[];
  };
}
