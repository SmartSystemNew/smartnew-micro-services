export interface IEquipmentComponent {
  findByEquipment: {
    id: number;
    descricao: string;
    fabricante: string;
    modelo: string;
    serie: string;
    ano_fabricacao: Date;
    id_status_componente: string;
  };
  findById: {
    id: number;
    descricao: string;
    fabricante: string;
    modelo: string;
    serie: string;
    ano_fabricacao: Date;
    id_status_componente: string;
  };
}
