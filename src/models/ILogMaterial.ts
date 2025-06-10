export default interface ILogMaterial {
  listStock: {
    id: number;
    acao: string;
    id_material: number;
    codigo: string;
    material: string;
    unidade: string;
    descricao: string;
    entrada: number;
    saida: number;
    estoque_max: number;
    estoque_min: number;
    ultima_entrada: number;
    ultima_saida: number;
  };
  listByClientAndActive: {
    id: number;
    id_material: number;
    acao: string;
    codigo: string;
    material: string;
  };
}
