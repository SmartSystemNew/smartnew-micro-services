import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_manutencao_apontamento_manual,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import MaintenanceAppointmentManualRepository from '../maintenance-appointment-manual-repository';

@Injectable()
export default class MaintenanceAppointmentManualRepositoryPrisma
  implements MaintenanceAppointmentManualRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_manutencao_apontamento_manual;

  async create(
    data: Prisma.smartnewsystem_manutencao_apontamento_manualUncheckedCreateInput,
  ): Promise<smartnewsystem_manutencao_apontamento_manual> {
    const appointment = await this.table.create({
      data,
    });

    return appointment;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_manutencao_apontamento_manualUncheckedUpdateInput,
  ): Promise<smartnewsystem_manutencao_apontamento_manual> {
    const appointment = await this.table.update({
      where: { id },
      data,
    });

    return appointment;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: { id },
    });

    return true;
  }
}
