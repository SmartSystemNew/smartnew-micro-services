import { Injectable } from '@nestjs/common';
import {
  $Enums,
  Prisma,
  smartnewsystem_financeiro_banco_movimentacao,
  smartnewsystem_financeiro_banco_movimentacao_tipo,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import FinanceBankTransactionRepository from '../financeBankTransaction-repository';
import IFinanceBankTransaction from 'src/models/IFinanceBankTransaction';

@Injectable()
export default class FinanceBankTransactionRepositoryPrisma
  implements FinanceBankTransactionRepository
{
  constructor(private prismaService: PrismaService) {}

  async listByClient(
    clientId: number,
    date?: { start: Date; end: Date },
  ): Promise<IFinanceBankTransaction['listByClient'][]> {
    const bank =
      await this.prismaService.smartnewsystem_financeiro_banco_movimentacao.findMany(
        {
          select: {
            id: true,
            id_banco: true,
            id_emissao: true,
            valor: true,
            data_lancamento: true,
            tipo: true,
            bank: {
              select: {
                id: true,
                nome: true,
                agencia: true,
              },
            },
          },
          where: {
            bank: { id_cliente: clientId },
            ...(date && {
              data_lancamento: { gte: date.start, lte: date.end },
            }),
          },
        },
      );

    return bank;
  }

  async listByBank(
    bankId: number[],
    date?: { start: Date; end: Date },
  ): Promise<IFinanceBankTransaction['listByBank'][]> {
    const bank =
      await this.prismaService.smartnewsystem_financeiro_banco_movimentacao.findMany(
        {
          select: {
            id: true,
            id_banco: true,
            id_emissao: true,
            valor: true,
            data_lancamento: true,
            tipo: true,
            bank: {
              select: {
                id: true,
                nome: true,
                agencia: true,
              },
            },
          },
          where: {
            bank: { id: { in: bankId } },
            ...(date && {
              data_lancamento: { gte: date.start, lte: date.end },
            }),
          },
        },
      );

    return bank;
  }

  async sumManyBankValues(
    idBank: number[],
    operations: smartnewsystem_financeiro_banco_movimentacao_tipo[],
  ): Promise<number> {
    const value = await this.table
      .aggregate({
        where: {
          id_banco: {
            in: idBank,
          },
          tipo: { in: operations },
        },
        _sum: { valor: true },
      })
      .then((result) => result._sum.valor ?? 0);
    return value;
  }

  async sumAllBankValuesByClient(
    clientId: number,
    operations: smartnewsystem_financeiro_banco_movimentacao_tipo[],
    date?: {
      start: Date;
      end: Date;
    },
  ): Promise<number> {
    const value = await this.table
      .aggregate({
        where: {
          bank: { id_cliente: clientId },
          tipo: { in: operations },
          ...(date && { data_lancamento: { gte: date.start, lte: date.end } }),
        },
        _sum: { valor: true },
      })
      .then((result) => result._sum.valor ?? 0);
    return value;
  }

  async sumValues(
    idClient: number,
    idBank: number,
    operations: smartnewsystem_financeiro_banco_movimentacao_tipo[],
  ): Promise<number> {
    const value = await this.table
      .aggregate({
        where: {
          id_banco: idBank,
          tipo: { in: operations },
          bank: { id_cliente: idClient },
        },
        _sum: { valor: true },
      })
      .then((result) => result._sum.valor ?? 0);
    return value;
  }
  async sumValuesIn(
    idClient: number,
    idBank: number,
    operations: smartnewsystem_financeiro_banco_movimentacao_tipo[] = [
      $Enums.smartnewsystem_financeiro_banco_movimentacao_tipo.ENTRADA,
      $Enums.smartnewsystem_financeiro_banco_movimentacao_tipo.MANUAL___ENTRADA,
      $Enums.smartnewsystem_financeiro_banco_movimentacao_tipo.ESTORNO,
    ],
  ): Promise<number> {
    return await this.sumValues(idClient, idBank, operations);
  }
  async sumValuesOut(
    idClient: number,
    idBank: number,
    operations: smartnewsystem_financeiro_banco_movimentacao_tipo[] = [
      $Enums.smartnewsystem_financeiro_banco_movimentacao_tipo.SAIDA,
      $Enums.smartnewsystem_financeiro_banco_movimentacao_tipo.MANUAL___SAIDA,
      $Enums.smartnewsystem_financeiro_banco_movimentacao_tipo.REEMBOLSO,
    ],
  ): Promise<number> {
    return await this.sumValues(idClient, idBank, operations);
  }

  private table =
    this.prismaService.smartnewsystem_financeiro_banco_movimentacao;

  async insert(
    data: Prisma.smartnewsystem_financeiro_banco_movimentacaoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_banco_movimentacao> {
    const transaction = await this.table.create({
      data,
    });

    return transaction;
  }

  async findByEmission(
    emissionId: number,
  ): Promise<smartnewsystem_financeiro_banco_movimentacao | null> {
    const transaction = await this.table.findFirst({
      where: {
        id_emissao: emissionId,
      },
    });

    return transaction;
  }
}
