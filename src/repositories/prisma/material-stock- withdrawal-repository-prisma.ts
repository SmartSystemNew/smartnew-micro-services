import { Injectable } from '@nestjs/common';
import {
  Prisma,
  smartnewsystem_material_estoque_retirada,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import MaterialStockWithDrawalRepository from '../material-stock-withdrawal-repository';
import { IMaterialStockWithDrawal } from 'src/models/IMaterialStockWithdrawal';

@Injectable()
export default class MaterialStockWithDrawalRepositoryPrisma
  implements MaterialStockWithDrawalRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_material_estoque_retirada;

  async listWithdrawal(
    branches: number[],
  ): Promise<IMaterialStockWithDrawal['listWithdrawal'][]> {
    const withdrawals = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        id_material: true,
        quantidade: true,
        id_material_secondario: true,
        id_cliente: true,
        id_item: true,
        id_filial: true,
        status: true,
        log_date: true,
        responsavel: true,
        url: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        material: {
          select: {
            material: true,
            unidade: true,
            codigo_secundario: true,
            codigo_ncm: true,
          },
        },
        itemBuy: {
          select: {
            estoque: true,
            quantidade: true,
            buy: {
              select: {
                id: true,
                numero: true,
              },
            },
            compositionItem: {
              select: {
                composicao: true,
                descricao: true,
                compositionGroup: {
                  select: {
                    composicao: true,
                    descricao: true,
                    costCenter: {
                      select: {
                        centro_custo: true,
                        descricao: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        materialCodigo: {
          select: {
            classificacao: true,
            codigo: true,
            especificacao: true,
            marca: true,
          },
        },
      },
      where: {
        id_filial: { in: branches },
      },
    });

    return withdrawals;
  }

  async findById(
    id: number,
  ): Promise<smartnewsystem_material_estoque_retirada | null> {
    const withdrawal = await this.table.findFirst({
      where: {
        id: id,
      },
    });

    return withdrawal;
  }

  async create(
    data: Prisma.smartnewsystem_material_estoque_retiradaUncheckedCreateInput,
  ): Promise<smartnewsystem_material_estoque_retirada> {
    const withdrawal = await this.table.create({
      data,
    });

    return withdrawal;
  }

  async update(
    id: number,
    data: Prisma.smartnewsystem_material_estoque_retiradaUncheckedUpdateInput,
  ): Promise<smartnewsystem_material_estoque_retirada> {
    const withdrawal = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return withdrawal;
  }
}
