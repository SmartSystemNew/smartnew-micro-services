import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import IFinanceTypeDocument from 'src/models/IFinanceTypeDocument';
import FinanceTypeDocumentRepository from '../finance-typeDocument-repository';
import {
  Prisma,
  smartnewsystem_financeiro_tipo_documento,
} from '@prisma/client';

@Injectable()
export default class FinanceTypeDocumentRepositoryPrisma
  implements FinanceTypeDocumentRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_tipo_documento;

  async create(
    data: Prisma.smartnewsystem_financeiro_tipo_documentoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_tipo_documento> {
    const typeDocument = await this.table.create({ data });
    return typeDocument;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_tipo_documentoUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_tipo_documento> {
    const typeDocument = await this.table.update({
      where: { id },
      data,
    });
    return typeDocument;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }

  async listByClient(
    clientId: number,
  ): Promise<IFinanceTypeDocument['listByClient'][]> {
    const typeDocument = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
        requer_chave: true,
        numeracao_automatica: true,
        finance: {
          select: {
            id: true,
            numero_fiscal: true,
            documento_numero: true,
          },
        },
        numberTypeDocument: {
          select: {
            id: true,
            numero: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
      },
    });

    return typeDocument;
  }

  async findById(id: number): Promise<IFinanceTypeDocument['findById'] | null> {
    const typeDocument = await this.table.findUnique({
      select: {
        id: true,
        descricao: true,
        requer_chave: true,
      },
      where: {
        id,
      },
    });

    return typeDocument;
  }

  async findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<IFinanceTypeDocument['findByClientAndName'] | null> {
    const typeDocument = await this.table.findFirst({
      select: {
        id: true,
        descricao: true,
        requer_chave: true,
      },
      where: {
        id_cliente: clientId,
        descricao: name,
      },
    });

    return typeDocument;
  }
}
