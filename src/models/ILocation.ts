export interface ILocation {
  create: {
    id: number;
    tag: string | null;
    localizacao: string;
    branch: {
      ID: number;
      filial_numero: string;
    };
    category: {
      id: number;
      categoria: string;
    } | null;
  };
  findByFilter: {
    id: number;
    tag: string | null;
    localizacao: string;
    branch: {
      ID: number;
      filial_numero: string;
    };
    category: {
      id: number;
      categoria: string;
    } | null;
  };
  findByBranch: {
    id: number;
    tag: string | null;
    localizacao: string;
    branch: {
      ID: number;
      filial_numero: string;
    };
    category: {
      id: number;
      categoria: string;
    } | null;
  };
  findById: {
    id: number;
    tag: string | null;
    localizacao: string;
    branch: {
      ID: number;
      filial_numero: string;
    };
    category: {
      id: number;
      categoria: string;
    } | null;
    checklist: {
      id: number;
    }[];
    modelChecklist: {
      id: number;
    }[];
  };
}
