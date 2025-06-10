import { Injectable } from '@nestjs/common';
import { cadastro_de_tipos_de_equipamentos, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { EquipmentTypeRepository } from '../equipment-type-repository';

@Injectable()
export default class EquipmentTypeRepositoryPrisma
  implements EquipmentTypeRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.cadastro_de_tipos_de_equipamentos;

  async findById(
    id: number,
  ): Promise<cadastro_de_tipos_de_equipamentos | null> {
    const type = await this.table.findFirst({
      where: {
        ID: id,
      },
    });

    return type;
  }

  async listByClient(
    clientId: number,
    filter?: Prisma.cadastro_de_tipos_de_equipamentosWhereInput | null,
  ): Promise<cadastro_de_tipos_de_equipamentos[]> {
    const type = await this.table.findMany({
      select: {
        ID: true,
        ID_cliente: true,
        ID_filial: true,
        tipo_equipamento: true,
        observacoes: true,
        log_user: true,
        log_date: true,
      },
      where: {
        ID_cliente: clientId,
        ...filter,
      },
    });

    return type;
  }

  async findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<cadastro_de_tipos_de_equipamentos | null> {
    const type = await this.table.findFirst({
      where: {
        ID_cliente: clientId,
        tipo_equipamento: name,
      },
    });

    return type;
  }
}
