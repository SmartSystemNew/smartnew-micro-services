import { Injectable } from '@nestjs/common';
import { mod_seguranca_permissoes_usuario, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import UserPermissionRepository from '../user-permission-repository';

@Injectable()
export default class UserPermissionRepositoryPrisma
  implements UserPermissionRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.mod_seguranca_permissoes_usuario;

  async update(
    id: number,
    login: string,
    dataUpdate: Prisma.mod_seguranca_permissoes_usuarioUncheckedUpdateInput,
    dataCreate: Prisma.mod_seguranca_permissoes_usuarioUncheckedCreateInput,
  ): Promise<mod_seguranca_permissoes_usuario> {
    const userPermission = await this.table.upsert({
      where: {
        id_permissao_login: {
          id_permissao: id,
          login,
        },
      },
      create: dataCreate,
      update: dataUpdate,
    });

    return userPermission;
  }
}
