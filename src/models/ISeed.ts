export interface ISeed {
  local: {
    company: {
      companyName: string;
      fantasyName: string;
      cnpj: string;
    };
    branch: {
      branchName: string;
      fantasyName: string;
      cnpj: string;
    };
    login: {
      name: string;
      pswd: string;
    };
    group: {
      name: string;
    };
    module: {
      icon: string;
      name: string;
      order: number;
    }[];
    provider: {
      name: string;
      fantasyName: string;
      cnpj: string;
      category: string;
      day: number;
    };
    descriptionCostCenter: {
      name: string;
    };
    costCenter: {
      code: string;
      name: string;
    };
    compositionGroup: {
      code: string;
      name: string;
    };
    compositionItem: {
      code: string;
      name: string;
    };
    typeDocument: {
      name: string;
      key: boolean;
      auto: boolean;
    }[];
    typePayment: {
      name: string;
      split: boolean;
    }[];
    category: {
      name: string;
    };
    material: {
      code: string;
      name: string;
      unity: string;
      active: boolean;
      tipo: 'stock' | 'service';
      value: number;
    }[];
    input: {
      name: string;
    }[];
    bank: {
      name: string;
      number: number;
      digit: number;
      agency: number;
      digitAgency: number;
      balance: number;
      negative: boolean;
      status: 'ATIVO' | 'DESATIVADO';
    }[];
    taxation: string[];
  };
  blank: {
    name: string;
    boundMenu: boolean;
    moduleId: number;
    type: 'blank' | 'control';
    typeView: 'front' | 'back';
    description: string;
    status: boolean;
    menu?: {
      icon: string;
      name: string;
      application: string;
      target: '_self' | '_blank';
      group: string;
      order: number;
      type: 'APLICACAO' | 'RELATORIO';
    };
  };
  order: {
    clientId: number;
    branchId: number;
    code: string;
    description: string;
    equipmentId: number;
  };
  equipment: {
    clientId: number;
    branchId: number;
    code: string;
    description: string;
    frota: string;
    family: {
      description: string;
      user: string;
    };
  };
  branchForCompany: {
    id: number;
    duplicate: boolean;
  };
  launchItemFinanceInHeaderImportForBranch: {
    id: number;
    newCompanyId: number;
    newBranchId: number;
  };
  launchOrderServiceImportForBranch: {
    id: number;
    newCompanyId: number;
    newBranchId: number;
  };
  launchMaterialImportForBranch: {
    id: number;
    newCompanyId: number;
    newBranchId: number;
  };
  launchProviderImportForBranch: {
    id: number;
    newCompanyId: number;
    newBranchId: number;
  };
  launchBuyImportForBranch: {
    id: number;
    newCompanyId: number;
    newBranchId: number;
  };
}
