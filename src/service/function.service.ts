interface IMenu {
  id: number;
  id_pai: number;
  icone: string | null;
  icone_react: string | null;
  nome: string;
  aplicacao: string;
  ordem: number;
  versao: string;
  permission: {
    access: boolean | null;
    update: boolean | null;
    delete: boolean | null;
    export: boolean | null;
    print: boolean | null;
  };
  children?: IMenu[];
}

export function buildTreeMenu(items: IMenu[]): IMenu[] {
  //console.log(items);
  const map = new Map<number, IMenu>();
  const roots: IMenu[] = [];

  // Primeiro, criamos um mapa de todos os itens
  items.forEach((item) => map.set(item.id, { ...item, children: [] }));

  // Agora, organizamos a estrutura da árvore
  items.forEach((item) => {
    const node = map.get(item.id);
    if (!node) return; // Segurança para evitar problemas

    if (item.id_pai !== 0) {
      const parent = map.get(item.id_pai);
      if (parent) {
        parent.children!.push(map.get(item.id)!);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export function formatMenu(menu: IMenu): any {
  return {
    value: menu.id,
    application: menu.aplicacao,
    icon: menu.icone,
    iconeReact: menu.icone_react,
    label: menu.nome,
    order: Number(menu.ordem),
    access: menu.permission?.access ?? null,
    permission: menu.permission,
    children: menu.children?.map((child) => formatMenu(child)) || [],
    react: menu.versao === 'react',
  };
}
