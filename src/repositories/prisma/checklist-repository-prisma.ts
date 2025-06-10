import { Prisma, smartnewsystem_producao_checklist } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CheckListRepository } from '../checklist-repository';
import { Injectable } from '@nestjs/common';
import { ICheckList, ICheckListListByClient } from 'src/models/ICheckList';

@Injectable()
export class CheckListRepositoryPrisma implements CheckListRepository {
  constructor(private prismaService: PrismaService) {}

  private table = this.prismaService.smartnewsystem_producao_checklist;

  async findByFamilyAndDescription(
    familyId: number,
    description: string,
  ): Promise<ICheckList['findByFamilyAndDescription'] | null> {
    const checklist = await this.table.findFirst({
      select: {
        id: true,
        descricao: true,
        familyEquipment: true,
        location: true,
      },
      where: {
        id_familia: familyId,
        descricao: description,
      },
    });

    return checklist;
  }

  async findByLocationAndDescription(
    locationId: number,
    description: string,
  ): Promise<ICheckList['findByLocationAndDescription'] | null> {
    const checklist = await this.table.findFirst({
      select: {
        id: true,
        descricao: true,
        familyEquipment: true,
        location: true,
      },
      where: {
        id_localizacao: locationId,
        descricao: description,
      },
    });

    return checklist;
  }

  async findById(id: number): Promise<ICheckList['findById'] | null> {
    const checkList = await this.table.findFirst({
      select: {
        id: true,
        descricao: true,
        familyEquipment: true,
        location: true,
        automatico: true,
        periocidade: true,
        data_base: true,
        antecipacao: true,
        hora_base: true,
        verifica_finalizado: true,
        typePeriodicity: {
          select: {
            id: true,
            descricao: true,
          },
        },
        checkListItens: {
          select: {
            id: true,
            checkListControl: {
              select: {
                id: true,
                descricao: true,
              },
            },
            checkListTask: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
        boundPeriodicity: {
          select: {
            id: true,
            equipment: {
              select: {
                ID: true,
                equipamento_codigo: true,
                descricao: true,
              },
            },
            diverse: {
              select: {
                id: true,
                localizacao: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    return checkList;
  }

  async listByClient(clientId: number): Promise<ICheckListListByClient[]> {
    const checkList = await this.table.findMany({
      select: {
        id: true,
        descricao: true,
        familyEquipment: true,
        location: true,
        automatico: true,
        periocidade: true,
        data_base: true,
        antecipacao: true,
        hora_base: true,
        typePeriodicity: {
          select: {
            id: true,
            descricao: true,
          },
        },
        checkListItens: {
          select: {
            id: true,
            checkListTask: {
              select: {
                id: true,
                descricao: true,
              },
            },
            checkListControl: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
      },
      where: {
        familyEquipment: {
          ID_cliente: clientId,
        },
      },
    });

    return checkList;
  }

  async listByBranch(
    branches: number[],
    filter?: Prisma.smartnewsystem_producao_checklistWhereInput | undefined,
  ): Promise<ICheckListListByClient[]> {
    const checkList = await this.table.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        descricao: true,
        familyEquipment: true,
        location: true,
        automatico: true,
        periocidade: true,
        data_base: true,
        antecipacao: true,
        hora_base: true,
        typePeriodicity: {
          select: {
            id: true,
            descricao: true,
          },
        },
        checkListItens: {
          select: {
            id: true,
            checkListTask: {
              select: {
                id: true,
                descricao: true,
              },
            },
            checkListControl: {
              select: {
                id: true,
                descricao: true,
              },
            },
          },
        },
      },
      where: {
        AND: {
          OR: [
            {
              location: {
                id_filial: {
                  in: branches,
                },
              },
            },
            {
              familyEquipment: {
                equipment: {
                  some: {
                    ID_filial: {
                      in: branches,
                    },
                  },
                },
              },
            },
          ],
        },
        ...filter,
      },
    });

    return checkList;
  }

  async listByFamily(
    familyId: number,
  ): Promise<smartnewsystem_producao_checklist[]> {
    const checkList = await this.table.findMany({
      where: {
        id_familia: familyId,
      },
    });

    return checkList;
  }

  async listByLocation(
    locationId: number,
  ): Promise<smartnewsystem_producao_checklist[]> {
    const checkList = await this.table.findMany({
      where: {
        id_localizacao: locationId,
      },
    });

    return checkList;
  }

  async create(
    data: Prisma.smartnewsystem_producao_checklistUncheckedCreateInput,
  ): Promise<smartnewsystem_producao_checklist> {
    const checkList = await this.table.create({
      data,
    });

    return checkList;
  }

  async update(
    data: Prisma.smartnewsystem_producao_checklistUncheckedUpdateInput,
    id: number,
  ): Promise<smartnewsystem_producao_checklist> {
    const checkList = await this.table.update({
      data,
      where: {
        id,
      },
    });

    return checkList;
  }

  async delete(id: number): Promise<boolean> {
    this.prismaService.$transaction(
      async (tx) => {
        await tx.smartnewsystem_producao_checklist_itens.deleteMany({
          where: {
            id_checklist: id,
          },
        });

        await tx.smartnewsystem_producao_checklist.delete({
          where: {
            id,
          },
        });
      },
      {
        timeout: 60000 * 5, // 5 min
      },
    );

    return true;
  }
}
