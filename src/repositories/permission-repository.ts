import { Prisma, mod_seguranca_permissoes } from '@prisma/client';
import {
  IListForGroupAndModule,
  IPermission,
  listForGroupAndModuleAndLogin,
} from 'src/models/IPermission';

export abstract class PermissionRepository {
  abstract listForGroupAndModuleAndLogin(
    groupId: number,
    moduleId: number,
    login: string,
  ): Promise<listForGroupAndModuleAndLogin[]>;

  abstract listForGroupAndModule(
    groupId: number,
    moduleId: number,
  ): Promise<IListForGroupAndModule[]>;

  abstract listPermission(
    login: string,
  ): Promise<IPermission['listPermission'][]>;

  abstract findByApplicationAndGroup(
    application: string,
    groupId: number,
  ): Promise<IPermission['findByApplicationAndGroup'] | null>;

  abstract findByApplicationAndGroupAndUser(
    application: string,
    groupId: number,
    login: string,
  ): Promise<IPermission['findByApplicationAndGroupAndUser'] | null>;

  abstract findByApplicationAndGroupAndModule(
    application: string,
    groupId: number,
    login: string,
    moduleId: number,
  ): Promise<IPermission['findByApplicationAndGroupAndModule'] | null>;

  abstract update(
    id: number,
    data: Prisma.mod_seguranca_permissoesUncheckedCreateInput,
  ): Promise<mod_seguranca_permissoes>;
}
