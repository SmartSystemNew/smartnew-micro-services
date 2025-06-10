import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/database/prisma.service';
import ICustoDiversos from 'src/models/ICustoDiversos';

export interface IFiltersCustos {
  id_ordem_servico?: number[] | null;
  id_cliente?: number[] | null;
  ID_filial?: number[] | null;
  id_equipamento?: number[] | null;
  id_familia?: number[] | null;
  id_tipo_equipamento?: number[] | null;
  descricao_custo?: string | null;
  setor_executante?: string | null;
  status?: string | null;
  ordem?: number | null;
  globalFilter?: string | null;
  filterColumn?: string | null;
  filterText?: string | null;
}

@Injectable()
export default class CustoDiversosRepositoryPrisma {
  constructor(private readonly prisma: PrismaService) {}

  async gridCustoDiversos(
    clientId: number[],
    login: string[],
    page: number | null,
    perPage: number | null,
    filters: IFiltersCustos = {},
  ): Promise<ICustoDiversos['gridCustoDiversos'][]> {
    if (clientId.length !== 1 || login.length !== 1) {
      throw new Error('clientId and login must contain exactly one value');
    }

    const singleClientId = clientId[0];
    const singleUserLogin = login[0];

    const {
      id_ordem_servico,
      id_cliente,
      ID_filial,
      id_equipamento,
      id_familia,
      id_tipo_equipamento,
      descricao_custo,
      setor_executante,
      status,
      ordem,
      filterColumn,
      filterText,
      globalFilter,
    } = filters;

    const whereConditions = [];

    if (globalFilter) {
      whereConditions.push(
        Prisma.sql`(
          b.descricao LIKE ${`%${globalFilter}%`} OR
          f.status LIKE ${`%${globalFilter}%`}
        )`,
      );
    }

    if (filterColumn && filterText) {
      switch (filterColumn) {
        case 'descricao_custo':
          whereConditions.push(
            Prisma.sql`b.descricao LIKE ${`%${filterText}%`}`,
          );
          break;
        case 'setor_executante':
          whereConditions.push(
            Prisma.sql`d.descricao LIKE ${`%${filterText}%`}`,
          );
          break;
        case 'status':
          whereConditions.push(Prisma.sql`f.status LIKE ${`%${filterText}%`}`);
          break;
        default:
          break;
      }
    }

    if (id_ordem_servico && id_ordem_servico.length > 0 && !filterColumn) {
      whereConditions.push(
        Prisma.sql`c.id IN (${Prisma.join(id_ordem_servico, ',')})`,
      );
    }
    if (id_cliente && id_cliente.length > 0 && !filterColumn) {
      whereConditions.push(
        Prisma.sql`c.id_cliente IN (${Prisma.join(id_cliente)})`,
      );
    }
    if (ID_filial && ID_filial.length > 0 && !filterColumn) {
      whereConditions.push(
        Prisma.sql`c.ID_filial IN (${Prisma.join(ID_filial, ',')})`,
      );
    }
    if (id_equipamento && id_equipamento.length > 0 && !filterColumn) {
      whereConditions.push(
        Prisma.sql`e.id IN (${Prisma.join(id_equipamento)})`,
      );
    }
    if (id_familia && id_familia.length > 0 && !filterColumn) {
      whereConditions.push(Prisma.sql`h.id IN (${Prisma.join(id_familia)})`);
    }
    if (
      id_tipo_equipamento &&
      id_tipo_equipamento.length > 0 &&
      !filterColumn
    ) {
      whereConditions.push(
        Prisma.sql`i.id IN (${Prisma.join(id_tipo_equipamento)})`,
      );
    }
    if (descricao_custo && !filterColumn) {
      whereConditions.push(
        Prisma.sql`b.descricao LIKE ${`%${descricao_custo}%`}`,
      );
    }
    if (setor_executante && !filterColumn) {
      whereConditions.push(
        Prisma.sql`d.descricao LIKE ${`%${setor_executante}%`}`,
      );
    }
    if (status && !filterColumn) {
      whereConditions.push(Prisma.sql`f.status LIKE ${`%${status}%`}`);
    }
    if (ordem && !filterColumn) {
      whereConditions.push(Prisma.sql`c.ordem = ${ordem}`);
    }

    const whereClause = whereConditions.length
      ? Prisma.sql`AND ${Prisma.join(whereConditions, ' AND ')}`
      : Prisma.empty;

    const offset = page !== null && perPage !== null ? page * perPage : null;

    const result = await this.prisma.$queryRaw<
      {
        id: number;
        id_ordem_servico: number;
        id_cliente: number;
        ID_filial: number;
        cliente: string;
        descricao_custo: string;
        unidade: string;
        quantidade: number;
        equipamento: string;
        familia_equipamento: string;
        tipo_equipamento: string;
        ordem: number;
        ordem_vinculada: number;
        fechada: string;
        data_custo: Date;
        mesano: string;
        valor_unitario: Decimal;
        custo_total: Decimal;
        observacoes: string;
        setor_executante: string;
        status: string;
      }[]
    >(
      Prisma.sql`
        SELECT a.id,
            c.id AS 'id_ordem_servico',
            c.id_cliente,
            c.ID_filial,
            CONCAT(g.razao_social, ' - ', g.filial_numero) AS 'cliente',
            b.descricao AS 'descricao_custo',
            b.unidade,
            a.quantidade,
            CONCAT(e.equipamento_codigo, ' - ', e.descricao) AS 'equipamento',
            h.familia AS 'familia_equipamento',
            i.tipo_equipamento,
            c.ordem,
            c.ordem_vinculada,
            c.fechada,
            a.data_custo,
            mesano2(a.data_custo) AS mesano,
            a.valor_unitario,
            a.custo AS 'custo_total',
            a.observacoes,
            d.descricao AS 'setor_executante',
            f.status
        FROM sofman_cad_custos_ordens_servico AS a
        JOIN sofman_cad_descricao_custos_ordem_servico AS b ON a.id_descricao_custo = b.id
        JOIN controle_de_ordens_de_servico AS c ON a.id_ordem_servico = c.id
        JOIN sofman_cad_setor_executante AS d ON c.setor_executante = d.id
        JOIN cadastro_de_equipamentos AS e ON c.id_equipamento = e.id
        JOIN sofman_status_ordem_servico AS f ON c.status_os = f.id
        JOIN cadastro_de_filiais AS g ON c.ID_filial = g.id
        JOIN cadastro_de_familias_de_equipamento AS h ON e.ID_familia = h.id
        JOIN cadastro_de_tipos_de_equipamentos AS i ON e.ID_tipoeqto = i.id
        WHERE g.id IN (
          SELECT fxu.id_filial
          FROM sofman_filiais_x_usuarios AS fxu
          WHERE fxu.id_user = ${singleUserLogin} AND fxu.id_cliente = ${singleClientId}
        )
        ${whereClause}
        ORDER BY a.data_custo DESC
        ${
          offset !== null && perPage !== null
            ? Prisma.raw(`LIMIT ${perPage} OFFSET ${offset}`)
            : Prisma.empty
        }
      `,
    );

    return result;
  }
}
