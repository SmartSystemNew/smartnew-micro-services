import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CheckListStatusFindById } from 'src/models/ICheckListStatus';
import { CheckListStatusRepository } from '../checklist-status-repository';

@Injectable()
export class CheckListStatusRepositoryPrisma
  implements CheckListStatusRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_producao_checklist_status;

  async findById(id: number): Promise<CheckListStatusFindById | null> {
    const status = await this.table.findUnique({
      select: {
        id: true,
        icone: true,
        descricao: true,
        cor: true,
        acao: true,
      },
      where: {
        id,
      },
    });

    return status;
  }

  async listByClient(clientId: number): Promise<CheckListStatusFindById[]> {
    const status = await this.table.findMany({
      select: {
        id: true,
        icone: true,
        descricao: true,
        cor: true,
        acao: true,
        checkListControl: {
          select: {
            descricao: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
      },
    });

    return status;
  }
}
