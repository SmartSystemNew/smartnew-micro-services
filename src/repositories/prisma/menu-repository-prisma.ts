import { PrismaService } from 'src/database/prisma.service';
import { IMenu } from 'src/models/IMenu';
import { MenuRepository } from '../menu-repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuRepositoryPrisma implements MenuRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_menu_itens;

  async findById(id: number): Promise<IMenu['findById'] | null> {
    const menu = await this.table.findUnique({
      select: {
        id: true,
        nome: true,
        icone: true,
      },
      where: {
        id,
      },
    });

    return menu;
  }

  async listMenu(): Promise<IMenu['listMenu'][]> {
    const menu = await this.table.findMany({
      select: {
        id: true,
        id_pai: true,
        aplicacao: true,
        nome: true,
        ordem: true,
        icone: true,
        icone_react: true,
        module: {
          select: {
            id: true,
            nome: true,
            ordem: true,
            icone: true,
            clientes: true,
          },
        },
      },
    });

    return menu;
  }

  async listMenuAndPermissionByGroup(
    groupId: number,
    filter?: Prisma.smartnewsystem_menu_itensWhereInput,
  ): Promise<IMenu['listMenuAndPermissionByGroup'][]> {
    const menu = await this.table.findMany({
      select: {
        id: true,
        id_pai: true,
        aplicacao: true,
        nome: true,
        ordem: true,
        icone: true,
        icone_react: true,
        status: true,
        versao: true,
        module: {
          select: {
            id: true,
            nome: true,
            ordem: true,
            icone: true,
            clientes: true,
            react_endpoint: true,
          },
        },
        permission: {
          select: {
            id: true,
            module: {
              select: {
                id: true,
              },
            },
            access: true,
            update: true,
            delete: true,
            export: true,
            print: true,
            userPermission: {
              select: {
                id_permissao: true,
                access: true,
                update: true,
                delete: true,
                export: true,
                print: true,
                users: {
                  select: {
                    login: true,
                    name: true,
                  },
                },
              },
            },
          },
          where: {
            group_id: groupId,
          },
        },
      },
      where: { ...filter },
    });

    return menu;
  }

  async listMenuAndPermissionByGroupAndModule(
    groupId: number,
    moduleId: number,
  ): Promise<IMenu['listMenuAndPermissionByGroupAndModule'][]> {
    const menu = await this.table.findMany({
      select: {
        id: true,
        id_pai: true,
        aplicacao: true,
        nome: true,
        ordem: true,
        icone: true,
        icone_react: true,
        module: {
          select: {
            id: true,
            nome: true,
            ordem: true,
            icone: true,
            clientes: true,
          },
        },
        permission: {
          select: {
            id: true,
            module: {
              select: {
                id: true,
              },
            },
            access: true,
            update: true,
            delete: true,
            export: true,
            print: true,
            userPermission: {
              select: {
                id_permissao: true,
                access: true,
                update: true,
                delete: true,
                export: true,
                print: true,
                users: {
                  select: {
                    login: true,
                    name: true,
                  },
                },
              },
            },
          },
          where: {
            group_id: groupId,
            id_modulo: moduleId,
          },
        },
      },
    });

    return menu;
  }
}
