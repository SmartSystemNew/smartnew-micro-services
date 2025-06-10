import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import ILogMaterial from 'src/models/ILogMaterial';
import LogMaterialRepository from '../log-material-repository';

@Injectable()
export default class LogMaterialRepositoryPrisma
  implements LogMaterialRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.log_sofman_cad_materiais;

  async listByClientAndActive(
    clientId: number,
    filter?: Prisma.log_sofman_cad_materiaisWhereInput | null,
  ): Promise<ILogMaterial['listByClientAndActive'][]> {
    const material = await this.table.findMany({
      select: {
        id: true,
        id_material: true,
        acao: true,
        codigo: true,
        material: true,
      },
      where: {
        id_cliente: clientId,
        ativo: 1,
        ...filter,
      },
    });

    return material;
  }

  async listStock(
    clientId: number,
    log_date: Date,
  ): Promise<ILogMaterial['listStock'][]> {
    const stock = await this.prismaService.$queryRaw`
        select
          lscm.id,
          (select
              acao
            from _log_sofman_cad_materiais
            where id_material = lscm.id_material
            order by lscm.id desc
            limit 1
          ) as acao ,
          lscm.id_material,
          lscm.codigo,
          lscm.material,
          lscm.unidade,
          sccm.descricao,
          COALESCE (estoque.entrada,0) entrada,
          COALESCE (ordem_servico.saida, 0) saida,
          lscm.estoque_max,
          lscm.estoque_min,
          coalesce(
            (select
              see3.valor_unitario
            from sofman_estoque_entrada see3
            join sofman_entrada_estoque see4 on see4.id = see3.id_entrada
            where see3.id_produto = lscm.id_material
            order by see3.id desc
            limit 1)
          , 0 ) as ultima_entrada,
          coalesce(
            (
              select
                smos2.valor_unidade
              from sofman_materiais_ordem_servico smos2
              where smos2.material = lscm.id_material
              order by smos2.id desc
              limit 1
            )
          ,0) as ultima_saida
        from _log_sofman_cad_materiais lscm
        left join (
          select
            id_produto,
            COALESCE(sum(quantidade), 0 ) as entrada
          from sofman_estoque_entrada see
          join sofman_entrada_estoque see2 on see2.id = see.id_entrada
          group by id_produto
        ) estoque on lscm.id_material = estoque.id_produto
        left join (
          select
            material,
            COALESCE (sum(quantidade), 0 ) as saida
          from sofman_materiais_ordem_servico smos
          group by material
        ) ordem_servico on ordem_servico.material = lscm.id_material
        left join sofman_cad_categorias_materiais sccm on sccm.id = lscm.id_categoria
        where lscm.id_cliente = ${clientId}
        and lscm.tipo = 'stock'
        and lscm.ativo = 1
        and lscm.log_date >= ${log_date.toISOString().split('T')[0]}
        group by lscm.id_material
        having entrada > 0 or saida > 0
      `;

    return stock as [];
  }
}
