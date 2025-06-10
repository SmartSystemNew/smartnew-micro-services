import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IEmission } from 'src/models/IEmission';
import EmissionRepository from '../emission-repository';
import { Prisma, smartnewsystem_financeiro_emissao } from '@prisma/client';

@Injectable()
export default class EmissionRepositoryPrisma implements EmissionRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_financeiro_emissao;

  async findById(id: number): Promise<IEmission['findById'] | null> {
    const emission = await this.table.findUnique({
      select: {
        id: true,
        data_vencimento: true,
        pago: true,
        bank: {
          select: {
            id: true,
            nome: true,
            saldo: true,
          },
        },
        emissionItem: {
          select: {
            installmentFinance: {
              select: {
                id: true,
                finance: {
                  select: {
                    financeControl: {
                      select: {
                        issuePay: {
                          select: {
                            ID: true,
                            razao_social: true,
                          },
                        },
                        senderPay: {
                          select: {
                            ID: true,
                            filial_numero: true,
                          },
                        },
                        issueReceive: {
                          select: {
                            ID: true,
                            filial_numero: true,
                          },
                        },
                        senderReceive: {
                          select: {
                            ID: true,
                            razao_social: true,
                          },
                        },
                      },
                    },
                  },
                },
                vencimento: true,
                valor_parcela: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    return emission;
  }

  async insert(
    data: Prisma.smartnewsystem_financeiro_emissaoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_emissao> {
    const emission = await this.table.create({
      data,
    });

    return emission;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_emissaoUncheckedUpdateInput,
  ): Promise<IEmission['update']> {
    const emission = await this.table.update({
      include: {
        emissionItem: {
          include: {
            installmentFinance: true,
          },
        },
      },
      data,
      where: {
        id,
      },
    });

    return emission;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
