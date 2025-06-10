import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_materiais } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IMaterial } from 'src/models/IMaterial';
import MaterialRepository from '../material-repository';

@Injectable()
export default class MaterialRepositoryPrisma implements MaterialRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_materiais;

  async findMaterialAndBound(
    id: number,
  ): Promise<IMaterial['findMaterialAndBound'] | null> {
    const material = await this.table.findFirst({
      select: {
        id: true,
        material: true,
        itemForMaterial: {
          select: {
            id: true,
          },
          take: 1,
        },
        materialServiceOrder: {
          select: {
            id: true,
          },
          take: 1,
        },
        materialSuppliers: {
          select: {
            id: true,
          },
          take: 1,
        },
        materialPlanPrev: {
          select: {
            id: true,
          },
          take: 1,
        },
      },
      where: {
        id,
      },
    });

    return material;
  }

  async listStock(
    clientId: number,
    start?: string | null,
    end?: string | null,
    materialId?: number[],
  ): Promise<IMaterial['listStock'][]> {
    const whereIn =
      start && end
        ? `where see2.data_entrada between '${start}' and '${end}'`
        : start && !end
        ? `where see2.data_entrada >= '${start}'`
        : !start && end
        ? `where see2.data_entrada <= '${end}'`
        : '';

    const whereOut =
      start && end
        ? `where data_uso between '${start}' and '${end}'`
        : start && !end
        ? `where data_uso >= '${start}' `
        : !start && end
        ? `where data_uso <= '${end}' `
        : 'where data_uso is not null';

    const andMaterial = materialId
      ? `and scm.id in (${materialId.join(',')})`
      : '';

    const stock = await this.prismaService.$queryRaw`
      select
				scm.id,
				scm.codigo,
				scm.material,
				scm.unidade,
				sccm.descricao,
				COALESCE (estoque.entrada,0) entrada,
				COALESCE (ordem_servico.saida, 0) saida,
				scm.estoque_max,
				scm.estoque_min,
				coalesce(
					(select
						see3.valor_unitario
					from sofman_estoque_entrada see3
					join sofman_entrada_estoque see4 on see4.id = see3.id_entrada
					where see3.id_produto = scm.id
					order by see3.id desc
					limit 1)
				, 0 ) as ultima_entrada,
				coalesce(
					(
						select
							smos2.valor_unidade
						from sofman_materiais_ordem_servico smos2
						where smos2.material = scm.id
						order by smos2.id desc
						limit 1
					)
				,0) as ultima_saida
			from sofman_cad_materiais scm
			left join (
				select
          id_produto,
					COALESCE(sum(quantidade), 0 ) as entrada
				from sofman_estoque_entrada see
				join sofman_entrada_estoque see2 on see2.id = see.id_entrada
				${Prisma.raw(whereIn ? `${whereIn}` : '')}
				group by id_produto
			) estoque on scm.id = estoque.id_produto
			left join (
				select
					material,
					COALESCE (sum(quantidade), 0 ) as saida
				from sofman_materiais_ordem_servico smos
				${Prisma.raw(whereOut ? `${whereOut}` : '')}
				group by material
			) ordem_servico on ordem_servico.material = scm.id
			left join sofman_cad_categorias_materiais sccm on sccm.id = scm.id_categoria
			where scm.id_cliente = ${clientId}
			and scm.tipo = 'stock'
			and scm.ativo = 1
      ${Prisma.raw(andMaterial ? ` ${andMaterial}` : '')}
			having entrada > 0 or saida > 0
    `;

    return stock as [];
  }

  async listStockCodeSecond(
    clientId: number,
    start?: string | null,
    end?: string | null,
    secondId?: number[],
  ): Promise<IMaterial['listStockCodeSecond'][]> {
    const whereIn =
      start && end
        ? `where see2.data_entrada between '${start}' and '${end}'`
        : start && !end
        ? `where see2.data_entrada >= '${start}'`
        : !start && end
        ? `where see2.data_entrada <= '${end}'`
        : '';

    const whereOut =
      start && end
        ? `where data_uso between '${start}' and '${end}'`
        : start && !end
        ? `where data_uso >= '${start}' `
        : !start && end
        ? `where data_uso <= '${end}' `
        : 'where data_uso is not null';

    const whereOutEntry =
      start && end
        ? `where data_entrada between '${start}' and '${end}'`
        : start && !end
        ? `where data_entrada >= '${start}' `
        : !start && end
        ? `where data_entrada <= '${end}' `
        : 'where data_entrada is not null';

    const andMaterial = secondId ? `and smc.id in (${secondId.join(',')})` : '';

    const stock = await this.prismaService.$queryRaw`
      select
        smc.id,
				smc.codigo,
				scm.material,
        smc.marca,
				smc.classificacao,
				smc.especificacao,
				scm.unidade,
				sccm.descricao,
				COALESCE (estoque.entrada,0) entrada,
				COALESCE (ordem_servico.saida, 0) saida,
        COALESCE (estoque_aprovado.reserva, 0) reserva,
				smc.estoque_max,
				smc.estoque_min,
				coalesce(
					(select
						see3.valor_unitario
					from sofman_estoque_entrada see3
					join sofman_entrada_estoque see4 on see4.id = see3.id_entrada
					where see3.id_codigo = smc.id
					order by see3.id desc
					limit 1)
				, 0 ) as ultima_entrada,
				coalesce(
					(
						select
							smos2.valor_unidade
						from sofman_materiais_ordem_servico smos2
						where smos2.id_codigo = smc.id
						order by smos2.id desc
						limit 1
					)
				,0) as ultima_saida
			from smartnewsystem_material_codigo smc
      join sofman_cad_materiais scm on scm.id = smc.id_material
			left join (
				select
          see.id_codigo,
					COALESCE(sum(quantidade), 0 ) as entrada
				from sofman_estoque_entrada see
				join sofman_entrada_estoque see2 on see2.id = see.id_entrada
				${Prisma.raw(whereIn ? `${whereIn}` : '')}
				group by id_codigo
			) estoque on smc.id = estoque.id_codigo
			left join (
				select
					id_codigo,
					COALESCE (sum(quantidade), 0 ) as saida
				from (
          select
            id_codigo,
            quantidade
          from sofman_materiais_ordem_servico smos
          ${Prisma.raw(whereOut ? `${whereOut}` : '')}

          UNION ALL

          select
            see.id_codigo,
            see.quantidade
          from sofman_estoque_entrada see
          ${Prisma.raw(whereOutEntry ? `${whereOutEntry}` : '')}
          and see.id_entrada IS NULL
        ) combined_saidas
				group by id_codigo
			) ordem_servico on ordem_servico.id_codigo = smc.id
      left join (
        select
          id_material_secundario,
          COALESCE (sum(quantidade), 0 ) as reserva
        from smartnewsystem_material_estoque sme
        where status = 1
        and retirada is null
        group by id_material_secundario
      ) estoque_aprovado on estoque_aprovado.id_material_secundario = smc.id
			left join sofman_cad_categorias_materiais sccm on sccm.id = scm.id_categoria
			where scm.id_cliente = ${clientId}
			and scm.tipo = 'stock'
			and scm.ativo = 1
      ${Prisma.raw(andMaterial ? ` ${andMaterial}` : '')}
			having entrada > 0 or saida > 0
    `;

    return stock as [];
  }

  async listStockCodeSecondInPage(
    clientId: number,
    index: number,
    perPage: number,
    start?: string | null,
    end?: string | null,
    secondId?: number[],
    filter?: string,
  ): Promise<IMaterial['listStockCodeSecondInPage'][]> {
    const whereIn =
      start && end
        ? `where see2.data_entrada between '${start}' and '${end}'`
        : start && !end
        ? `where see2.data_entrada >= '${start}'`
        : !start && end
        ? `where see2.data_entrada <= '${end}'`
        : '';

    const whereOut =
      start && end
        ? `where data_uso between '${start}' and '${end}'`
        : start && !end
        ? `where data_uso >= '${start}' `
        : !start && end
        ? `where data_uso <= '${end}' `
        : 'where data_uso is not null';

    const whereOutEntry =
      start && end
        ? `where data_entrada between '${start}' and '${end}'`
        : start && !end
        ? `where data_entrada >= '${start}' `
        : !start && end
        ? `where data_entrada <= '${end}' `
        : 'where data_entrada is not null';

    const andMaterial = secondId ? `and smc.id in (${secondId.join(',')})` : '';

    const stock = await this.prismaService.$queryRaw`
      select
        smc.id,
				smc.codigo,
				scm.material,
        smc.marca,
				smc.classificacao,
				smc.especificacao,
				scm.unidade,
				sccm.descricao,
				COALESCE (estoque.entrada,0) entrada,
				COALESCE (ordem_servico.saida, 0) saida,
        COALESCE (estoque_aprovado.reserva, 0) reserva,
				smc.estoque_max,
				smc.estoque_min,
				coalesce(
					(select
						see3.valor_unitario
					from sofman_estoque_entrada see3
					join sofman_entrada_estoque see4 on see4.id = see3.id_entrada
					where see3.id_codigo = smc.id
					order by see3.id desc
					limit 1)
				, 0 ) as ultima_entrada,
				coalesce(
					(
						select
							smos2.valor_unidade
						from sofman_materiais_ordem_servico smos2
						where smos2.id_codigo = smc.id
						order by smos2.id desc
						limit 1
					)
				,0) as ultima_saida
			from smartnewsystem_material_codigo smc
      join sofman_cad_materiais scm on scm.id = smc.id_material
			left join (
				select
          see.id_codigo,
					COALESCE(sum(quantidade), 0 ) as entrada
				from sofman_estoque_entrada see
				join sofman_entrada_estoque see2 on see2.id = see.id_entrada
				${Prisma.raw(whereIn ? `${whereIn}` : '')}
				group by id_codigo
			) estoque on smc.id = estoque.id_codigo
			left join (
				select
					id_codigo,
					COALESCE (sum(quantidade), 0 ) as saida
				from (
          select
            id_codigo,
            quantidade
          from sofman_materiais_ordem_servico smos
          ${Prisma.raw(whereOut ? `${whereOut}` : '')}

          UNION ALL

          select
            see.id_codigo,
            see.quantidade
          from sofman_estoque_entrada see
          ${Prisma.raw(whereOutEntry ? `${whereOutEntry}` : '')}
          and see.id_entrada IS NULL
        ) combined_saidas
				group by id_codigo
			) ordem_servico on ordem_servico.id_codigo = smc.id
      left join (
        select
          id_material_secundario,
          COALESCE (sum(quantidade), 0 ) as reserva
        from smartnewsystem_material_estoque sme
        where status = 1
        and retirada is null
        group by id_material_secundario
      ) estoque_aprovado on estoque_aprovado.id_material_secundario = smc.id
			left join sofman_cad_categorias_materiais sccm on sccm.id = scm.id_categoria
			where scm.id_cliente = ${clientId}
			and scm.tipo = 'stock'
			and scm.ativo = 1
      ${Prisma.raw(andMaterial ? ` ${andMaterial}` : '')}
      ${Prisma.raw(filter ? `${filter}` : ``)}
			having entrada > 0 or saida > 0
      limit ${perPage} offset ${index}
    `;

    return stock as [];
  }

  async countListStockCodeSecond(
    clientId: number,
    start?: string | null,
    end?: string | null,
    secondId?: number[],
    filter?: string,
  ): Promise<number> {
    const whereIn =
      start && end
        ? `where see2.data_entrada between '${start}' and '${end}'`
        : start && !end
        ? `where see2.data_entrada >= '${start}'`
        : !start && end
        ? `where see2.data_entrada <= '${end}'`
        : '';

    const whereOut =
      start && end
        ? `where data_uso between '${start}' and '${end}'`
        : start && !end
        ? `where data_uso >= '${start}' `
        : !start && end
        ? `where data_uso <= '${end}' `
        : 'where data_uso is not null';

    const whereOutEntry =
      start && end
        ? `where data_entrada between '${start}' and '${end}'`
        : start && !end
        ? `where data_entrada >= '${start}' `
        : !start && end
        ? `where data_entrada <= '${end}' `
        : 'where data_entrada is not null';

    const andMaterial = secondId ? `and smc.id in (${secondId.join(',')})` : '';

    const stock: { total_itens: number }[] = await this.prismaService.$queryRaw`
      SELECT COUNT(*) AS total_itens
      FROM smartnewsystem_material_codigo smc
      JOIN sofman_cad_materiais scm ON scm.id = smc.id_material
      LEFT JOIN (
          SELECT see.id_codigo, COALESCE(SUM(quantidade), 0) AS entrada
          FROM sofman_estoque_entrada see
          JOIN sofman_entrada_estoque see2 ON see2.id = see.id_entrada
          ${Prisma.raw(whereIn ? `${whereIn}` : '')}
          GROUP BY see.id_codigo
          HAVING COALESCE(SUM(quantidade), 0) > 0
      ) estoque ON smc.id = estoque.id_codigo
      LEFT JOIN (
          SELECT id_codigo, COALESCE(SUM(quantidade), 0) AS saida
          FROM (
              SELECT id_codigo, quantidade
              FROM sofman_materiais_ordem_servico smos
              ${Prisma.raw(whereOut ? `${whereOut}` : '')}
              UNION ALL
              SELECT see.id_codigo, see.quantidade
              FROM sofman_estoque_entrada see
              ${Prisma.raw(whereOutEntry ? `${whereOutEntry}` : '')}
              AND see.id_entrada IS NULL
          ) combined_saidas
          GROUP BY id_codigo
          HAVING COALESCE(SUM(quantidade), 0) > 0
      ) ordem_servico ON ordem_servico.id_codigo = smc.id
      LEFT JOIN (
          SELECT id_material_secundario, COALESCE(SUM(quantidade), 0) AS reserva
          FROM smartnewsystem_material_estoque sme
          WHERE status = 1 AND retirada IS NULL
          GROUP BY id_material_secundario
      ) estoque_aprovado ON estoque_aprovado.id_material_secundario = smc.id
      WHERE scm.id_cliente = ${clientId}
      AND scm.tipo = 'stock'
      AND scm.ativo = 1
      ${Prisma.raw(andMaterial ? ` ${andMaterial}` : '')}
      ${Prisma.raw(filter ? ` ${filter}` : '')}
      AND (estoque.entrada > 0 OR ordem_servico.saida > 0 OR estoque.entrada IS NOT NULL OR ordem_servico.saida IS NOT NULL);
    `;

    return stock.length > 0 ? Number(stock[0].total_itens) : 0;
  }

  async create(
    data: Prisma.sofman_cad_materiaisUncheckedCreateInput,
  ): Promise<sofman_cad_materiais> {
    const material = await this.table.create({ data });

    return material;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async listByClient(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
  ): Promise<IMaterial['listByClient'][]> {
    const obj = await this.table.findMany({
      ...(index != null && {
        skip: index * perPage,
        take: perPage,
      }),
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        id_cliente: true,
        id_filial: true,
        codigo: true,
        material: true,
        unidade: true,
        ativo: true,
        valor: true,
        Valor_venda: true,
        fator: true,
        estoque_min: true,
        estoque_max: true,
        estoque_real: true,
        localizacao: true,
        log_date: true,
        log_user: true,
        sessao_id: true,
        //DataEstoqueMin: true,
        id_categoria: true,
        codigo_ncm: true,
        codigo_secundario: true,
        observacao: true,
        tipo: true,
        categoryMaterial: {
          select: {
            id: true,
            descricao: true,
          },
        },
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        branch: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        // materialSectorExecutorIn: {
        //   select: {
        //     Id: true,
        //     observacao: true,
        //   },
        // },
        // stockIn: {
        //   select: {
        //     id: true,
        //     numero_serie: true,
        //   },
        // },
        // stockMovement: {
        //   select: {
        //     Id: true,
        //     descricao_vinculo: true,
        //   },
        // },
        // materialSuppliers: {
        //   select: {
        //     id: true,
        //     observacoes: true,
        //   },
        // },
        // materialServiceOrder: {
        //   select: {
        //     id: true,
        //     codigo: true,
        //   },
        // },
        // materialPlanPrev: {
        //   select: {
        //     id: true,
        //     material: true,
        //   },
        // },
        // materialProject: {
        //   select: {
        //     id: true,
        //     observacao: true,
        //   },
        // },
        // purchaseItemRequest: {
        //   select: {
        //     id: true,
        //     observacao: true,
        //   },
        // },
        // itemForMaterial: {
        //   select: {
        //     id: true,
        //     item: true,
        //   },
        // },
      },
      where: {
        id_cliente: clientId,
      },
    });
    return obj;
  }

  async listForReportStockByClient(
    clientId: number,
    index?: number | null,
    perPage?: number | null,
    currentDate?: Date | null,
    filter?: Prisma.sofman_cad_materiaisWhereInput | null,
  ): Promise<IMaterial['listForReportStockByClient'][]> {
    const obj = await this.table.findMany({
      ...(index !== null ? { skip: index * perPage, take: perPage } : {}),
      select: {
        id: true,
        id_cliente: true,
        id_filial: true,
        codigo: true,
        material: true,
        codigo_secundario: true,
        unidade: true,
        ativo: true,
        valor: true,
        Valor_venda: true,
        fator: true,
        estoque_min: true,
        estoque_max: true,
        estoque_real: true,
        localizacao: true,
        log_date: true,
        log_user: true,
        sessao_id: true,
        DataEstoqueMin: true,
        id_categoria: true,
        categoryMaterial: {
          select: {
            id: true,
            descricao: true,
          },
        },
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        stockIn: {
          select: {
            id: true,
            numero_serie: true,
            quantidade: true,
            data_entrada: true,
            valor_unitario: true,
          },
          where: {
            stock: {
              data_entrada: currentDate,
            },
          },
        },
        materialServiceOrder: {
          select: {
            id: true,
            codigo: true,
            data_uso: true,
            valor_unidade: true,
            quantidade: true,
            serviceOrder: {
              select: {
                ID: true,
                ordem: true,
                statusOrderService: {
                  select: {
                    id: true,
                    status: true,
                    cor: true,
                  },
                },
              },
            },
          },
          where: {
            data_uso: currentDate,
          },
        },
        // purchaseItemRequest: {
        //   select: {
        //     id: true,
        //     observacao: true,
        //   },
        // },
        // itemForMaterial: {
        //   select: {
        //     id: true,
        //     item: true,
        //   },
        // },
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });
    return obj;
  }

  async listByClientAndActive(
    clientId: number,
    filter?: Prisma.sofman_cad_materiaisWhereInput | null,
    index?: number | null,
    perPage?: number | null,
  ): Promise<IMaterial['listByClientAndActive'][]> {
    const material = await this.table.findMany({
      ...(index !== undefined &&
        index !== null && {
          skip: perPage * index,
          take: perPage,
        }),
      select: {
        id: true,
        id_cliente: true,
        codigo: true,
        material: true,
        unidade: true,
        id_categoria: true,
        tipo: true,
        localizacao: true,
        log_user: true,
        ativo: true,
        observacao: true,
        codigo_ncm: true,
        categoryMaterial: {
          select: {
            id: true,
            descricao: true,
          },
        },
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        branch: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        location: {
          select: {
            id: true,
            localizacao: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
        ativo: 1,
        ...filter,
      },
    });

    return material;
  }

  async countListByClientAndActive(
    clientId: number,
    filter?: Prisma.sofman_cad_materiaisWhereInput | null,
  ): Promise<number> {
    const material = await this.table.count({
      where: {
        id_cliente: clientId,
        ativo: 1,
        ...filter,
      },
    });

    return material || 0;
  }

  async findById(id: number): Promise<IMaterial['listById'] | null> {
    const obj = await this.table.findUnique({
      select: {
        id: true,
        codigo: true,
        material: true,
        unidade: true,
        id_categoria: true,
        id_cliente: true,
        localizacao: true,
        observacao: true,
        ativo: true,
        estoque_min: true,
        estoque_max: true,
        tipo: true,
        codigo_ncm: true,
        codigo_secundario: true,
        categoryMaterial: {
          select: {
            id: true,
            descricao: true,
          },
        },
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        branch: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        materialSectorExecutorIn: {
          select: {
            Id: true,
            observacao: true,
          },
        },
        stockIn: {
          select: {
            id: true,
            numero_serie: true,
            quantidade: true,
            valor_unitario: true,
          },
        },
        stockMovement: {
          select: {
            Id: true,
            descricao_vinculo: true,
          },
        },
        materialSuppliers: {
          select: {
            id: true,
            observacoes: true,
          },
        },
        materialServiceOrder: {
          select: {
            id: true,
            codigo: true,
            quantidade: true,
            valor_unidade: true,
          },
        },
        materialPlanPrev: {
          select: {
            id: true,
            material: true,
          },
        },
        materialProject: {
          select: {
            id: true,
            observacao: true,
          },
        },
        purchaseItemRequest: {
          select: {
            id: true,
            observacao: true,
          },
        },
        itemForMaterial: {
          select: {
            id: true,
            item: true,
          },
        },
        materialCode: {
          select: {
            id: true,
            codigo: true,
            classificacao: true,
            marca: true,
            especificacao: true,
            estoque_min: true,
            estoque_max: true,
          },
        },
      },
      where: {
        id,
      },
    });

    return obj;
  }

  async groupStockByPrice(
    id: number,
  ): Promise<IMaterial['groupStockByPrice'][]> {
    const obj = await this.table.findUnique({
      select: {
        id: true,
        codigo: true,
        material: true,
        tipo: true,
        stockIn: {
          select: {
            id: true,
            numero_serie: true,
            quantidade: true,
            valor_unitario: true,
          },
        },
        materialServiceOrder: {
          select: {
            id: true,
            codigo: true,
            quantidade: true,
            valor_unidade: true,
          },
        },
      },
      where: {
        id,
      },
    });

    // Agrupe as entradas e saídas por preço
    const groupedStockIn = obj.stockIn.reduce((acc, item) => {
      acc[Number(item.valor_unitario)] =
        (acc[Number(item.valor_unitario)] || 0) + Number(item.quantidade);
      return acc;
    }, {});

    const groupedMaterialServiceOrder = obj.materialServiceOrder.reduce(
      (acc, item) => {
        acc[Number(item.valor_unidade)] =
          (acc[Number(item.valor_unidade)] || 0) + Number(item.quantidade);
        return acc;
      },
      {},
    );

    // Calcule o estoque atual por preço
    const stock = Object.keys(groupedStockIn).map((price) => {
      const stockIn = groupedStockIn[price] || 0;
      const stockOut = groupedMaterialServiceOrder[price] || 0;

      return {
        price: Number(price),
        quantity: stockIn - stockOut,
      };
    });

    return stock;
  }

  async findByClientAndMaterial(
    clientId: number,
    material: string,
  ): Promise<IMaterial['findByClientAndMaterial'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        codigo: true,
        material: true,
        unidade: true,
        id_categoria: true,
        categoryMaterial: {
          select: {
            id: true,
            descricao: true,
          },
        },
        id_cliente: true,
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        materialSectorExecutorIn: {
          select: {
            Id: true,
            observacao: true,
          },
        },
        stockIn: {
          select: {
            id: true,
            numero_serie: true,
          },
        },
        stockMovement: {
          select: {
            Id: true,
            descricao_vinculo: true,
          },
        },
        materialSuppliers: {
          select: {
            id: true,
            observacoes: true,
          },
        },
        materialServiceOrder: {
          select: {
            id: true,
            codigo: true,
          },
        },
        materialPlanPrev: {
          select: {
            id: true,
            material: true,
          },
        },
        materialProject: {
          select: {
            id: true,
            observacao: true,
          },
        },
        purchaseItemRequest: {
          select: {
            id: true,
            observacao: true,
          },
        },
        itemForMaterial: {
          select: {
            id: true,
            item: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
        material,
      },
    });

    return obj;
  }
  async findByClientAndCodeAndMaterial(
    clientId: number,
    code: string,
    material: string,
  ): Promise<IMaterial['findByClientAndMaterial'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        codigo: true,
        material: true,
        unidade: true,
        id_categoria: true,
        categoryMaterial: {
          select: {
            id: true,
            descricao: true,
          },
        },
        id_cliente: true,
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        materialSectorExecutorIn: {
          select: {
            Id: true,
            observacao: true,
          },
        },
        stockIn: {
          select: {
            id: true,
            numero_serie: true,
          },
        },
        stockMovement: {
          select: {
            Id: true,
            descricao_vinculo: true,
          },
        },
        materialSuppliers: {
          select: {
            id: true,
            observacoes: true,
          },
        },
        materialServiceOrder: {
          select: {
            id: true,
            codigo: true,
          },
        },
        materialPlanPrev: {
          select: {
            id: true,
            material: true,
          },
        },
        materialProject: {
          select: {
            id: true,
            observacao: true,
          },
        },
        purchaseItemRequest: {
          select: {
            id: true,
            observacao: true,
          },
        },
        itemForMaterial: {
          select: {
            id: true,
            item: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
        material,
        codigo: code,
      },
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_materiaisUncheckedUpdateInput,
  ): Promise<sofman_cad_materiais> {
    const material = await this.table.update({ data, where: { id } });

    return material;
  }
}
