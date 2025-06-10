import ListMenuResponse from 'src/useCases/system/dtos/listMenu-response';

export interface IProfileResponse {
  user: {
    clientId: number;
    name: string;
    login: string;
    companies: {
      id: number;
      name: string;
      cnpj: string;
    }[];
    group:
      | {
          description: string;
          id: number;
        }
      | '';
  };

  // modules: {
  //   id: number;
  //   icon: string;
  //   name: string;
  //   order: number;
  //   access: boolean;
  // }[];
  modules: ListMenuResponse['module'];
}
