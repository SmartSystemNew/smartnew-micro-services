export interface IPermission {
  listPermission: {
    id: number;
    access: string;
    insert: string;
    delete: string;
    update: string;
    export: string;
    print: string;
    menu: {
      id: number;
      aplicacao: string;
    };
    module: {
      id: number;
      nome: string;
    };
    userPermission: {
      access: string;
      insert: string;
      delete: string;
      update: string;
      export: string;
      print: string;
    }[];
  };
  findByApplicationAndGroup: {
    id: number;
    access: string;
    insert: string;
    delete: string;
    update: string;
    export: string;
    print: string;
    menu: {
      id: number;
      aplicacao: string;
    };
    module: {
      id: number;
      nome: string;
    };
    userPermission: {
      access: string;
      insert: string;
      delete: string;
      update: string;
      export: string;
      print: string;
    }[];
  };
  findByApplicationAndGroupAndUser: {
    id: number;
    access: string;
    insert: string;
    delete: string;
    update: string;
    export: string;
    print: string;
    menu: {
      id: number;
      aplicacao: string;
    };
    module: {
      id: number;
      nome: string;
    };
    userPermission: {
      access: string;
      insert: string;
      delete: string;
      update: string;
      export: string;
      print: string;
    }[];
  };
  findByApplicationAndGroupAndModule: {
    id: number;
    access: string;
    insert: string;
    delete: string;
    update: string;
    export: string;
    print: string;
    menu: {
      id: number;
      aplicacao: string;
    };
    module: {
      id: number;
      nome: string;
    };
    userPermission: {
      access: string;
      insert: string;
      delete: string;
      update: string;
      export: string;
      print: string;
    }[];
  };
}

export interface listForGroupAndModuleAndLogin {
  menu: {
    id: number;
    icone: string;
    nome: string;
    id_pai: number | null;
  };
  access: string;
  insert: string;
  delete: string;
  update: string;
  export: string;
  print: string;
  userPermission:
    | {
        access: string;
        insert: string;
        delete: string;
        update: string;
        export: string;
        print: string;
      }[]
    | null;
}

export interface IListForGroupAndModule {
  id: number;
  menu: {
    id: number;
    icone: string;
    nome: string;
    id_pai: number | null;
  };
  access: string;
  insert: string;
  delete: string;
  update: string;
  export: string;
  print: string;
  userPermission:
    | {
        access: string;
        insert: string;
        delete: string;
        update: string;
        export: string;
        print: string;
        login: string;
      }[]
    | null;
}

export interface IPermissionMenu {
  menu: string;
  access: boolean;
  update: boolean;
  insert: boolean;
  delete: boolean;
  print: boolean;
  export: boolean;
  user: {
    access: boolean;
    update: boolean;
    insert: boolean;
    delete: boolean;
    print: boolean;
    export: boolean;
  };
}
