import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_colaboradores } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

import { IEmployee } from 'src/models/Employee';
import { querySetFilter } from 'src/service/queryFilters.service';
import { querySetSelect } from 'src/service/querySelect.service';
import { EmployeeRepository } from '../employee-repository';

@Injectable()
export default class EmployeeRepositoryPrisma implements EmployeeRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_colaboradores;

  async findById(id: number): Promise<IEmployee['findById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        id: true,
        id_cliente: true,
        cod_colaborador: true,
        nome: true,
        idade: true,
        data_nascimento: true,
        data_admissao: true,
        cep: true,
        endereco: true,
        bairro: true,
        cidade: true,
        estado: true,
        email: true,
        telefone: true,
        cargo: true,
        status: true,
        setor_executante: true,
        id_equipe: true,
        filiais: true,
        valor_hora: true,
        //imagem: true,
        observacoes: true,
      },
      where: {
        id: id,
      },
    });
    return obj;
  }

  async create(
    data: Prisma.sofman_cad_colaboradoresUncheckedCreateInput,
  ): Promise<sofman_cad_colaboradores> {
    const obj = await this.table.create({
      data,
    });

    return obj;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_colaboradoresUncheckedUpdateInput,
  ): Promise<sofman_cad_colaboradores> {
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

  async listByClient(
    idClient: number,
    filters: Prisma.sofman_cad_colaboradoresWhereInput = {},
    fields: string[] = [],
  ): Promise<IEmployee['listByClient'][]> {
    const where: Prisma.sofman_cad_colaboradoresWhereInput = {
      id_cliente: idClient,
    };

    if (!filters) filters = {};
    if (!fields) fields = [];

    const select: Prisma.sofman_cad_colaboradoresSelect =
      fields.length > 0
        ? querySetSelect(fields)
        : {
            id: true,
            id_cliente: true,
            cod_colaborador: true,
            nome: true,
            idade: true,
            data_nascimento: true,
            data_admissao: true,
            cep: true,
            endereco: true,
            bairro: true,
            cidade: true,
            estado: true,
            email: true,
            telefone: true,
            cargo: true,
            status: true,
            setor_executante: true,
            id_equipe: true,
            filiais: true,
            valor_hora: true,
            //imagem: true,
            observacoes: true,
          };

    filters = Object.keys(filters).length > 0 && querySetFilter(filters);

    const obj = await this.table.findMany({
      select: select,
      where: { ...where, ...filters },
      orderBy: {
        nome: 'desc',
      },
    });

    return obj;
  }

  async listByClientId(
    clientId: number,
    filter?: Prisma.sofman_cad_colaboradoresWhereInput | null,
  ): Promise<IEmployee['listByClientId'][]> {
    const obj = await this.table.findMany({
      select: {
        id: true,
        id_cliente: true,
        cod_colaborador: true,
        nome: true,
        idade: true,
        data_nascimento: true,
        data_admissao: true,
        cep: true,
        endereco: true,
        bairro: true,
        cidade: true,
        estado: true,
        email: true,
        telefone: true,
        cargo: true,
        status: true,
        setor_executante: true,
        id_equipe: true,
        filiais: true,
        valor_hora: true,
        //imagem: true,
        observacoes: true,
        user: {
          select: {
            login: true,
            name: true,
          },
        },
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
      orderBy: {
        nome: 'desc',
      },
    });

    return obj;
  }

  /* (EXISTS (
          SELECT
            b.id
          FROM
            sofman_filiais_x_usuarios b
          WHERE
            FIND_IN_SET(b.id_filial, a.filiais)
            AND b.id_user = ${userLogin}
        ) */
  /* AND  */
  async selectMaintainersByClient(
    idClient: number,
    userLogin: string,
    idServiceOrder?: number,
  ): Promise<{ id: number; nome: string }[]> {
    const result = await this.prismaService.$queryRaw`
      SELECT
        a.id AS id,
        a.nome AS nome
      FROM
        sofman_cad_colaboradores a
      WHERE
        a.id_cliente = ${idClient}
        AND a.status IN (1, 5)
        OR FIND_IN_SET(a.id, (
          SELECT
            mantenedores
          FROM
            controle_de_ordens_de_servico
          WHERE
            id = ${idServiceOrder}
        ))
      ORDER BY
        a.nome
    `;

    return result as IEmployee['listByClient'][];
  }
}
