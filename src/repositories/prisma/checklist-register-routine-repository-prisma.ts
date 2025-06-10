import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_checklist_registro_automatico,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ChecklistRegisterRoutineRepository from '../checklist-register-routine-repository';

@Injectable()
export default class ChecklistRegisterRoutineRepositoryPrisma
  implements ChecklistRegisterRoutineRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_checklist_registro_automatico;

  async findByModelAndEquipment(
    modelId: number,
    equipmentId: number,
  ): Promise<smartnewsystem_checklist_registro_automatico | null> {
    const routine = await this.table.findFirst({
      where: {
        id_modelo: modelId,
        id_equipamento: equipmentId,
      },
    });

    return routine;
  }

  async create(
    data: Prisma.smartnewsystem_checklist_registro_automaticoUncheckedCreateInput,
  ): Promise<smartnewsystem_checklist_registro_automatico> {
    const routine = await this.table.create({ data });

    return routine;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_checklist_registro_automaticoUncheckedUpdateInput,
  ): Promise<smartnewsystem_checklist_registro_automatico> {
    const routine = await this.table.update({
      where: { id },
      data,
    });

    return routine;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
