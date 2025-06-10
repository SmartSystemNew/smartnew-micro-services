export interface IManagerCompany {
  listByLogin: {
    id: number;
    companyBound: {
      ID: number;
      nome_fantasia: string;
      razao_social: string;
      cnpj: string;
    };
  };
}
