export enum TypeColumn {
  ID = 'id',
  String = 'string',
  Date = 'Date',
  Number = 'Number',
  Boolean = 'Boolean',
  Null = 'null',
  TipoItem = 'insumo | equipamento',
  EnumItemInsumo = 'select_insumo',
  EnumItemEquipamento = 'select_equipamento',
  SelectFilial = 'select_filial',
  SelectFornecedor = 'select_fornecedor',
  SelectTipoContrato = 'select_tipo_fornecedor',
}

interface IDefault {
  [key: string]: TypeColumn | IDefault;
}

export interface IExcel {
  contract: IDefault & {
    children?: IDefault;
  };
  plansR2: {
    [key: string]: TypeColumn;
  };
}
