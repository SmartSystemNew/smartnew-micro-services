import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IEquipmentComponent } from 'src/models/IEquipmentComponent';
import { EquipmentComponentRepository } from '../equipment-component-repository';
import { Prisma, sofman_componente_equipamento } from '@prisma/client';

@Injectable()
export default class EquipmentComponentRepositoryPrisma
  implements EquipmentComponentRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_componente_equipamento;

  async findByEquipment(
    equipmentId: number,
  ): Promise<IEquipmentComponent['findByEquipment'][]> {
    const component = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
        fabricante: true,
        modelo: true,
        serie: true,
        ano_fabricacao: true,
        id_status_componente: true,
      },
      where: {
        id_equipamento: equipmentId,
      },
    });

    return component;
  }

  async create(
    data: Prisma.sofman_componente_equipamentoUncheckedCreateInput,
  ): Promise<sofman_componente_equipamento> {
    const component = await this.table.create({ data });

    return component;
  }

  async findById(id: number): Promise<IEquipmentComponent['findById'] | null> {
    const component = await this.table.findUnique({
      select: {
        id: true,
        descricao: true,
        fabricante: true,
        modelo: true,
        serie: true,
        ano_fabricacao: true,
        id_status_componente: true,
      },
      where: {
        id,
      },
    });

    return component;
  }

  async update(
    id: number,
    data: Prisma.sofman_componente_equipamentoUncheckedUpdateInput,
  ): Promise<sofman_componente_equipamento> {
    const component = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return component;
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
