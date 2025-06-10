import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_imagem_login } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ImageLoginRepository from '../image-login-repository';

@Injectable()
export default class ImageLoginRepositoryPrisma
  implements ImageLoginRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_imagem_login;

  async findById(id: number): Promise<smartnewsystem_imagem_login | null> {
    const imageLogin = await this.table.findFirst({
      where: { id },
    });

    return imageLogin;
  }

  async listImage(
    filter?: Prisma.smartnewsystem_imagem_loginWhereInput | null,
  ): Promise<smartnewsystem_imagem_login[]> {
    const imageLogin = await this.table.findMany({
      where: { ...filter },
    });

    return imageLogin;
  }

  async create(
    data: Prisma.smartnewsystem_imagem_loginUncheckedCreateInput,
  ): Promise<smartnewsystem_imagem_login> {
    const imageLogin = await this.table.create({ data });

    return imageLogin;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_imagem_loginUncheckedUpdateInput,
  ): Promise<smartnewsystem_imagem_login> {
    const imageLogin = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return imageLogin;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
