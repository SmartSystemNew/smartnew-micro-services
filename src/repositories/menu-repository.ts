import { Prisma } from '@prisma/client';
import { IMenu } from 'src/models/IMenu';

export abstract class MenuRepository {
  abstract findById(id: number): Promise<IMenu['findById'] | null>;
  abstract listMenu(groupId: number): Promise<IMenu['listMenu'][]>;
  abstract listMenuAndPermissionByGroup(
    groupId: number,
    filter?: Prisma.smartnewsystem_menu_itensWhereInput,
  ): Promise<IMenu['listMenuAndPermissionByGroup'][]>;

  abstract listMenuAndPermissionByGroupAndModule(
    groupId: number,
    moduleId: number,
  ): Promise<IMenu['listMenuAndPermissionByGroupAndModule'][]>;
}
