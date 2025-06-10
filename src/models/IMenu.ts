import { Decimal } from '@prisma/client/runtime/library';

export interface IMenu {
  findById: {
    id: number;
    nome: string;
    icone: string;
  };
  listMenu: {
    id: number;
    id_pai: number;
    icone: string | null;
    icone_react: string | null;
    nome: string;
    aplicacao: string;
    ordem: Decimal;
    module: {
      id: number;
      nome: string;
      ordem: number;
      icone: string | null;
      clientes: string;
    };
  };
  listMenuAndPermissionByGroup: {
    id: number;
    id_pai: number;
    icone: string | null;
    icone_react: string | null;
    nome: string;
    aplicacao: string;
    ordem: Decimal;
    status: string;
    versao: string | null;
    module: {
      id: number;
      nome: string;
      ordem: number;
      icone: string | null;
      clientes: string;
      react_endpoint: string | null;
    };
    permission: {
      id: number;
      access: string;
      delete: string;
      update: string;
      export: string;
      print: string;
      module: {
        id: number;
      };
      userPermission: {
        users: {
          login: string;
          name: string;
        };
        access: string;
        delete: string;
        update: string;
        export: string;
        print: string;
        id_permissao: number;
      }[];
    }[];
  };
  listMenuAndPermissionByGroupAndModule: {
    id: number;
    id_pai: number;
    icone: string | null;
    icone_react: string | null;
    nome: string;
    aplicacao: string;
    ordem: Decimal;
    module: {
      id: number;
      nome: string;
      ordem: number;
      icone: string | null;
      clientes: string;
    };
    permission: {
      id: number;
      access: string;
      delete: string;
      update: string;
      export: string;
      print: string;
      module: {
        id: number;
      };
      userPermission: {
        users: {
          login: string;
          name: string;
        };
        access: string;
        delete: string;
        update: string;
        export: string;
        print: string;
        id_permissao: number;
      }[];
    }[];
  };
}
