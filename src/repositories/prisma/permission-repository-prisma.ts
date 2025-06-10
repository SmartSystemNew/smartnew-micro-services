import { PrismaService } from 'src/database/prisma.service';
import {
  IListForGroupAndModule,
  IPermission,
  listForGroupAndModuleAndLogin,
} from 'src/models/IPermission';
import { PermissionRepository } from '../permission-repository';
import { Injectable } from '@nestjs/common';
import { mod_seguranca_permissoes, Prisma } from '@prisma/client';

@Injectable()
export class PermissionRepositoryPrisma implements PermissionRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.mod_seguranca_permissoes;

  async listForGroupAndModuleAndLogin(
    groupId: number,
    moduleId: number,
    login: string,
  ): Promise<listForGroupAndModuleAndLogin[]> {
    const permission = await this.table.findMany({
      select: {
        menu: {
          select: {
            id: true,
            nome: true,
            icone: true,
            id_pai: true,
          },
        },
        access: true,
        update: true,
        insert: true,
        delete: true,
        print: true,
        export: true,
        userPermission: {
          select: {
            access: true,
            update: true,
            insert: true,
            delete: true,
            print: true,
            export: true,
          },
          where: {
            login,
          },
        },
      },
      where: {
        group_id: groupId,
        id_modulo: moduleId,
      },
    });

    return permission;
  }

  async listForGroupAndModule(
    groupId: number,
    moduleId: number,
  ): Promise<IListForGroupAndModule[]> {
    const permission = await this.table.findMany({
      select: {
        id: true,
        menu: {
          select: {
            id: true,
            nome: true,
            icone: true,
            id_pai: true,
          },
        },
        access: true,
        update: true,
        insert: true,
        delete: true,
        print: true,
        export: true,
        userPermission: {
          select: {
            access: true,
            update: true,
            insert: true,
            delete: true,
            print: true,
            export: true,
            login: true,
          },
        },
      },
      where: {
        group_id: groupId,
        id_modulo: moduleId,
      },
    });

    return permission;
  }

  async listPermission(
    login: string,
  ): Promise<IPermission['listPermission'][]> {
    const permission = await this.table.findMany({
      select: {
        id: true,
        menu: {
          select: {
            id: true,
            aplicacao: true,
          },
        },
        module: {
          select: {
            id: true,
            nome: true,
          },
        },
        access: true,
        update: true,
        insert: true,
        delete: true,
        print: true,
        export: true,
        userPermission: {
          select: {
            access: true,
            update: true,
            insert: true,
            delete: true,
            print: true,
            export: true,
          },
          where: {
            login,
          },
        },
      },
      where: {
        groups: {
          groupUser: {
            every: {
              login,
            },
          },
        },
      },
    });

    return permission;
  }

  async findByApplicationAndGroupAndUser(
    application: string,
    groupId: number,
    login: string,
  ): Promise<IPermission['findByApplicationAndGroupAndUser'] | null> {
    const permission = await this.table.findFirst({
      select: {
        id: true,
        menu: {
          select: {
            id: true,
            aplicacao: true,
          },
        },
        module: {
          select: {
            id: true,
            nome: true,
          },
        },
        access: true,
        update: true,
        insert: true,
        delete: true,
        print: true,
        export: true,
        userPermission: {
          select: {
            access: true,
            update: true,
            insert: true,
            delete: true,
            print: true,
            export: true,
          },
          where: {
            login,
          },
        },
      },
      where: {
        group_id: groupId,
        menu: {
          aplicacao: application,
        },
      },
    });

    return permission;
  }

  async findByApplicationAndGroup(
    application: string,
    groupId: number,
  ): Promise<IPermission['findByApplicationAndGroup'] | null> {
    const permission = await this.table.findFirst({
      select: {
        id: true,
        menu: {
          select: {
            id: true,
            aplicacao: true,
          },
        },
        module: {
          select: {
            id: true,
            nome: true,
          },
        },
        access: true,
        update: true,
        insert: true,
        delete: true,
        print: true,
        export: true,
        userPermission: {
          select: {
            access: true,
            update: true,
            insert: true,
            delete: true,
            print: true,
            export: true,
          },
        },
      },
      where: {
        group_id: groupId,
        menu: {
          aplicacao: application,
        },
      },
    });

    return permission;
  }

  async findByApplicationAndGroupAndModule(
    application: string,
    groupId: number,
    login: string,
    moduleId: number,
  ): Promise<IPermission['findByApplicationAndGroupAndModule'] | null> {
    const permission = await this.table.findFirst({
      select: {
        id: true,
        menu: {
          select: {
            id: true,
            aplicacao: true,
          },
        },
        module: {
          select: {
            id: true,
            nome: true,
          },
        },
        access: true,
        update: true,
        insert: true,
        delete: true,
        print: true,
        export: true,
        userPermission: {
          select: {
            access: true,
            update: true,
            insert: true,
            delete: true,
            print: true,
            export: true,
          },
          where: {
            login,
          },
        },
      },
      where: {
        group_id: groupId,
        id_modulo: moduleId,
        menu: {
          aplicacao: application,
        },
      },
    });

    return permission;
  }

  async update(
    id: number,
    data: Prisma.mod_seguranca_permissoesUncheckedCreateInput,
  ): Promise<mod_seguranca_permissoes> {
    const permission = this.table.update({
      where: { id },
      data,
    });

    return permission;
  }
}
