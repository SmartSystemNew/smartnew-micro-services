import { Injectable } from '@nestjs/common';
import { Prisma, sofman_log_funcionamento } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { LogOperationRepository } from '../log-operation-repository';

@Injectable()
export default class LogOperationRepositoryPrisma
  implements LogOperationRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_log_funcionamento;

  async insert(
    data: Prisma.sofman_log_funcionamentoUncheckedCreateInput,
  ): Promise<sofman_log_funcionamento> {
    const operation = await this.table.create({ data });

    return operation;
  }
  async createMany(
    data: Prisma.sofman_log_funcionamentoUncheckedCreateInput[],
  ): Promise<Prisma.BatchPayload> {
    try {
      return this.table.createMany({ data });
    } catch (error) {
      console.error('Error creating many operations:', error);
      throw error;
    }
  }

  async findByEquipmentAndRegister(
    equipmentId: number,
    register?: Date | null,
  ): Promise<sofman_log_funcionamento | null> {
    const where = {
      id_equipamento: equipmentId,
    };
    if (equipmentId && register) {
      where['data_leitura'] = register;
    }
    const operation = await this.table.findFirst({
      where: where,
    });

    return operation;
  }
}
