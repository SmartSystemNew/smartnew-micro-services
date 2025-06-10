import { Injectable } from '@nestjs/common';
import { Prisma, controle_de_ordens_de_servico } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import IServiceOrder from 'src/models/IServiceOrder';
import ServiceOrderRepository from '../service-order-repository';

@Injectable()
export default class ServiceOrderRepositoryPrisma
  implements ServiceOrderRepository
{
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.controle_de_ordens_de_servico;

  async findByWhere(
    where: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['findByWhere'] | null> {
    const serviceOrder = await this.table.findFirst({
      select: {
        ID: true,
        ordem: true,
        descricao_solicitacao: true,
        ordem_vinculada: true,
        localizacao: true,
        descricao_servico_realizado: true,
        observacoes: true,
        observacoes_executante: true,
        observacoes_cliente: true,
        retorno_checklist: true,
        data_hora_solicitacao: true,
        data_prevista_termino: true,
        data_inicio: true,
        data_hora_encerramento: true,
        data_equipamento_parou: true,
        data_equipamento_funcionou: true,
        data_acionamento_tecnico: true,
        chegada_tecnico: true,
        log_date: true,
        fechada: true,
        maquina_parada: true,
        solicitante: true,
        id_solicitante: true,
        emissor: true,
        status_execucao: true,
        priorityOrderService: {
          select: {
            descricao: true,
          },
        },
        // classOrderService: {
        //   select: {
        //     descricao: true,
        //   },
        // },
        failureCause: {
          select: {
            descricao: true,
          },
        },
        sectorExecutor: {
          select: {
            descricao: true,
          },
        },
        statusOrderService: {
          select: {
            status: true,
          },
        },
        typeMaintenance: {
          select: {
            tipo_manutencao: true,
          },
        },
        building: {
          select: {
            predio: true,
          },
        },
        sector: {
          select: {
            setor: true,
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
            filial_numero: true,
            razao_social: true,
          },
        },
        costCenter: {
          select: {
            descricao: true,
            centro_custo: true,
          },
        },
        department: {
          select: {
            departamento: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            modelo: true,
            localizacao: true,
            family: {
              select: {
                familia: true,
              },
            },
            typeEquipment: {
              select: {
                tipo_equipamento: true,
              },
            },
            classification: {
              select: {
                descricao: true,
              },
            },
            criticalityEquipment: {
              select: {
                descricao: true,
              },
            },
            building: {
              select: {
                predio: true,
              },
            },
            sector: {
              select: {
                setor: true,
              },
            },
            department: {
              select: {
                departamento: true,
              },
            },
          },
        },
        requester: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      where,
    });

    return serviceOrder;
  }

  async listByClient(
    clientId: number,
  ): Promise<IServiceOrder['listByClient'][]> {
    const obj = await this.table.findMany({
      select: {
        ID: true,
        id_app: true,
        ordem: true,
        descricao_solicitacao: true,
        ordem_vinculada: true,
        localizacao: true,
        descricao_servico_realizado: true,
        observacoes: true,
        observacoes_executante: true,
        observacoes_cliente: true,
        retorno_checklist: true,
        data_hora_solicitacao: true,
        data_prevista_termino: true,
        data_inicio: true,
        data_hora_encerramento: true,
        data_equipamento_parou: true,
        data_equipamento_funcionou: true,
        data_acionamento_tecnico: true,
        chegada_tecnico: true,
        log_date: true,
        fechada: true,
        maquina_parada: true,
        solicitante: true,
        id_solicitante: true,
        emissor: true,
        mantenedores: true,
        priorityOrderService: {
          select: {
            descricao: true,
          },
        },
        classOrderService: {
          select: {
            descricao: true,
          },
        },
        failureCause: {
          select: {
            descricao: true,
          },
        },
        sectorExecutor: {
          select: {
            descricao: true,
          },
        },
        statusOrderService: {
          select: {
            status: true,
          },
        },
        typeMaintenance: {
          select: {
            tipo_manutencao: true,
          },
        },
        building: {
          select: {
            predio: true,
          },
        },
        sector: {
          select: {
            setor: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
        costCenter: {
          select: {
            descricao: true,
            centro_custo: true,
          },
        },
        department: {
          select: {
            departamento: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            modelo: true,
            localizacao: true,
            family: {
              select: {
                familia: true,
              },
            },
            // classification: {
            //   select: {
            //     descricao: true,
            //   },
            // },
            criticalityEquipment: {
              select: {
                descricao: true,
              },
            },
            building: {
              select: {
                predio: true,
              },
            },
            sector: {
              select: {
                setor: true,
              },
            },
            department: {
              select: {
                departamento: true,
              },
            },
          },
        },
        requester: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      where: {
        ID_cliente: clientId,
      },
      orderBy: {
        ID: 'desc',
      },
    });

    return obj;
  }

  async listByMaintenairs(
    clientId: number,
    branches: number[],
    colaborador_id: number,
    filters?: Prisma.controle_de_ordens_de_servicoWhereInput | null,
  ): Promise<IServiceOrder['listByMaintenairs'][]> {
    const order = await this.table.findMany({
      select: {
        ID: true,
        ordem: true,
        descricao_solicitacao: true,
        ordem_vinculada: true,
        localizacao: true,
        descricao_servico_realizado: true,
        observacoes: true,
        observacoes_executante: true,
        observacoes_cliente: true,
        retorno_checklist: true,
        data_hora_solicitacao: true,
        data_prevista_termino: true,
        data_inicio: true,
        data_hora_encerramento: true,
        data_equipamento_parou: true,
        data_equipamento_funcionou: true,
        data_acionamento_tecnico: true,
        chegada_tecnico: true,
        log_date: true,
        fechada: true,
        maquina_parada: true,
        solicitante: true,
        id_solicitante: true,
        emissor: true,
        priorityOrderService: {
          select: {
            descricao: true,
          },
        },
        // classOrderService: {
        //   select: {
        //     descricao: true,
        //   },
        // },
        failureCause: {
          select: {
            descricao: true,
          },
        },
        sectorExecutor: {
          select: {
            descricao: true,
          },
        },
        statusOrderService: {
          select: {
            status: true,
          },
        },
        typeMaintenance: {
          select: {
            tipo_manutencao: true,
          },
        },
        building: {
          select: {
            predio: true,
          },
        },
        sector: {
          select: {
            setor: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
        costCenter: {
          select: {
            descricao: true,
            centro_custo: true,
          },
        },
        department: {
          select: {
            departamento: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            modelo: true,
            localizacao: true,
            family: {
              select: {
                familia: true,
              },
            },
            criticalityEquipment: {
              select: {
                descricao: true,
              },
            },
            building: {
              select: {
                predio: true,
              },
            },
            sector: {
              select: {
                setor: true,
              },
            },
            department: {
              select: {
                departamento: true,
              },
            },
          },
        },
        requester: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      where: {
        ID_cliente: clientId,
        ID_filial: {
          in: branches,
        },
        maintainers: {
          some: {
            id_colaborador: colaborador_id,
          },
        },
        data_hora_encerramento: null,
        ...filters,
      },
    });

    return order;
  }

  async listByWhere(
    where: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listByWhere'][]> {
    const order = await this.table.findMany({
      //take: 5,
      select: {
        ID: true,
        ordem: true,
        descricao_solicitacao: true,
        ordem_vinculada: true,
        localizacao: true,
        descricao_servico_realizado: true,
        observacoes: true,
        observacoes_executante: true,
        observacoes_cliente: true,
        retorno_checklist: true,
        data_hora_solicitacao: true,
        data_prevista_termino: true,
        data_inicio: true,
        data_hora_encerramento: true,
        data_equipamento_parou: true,
        data_equipamento_funcionou: true,
        data_acionamento_tecnico: true,
        chegada_tecnico: true,
        log_date: true,
        fechada: true,
        maquina_parada: true,
        solicitante: true,
        id_solicitante: true,
        emissor: true,
        status_execucao: true,
        priorityOrderService: {
          select: {
            descricao: true,
          },
        },
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        // classOrderService: {
        //   select: {
        //     descricao: true,
        //   },
        // },
        failureCause: {
          select: {
            descricao: true,
          },
        },
        sectorExecutor: {
          select: {
            descricao: true,
          },
        },
        statusOrderService: {
          select: {
            status: true,
          },
        },
        typeMaintenance: {
          select: {
            tipo_manutencao: true,
          },
        },
        building: {
          select: {
            predio: true,
          },
        },
        sector: {
          select: {
            setor: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
        costCenter: {
          select: {
            descricao: true,
            centro_custo: true,
          },
        },
        department: {
          select: {
            departamento: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            modelo: true,
            localizacao: true,
            family: {
              select: {
                familia: true,
              },
            },
            typeEquipment: {
              select: {
                tipo_equipamento: true,
              },
            },
            classification: {
              select: {
                descricao: true,
              },
            },
            criticalityEquipment: {
              select: {
                descricao: true,
              },
            },
            building: {
              select: {
                predio: true,
              },
            },
            sector: {
              select: {
                setor: true,
              },
            },
            department: {
              select: {
                departamento: true,
              },
            },
          },
        },
        requester: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      where,
    });

    return order;
  }

  async findById(id: number): Promise<IServiceOrder['findById'] | null> {
    const obj = await this.table.findUnique({
      select: {
        ID: true,
        ordem: true,
        hh_previsto: true,
        ID_cliente: true,
        ID_filial: true,
        horimetro: true,
        odometro: true,
        log_date: true,
        log_date_timestamp: true,
        descricao_solicitacao: true,
        observacoes: true,
        descricao_servico_realizado: true,
        observacoes_executante: true,
        ordem_vinculada: true,
        //serie_equipamento: true,
        maquina_parada: true,
        solicitante: true,
        id_solicitante: true,
        servico_pendente: true,
        possui_anexo: true,
        data_hora_solicitacao: true,
        data_hora_solicitacao_timestamp: true,
        data_equipamento_parou: true,
        data_prevista_termino: true,
        data_equipamento_funcionou: true,
        data_acionamento_tecnico: true,
        chegada_tecnico: true,
        status_os: true,
        id_ordem_pai: true,
        mantenedores: true,
        nota_avalicao_servico: true,
        company: {
          select: {
            ID: true,
            razao_social: true,
          },
        },
        materialServiceOrder: {
          select: {
            id: true,
            quantidade: true,
            valor_unidade: true,
            materials: {
              select: {
                id: true,
                material: true,
              },
            },
            materialCodigo: {
              select: {
                id: true,
              },
            },
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            n_serie: true,
          },
        },
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        requester: {
          select: {
            id: true,
            nome: true,
          },
        },
        priorityOrderService: {
          select: {
            id: true,
            descricao: true,
          },
        },
        classOrderService: {
          select: {
            id: true,
            descricao: true,
          },
        },
        justifyStatus: {
          select: {
            id: true,
            id_ordem_servico: true,
            id_status_antigo: true,
            status_old_service_order: {
              select: {
                cor: true,
                cor_font: true,
                status: true,
              },
            },
            id_status_novo: true,
            status_new_service_order: {
              select: {
                cor: true,
                cor_font: true,
                status: true,
              },
            },
            justificativa: true,
            login: true,
            log_date: true,
          },
        },
        maintainers: {
          select: {
            id: true,
            id_colaborador: true,
          },
        },
      },
      where: {
        ID: id,
      },
    });
    return obj;
  }

  async findByIdAndRequest(
    id: number,
    requestId: number,
  ): Promise<IServiceOrder['findByIdAndRequest'] | null> {
    const obj = await this.table.findUnique({
      select: {
        ID: true,
        ordem: true,
        hh_previsto: true,
        ID_cliente: true,
        ID_filial: true,
        horimetro: true,
        odometro: true,
        log_date: true,
        log_date_timestamp: true,
        descricao_solicitacao: true,
        observacoes: true,
        descricao_servico_realizado: true,
        observacoes_executante: true,
        ordem_vinculada: true,
        //serie_equipamento: true,
        maquina_parada: true,
        solicitante: true,
        id_solicitante: true,
        servico_pendente: true,
        possui_anexo: true,
        data_hora_solicitacao: true,
        data_hora_solicitacao_timestamp: true,
        data_equipamento_parou: true,
        data_prevista_termino: true,
        data_equipamento_funcionou: true,
        data_acionamento_tecnico: true,
        chegada_tecnico: true,
        status_os: true,
        id_ordem_pai: true,
        mantenedores: true,
        nota_avalicao_servico: true,
        materialServiceOrder: {
          select: {
            id: true,
            materials: {
              select: {
                id: true,
                material: true,
              },
            },
            materialCodigo: {
              select: {
                id: true,
              },
            },
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            n_serie: true,
          },
        },
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        requester: {
          select: {
            id: true,
            nome: true,
          },
        },
        priorityOrderService: {
          select: {
            id: true,
            descricao: true,
          },
        },
        classOrderService: {
          select: {
            id: true,
            descricao: true,
          },
        },
      },
      where: {
        ID: id,
        id_pedido: requestId,
      },
    });
    return obj;
  }

  async listByBranch(
    branchId: number[],
  ): Promise<IServiceOrder['listByBranch'][]> {
    const obj = await this.table.findMany({
      orderBy: {
        ID: 'desc',
      },
      select: {
        ID: true,
        ordem: true,
        log_date: true,
        descricao_solicitacao: true,
        data_hora_solicitacao: true,
        maintainers: {
          select: {
            id: true,
            collaborator: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        mantenedores: true,
        data_hora_encerramento: true,
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        requester: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      where: {
        ID_filial: {
          in: branchId,
        },
      },
    });

    return obj;
  }

  async listPositionMaterial(
    branchId: number[],
    filters?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listPositionMaterial'][]> {
    const obj = await this.table.findMany({
      select: {
        ID: true,
        ordem: true,
        descricao_solicitacao: true,
        data_hora_solicitacao: true,
        data_hora_solicitacao_timestamp: true,
        data_prevista_termino: true,
        data_hora_encerramento: true,
        log_date: true,
        log_date_timestamp: true,
        solicitante: true,
        id_solicitante: true,
        emissor: true,
        fechada: true,
        maquina_parada: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
        materialServiceOrder: {
          select: {
            materials: {
              select: {
                id: true,
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
                DataEstoqueMin: true,
                id_categoria: true,
                stockIn: {
                  select: {
                    id: true,
                    numero_serie: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        ID_filial: {
          in: branchId,
        },
        ...filters,
      },
    });
    return obj;
  }

  async listServiceOrder(
    branchId: number[],
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listServiceOrder'][]> {
    const obj = await this.table.findMany({
      orderBy: {
        ID: 'desc',
      },
      ...(index !== null && {
        skip: index * perPage,
        take: perPage,
      }),
      select: {
        ID: true,
        ordem: true,
        descricao_solicitacao: true,
        data_hora_solicitacao: true,
        data_hora_solicitacao_timestamp: true,
        data_prevista_termino: true,
        data_hora_encerramento: true,
        data_equipamento_parou: true,
        data_equipamento_funcionou: true,
        log_date: true,
        log_date_timestamp: true,
        solicitante: true,
        id_solicitante: true,
        id_planejamento_manutencao: true,
        emissor: true,
        fechada: true,
        maquina_parada: true,
        localizacao: true,
        observacoes: true,
        observacoes_cliente: true,
        observacoes_executante: true,
        nota_avalicao_servico: true,
        data_acionamento_tecnico: true,
        chegada_tecnico: true,
        orderService: {
          select: {
            ID: true,
            ordem: true,
            descricao_solicitacao: true,
          },
        },
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
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        statusOrderService: {
          select: {
            id: true,
            status: true,
            cor: true,
            finalizacao: true,
            requer_justificativa: true,
          },
        },
        justifyStatus: {
          select: {
            id: true,
            id_ordem_servico: true,
            id_status_antigo: true,
            status_old_service_order: {
              select: {
                cor: true,
                cor_font: true,
                status: true,
              },
            },
            id_status_novo: true,
            status_new_service_order: {
              select: {
                cor: true,
                cor_font: true,
                status: true,
              },
            },
            justificativa: true,
            login: true,
            log_date: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
        requester: {
          select: {
            id: true,
            nome: true,
          },
        },
        note: {
          select: {
            id: true,
            data_hora_inicio: true,
            data_hora_termino: true,
            employee: {
              select: {
                id: true,
                nome: true,
                valor_hora: true,
              },
            },
          },
        },
        noteStop: {
          select: {
            id: true,
            data_hora_start: true,
            data_hora_stop: true,
          },
        },
        failureAnalysis: {
          select: {
            id: true,
            failureCause: {
              select: {
                id: true,
                descricao: true,
              },
            },
            failureAction: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        materialServiceOrder: {
          select: {
            id: true,
            quantidade: true,
            valor_unidade: true,
          },
        },
        maintainers: {
          select: {
            id: true,
            collaborator: {
              select: {
                id: true,
                nome: true,
              },
            },
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

    return obj;
  }

  async listServiceOrderByKanban(
    branchId: number[],
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listServiceOrderByKanban'][]> {
    const obj = await this.table.findMany({
      orderBy: {
        ID: 'desc',
      },
      ...(index !== null && {
        skip: index * perPage,
        take: perPage,
      }),
      select: {
        ID: true,
        ordem: true,
        descricao_solicitacao: true,
        data_hora_solicitacao: true,
        data_prevista_termino: true,
        log_date: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
          },
        },
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
        statusOrderService: {
          select: {
            id: true,
            cor: true,
            status: true,
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

    return obj;
  }

  async listForStatusTable(
    branchId: number[],
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listForStatusTable'][]> {
    const obj = await this.table.findMany({
      select: {
        ID: true,
        data_prevista_termino: true,
        data_hora_encerramento: true,
      },
      where: {
        ID_filial: {
          in: branchId,
        },
        ...filter,
      },
    });

    return obj;
  }

  async countListServiceOrder(
    branchId: number[],
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<number> {
    const obj = await this.table.count({
      where: {
        ID_filial: {
          in: branchId,
        },
        ...filter,
      },
    });

    return obj || 0;
  }

  async countOrderServiceGroupEquipmentWithNoteStop(
    clientId: number,
    branchId: number[],
    startDate: Date,
    endDate: Date,
  ): Promise<IServiceOrder['countOrderServiceGroupEquipmentWithNoteStop'][]> {
    const obj: IServiceOrder['countOrderServiceGroupEquipmentWithNoteStop'][] =
      await this.prismaService.$queryRaw`
    select
      cdods.id_equipamento as equipmentId,
      count(DISTINCT cdods.ID) as count
    from controle_de_ordens_de_servico cdods
    join sofman_apontamento_paradas sap on sap.id_ordem_servico = cdods.ID
    where id_cliente = ${clientId}
    and cdods.ID_filial in (${branchId.join(',')})
    and sap.data_hora_stop BETWEEN ${Prisma.sql`${startDate}`} and ${Prisma.sql`${endDate}`}
    group by cdods.id_equipamento;`;

    const convertedObj = obj.map((item) => ({
      equipmentId: item.equipmentId,
      count: Number(item.count), // Converte BigInt para number
    }));

    console.log(convertedObj, 'convertedObj');
    return convertedObj;
  }

  async listOrdensMaintainer(
    branchId: number[],
    filters: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listOrdensMaintainer'][]> {
    const obj = await this.table.findMany({
      select: {
        ID: true,
        ordem: true,
        descricao_solicitacao: true,
        data_hora_solicitacao: true,
        data_hora_solicitacao_timestamp: true,
        data_prevista_termino: true,
        data_hora_encerramento: true,
        log_date: true,
        log_date_timestamp: true,
        solicitante: true,
        id_solicitante: true,
        emissor: true,
        fechada: true,
        maquina_parada: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        statusOrderService: {
          select: {
            id: true,
            status: true,
            cor: true,
            finalizacao: true,
            requer_justificativa: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
        taskServiceOrder: {
          select: {
            id: true,
            registerHour: {
              select: {
                id: true,
                inicio: true,
                fim: true,
              },
            },
          },
        },
      },
      where: {
        ID_filial: {
          in: branchId,
        },
        ...filters,
      },
    });

    return obj;
  }

  async listOrdersCalendarTypeMaintenance(
    branchId: number[],
    filters: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listOrdersCalendarTypeMaintenance'][]> {
    const obj = await this.table.findMany({
      select: {
        ID: true,
        ordem: true,
        data_hora_solicitacao: true,
        data_hora_solicitacao_timestamp: true,
        data_hora_encerramento: true,
        log_date: true,
        log_date_timestamp: true,
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        statusOrderService: {
          select: {
            id: true,
            status: true,
            cor: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
      },
      where: {
        ID_filial: {
          in: branchId,
        },
        ...filters,
      },
    });
    return obj;
  }

  async listOrdersCalendar(
    branchId: number[],
    filters: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listOrdersCalendar'][]> {
    const obj = await this.table.findMany({
      select: {
        ID: true,
        ordem: true,
        equipamento: true,
        data_inicio: true,
        log_date: true,
        data_hora_encerramento: true,
        statusOrderService: {
          select: {
            id: true,
            status: true,
            cor: true,
          },
        },
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
      },
      where: {
        ID_filial: {
          in: branchId,
        },
        ...filters,
      },
    });
    return obj;
  }

  async stopRecordTypeMaintenance(
    branchId: number[],
    filter: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['stopRecordTypeMaintenance'][]> {
    const obj = await this.table.findMany({
      select: {
        ID: true,
        ordem: true,
        data_hora_solicitacao: true,
        data_prevista_termino: true,
        data_hora_encerramento: true,
        data_equipamento_parou: true,
        data_equipamento_funcionou: true,
        data_inicio: true,
        log_date: true,
        fechada: true,
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        statusOrderService: {
          select: {
            id: true,
            status: true,
            finalizacao: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
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
    return obj;
  }

  async listServiceOrderWithFilter(
    branchId: number[],
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listServiceOrderWithFilter'][]> {
    const obj = await this.table.findMany({
      orderBy: {
        ID: 'desc',
      },
      select: {
        ID: true,
        ordem: true,
        descricao_solicitacao: true,
        data_hora_solicitacao: true,
        data_hora_solicitacao_timestamp: true,
        data_prevista_termino: true,
        data_hora_encerramento: true,
        log_date: true,
        log_date_timestamp: true,
        solicitante: true,
        id_solicitante: true,
        emissor: true,
        fechada: true,
        maquina_parada: true,
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
          },
        },
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        statusOrderService: {
          select: {
            id: true,
            status: true,
            cor: true,
            finalizacao: true,
            requer_justificativa: true,
          },
        },
        justifyStatus: {
          select: {
            id: true,
            id_ordem_servico: true,
            id_status_antigo: true,
            status_old_service_order: {
              select: {
                cor: true,
                cor_font: true,
                status: true,
              },
            },
            id_status_novo: true,
            status_new_service_order: {
              select: {
                cor: true,
                cor_font: true,
                status: true,
              },
            },
            justificativa: true,
            login: true,
            log_date: true,
          },
        },
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
        requester: {
          select: {
            id: true,
            nome: true,
          },
        },
        requestOrderService: {
          select: {
            id: true,
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

    return obj;
  }

  async serviceOrderById(
    id: number,
  ): Promise<IServiceOrder['serviceOrderById'] | null> {
    const obj = await this.table.findFirst({
      select: {
        ID: true,
        ordem: true,
        hh_previsto: true,
        ID_cliente: true,
        ID_filial: true,
        horimetro: true,
        odometro: true,
        log_date: true,
        log_date_timestamp: true,
        descricao_solicitacao: true,
        observacoes: true,
        descricao_servico_realizado: true,
        observacoes_executante: true,
        ordem_vinculada: true,
        //serie_equipamento: true,
        maquina_parada: true,
        solicitante: true,
        id_solicitante: true,
        servico_pendente: true,
        possui_anexo: true,
        data_hora_solicitacao: true,
        data_hora_solicitacao_timestamp: true,
        data_equipamento_parou: true,
        data_prevista_termino: true,
        data_equipamento_funcionou: true,
        data_inicio: true,
        data_hora_encerramento: true,
        status_os: true,
        id_ordem_pai: true,
        mantenedores: true,
        prioridade: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            n_serie: true,
            registerEquipment: {
              select: {
                id: true,
                horimetro: true,
                quilometragem: true,
              },
            },
            registerEquipmentAction: {
              select: {
                id: true,
                horimetro: true,
                quilometragem: true,
                turno: true,
              },
            },
          },
        },
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        requester: {
          select: {
            id: true,
            nome: true,
          },
        },
        noteStop: {
          select: {
            id: true,
            data_hora_start: true,
            data_hora_stop: true,
          },
        },
        note: {
          select: {
            id: true,
          },
        },
        justifyStatus: {
          select: {
            id: true,
            justificativa: true,
            status_new_service_order: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
      },
      where: {
        ID: id,
      },
    });

    return obj;
  }

  async findUnissgnedOrders(
    orderId: number[],
    clientId: number,
  ): Promise<Partial<IServiceOrder['listByClient']>[]> {
    return await this.table.findMany({
      where: {
        ID: { in: orderId },
        ID_cliente: clientId,
        maintainers: {
          none: {},
        },
      },
      select: {
        ID: true,
        ordem: true,
        descricao_solicitacao: true,
      },
    });
  }

  async findByCodeAndEquipment(
    clientId: number,
    code: string,
    equipmentId: number,
  ): Promise<IServiceOrder['findByCodeAndEquipment'] | null> {
    const obj = await this.table.findFirst({
      select: {
        ID: true,
        ordem: true,
        hh_previsto: true,
        ID_cliente: true,
        ID_filial: true,
        horimetro: true,
        odometro: true,
        log_date: true,
        log_date_timestamp: true,
        descricao_solicitacao: true,
        observacoes: true,
        descricao_servico_realizado: true,
        observacoes_executante: true,
        ordem_vinculada: true,
        //serie_equipamento: true,
        maquina_parada: true,
        solicitante: true,
        id_solicitante: true,
        servico_pendente: true,
        possui_anexo: true,
        data_hora_solicitacao: true,
        data_hora_solicitacao_timestamp: true,
        data_equipamento_parou: true,
        data_prevista_termino: true,
        data_equipamento_funcionou: true,
        data_inicio: true,
        data_hora_encerramento: true,
        status_os: true,
        id_ordem_pai: true,
        mantenedores: true,
        prioridade: true,
        branch: {
          select: {
            ID: true,
            filial_numero: true,
            razao_social: true,
          },
        },
        equipment: {
          select: {
            ID: true,
            equipamento_codigo: true,
            descricao: true,
            n_serie: true,
            registerEquipment: {
              select: {
                id: true,
                horimetro: true,
                quilometragem: true,
              },
            },
            registerEquipmentAction: {
              select: {
                id: true,
                horimetro: true,
                quilometragem: true,
                turno: true,
              },
            },
          },
        },
        typeMaintenance: {
          select: {
            ID: true,
            tipo_manutencao: true,
          },
        },
        sectorExecutor: {
          select: {
            Id: true,
            descricao: true,
          },
        },
        requester: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      where: {
        ID_cliente: clientId,
        ordem: code,
        id_equipamento: equipmentId,
      },
    });

    return obj;
  }

  async create(
    data: Prisma.controle_de_ordens_de_servicoUncheckedCreateInput,
  ): Promise<controle_de_ordens_de_servico> {
    try {
      const obj = await this.table.create({
        data,
      });

      return obj;
    } catch (error) {
      throw {
        stack: error.stack,
        message: error.message.includes('Error occurred')
          ? `Error occurred${error.message.split('Error occurred')[1]}`
          : error.message,
        data,
      };
    }
  }
  async update(
    id: number,
    data: Prisma.controle_de_ordens_de_servicoUncheckedUpdateInput,
  ): Promise<controle_de_ordens_de_servico> {
    try {
      const obj = await this.table.update({
        data,
        where: {
          ID: id,
        },
      });

      return obj;
    } catch (error) {
      throw {
        stack: error.stack,
        message: error.message.includes('Error occurred')
          ? `Error occurred${error.message.split('Error occurred')[1]}`
          : error.message,
        data,
      };
    }
  }

  async delete(id: number): Promise<boolean> {
    await this.prismaService
      .$transaction(
        async (tx) => {
          await tx.sofman_anexos_os.deleteMany({
            where: {
              id_ordem_servico: id,
            },
          });

          await tx.controle_de_ordens_de_servico.delete({
            where: {
              ID: id,
            },
          });
        },
        {
          timeout: 60000 * 5,
        },
      )
      .catch((error) => {
        console.error(error);
        return false;
      });

    return true;
  }

  async graficPerformanceIndicatorsKPIS(
    clientId: number,
    startDate: string,
    endDate: string,
    typeMaintenance?: number[], // Tornando opcional com '?'
  ): Promise<IServiceOrder['graficPerformanceIndicatorsKPIS'][]> {
    // Define o filtro dinamicamente com base em typeMaintenance
    const typeMaintenanceFilter =
      typeMaintenance && typeMaintenance.length > 0
        ? Prisma.sql`AND os.tipo_manutencao IN (${Prisma.join(
            typeMaintenance,
          )})`
        : Prisma.sql``; // String vazia se não houver filtro

    console.log(`a.data_programada BETWEEN ${startDate} AND ${endDate}`);

    const result = await this.prismaService.$queryRaw<
      {
        Familia: string;
        DF: number;
        MTBF: number;
        MTTR: number;
        Paradas: number;
        tempo_corretiva: number;
        tempo_prev: number;
      }[]
    >(
      Prisma.sql`
        SELECT
          familia,
          (SUM(TempoPrevistoFuncionamento) - SUM(TempoManutencao)) / SUM(TempoPrevistoFuncionamento) * 100 AS DF,
          (SUM(TempoPrevistoFuncionamento) - SUM(TempoManutencao)) / IF(SUM(OrdensServico) IN (NULL, 0), 1, SUM(OrdensServico)) AS MTBF,
          SUM(TempoManutencao) / IF(SUM(OrdensServico) IN (NULL, 0), 1, SUM(OrdensServico)) AS MTTR,
          SUM(OrdensServico) AS Paradas,
          SUM(TempoPrevistoFuncionamento) AS temp_prev,
          SUM(TempoManutencao) AS temp_corretiva
        FROM (
          SELECT
            Data,
            familia,
            (tprev / 60) AS TempoPrevistoFuncionamento,
            (IF(toff > tPrev, tPrev, toff) / 60) AS TempoManutencao,
            os AS OrdensServico
          FROM (
            SELECT
              (SELECT GROUP_CONCAT(DISTINCT id_ordem_servico)
               FROM sofman_apontamento_paradas par
               JOIN controle_de_ordens_de_servico os ON os.id = par.id_ordem_servico ${typeMaintenanceFilter}
               WHERE par.id_equipamento = a.id_equipamento
               AND DATE(data_hora_stop) = a.data_programada) AS id_ordem,

              a.data_programada AS Data,
              fm.familia,
              SUM(TIMESTAMPDIFF(MINUTE, inicio,
                IF(termino < inicio, ADDDATE(termino, INTERVAL 1440 MINUTE),
                IF(termino = '23:59:59', ADDDATE(termino, INTERVAL 1 SECOND), termino))
              )) AS tPrev,

              IFNULL((
                SELECT SUM(TIMESTAMPDIFF(MINUTE,
                  IF(DATE(data_hora_stop) < a.data_programada, a.data_programada, data_hora_stop),
                  IF(ISNULL(data_hora_start) OR DATE(data_hora_start) > a.data_programada,
                  ADDDATE(a.data_programada, INTERVAL 1440 MINUTE), data_hora_start)
                ))
                FROM sofman_apontamento_paradas par
                JOIN controle_de_ordens_de_servico os ON os.id = par.id_ordem_servico ${typeMaintenanceFilter}
                WHERE par.id_equipamento = eq.id
                AND (a.data_programada = DATE(data_hora_stop)
                OR DATE(data_hora_stop) < a.data_programada AND ISNULL(data_hora_start)
                OR a.data_programada BETWEEN data_hora_stop AND data_hora_start)
              ), 0) AS toff,

              (SELECT COUNT(DISTINCT id_ordem_servico)
               FROM sofman_apontamento_paradas par
               JOIN controle_de_ordens_de_servico os ON os.id = par.id_ordem_servico ${typeMaintenanceFilter}
               WHERE par.id_equipamento = a.id_equipamento
               AND DATE(data_hora_stop) = a.data_programada
              ) AS os

            FROM sofman_prospect_escala_trabalho a
            JOIN cadastro_de_equipamentos eq ON eq.id = a.id_equipamento
            JOIN cadastro_de_familias_de_equipamento fm ON fm.id = eq.id_familia
            WHERE eq.id_cliente = ${clientId}
            AND a.data_programada <= CURDATE()
            AND a.data_programada BETWEEN ${startDate} AND ${endDate}
            GROUP BY a.id_equipamento, a.data_programada
            ORDER BY a.data_programada DESC, eq.equipamento_codigo
          ) kpi
        ) KPIS_SOFMAN
        GROUP BY familia;
      `,
    );

    return result;
  }
}
