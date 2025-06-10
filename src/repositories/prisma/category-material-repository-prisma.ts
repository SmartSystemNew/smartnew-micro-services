import { Prisma, sofman_cad_categorias_materiais } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import CategoryMaterialRepository from '../category-material-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class CategoryMaterialRepositoryPrisma
  implements CategoryMaterialRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_categorias_materiais;

  async findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<sofman_cad_categorias_materiais | null> {
    const category = await this.table.findFirst({
      where: {
        id_cliente: clientId,
        descricao: name,
      },
    });

    return category;
  }

  async listByClient(
    clientId: number,
  ): Promise<sofman_cad_categorias_materiais[]> {
    const category = await this.table.findMany({
      where: {
        id_cliente: clientId,
      },
    });

    return category;
  }

  async create(
    data: Prisma.sofman_cad_categorias_materiaisUncheckedCreateInput,
  ): Promise<sofman_cad_categorias_materiais> {
    const category = await this.table.create({ data });

    return category;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_categorias_materiaisUncheckedUpdateInput,
  ): Promise<sofman_cad_categorias_materiais> {
    const category = await this.table.update({
      data,
      where: { id: id },
    });

    return category;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id: id } });

    return true;
  }
}
