import { Injectable } from '@nestjs/common';
import { Prisma, sofman_materiais_ordem_servico } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IMaterialServiceOrder } from 'src/models/IMaterialServiceOrder';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import { MaterialServiceOrderRepository } from '../material-service-order-repository';

@Injectable()
export default class MaterialServiceOrderRepositoryPrisma
  implements MaterialServiceOrderRepository
{
  private table = this.prismaService.sofman_materiais_ordem_servico;

  constructor(private prismaService: PrismaService) {}
  async findById(
    id: number,
  ): Promise<IMaterialServiceOrder['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_filial: true,
        categoria: true,
        codigo: true,
        quantidade: true,
        unidade: true,
        valor_unidade: true,
        valor_total: true,
        utilizado: true,
        observacao: true,
        data_uso: true,
        n_serie_antigo: true,
        n_serie_novo: true,
        log_date: true,
        log_user: true,
        sessao_id: true,
        id_equipamento: true,
        id_codigo: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
          },
        },
        material: true,
        materials: {
          select: {
            id: true,
            codigo: true,
            material: true,
          },
        },
        materialCodigo: {
          select: {
            id: true,
            codigo: true,
          },
        },
        id_cliente: true,
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        id_ordem_servico: true,
        serviceOrder: {
          select: {
            ID: true,
            ordem: true,
          },
        },
        id_tarefa_plano: true,
        planPrev: {
          select: {
            ID: true,
            unidade_dia: true,
          },
        },
        id_programacao_r2: true,
        maintenancePlanTask: {
          select: {
            id: true,
            unidade: true,
          },
        },
        buyItem: {
          select: {
            id: true,
            buy: {
              select: {
                id: true,
                id_filial: true,
                status: true,
              },
            },
          },
        },
      },
      where: {
        id: id,
      },
    });

    return obj;
  }

  async create(
    data: Prisma.sofman_materiais_ordem_servicoUncheckedCreateInput,
  ): Promise<sofman_materiais_ordem_servico> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async createMaterialOrder(
    data: Prisma.sofman_materiais_ordem_servicoUncheckedCreateInput,
  ): Promise<IMaterialServiceOrder['createMaterialOrder']> {
    const obj = await this.table.create({
      data: {
        id_cliente: data.id_cliente,
        id_ordem_servico: data.id_ordem_servico,
        material: data.material,
        quantidade: data.quantidade,
        valor_unidade: data.valor_unidade,
        data_uso: data.data_uso,
        n_serie_novo: data.n_serie_novo,
        n_serie_antigo: data.n_serie_antigo,
      },
    });
    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_materiais_ordem_servicoUncheckedUpdateInput,
  ): Promise<sofman_materiais_ordem_servico> {
    const obj = await this.table.update({
      data,
      where: {
        id: id,
      },
    });

    return obj;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        id: id,
      },
    });

    return true;
  }
  async listByServiceOrder(
    idServiceOrder: number,
    filters: Prisma.sofman_materiais_ordem_servicoWhereInput = {},
    fields: string[] = [],
  ): Promise<IMaterialServiceOrder['listByServiceOrder'][]> {
    const where: Prisma.sofman_materiais_ordem_servicoWhereInput = {
      id_ordem_servico: idServiceOrder,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_materiais_ordem_servicoSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_filial: true,
            categoria: true,
            codigo: true,
            quantidade: true,
            unidade: true,
            valor_unidade: true,
            valor_total: true,
            utilizado: true,
            observacao: true,
            data_uso: true,
            n_serie_antigo: true,
            n_serie_novo: true,
            log_date: true,
            log_user: true,
            sessao_id: true,
            id_equipamento: true,
            id_codigo: true,
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
              },
            },
            material: true,
            materials: {
              select: {
                id: true,
                codigo: true,
                material: true,
              },
            },
            materialCodigo: {
              select: {
                id: true,
                codigo: true,
                marca: true,
                classificacao: true,
              },
            },
            id_cliente: true,
            company: {
              select: {
                ID: true,
                razao_social: true,
              },
            },
            id_ordem_servico: true,
            serviceOrder: {
              select: {
                ID: true,
                ordem: true,
              },
            },
            id_tarefa_plano: true,
            planPrev: {
              select: {
                ID: true,
                unidade_dia: true,
              },
            },
            id_programacao_r2: true,
            maintenancePlanTask: {
              select: {
                id: true,
                task: true,
              },
            },
            buyItem: {
              select: {
                id: true,
                buy: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            materialStock: {
              select: {
                id: true,
                stockWithdrawal: {
                  select: {
                    id: true,
                    log_date: true,
                  },
                },
              },
            },
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: {
        ...select,
        buyItem: {
          select: {
            id: true,
            buy: {
              select: {
                id: true,
                numero: true,
              },
            },
          },
        },
        materialStock: {
          select: {
            id: true,
            stockWithdrawal: {
              select: {
                id: true,
                log_date: true,
              },
            },
          },
        },
      },
      where: { ...where, ...filters },
    });
    return obj;
  }

  async listByMaterialOrderService(
    branches: number[],
    filter?: Prisma.sofman_materiais_ordem_servicoWhereInput | null,
  ): Promise<IMaterialServiceOrder['listByMaterialOrderService'][]> {
    const obj = await this.table.findMany({
      select: {
        id: true,
        id_ordem_servico: true,
        material: true,
        quantidade: true,
        valor_unidade: true,
        data_uso: true,
        n_serie_novo: true,
        n_serie_antigo: true,
      },
      where: {
        serviceOrder: {
          ID_filial: {
            in: branches,
          },
        },
        ...filter,
      },
    });

    return obj;
  }

  async sumGroupByMaterial(
    clientId: number,
    date: Date,
    materialId?: number[] | null,
  ): Promise<{ id_material: number; quantity: number }[]> {
    const obj: { id_material: number; quantity: number }[] = await this
      .prismaService.$queryRaw`
      select
        smos.material as id_material,
        round(IFNULL(sum(smos.quantidade),0) , 2) as quantity
      from sofman_materiais_ordem_servico smos
      join sofman_cad_materiais scm on scm.id = smos.material
      where scm.id_cliente = ${clientId}
      and data_uso <= ${date}
      ${Prisma.raw(
        materialId ? `and smos.material in (${materialId.join(',')})` : '',
      )}
      GROUP by smos.material;
    `;

    return obj;
  }

  async sumGroupByMaterialSecondary(
    clientId: number,
    date: Date,
    materialId?: number[] | null,
  ): Promise<{ id_codigo: number; quantity: number }[]> {
    const obj: { id_codigo: number; quantity: number }[] = await this
      .prismaService.$queryRaw`
      select
        smos.material as id_codigo,
        round(IFNULL(sum(smos.quantidade),0) , 2) as quantity
      from sofman_materiais_ordem_servico smos
      join smartnewsystem_material_codigo scm on scm.id = smos.material
      where scm.id_cliente = ${clientId}
      and data_uso <= ${date}
      ${Prisma.raw(
        materialId ? `and smos.id_codigo in (${materialId.join(',')})` : '',
      )}
      GROUP by smos.material;
    `;

    return obj;
  }
}
