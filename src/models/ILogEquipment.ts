export default interface ILogEquipment {
  listByBranches: {
    ID: number;
    id_equipamento: number;
    acao: string;
    equipamento_codigo: string;
    descricao: string;
    n_serie: string;
    observacoes: string;
    chassi: string;
    placa: string;
    equipment: {
      ID: number;
      costCenter: {
        ID: number;
        centro_custo: string;
      };
      descriptionPlanMaintenance: {
        id: number;
      }[];
      branch: {
        ID: number;
        filial_numero: string;
      };
      typeEquipment: {
        ID: number;
        tipo_equipamento: string;
      };
    };
  };
}
