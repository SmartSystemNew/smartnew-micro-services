import { Injectable } from '@nestjs/common';
import { IListAll } from 'src/models/IModule';

@Injectable()
export class ModuleService {
  filterModulesByClient(modules: IListAll[], clientId: number): IListAll[] {
    const allModuleFind: IListAll[] = [];

    modules.forEach((item) => {
      const splitted = item.clientes.split(',');

      if (splitted.includes(clientId.toString())) {
        allModuleFind.push(item);
      }
    });

    return allModuleFind;
  }

  public list = {
    Manutenção: 1,
    'Task Controll': 2,
    'Controle de Abastecimento': 3,
    Produção: 4,
    Gestor: 5,
    Security: 6,
    Contratos: 7,
    'Controle Balanca': 8,
    Compras: 9,
    Vendas: 10,
    Financeiro: 11,
    Telemetria: 12,
    'Smart List': 13,
  };
}
