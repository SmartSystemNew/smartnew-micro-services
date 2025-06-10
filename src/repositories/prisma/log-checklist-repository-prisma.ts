import { Injectable } from '@nestjs/common';
import { log_checklist_smartnewsystem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import LogChecklistRepository from '../log-checklist-repository';

@Injectable()
export default class LogChecklistRepositoryPrisma
  implements LogChecklistRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_checklist_smartnewsystem;

  async list(): Promise<log_checklist_smartnewsystem[]> {
    const log = await this.table.findMany();

    return log;
  }

  async create(
    data: Prisma.log_checklist_smartnewsystemUncheckedCreateInput,
  ): Promise<log_checklist_smartnewsystem> {
    const log = await this.table.create({
      data,
    });

    return log;
  }
}
