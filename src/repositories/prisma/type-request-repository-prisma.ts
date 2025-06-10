import { Injectable } from '@nestjs/common';
import { Prisma, sofman_cad_tipo_solicitacao } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import TypeRequestRepository from '../type-request-repository';

@Injectable()
export default class TypeRequestRepositoryPrisma
  implements TypeRequestRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.sofman_cad_tipo_solicitacao;

  async listByClient(
    clientId: number,
    filter?: Prisma.sofman_cad_tipo_solicitacaoWhereInput | null,
  ): Promise<sofman_cad_tipo_solicitacao[]> {
    const types = await this.table.findMany({
      select: {
        id: true,
        id_cliente: true,
        id_setor_executante: true,
        descricao: true,
        mensagem: true,
        log_date: true,
      },
      where: {
        id_cliente: clientId,
        ...filter,
      },
    });

    return types;
  }

  async create(
    data: Prisma.sofman_cad_tipo_solicitacaoUncheckedCreateInput,
  ): Promise<sofman_cad_tipo_solicitacao> {
    const type = await this.table.create({ data });

    return type;
  }

  async update(
    id: number,
    data: Prisma.sofman_cad_tipo_solicitacaoUncheckedUpdateInput,
  ): Promise<sofman_cad_tipo_solicitacao> {
    const type = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return type;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({ where: { id } });

    return true;
  }
}
