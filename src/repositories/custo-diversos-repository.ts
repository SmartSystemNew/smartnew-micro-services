export default abstract class CustoDiversosRepository {
  abstract gridCustoDiversos(
    clientId: number[],
    login: string[],
    page: number | null,
    perPage: number | null,
    filters: {
      id_ordem_servico?: number[];
      id_cliente?: number[];
      ID_filial?: number[];
      cliente?: string;
      descricao_custo?: string;
      equipamento?: string;
      familia_equipamento?: string;
      tipo_equipamento?: string;
      setor_executante?: string;
      status?: string;
      ordem?: number;
      filterColumn?: string;
      filterText?: string;
      globalFilter?: string;
    },
  ): Promise<any[]>;
}
