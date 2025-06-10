import { Injectable } from '@nestjs/common';
import { Prisma, cadastro_de_equipamentos } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IEquipment } from 'src/models/IEquipment';
import EquipmentRepository from '../equipment-repository';

@Injectable()
export default class EquipmentRepositoryPrisma implements EquipmentRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.cadastro_de_equipamentos;

  async create(
    data: Prisma.cadastro_de_equipamentosUncheckedCreateInput,
  ): Promise<IEquipment['create']> {
    const equipment = await this.table.create({
      select: { ID: true, ID_filial: true },
      data,
    });

    return equipment;
  }

  async listByBranch(
    branchId: number[],
    filter?: Prisma.cadastro_de_equipamentosWhereInput | undefined,
  ): Promise<IEquipment['listByBranch'][]> {
    const equipment = await this.table.findMany({
      orderBy: {
        ID: 'desc',
      },
      select: {
        ID: true,
        equipamento_codigo: true,
        descricao: true,
        chassi: true,
        n_serie: true,
        placa: true,
        status_equipamento: true,
        observacoes: true,
        garantia: true,
        data_compra: true,
        ano_fabricacao: true,
        ano_modelo: true,
        n_nota_fiscal: true,
        valor_aquisicao: true,
        //imagem: true,
        tipo_consumo: true,
        fuelling: {
          select: {
            id: true,
            quantidade: true,
            contadorAtual: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        costCenter: {
          select: {
            ID: true,
            centro_custo: true,
            descricao: true,
          },
        },
        descriptionPlanMaintenance: {
          select: {
            id: true,
          },
        },
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
      where: {
        ID_filial: {
          in: branchId,
        },
        ...filter,
      },
    });

    return equipment;
  }

  async listFamily(
    familyId: number[],
    filter?: Prisma.cadastro_de_equipamentosWhereInput | undefined,
  ): Promise<IEquipment['listFamily'][]> {
    const equipment = await this.table.findMany({
      orderBy: {
        ID: 'desc',
      },
      select: {
        ID: true,
        equipamento_codigo: true,
        descricao: true,
        chassi: true,
        n_serie: true,
        placa: true,
        status_equipamento: true,
        observacoes: true,
        garantia: true,
        data_compra: true,
        ano_fabricacao: true,
        ano_modelo: true,
        n_nota_fiscal: true,
        valor_aquisicao: true,
        //imagem: true,
        tipo_consumo: true,
        fuelling: {
          select: {
            id: true,
            quantidade: true,
            contadorAtual: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        costCenter: {
          select: {
            ID: true,
            centro_custo: true,
            descricao: true,
          },
        },
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
      where: {
        ID_familia: {
          in: familyId,
        },
        ...filter,
      },
    });

    return equipment;
  }

  async findByBranchAndCode(
    branchId: number,
    code: string,
  ): Promise<IEquipment['findByBranchAndCode'] | null> {
    const equipment = await this.table.findUnique({
      select: {
        ID: true,
        equipamento_codigo: true,
        descricao: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            cnpj: true,
          },
        },
      },
      where: {
        ID_filial_equipamento_codigo: {
          ID_filial: branchId,
          equipamento_codigo: code,
        },
      },
    });

    return equipment;
  }
  async getDataUnitMetricFromPlan(
    idClient: number,
    code: string,
  ): Promise<IEquipment['getDataUnitMetricFromPlan'][] | null> {
    const obj = await this.table.findMany({
      select: {
        ID: true,
        ID_filial: true,
        equipamento_codigo: true,
        descriptionPlanMaintenance: {
          select: {
            id: true,
            id_unidade_medida: true,
            unityPlan: {
              select: {
                unidade: true,
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
        },
      },
      orderBy: [
        {
          ID: 'desc',
        },
      ],
      where: {
        ID_cliente: idClient,
        equipamento_codigo: code,
      },
    });
    const data = [];
    if (obj.length == 0) {
      return [];
    }

    obj.forEach((element) => {
      if (element.descriptionPlanMaintenance.length > 0) {
        const unitType =
          element.descriptionPlanMaintenance[0].unityPlan.unidade;
        data.push({
          id: element.ID,
          code: element.equipamento_codigo,
          idBranch: element.ID_filial,
          idUnitMetric:
            element.descriptionPlanMaintenance?.[0].id_unidade_medida,
          unitType: unitType.toLocaleLowerCase(),
        });
      }
    });

    return data;
  }

  async findByClientAndCode(
    clientId: number,
    code: string,
  ): Promise<IEquipment['findByClientAndCode'] | null> {
    const equipment = await this.table.findFirst({
      select: {
        ID: true,
        ID_filial: true,
        equipamento_codigo: true,
        tag_vinculada: true,
        descricao: true,
        chassi: true,
        n_serie: true,
        placa: true,
        status_equipamento: true,
        observacoes: true,
        garantia: true,
        data_compra: true,
        ano_fabricacao: true,
        ano_modelo: true,
        n_nota_fiscal: true,
        valor_aquisicao: true,
        //imagem: true,
        n_patrimonio: true,
        n_ct_finame: true,
        numero_crv: true,
        marca: true,
        modelo: true,
        fabricante: true,
        custo_hora: true,
        tipo_consumo: true,
        consumo_previsto: true,
        limite_dia_unidade_medida: true,
        proprietario: true,
        cor: true,
        codigo_renavam: true,
        data_emisao_crv: true,
        licenciamento: true,
        apolice_seguro: true,
        vencimento_apolice_seguro: true,
        frota: true,
        ficha_tecnica: true,
        id_unidade_medida: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            cnpj: true,
          },
        },
        unityPlans: {
          select: {
            id: true,
            unidade: true,
          },
        },
      },
      where: {
        ID_cliente: clientId,
        equipamento_codigo: {
          contains: code,
        },
      },
    });

    return equipment;
  }

  async findByOrderAndEquipment(
    clientId: number,
  ): Promise<IEquipment['findByOrderAndEquipment'][] | null> {
    const equipment = await this.table.findMany({
      select: {
        ID: true,
        ID_familia: true,
        equipamento_codigo: true,
        descricao: true,
        status_equipamento: true,
        observacoes: true,
        marca: true,
        modelo: true,
        fabricante: true,
        custo_hora: true,
        tipo_consumo: true,
        proprietario: true,
        cor: true,
        ficha_tecnica: true,
        orderService: {
          select: {
            ID: true,
            id_equipamento: true,
            ordem: true,
            equipamento: true,
            tipo_manutencao: true,
            tipo_equipamento: true,
            data_equipamento_funcionou: true,
            data_equipamento_parou: true,
            data_hora_encerramento: true,
            data_inicio: true,
            status_os: true,
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
        ID_cliente: clientId,
      },
    });

    return equipment;
  }

  async findById(id: number): Promise<IEquipment['findById'] | null> {
    const equipment = await this.table.findUnique({
      select: {
        ID: true,
        equipamento_codigo: true,
        tag_vinculada: true,
        descricao: true,
        chassi: true,
        n_serie: true,
        placa: true,
        status_equipamento: true,
        observacoes: true,
        garantia: true,
        data_compra: true,
        ano_fabricacao: true,
        ano_modelo: true,
        n_nota_fiscal: true,
        valor_aquisicao: true,
        //imagem: true,
        n_patrimonio: true,
        n_ct_finame: true,
        numero_crv: true,
        marca: true,
        modelo: true,
        fabricante: true,
        custo_hora: true,
        tipo_consumo: true,
        id_unidade_medida: true,
        consumo_previsto: true,
        limite_dia_unidade_medida: true,
        proprietario: true,
        cor: true,
        codigo_renavam: true,
        data_emisao_crv: true,
        licenciamento: true,
        apolice_seguro: true,
        vencimento_apolice_seguro: true,
        frota: true,
        ficha_tecnica: true,
        company: {
          select: {
            ID: true,
            nome_fantasia: true,
            cnpj: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
        costCenter: {
          select: {
            ID: true,
            centro_custo: true,
            descricao: true,
          },
        },
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
        unityPlans: {
          select: {
            id: true,
            unidade: true,
          },
        },
      },
      where: {
        ID: id,
      },
    });

    return equipment;
  }

  async findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<IEquipment['findByClientAndName'] | null> {
    const equipment = await this.table.findFirst({
      select: {
        ID: true,
        equipamento_codigo: true,
        descricao: true,
      },
      where: {
        ID_cliente: clientId,
        descricao: {
          contains: name,
        },
      },
    });

    return equipment;
  }

  async update(
    id: number,
    data: Prisma.cadastro_de_equipamentosUncheckedUpdateInput,
  ): Promise<cadastro_de_equipamentos> {
    const equipment = await this.table.update({
      data,
      where: {
        ID: id,
      },
    });

    return equipment;
  }

  async delete(id: number): Promise<boolean> {
    await this.table.delete({
      where: {
        ID: id,
      },
    });

    return true;
  }

  async listEquipmentWithProspectScale(
    clientId: number,
    branchId: number[],
    filter?: Prisma.cadastro_de_equipamentosWhereInput | null,
  ): Promise<IEquipment['listEquipmentWithProspectScale'][]> {
    const equipment = await this.table.findMany({
      select: {
        ID: true,
        equipamento_codigo: true,
        descricao: true,
        prospectScale: {
          select: {
            id: true,
            data_programada: true,
            inicio: true,
            termino: true,
          },
        },
      },
      where: {
        ID_cliente: clientId,
        ID_filial: {
          in: branchId,
        },
        ...filter,
      },
    });

    return equipment;
  }
}
