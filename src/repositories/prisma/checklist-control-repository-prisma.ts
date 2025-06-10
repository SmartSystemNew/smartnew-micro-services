import { Injectable } from '@nestjs/common';
import { smartnewsystem_producao_checklist_controle } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CheckListControlRepository } from '../checklist-control-repository';

@Injectable()
export class CheckListControlRepositoryPrisma
  implements CheckListControlRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_producao_checklist_controle;

  async list(): Promise<smartnewsystem_producao_checklist_controle[]> {
    const control = await this.table.findMany();

    return control;
  }
}
