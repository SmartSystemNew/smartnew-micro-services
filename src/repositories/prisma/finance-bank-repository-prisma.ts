import { Injectable } from '@nestjs/common';
import { Prisma, smartnewsystem_financeiro_bancos } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IFinanceBank from 'src/models/IFinanceBank';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import FinanceBankRepository from '../finance-bank-repository';

@Injectable()
export default class FinanceBankRepositoryPrisma
  implements FinanceBankRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_bancos;

  async listByClient(
    idClient: number,
    filters: Prisma.smartnewsystem_financeiro_bancosWhereInput = {},
    fields: string[] = [],
  ): Promise<IFinanceBank['listByClient'][]> {
    const where: Prisma.smartnewsystem_financeiro_bancosWhereInput = {
      id_cliente: idClient,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.smartnewsystem_financeiro_bancosSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            nome: true,
            //dono: true,
            numero_conta: true,
            digito: true,
            agencia: true,
            digito_agencia: true,
            saldo: true,
            negativo: true,
            status: true,
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...where, ...filters },
    });
    return obj;
  }
  async findById(id: number): Promise<IFinanceBank['findById']> {
    const bank = await this.table.findUnique({
      select: {
        id: true,
        id_cliente: true,
        nome: true,
        //dono: true,
        numero_conta: true,
        digito: true,
        agencia: true,
        digito_agencia: true,
        saldo: true,
        negativo: true,
        status: true,
      },
      where: {
        id,
      },
    });

    return bank;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_bancosUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_bancos> {
    const bank = await this.table.update({
      data,
      where: { id },
    });

    return bank;
  }
}
