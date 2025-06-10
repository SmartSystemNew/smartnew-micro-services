export default interface IMaterialBound {
  findByMaterial: {
    id: number;
    equipment: {
      ID: number;
      equipamento_codigo: string;
      descricao: string;
      fabricante: string;
      n_serie: string;
      modelo: string;
      ano_fabricacao: Date;
      placa: string;
    };
  };
}
