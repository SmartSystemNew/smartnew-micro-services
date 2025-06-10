import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IFindByLogin, IFindGroup, IListUserByClient } from 'src/models/IUser';
import { UserRepository } from '../user-repository';

@Injectable()
export class UserRepositoryPrisma implements UserRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sec_users;

  async findGroup(login: string): Promise<IFindGroup | null> {
    const group = await this.table.findFirst({
      select: {
        userGroup: {
          select: {
            group_id: true,
            group: {
              select: {
                description: true,
                groupModule: {
                  select: {
                    ID: true,
                    priv_access: true,
                    module: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        login,
      },
    });

    return group.userGroup || null;
  }

  async listUserByClient(clientId: number): Promise<IListUserByClient[]> {
    const user = await this.table.findMany({
      select: {
        login: true,
        name: true,
      },
      where: {
        id_cliente: clientId,
      },
    });

    return user;
  }

  async listUserByClientAndActive(
    clientId: number,
  ): Promise<IListUserByClient[]> {
    const user = await this.table.findMany({
      select: {
        login: true,
        name: true,
      },
      where: {
        id_cliente: clientId,
        active: 'Y',
      },
    });

    return user;
  }

  async findByLogin(login: string): Promise<IFindByLogin | null> {
    const user = await this.table.findFirst({
      select: {
        id_cliente: true,
        login: true,
        name: true,
        id_mantenedor: true,
        company: {
          select: {
            ID: true,
            nome_fantasia: true,
            razao_social: true,
            cnpj: true,
          },
        },
      },
      where: {
        login,
      },
    });

    return user;
  }
}
