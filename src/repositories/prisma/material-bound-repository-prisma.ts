import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_material_vinculo } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import MaterialBoundRepository from '../material-bound-repository';
import IMaterialBound from 'src/models/IMaterialBound';

@Injectable()
export default class MaterialBoundRepositoryPrisma
  implements MaterialBoundRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_material_vinculo;

  async findByMaterial(
    materialId: number,
  ): Promise<IMaterialBound['findByMaterial'][]> {
    const bound = await this.table.findMany({
      select: {
        id: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            fabricante: true,
            modelo: true,
            n_serie: true,
            placa: true,
            ano_fabricacao: true,
          },
        },
      },
      where: {
        id_material: materialId,
      },
    });

    return bound;
  }

  async findByMaterialAndEquipment(
    materialId: number,
    equipmentId: number,
  ): Promise<smartnewsystem_material_vinculo | null> {
    const bound = await this.table.findFirst({
      where: {
        id_material: materialId,
        id_equipamento: equipmentId,
      },
    });

    return bound;
  }

  async create(
    data: Prisma.smartnewsystem_material_vinculoUncheckedCreateInput,
  ): Promise<smartnewsystem_material_vinculo> {
    const bound = await this.table.create({ data });

    return bound;
  }

  async update(
    boundId: number,
    data: Prisma.smartnewsystem_material_vinculoUpdateInput,
  ): Promise<smartnewsystem_material_vinculo> {
    const bound = await this.table.update({
      where: { id: boundId },
      data,
    });

    return bound;
  }

  async delete(boundId: number): Promise<boolean> {
    await this.table.delete({ where: { id: boundId } });

    return true;
  }
}
