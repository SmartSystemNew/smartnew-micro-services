import { Injectable } from '@nestjs/common';
import {
  $Enums,
  Prisma,
  smartnewsystem_financeiro_descricao_titulos,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import FinanceRepository from '../finance-repository';
import { IFinance } from 'src/models/IFinance';

@Injectable()
export default class FinanceRepositoryPrisma implements FinanceRepository {
  constructor(private prismaService: PrismaService) {}

  private table =
    this.prismaService.smartnewsystem_financeiro_descricao_titulos;

  async insert(
    data: Prisma.smartnewsystem_financeiro_descricao_titulosUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_descricao_titulos> {
    const finance = await this.table.create({
      data,
    });

    return finance;
  }

  async findLast(
    clientId: number,
  ): Promise<smartnewsystem_financeiro_descricao_titulos> {
    const finance = await this.table.findFirst({
      orderBy: {
        id: 'desc',
      },
      where: {
        id_cliente: clientId,
      },
    });

    return finance;
  }

  async findIfExist(
    typeDocument: number,
    issue: number,
    sender: number,
    numberFiscal: string,
    direction: 'pagar' | 'receber',
  ): Promise<smartnewsystem_financeiro_descricao_titulos | null> {
    const finance = await this.table.findUnique({
      where: {
        id_documento_tipo_emitente_remetente_numero_fiscal_direcao: {
          direcao: direction,
          emitente: issue,
          remetente: sender,
          id_documento_tipo: typeDocument,
          numero_fiscal: numberFiscal,
        },
      },
    });

    return finance;
  }

  async listFinanceByClient(
    clientId: number,
  ): Promise<IFinance['listFinanceByClient'][]> {
    const finance = await this.table.findMany({
      select: {
        id: true,
        emitente: true,
        remetente: true,
        direcao: true,
        financeControl: {
          select: {
            id: true,
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
      where: {
        id_cliente: clientId,
      },
    });

    return finance;
  }

  async findById(id: number): Promise<IFinance['findById'] | null> {
    const finance = await this.table.findUnique({
      select: {
        id: true,
        id_cliente: true,
        id_filial: true,
        remetente: true,
        emitente: true,
        direcao: true,
        documento_numero: true,
        numero_fiscal: true,
        descricao: true,
        log_user: true,
        log_date: true,
        frequencia_fixa: true,
        frequencia_pagamento: true,
        documento_valor: true,
        parcelar: true,
        quantidade_parcela: true,
        data_vencimento: true,
        data_emissao: true,
        data_lancamento: true,
        chave: true,
        status: true,
        total_acrescimo: true,
        total_desconto: true,
        acrescimo_desconto: true,
        total_liquido: true,
        bankTransferPay: {
          select: {
            id: true,
            data_transferencia: true,
          },
        },
        bankTransferReceive: {
          select: {
            id: true,
            data_transferencia: true,
          },
        },
        financeControl: {
          select: {
            id: true,
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
        installmentFinance: {
          select: {
            id: true,
            parcela: true,
            valor_a_pagar: true,
            valor_parcela: true,
            status: true,
          },
        },
        documentType: {
          select: {
            id: true,
            descricao: true,
          },
        },
        paymentType: {
          select: {
            id: true,
            descricao: true,
          },
        },
        registerTribute: {
          select: {
            id: true,
            valor: true,
            tipo: true,
            tribute: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        requestProvider: {
          select: {
            id: true,
            id_pedido: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return finance;
  }

  async findByNotControl(
    clientId: number,
    type: 'pagar' | 'receber',
  ): Promise<smartnewsystem_financeiro_descricao_titulos[]> {
    const finance = await this.table.findMany({
      where: {
        //id_cliente: clientId,
        id_controle: null,
        direcao: type,
      },
    });

    return finance;
  }

  async listByClientAndStatus(
    clientId: number,
    type: $Enums.smartnewsystem_financeiro_descricao_titulos_direcao,
    status: $Enums.smartnewsystem_financeiro_descricao_titulos_status,
  ): Promise<IFinance['listByClientAndStatus'][]> {
    const finance = await this.table.findMany({
      select: {
        id: true,
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
        data_emissao: true,
        documento_numero: true,
        numero_fiscal: true,
      },
      where: {
        id_cliente: clientId,
        direcao: type,
        status,
      },
    });

    return finance;
  }

  async listByFilterDynamic(
    where: Prisma.smartnewsystem_financeiro_descricao_titulosWhereInput,
  ): Promise<IFinance['listByFilterDynamic'][]> {
    const finance = await this.table.findMany({
      select: {
        id: true,
        financeControl: {
          select: {
            issuePay: {
              select: {
                razao_social: true,
              },
            },
            senderPay: {
              select: {
                filial_numero: true,
              },
            },
            issueReceive: {
              select: {
                filial_numero: true,
              },
            },
            senderReceive: {
              select: {
                razao_social: true,
              },
            },
          },
        },
        data_emissao: true,
        documento_numero: true,
        numero_fiscal: true,
      },
      where,
    });

    return finance;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_descricao_titulosUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_descricao_titulos> {
    const finance = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return finance;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prismaService.$transaction(async (tx) => {
        await tx.smartnewsystem_financeiro_titulo_pagamento.deleteMany({
          where: {
            id_titulo: id,
          },
        });

        await tx.smartnewsystem_financeiro_descricao_titulos.delete({
          where: {
            id,
          },
        });
      });
    } catch (error: any) {
      console.log(error);

      throw new Error(error);
    }

    return true;
  }
}
