interface IMenu {
  value: number;
  application: string;
  label: string;
  icon: string | null;
  order: number;
  access: boolean;
  permission?: {
    access: boolean | null;
    update: boolean | null;
    delete: boolean | null;
    export: boolean | null;
    print: boolean | null;
  };
  children: IMenu[] | null;
}

export default interface ListMenuResponse {
  module: {
    id: number;
    name: string;
    icon: string | null;
    order: number;
    access: boolean;
    menu: IMenu[];
  }[];
}
