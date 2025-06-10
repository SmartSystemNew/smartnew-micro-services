import { Injectable } from '@nestjs/common';
import { Prisma, sofman_estoque_entrada } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import StockInventoryRepository from '../stock-inventory-repository';
import { Decimal } from '@prisma/client/runtime/library';
import IStockInventory from 'src/models/IStockInventory';

@Injectable()
export default class StockInventoryRepositoryPrisma
  implements StockInventoryRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_estoque_entrada;

  async listOut(
    branches: number[],
    index: number,
    perPage: number,
    filter?: Prisma.sofman_estoque_entradaWhereInput | null,
  ): Promise<IStockInventory['listOut'][]> {
    const stockOut = await this.table.findMany({
      skip: index * perPage,
      take: perPage,
      select: {
        id: true,
        data_entrada: true,
        quantidade: true,
        valor_unitario: true,
        numero_serie: true,
        observacao: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        material: {
          select: {
            id: true,
            material: true,
            unidade: true,
          },
        },
        materialCodigo: {
          select: {
            id: true,
            codigo: true,
          },
        },
      },
      where: {
        branch: {
          ID: {
            in: branches,
          },
        },
        id_entrada: null,
        ...filter,
      },
      orderBy: { data_entrada: 'desc' },
    });

    return stockOut;
  }

  async countList(
    branches: number[],
    filter?: Prisma.sofman_estoque_entradaWhereInput | null,
  ): Promise<number> {
    const stockOut = await this.table.aggregate({
      _count: true,
      where: {
        branch: {
          ID: {
            in: branches,
          },
        },
        id_entrada: null,
        ...filter,
      },
    });

    return stockOut._count || 0;
  }

  async findById(id: number): Promise<IStockInventory['findById'] | null> {
    const stockOut = await this.table.findFirst({
      select: {
        id: true,
        data_entrada: true,
        quantidade: true,
        valor_unitario: true,
        numero_serie: true,
        observacao: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        material: {
          select: {
            id: true,
            material: true,
            unidade: true,
          },
        },
        materialCodigo: {
          select: {
            id: true,
            codigo: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return stockOut;
  }

  async listByMaterial(materialId: number): Promise<sofman_estoque_entrada[]> {
    const stockIn = await this.table.findMany({
      where: {
        id_produto: materialId,
      },
    });

    return stockIn;
  }

  async sumGroupMaterialByBeforeDate(
    clientId: number,
    date: Date,
    materialId?: number[] | null,
  ): Promise<{ id_produto: number; quantity: Decimal }[]> {
    const groupByMaterial: { id_produto: number; quantity: Decimal }[] =
      await this.prismaService.$queryRaw`
      select
	      see.id_produto,
        ROUND(IFNUll(sum(see.quantidade),0),2) as quantity
      from sofman_estoque_entrada see
      join sofman_entrada_estoque e on e.id = see.id_entrada
      join sofman_cad_materiais scm on scm.id = see.id_produto
      where scm.id_cliente = ${clientId}
      and e.data_entrada <= ${date}
      ${Prisma.raw(
        materialId ? `and see.id_produto IN (${materialId.join(',')})` : '',
      )}
      group by see.id_produto;
    `;

    return groupByMaterial;
  }

  async sumGroupMaterialSecondaryByBeforeDate(
    clientId: number,
    date: Date,
    materialId?: number[] | null,
  ): Promise<{ id_codigo: number; quantity: Decimal }[]> {
    const groupByMaterial: { id_codigo: number; quantity: Decimal }[] =
      await this.prismaService.$queryRaw`
      select
	      see.id_codigo,
        ROUND(IFNUll(sum(see.quantidade),0),2) as quantity
      from sofman_estoque_entrada see
      join sofman_entrada_estoque e on e.id = see.id_entrada
      join smartnewsystem_material_codigo scm on scm.id = see.id_codigo
      where scm.id_cliente = ${clientId}
      and e.data_entrada <= ${date}
      ${Prisma.raw(
        materialId ? `and see.id_codigo IN (${materialId.join(',')})` : '',
      )}
      group by see.id_codigo;
    `;

    return groupByMaterial;
  }

  async create(
    data: Prisma.sofman_estoque_entradaUncheckedCreateInput,
  ): Promise<sofman_estoque_entrada> {
    const entry = await this.table.create({ data });

    return entry;
  }

  async update(
    id: number,
    data: Prisma.sofman_estoque_entradaUncheckedUpdateInput,
  ): Promise<sofman_estoque_entrada> {
    const entry = await this.table.update({
      data,
      where: {
        id: id,
      },
    });

    return entry;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id: id,
      },
    });

    return true;
  }
}
