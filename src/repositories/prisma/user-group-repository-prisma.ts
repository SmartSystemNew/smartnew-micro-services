import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IUserGroup from 'src/models/IUserGroup';

@Injectable()
export default class UserGroupRepositoryPrisma {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sec_users_groups;

  async listByGroup(groupId: number): Promise<IUserGroup['listByGroup'][]> {
    const userGroup = await this.table.findMany({
      select: {
        login: true,
        users: {
          select: {
            login: true,
            name: true,
          },
        },
      },
      where: {
        group_id: groupId,
      },
    });

    return userGroup;
  }
}
