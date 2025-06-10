import { IPermissionMenu } from './IPermission';

export interface IProfile {
  user: {
    clientId: number;
    login: string;
  };
  modules: {
    id: number;
    icon: string;
    name: string;
    order: number;
    permission: IPermissionMenu[];
  }[];
}
