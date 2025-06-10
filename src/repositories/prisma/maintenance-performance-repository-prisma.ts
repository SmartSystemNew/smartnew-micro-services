import { Injectable } from '@nestjs/common';
import { Prisma, sofman_prospect_escala_trabalho } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IMaintenancePerformance from 'src/models/IMaintenancePerformance';
import MaintenancePerformanceRepository from '../maintenance-performance-repository';

interface IFiltersCustos {
  equipamento?: string;
  localizacao?: string;
  familia?: string;
  tipo_equipamento?: string;
  ordensServico?: number[];
  globalFilter?: string;
  filterColumn?: string;
  filterText?: string;
}

@Injectable()
export default class MaintenancePerformanceRepositoryPrisma
  implements MaintenancePerformanceRepository
{
  constructor(private readonly prisma: PrismaService) {}

  private table = this.prisma.controle_de_ordens_de_servico;

  async gridIndicatorPerformanceMaintenance(
    clientId: number,
    startDate: string,
    endDate: string,
    page: number | null,
    perPage: number | null,
    filters: IFiltersCustos = {},
  ): Promise<IMaintenancePerformance['gridIndicatorPerformanceMaintenance'][]> {
    const {
      equipamento,
      localizacao,
      familia,
      tipo_equipamento,
      ordensServico,
      globalFilter,
      filterColumn,
      filterText,
    } = filters;

    const whereConditions = [];

    // Filtro global (busca em múltiplas colunas)
    if (globalFilter) {
      whereConditions.push(
        Prisma.sql`(
          eq.equipamento_codigo LIKE ${`%${globalFilter}%`} OR
          eq.descricao LIKE ${`%${globalFilter}%`} OR
          eq.localizacao LIKE ${`%${globalFilter}%`} OR
          fm.familia LIKE ${`%${globalFilter}%`} OR
          teq.tipo_equipamento LIKE ${`%${globalFilter}%`}
        )`,
      );
    }

    // Filtro por coluna específica
    if (filterColumn && filterText) {
      switch (filterColumn) {
        case 'equipamento':
          whereConditions.push(
            Prisma.sql`eq.equipamento_codigo LIKE ${`%${filterText}%`} OR eq.descricao LIKE ${`%${filterText}%`}`,
          );
          break;
        case 'localizacao':
          whereConditions.push(
            Prisma.sql`eq.localizacao LIKE ${`%${filterText}%`}`,
          );
          break;
        case 'familia':
          whereConditions.push(
            Prisma.sql`fm.familia LIKE ${`%${filterText}%`}`,
          );
          break;
        case 'tipo_equipamento':
          whereConditions.push(
            Prisma.sql`teq.tipo_equipamento LIKE ${`%${filterText}%`}`,
          );
          break;
        case 'ordensServico':
          whereConditions.push(Prisma.sql`os = ${Number(filterText)}`);
          break;
      }
    }

    // Filtros específicos (mantendo compatibilidade com o comportamento atual)
    if (equipamento && !filterColumn) {
      whereConditions.push(
        Prisma.sql`eq.equipamento_codigo LIKE ${`%${equipamento}%`} OR eq.descricao LIKE ${`%${equipamento}%`}`,
      );
    }
    if (localizacao && !filterColumn) {
      whereConditions.push(
        Prisma.sql`eq.localizacao LIKE ${`%${localizacao}%`}`,
      );
    }
    if (familia && !filterColumn) {
      whereConditions.push(Prisma.sql`fm.familia LIKE ${`%${familia}%`}`);
    }
    if (tipo_equipamento && !filterColumn) {
      whereConditions.push(
        Prisma.sql`teq.tipo_equipamento LIKE ${`%${tipo_equipamento}%`}`,
      );
    }
    if (ordensServico && ordensServico.length > 0 && !filterColumn) {
      whereConditions.push(
        Prisma.sql`os IN (${Prisma.join(ordensServico, ',')})`,
      );
    }

    const whereClause = whereConditions.length
      ? Prisma.sql`AND ${Prisma.join(whereConditions, ' AND ')}`
      : Prisma.empty;

    const offset = page !== null && perPage !== null ? page * perPage : null;

    const result = await this.prisma.$queryRaw<
      {
        Data: string;
        cliente: string;
        equipamento: string;
        localizacao: string;
        familia: string;
        tipo_equipamento: string;
        DISPONIBILIDADE: number;
        MTBF: number;
        MTTR: number;
        TempoPrevistoFuncionamento: number;
        TempoManutencao: number;
        OrdensServico: number;
      }[]
    >(
      Prisma.sql`
        SELECT * FROM (
            SELECT
                Data AS "Data",
                cliente,
                equipamento,
                localizacao,
                familia,
                tipo_equipamento,
                ROUND(IFNULL((tPrev - IF(toff > tPrev, tPrev, toff)) / tPrev * 100, 100), 2) AS DISPONIBILIDADE,
                ROUND(IFNULL((tPrev - IF(toff > tPrev, tPrev, toff)) / 60, tPrev), 2) AS MTBF,
                ROUND(IFNULL(IF(IF(toff > tPrev, tPrev, toff) = tPrev AND os = 0, tPrev / 60, ((IF(toff > tPrev, tPrev, toff) / 60) / os)), 0), 2) AS MTTR,
                CAST((tPrev / 60) AS DECIMAL(15,2)) AS TempoPrevistoFuncionamento,
                CAST(IFNULL((IF(toff > tPrev, tPrev, toff) / 60), 0) AS DECIMAL(15,2)) AS TempoManutencao,
                os AS OrdensServico
            FROM (
                SELECT
                    a.data_programada AS "Data",
                    fl.filial_numero AS cliente,
                    CONCAT(eq.equipamento_codigo, ' - ', eq.descricao) AS Equipamento,
                    eq.localizacao,
                    fm.familia,
                    teq.tipo_equipamento,
                    SUM(TIMESTAMPDIFF(MINUTE, inicio, IF(termino = '23:59:59', ADDDATE(termino, INTERVAL 1 MINUTE), termino))) AS tPrev,
                    (
                        SELECT
                            SUM(TIMESTAMPDIFF(MINUTE, IF(DATE(data_hora_stop) < a.data_programada, a.data_programada, data_hora_stop),
                            IF(ISNULL(data_hora_start) OR DATE(data_hora_start) > a.data_programada, ADDDATE(a.data_programada, INTERVAL 1440 MINUTE), data_hora_start)))
                        FROM sofman_apontamento_paradas
                        WHERE id_equipamento = eq.id
                        AND (a.data_programada = DATE(data_hora_stop)
                            OR DATE(data_hora_stop) < a.data_programada AND ISNULL(data_hora_start)
                            OR a.data_programada BETWEEN data_hora_stop AND data_hora_start)
                    ) +
                    IFNULL((
                        SELECT SUM(TIMESTAMPDIFF(MINUTE, data_programada, data_hora_start))
                        FROM sofman_apontamento_paradas
                        WHERE id_equipamento = a.id_equipamento
                        AND DATE(data_hora_start) = a.data_programada
                        AND DATE(data_hora_stop) < a.data_programada
                        ORDER BY data_hora_stop, data_hora_start
                    ), 0) AS toff,
                    (
                        SELECT
                            COUNT(DISTINCT id_ordem_servico) AS tos
                        FROM sofman_apontamento_paradas
                        WHERE id_equipamento = a.id_equipamento
                        AND DATE(data_hora_stop) = a.data_programada
                    ) AS os
                FROM sofman_prospect_escala_trabalho a
                JOIN cadastro_de_equipamentos eq ON eq.id = a.id_equipamento
                JOIN cadastro_de_filiais fl ON fl.id = eq.id_filial
                JOIN cadastro_de_familias_de_equipamento fm ON fm.id = eq.id_familia
                JOIN cadastro_de_tipos_de_equipamentos teq ON teq.id = eq.ID_tipoeqto
                WHERE fl.id IN (${clientId})
                AND data_programada <= CURDATE()
                AND data_programada BETWEEN ${startDate} AND ${endDate} ${whereClause}
                GROUP BY a.id_equipamento, a.data_programada
                ORDER BY a.id_equipamento, a.data_programada
            ) kpi
        ) KPIS_SOFMAN
        ${
          offset !== null && perPage !== null
            ? Prisma.raw(`LIMIT ${perPage} OFFSET ${offset}`)
            : Prisma.empty
        }
      `,
    );

    // Convertendo BigInt para número para a serialização do JSON
    return result.map((row) => ({
      ...row,
      TempoPrevistoFuncionamento: Number(row.TempoPrevistoFuncionamento),
      TempoManutencao: Number(row.TempoManutencao),
      OrdensServico: Number(row.OrdensServico),
    }));
  }

  async gridPerformance(
    clienteId: number,
    idFilial: number[],
    startDate: Date,
    endDate: Date,
    index: number | null,
    perPage: number | null,
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput | null,
  ): Promise<IMaintenancePerformance['gridPerformance'][]> {
    const object = await this.table.findMany({
      ...(index != null && {
        skip: index * perPage,
        take: perPage,
      }),
      select: {
        ID: true,
        data_hora_solicitacao: true,
        ordem: true,
        data_acionamento_tecnico: true,
        chegada_tecnico: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            family: {
              select: {
                ID: true,
                familia: true,
              },
            },
            typeEquipment: {
              select: {
                ID: true,
                tipo_equipamento: true,
              },
            },
          },
        },
        noteStop: {
          select: {
            id: true,
            id_ordem_servico: true,
            id_equipamento: true,
            data_hora_stop: true,
            data_hora_start: true,
          },
        },
      },
      where: {
        ID_cliente: clienteId,
        ID_filial: {
          in: idFilial,
        },
        noteStop: {
          some: {
            data_hora_start: {
              lte: endDate,
            },
            data_hora_stop: { gte: startDate },
          },
        },
        ...filter,
      },
    });

    return object;
  }

  async listProspectScale(
    id: number,
  ): Promise<sofman_prospect_escala_trabalho[]> {
    const object = await this.prisma.sofman_prospect_escala_trabalho.findMany({
      select: {
        id: true,
        id_escala: true,
        id_equipamento: true,
        data_programada: true,
        inicio: true,
        termino: true,
        log_user: true,
        log_date: true,
        alterado: true,
      },
      where: {
        id: id,
      },
    });
    return object;
  }
}
