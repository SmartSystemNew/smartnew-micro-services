import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_financeiro_numero_tipo_documento,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import FinanceNumberTypeDocumentRepository from '../finance-numberTypeDocument-repository';

@Injectable()
export default class FinanceNumberTypeDocumentRepositoryPrisma
  implements FinanceNumberTypeDocumentRepository
{
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_financeiro_numero_tipo_documento;

  async insert(
    data: Prisma.smartnewsystem_financeiro_numero_tipo_documentoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_numero_tipo_documento> {
    const number = await this.table.create({
      data,
    });

    return number;
  }

  async lastNumber(clientId: number, typeDocumentId: number): Promise<number> {
    const number = await this.table.findMany({
      orderBy: {
        numero: 'desc',
      },
      take: 1,
      where: {
        id_cliente: clientId,
        id_tipo_documento: typeDocumentId,
      },
    });

    return number.length ? number[0].numero : 0;
  }
}
