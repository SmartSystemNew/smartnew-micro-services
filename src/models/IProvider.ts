export interface IProvider {
  listByClient: {
    ID: number;
    razao_social: string;
    cnpj: string;
    dias: number | null;
  };
  findByClientAndCNPJ: {
    ID: number;
    razao_social: string;
    cnpj: string;
    dias: number | null;
  };
  listByBranches: {
    ID: number;
    razao_social: string;
    cnpj: string;
    dias: number | null;
  };
  findById: {
    ID: number;
    cnpj: string;
    razao_social: string | null;
    nome_fantasia: string | null;
    dias: number | null;
  };
}
