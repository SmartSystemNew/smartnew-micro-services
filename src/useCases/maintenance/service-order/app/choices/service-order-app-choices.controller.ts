import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { BranchRepository } from 'src/repositories/branch-repository';
import ClassificationServiceOrderRepository from 'src/repositories/classification-service-order-repository';
import { ComponentsRepository } from 'src/repositories/components-repository';
import { CostCenterRepository } from 'src/repositories/cost-center-repository';
import DescriptionPlanRepository from 'src/repositories/description-plan-repository';
import { EmployeeRepository } from 'src/repositories/employee-repository';
import EquipmentRepository from 'src/repositories/equipment-repository';
import { EquipmentTypeRepository } from 'src/repositories/equipment-type-repository';
import LegendTaskRepository from 'src/repositories/legend-task-repository';
import LogEmployeesRepository from 'src/repositories/log-employees-repository';
import LogEquipmentRepository from 'src/repositories/log-equipment-repository';
import LogMaterialRepository from 'src/repositories/log-material-repository';
import LogStatusRequestServiceRepository from 'src/repositories/log-status-request-service-repository';
import LogUnityOfMensurePlansRepository from 'src/repositories/log-unity-of-mensure-plans-repository';
import { LogDescriptionCostServiceOrderRepository } from 'src/repositories/log_description-cost-service-order-repository';
import LogDescriptionPlanRepository from 'src/repositories/log_description-plan-repository';
import MaintenanceRequesterRepository from 'src/repositories/maintenance-requester-repository';
import MaterialRepository from 'src/repositories/material-repository';
import PositionMaintainerRepository from 'src/repositories/position-maintainer-repository';
import PriorityServiceOrderRepository from 'src/repositories/priority-service-order-repository';
import { SectorExecutingRepository } from 'src/repositories/sector-executing-repository';
import { StatusServiceOrderRepository } from 'src/repositories/status-service-order-repository';
import TaskRepository from 'src/repositories/task-repository';
import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
import TypeRequestRepository from 'src/repositories/type-request-repository';
import { z } from 'zod';
import DefaultResponseSwagger from './dtos/default-response-swagger';
import ListEquipmentResponseSwagger from './dtos/listEquipment-response-swagger';
import LogDescriptionMaintenancePlanningRepository from 'src/repositories/log-description-maintenance-planning-repository';

@ApiTags('Maintenance - Service Order - App - Choice ')
@ApiBearerAuth()
@Controller('/maintenance/service-order/app/choice')
export default class AppServiceOrderChoiceController {
  constructor(
    private equipmentRepository: EquipmentRepository,
    private branchRepository: BranchRepository,
    private employeeRepository: EmployeeRepository,
    private typeRequestRepository: TypeRequestRepository,
    private priorityServiceOrderRepository: PriorityServiceOrderRepository,
    private componentRepository: ComponentsRepository,
    private statusServiceOrderRepository: StatusServiceOrderRepository,
    private sectorExecutingRepository: SectorExecutingRepository,
    private maintenanceRequesterRepository: MaintenanceRequesterRepository,
    private typeMaintenanceRepository: TypeMaintenanceRepository,
    private costCenterRepository: CostCenterRepository,
    private equipmentTypeRepository: EquipmentTypeRepository,
    private legendTaskRepository: LegendTaskRepository,
    private taskRepository: TaskRepository,
    private descriptionPlanRepository: DescriptionPlanRepository,
    private materialRepository: MaterialRepository,
    private logMaterialRepository: LogMaterialRepository,
    private logEmployeesRepository: LogEmployeesRepository,
    private classificationServiceOrder: ClassificationServiceOrderRepository,
    private logEquipmentRepository: LogEquipmentRepository,
    private logDescriptionCostServiceOrderRepository: LogDescriptionCostServiceOrderRepository,
    private logDescriptionPlanRepository: LogDescriptionPlanRepository,
    private logStatusRequestServiceRepository: LogStatusRequestServiceRepository,
    private logUnityOfMensurePlansRepository: LogUnityOfMensurePlansRepository,
    private positionMaintainerRepository: PositionMaintainerRepository,
    private logDescriptionMaintenancePlanningRepository: LogDescriptionMaintenancePlanningRepository,
  ) {}

  @ApiResponse({
    type: ListEquipmentResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/equipment')
  async listEquipment(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    if (query.timestamp) {
      const deletedIds = new Set(response.deleted.map((item) => item.id));

      const logEquipment = await this.logEquipmentRepository.listByBranches(
        user.branches,
      );

      logEquipment.forEach((item) => {
        if (
          item.acao === 'INSERT' &&
          !deletedIds.has(item.id_equipamento.toString())
        ) {
          const findIndex = response.created.findIndex(
            (value) => value.id === item.id_equipamento.toString(),
          );

          const equipmentDetails = {
            id: item.id_equipamento?.toString() || null,
            tag: item.equipamento_codigo,
            description: `${item.equipamento_codigo} - ${item.descricao}`,
            branch_id: item.equipment.branch.ID.toString(),
            cost_center: item.equipment?.costCenter?.ID.toString(),
            equipment_type: item.equipment?.typeEquipment?.ID.toString(),
            plannings: item.equipment.descriptionPlanMaintenance.map((item) =>
              item.id.toString(),
            ),
            plate: item.placa,
            chassi: item.chassi,
            serial_number: item.n_serie,
            observation: item.observacoes,
          };

          if (findIndex === -1) {
            response.created.push(equipmentDetails);
          } else {
            response.created[findIndex] = equipmentDetails;
          }
        }

        if (
          item.acao === 'UPDATE' &&
          !deletedIds.has(item.id_equipamento.toString())
        ) {
          const findIndex = response.created.findIndex(
            (value) => value.id === item.id_equipamento.toString(),
          );

          const equipmentDetails = {
            id: item.id_equipamento?.toString() || null,
            tag: item.equipamento_codigo,
            description: `${item.equipamento_codigo} - ${item.descricao}`,
            branch_id: item.equipment.branch.ID.toString(),
            cost_center: item.equipment?.costCenter?.ID.toString(),
            equipment_type: item.equipment?.typeEquipment?.ID.toString(),
            plannings: item.equipment.descriptionPlanMaintenance.map((item) =>
              item.id.toString(),
            ),
            plate: item.placa,
            chassi: item.chassi,
            serial_number: item.n_serie,
            observation: item.observacoes,
          };

          if (findIndex === -1) {
            response.created.push(equipmentDetails);
          } else {
            response.created[findIndex] = equipmentDetails;
          }
        }

        if (item.acao === 'DELETE') {
          const findIndex = response.created.findIndex(
            (value) => value.id === item.id_equipamento.toString(),
          );

          if (findIndex === -1) {
            response.created.push(item.id_equipamento?.toString() || null);

            deletedIds.add(item.id_equipamento.toString());
          } else {
            response.created[findIndex] =
              item.id_equipamento?.toString() || null;
          }
        }
      });

      response.created = response.created.filter(
        (item) => !deletedIds.has(item.id),
      );
      response.updated = response.updated.filter(
        (item) => !deletedIds.has(item.id),
      );
    } else {
      const equipment = await this.equipmentRepository.listByBranch(
        user.branches,
      );

      response.created = equipment.map((item) => {
        return {
          id: item.ID.toString(),
          tag: item.equipamento_codigo,
          description: `${item.equipamento_codigo} - ${item.descricao}`,
          branch_id: item.branch.ID.toString(),
          cost_center: item?.costCenter?.ID.toString(),
          equipment_type: item?.typeEquipment?.ID.toString(),
          plannings: item.descriptionPlanMaintenance.map((item) =>
            item.id.toString(),
          ),
          plate: item.placa,
          chassi: item.chassi,
          serial_number: item.n_serie,
          observation: item.observacoes,
        };
      });
    }

    return {
      ...response,
    };
  }

  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/branch')
  async listBranch(@Req() req) {
    const user: IUserInfo = req.user;

    return {
      data: user.branch.map((item) => ({
        id: item.id.toString(),
        description: item.name,
      })),
    };
  }

  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/collaborator')
  async listCollaborator(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    if (query.timestamp) {
      const allCollaborator = await this.logEmployeesRepository.listByClient(
        user.clientId,
        {
          log_date: {
            gte: query.timestamp,
          },
        },
      );

      const deletedIds = new Set(response.deleted.map((item) => item.id));

      allCollaborator.forEach((obj) => {
        if (
          obj.acao === 'INSERT' &&
          !deletedIds.has(obj.id_colaborador.toString())
        ) {
          if (obj.status !== '1') {
            deletedIds.add(obj.id_colaborador.toString());
            return;
          }

          const findIndex = response.created.findIndex(
            (value) => value.id === obj.id_colaborador.toString(),
          );

          if (findIndex >= 0) {
            response.created[findIndex].description = obj.nome;
          } else {
            response.created.push({
              id: obj.id_colaborador.toString(),
              description: obj.nome,
              login:
                obj.collaborator.user.length > 0
                  ? obj.collaborator.user[0].login
                  : null,
            });
          }
        }

        if (
          obj.acao === 'UPDATE' &&
          !deletedIds.has(obj.id_colaborador.toString())
        ) {
          if (obj.status !== '1') {
            deletedIds.add(obj.id_colaborador.toString());
            return;
          }

          const findIndex = response.updated.findIndex(
            (value) => value.id === obj.id_colaborador.toString(),
          );

          if (findIndex >= 0) {
            response.updated[findIndex].description = obj.nome;
          } else {
            response.updated.push({
              id: obj.id_colaborador.toString(),
              description: obj.nome,
              login:
                obj.collaborator.user.length > 0
                  ? obj.collaborator.user[0].login
                  : null,
            });
          }
        }
        if (obj.acao === 'DELETE') {
          const findIndex = response.deleted.findIndex(
            (value) => value.id === obj.id_colaborador.toString(),
          );

          if (findIndex >= 0) {
            response.deleted[findIndex].description = obj.nome;
          } else {
            response.deleted.push({
              id: obj.id_colaborador.toString(),
              description: obj.nome,
            });

            deletedIds.add(obj.id_colaborador.toString());
          }
        }
      });

      // Remover IDs duplicados dos arrays created e updated
      response.created = response.created.filter(
        (item) => !deletedIds.has(item.id),
      );
      response.updated = response.updated.filter(
        (item) => !deletedIds.has(item.id),
      );
    } else {
      const allCollaborator = await this.employeeRepository.listByClientId(
        user.clientId,
        {
          status: { in: ['1'] },
        },
      );

      response.created = allCollaborator.map((obj) => {
        return {
          id: obj.id.toString(),
          description: obj.nome,
          login: obj.user.length > 0 ? obj.user[0].login : null,
        };
      });
    }

    return {
      ...response,
    };
  }

  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/problem')
  async listProblem(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filter = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const typeRequest = await this.typeRequestRepository.listByClient(
      user.clientId,
      filter,
    );

    return {
      data: typeRequest.map((item) => ({
        id: item.id.toString(),
        description: item.descricao,
      })),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/cost-diversity')
  async listCostDiversity(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const filter = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : {
          log_date: {
            gte: new Date('2020-01-01').toISOString(),
          },
        };

    const allCosts =
      await this.logDescriptionCostServiceOrderRepository.listByClient(
        user.clientId,
        filter,
        null,
      );

    const deletedIds = new Set(response.deleted.map((item) => item.id));

    console.log(query);

    allCosts.forEach((obj) => {
      if (!query.timestamp) {
        if (obj.acao === 'DELETE') {
          deletedIds.add(obj.id_descricao.toString());
          return;
        }

        const findIndex = response.created.findIndex(
          (value) => value.id === obj.id_descricao.toString(),
        );

        if (findIndex >= 0) {
          response.created[
            findIndex
          ].label = `${obj.descricao.toString()} ${obj.unidade.toString()}`;
        } else {
          response.created.push({
            id: obj.id_descricao.toString(),
            label: ` ${obj.descricao.toString()} ${obj.unidade.toString()}`,
          });
        }
      } else if (
        obj.acao === 'INSERT' &&
        !deletedIds.has(obj.id_descricao.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === obj.id_descricao.toString(),
        );

        if (findIndex >= 0) {
          response.created[
            findIndex
          ].label = `${obj.descricao.toString()} ${obj.unidade.toString()}`;
        } else {
          response.created.push({
            id: obj.id_descricao.toString(),
            label: ` ${obj.descricao.toString()} ${obj.unidade.toString()}`,
          });
        }
      } else if (obj.acao === 'UPDATE' && !deletedIds.has(obj.id.toString())) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === obj.id.toString(),
        );

        if (findIndex >= 0) {
          response.updated[
            findIndex
          ].label = ` ${obj.descricao.toString()} ${obj.unidade.toString()}`;
        } else {
          response.updated.push({
            id: obj.id_descricao.toString(),
            label: ` ${obj.descricao.toString()} ${obj.unidade.toString()}`,
          });
        }
      } else if (obj.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value.id === obj.id_descricao.toString(),
        );

        if (findIndex >= 0) {
          response.deleted[
            findIndex
          ].label = `${obj.descricao.toString()} ${obj.unidade.toString()}`;
        } else {
          response.deleted.push({
            id: obj.id_descricao.toString(),
            label: ` ${obj.descricao.toString()} ${obj.unidade.toString()}`,
          });

          deletedIds.add(obj.id.toString());
        }
      }
    });

    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return response;
  }

  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/priority')
  async listPriority(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filter = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const priority = await this.priorityServiceOrderRepository.listByClient(
      user.clientId,
      filter,
    );

    return {
      data: priority.map((item) => ({
        id: item.id.toString(),
        description: item.descricao,
      })),
    };
  }

  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/component')
  async listComponent(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filter = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const component = await this.componentRepository.listByClient(
      user.clientId,
      filter,
    );

    return {
      data: component.map((item) => ({
        id: item.id.toString(),
        description: item.componente,
      })),
    };
  }

  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/status')
  async listStatus(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filters = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const status = await this.statusServiceOrderRepository.listByClient(
      user.clientId,
      filters,
    );

    return {
      data: status.map((item) => ({
        id: item.id.toString(),
        description: item.status,
        end: item.finalizacao === 1,
      })),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/position-maintainer')
  async listPositionMaintainer(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filters = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const position = await this.positionMaintainerRepository.list(
      user.clientId,
      filters,
    );

    return {
      data: position.map((item) => ({
        id: item.id.toString(),
        description: item.descricao,
      })),
    };
  }

  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/sector-executing')
  async listSectorExecuting(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filters = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const sector = await this.sectorExecutingRepository.listByClient(
      user.clientId,
      filters,
    );

    return {
      data: sector.map((item) => ({
        id: item.Id.toString(),
        description: item.descricao,
      })),
    };
  }

  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/cost-center')
  async listCostCenter(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filter = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const costCenter = await this.costCenterRepository.byBranches(
      user.branches,
      filter,
    );

    return {
      data: costCenter.map((item) => ({
        id: item.ID.toString(),
        description: `${item.centro_custo} - ${item.descricao}`,
      })),
    };
  }

  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/equipment-type')
  async listEquipmentType(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filter = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const equipmentType = await this.equipmentTypeRepository.listByClient(
      user.clientId,
      filter,
    );

    return {
      data: equipmentType.map((item) => ({
        id: item.ID.toString(),
        description: item.tipo_equipamento,
      })),
    };
  }

  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/request')
  async listRequest(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filter = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const requester = await this.maintenanceRequesterRepository.listByClient(
      user.clientId,
      filter,
    );

    return {
      data: requester.map((item) => ({
        id: item.id.toString(),
        description: item.nome,
      })),
    };
  }

  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @UseGuards(AuthGuard)
  @Get('/type-maintenance')
  async listTypeMaintenance(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filter = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const typeMaintenance = await this.typeMaintenanceRepository.listByClient(
      user.clientId,
      filter,
    );

    return {
      data: typeMaintenance.map((item) => ({
        id: item.ID.toString(),
        description: item.tipo_manutencao,
      })),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-legend-task')
  async listLegendTask(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filter = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const allLegendTask = await this.legendTaskRepository.listByClient(
      user.clientId,
      filter,
    );

    const response = allLegendTask.map((obj) => {
      return {
        id: obj.id.toString(),
        description: `${obj.legenda}-${obj.descricao}`,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: DefaultResponseSwagger,
  })
  @Get('/list-task')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async task(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.taskRepository.listByClient(user.clientId, null, [
      'id',
      'tarefa',
      'tipo_dado',
    ]);

    const response = data.map((obj) => {
      return {
        id: obj.id.toString(),
        description: obj.tarefa.replaceAll('\t', '').replaceAll('\n', ''),
        type_answer: obj.tipo_dado,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/material')
  async materialAll(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    if (query.timestamp) {
      const allMaterial =
        await this.logMaterialRepository.listByClientAndActive(user.clientId, {
          log_date: {
            gte: query.timestamp,
          },
        });

      const deletedIds = new Set(response.deleted.map((item) => item.id));

      allMaterial.forEach((obj) => {
        if (
          obj.acao === 'INSERT' &&
          !deletedIds.has(obj.id_material.toString())
        ) {
          const findIndex = response.created.findIndex(
            (value) => value.id === obj.id_material.toString(),
          );

          if (findIndex === -1) {
            response.created.push({
              id: obj.id_material.toString(),
              description:
                obj.codigo === null || obj.codigo.toString() === ''
                  ? obj.material
                  : `${obj.codigo} - ${obj.material}`,
            });
          } else {
            response.created[findIndex].description =
              obj.codigo === null || obj.codigo.toString() === ''
                ? obj.material
                : `${obj.codigo} - ${obj.material}`;
          }
        }
        if (
          obj.acao === 'UPDATE' &&
          !deletedIds.has(obj.id_material.toString())
        ) {
          const findIndex = response.updated.findIndex(
            (value) => value.id === obj.id_material.toString(),
          );

          if (findIndex === -1) {
            response.updated.push({
              id: obj.id_material.toString(),
              description:
                obj.codigo === null || obj.codigo.toString() === ''
                  ? obj.material
                  : `${obj.codigo} - ${obj.material}`,
            });
          } else {
            response.updated[findIndex].description =
              obj.codigo === null || obj.codigo.toString() === ''
                ? obj.material
                : `${obj.codigo} - ${obj.material}`;
          }
        }
        if (obj.acao === 'DELETE') {
          const findIndex = response.deleted.findIndex(
            (value) => value.id === obj.id_material.toString(),
          );

          if (findIndex === -1) {
            response.deleted.push({
              id: obj.id_material.toString(),
              description:
                obj.codigo === null || obj.codigo.toString() === ''
                  ? obj.material
                  : `${obj.codigo} - ${obj.material}`,
            });

            deletedIds.add(obj.id_material.toString());
          } else {
            response.deleted[findIndex].description =
              obj.codigo === null || obj.codigo.toString() === ''
                ? obj.material
                : `${obj.codigo} - ${obj.material}`;
          }
        }
      });

      // Remover IDs duplicados dos arrays created e updated
      response.created = response.created.filter(
        (item) => !deletedIds.has(item.id),
      );
      response.updated = response.updated.filter(
        (item) => !deletedIds.has(item.id),
      );
    } else {
      const allMaterial = await this.materialRepository.listByClientAndActive(
        user.clientId,
      );

      response.created = allMaterial.map((obj) => {
        return {
          id: obj.id.toString(),
          description:
            obj.codigo === null || obj.codigo.toString() === ''
              ? obj.material
              : `${obj.codigo} - ${obj.material}`,
        };
      });
    }

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/material-stock')
  async listStock(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const startTimestamp = query.timestamp
      ? new Date(query.timestamp)
      : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3);

    if (query.timestamp) {
      const allMaterial = await this.logMaterialRepository.listStock(
        user.clientId,
        startTimestamp,
      );

      const deletedIds = new Set(response.deleted.map((item) => item.id));

      allMaterial.forEach((obj) => {
        if (
          obj.acao === 'INSERT' &&
          !deletedIds.has(obj.id_material.toString())
        ) {
          const findIndex = response.created.findIndex(
            (value) => value.id === obj.id_material.toString(),
          );

          if (findIndex === -1) {
            response.created.push({
              id: obj.id_material.toString(),
              description:
                obj.codigo === null || obj.codigo.toString() === ''
                  ? obj.material
                  : `${obj.codigo} - ${obj.material}`,
              min: Number(obj.estoque_min),
              max: Number(obj.estoque_max),
              value: Number(obj.ultima_entrada) || null,
              stock: obj.entrada - obj.saida,
            });
          } else {
            response.created[findIndex].description =
              obj.codigo === null || obj.codigo.toString() === ''
                ? obj.material
                : `${obj.codigo} - ${obj.material}`;
          }
        }
        if (
          obj.acao === 'UPDATE' &&
          !deletedIds.has(obj.id_material.toString())
        ) {
          const findIndex = response.updated.findIndex(
            (value) => value.id === obj.id_material.toString(),
          );

          if (findIndex === -1) {
            response.updated.push({
              id: obj.id_material.toString(),
              description:
                obj.codigo === null || obj.codigo.toString() === ''
                  ? obj.material
                  : `${obj.codigo} - ${obj.material}`,
              min: Number(obj.estoque_min),
              max: Number(obj.estoque_max),
              value: Number(obj.ultima_entrada) || null,
              stock: obj.entrada - obj.saida,
            });
          } else {
            response.updated[findIndex].description =
              obj.codigo === null || obj.codigo.toString() === ''
                ? obj.material
                : `${obj.codigo} - ${obj.material}`;
          }
        }
        if (obj.acao === 'DELETE') {
          const findIndex = response.deleted.findIndex(
            (value) => value.id === obj.id_material.toString(),
          );

          if (findIndex === -1) {
            response.deleted.push({
              id: obj.id_material.toString(),
              description:
                obj.codigo === null || obj.codigo.toString() === ''
                  ? obj.material
                  : `${obj.codigo} - ${obj.material}`,
              min: Number(obj.estoque_min),
              max: Number(obj.estoque_max),
              value: Number(obj.ultima_entrada) || null,
              stock: obj.entrada - obj.saida,
            });

            deletedIds.add(obj.id_material.toString());
          } else {
            response.deleted[findIndex].description =
              obj.codigo === null || obj.codigo.toString() === ''
                ? obj.material
                : `${obj.codigo} - ${obj.material}`;
          }
        }
      });

      // Remover IDs duplicados dos arrays created e updated
      response.created = response.created.filter(
        (item) => !deletedIds.has(item.id),
      );
      response.updated = response.updated.filter(
        (item) => !deletedIds.has(item.id),
      );
    } else {
      const allMaterial = await this.materialRepository.listStock(
        user.clientId,
      );

      response.created = allMaterial.map((obj) => {
        return {
          id: obj.id.toString(),
          description:
            obj.codigo === null || obj.codigo.toString() === ''
              ? obj.material
              : `${obj.codigo} - ${obj.material}`,
          min: Number(obj.estoque_min),
          max: Number(obj.estoque_max),
          value: Number(obj.ultima_entrada) || null,
          stock: obj.entrada - obj.saida,
        };
      });
    }

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/classification')
  async listClassification(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const filter = query.timestamp
      ? { log_date: { gte: query.timestamp } }
      : undefined;

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const allClassification =
      await this.classificationServiceOrder.listByClient(user.clientId, filter);

    response.created = allClassification.map((item) => ({
      id: item.id.toString(),
      description: item.descricao.toString(),
    }));

    return response;
  }

  @UseGuards(AuthGuard)
  @Get('/list-task-plan')
  async listDescriptionTask(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    // const filter = query.timestamp
    //   ? { log_date: { gte: query.timestamp } }
    //   : undefined;

    const allDescriptionPlan =
      await this.logDescriptionPlanRepository.listByDescriptionPlans(
        user.clientId,
        {
          ...(query.timestamp && {
            log_date: {
              gte: query.timestamp,
            },
          }),
        },
      );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const deletedIds = new Set(response.deleted.map((item) => item.id));

    allDescriptionPlan.forEach((obj) => {
      if (
        obj.acao === 'INSERT' &&
        !deletedIds.has(obj.id_descricao_planos.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === obj.id_descricao_planos.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: obj.id_descricao_planos.toString(),
            title: obj.descricao,
            tasks: obj.descriptionPlans?.plans.map((item) => {
              return {
                id: item.task.id.toString() || null,
                description: item.task.tarefa || null,
              };
            }),
          });
        } else {
          response.created[findIndex] = {
            id: obj.id_descricao_planos.toString(),
            title: obj.descricao,
            tasks: obj.descriptionPlans?.plans.map((item) => {
              return {
                id: item.task.id.toString() || null,
                description: item.task.tarefa || null,
              };
            }),
          };
        }
      } else if (
        obj.acao === 'UPDATE' &&
        !deletedIds.has(obj.id_descricao_planos.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === obj.id_descricao_planos.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: obj.id_descricao_planos.toString(),
            title: obj.descricao,
            tasks: obj.descriptionPlans?.plans.map((item) => {
              return {
                id: item.task.id.toString() || null,
                description: item.task.tarefa || null,
              };
            }),
          });
        } else {
          response.updated[findIndex] = {
            id: obj.id_descricao_planos.toString(),
            title: obj.descricao,
            tasks: obj.descriptionPlans?.plans.map((item) => {
              return {
                id: item.task.id.toString() || null,
                description: item.task.tarefa || null,
              };
            }),
          };
        }
      } else if (obj.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value.id === obj.id_descricao_planos.toString(),
        );

        if (findIndex === -1) {
          response.deleted.push({
            id: obj.id_descricao_planos.toString(),
            title: obj.descricao,
            tasks: obj.descriptionPlans?.plans.map((item) => {
              return {
                id: item.task.id.toString() || null,
                description: item.task.tarefa || null,
              };
            }),
          });
        } else {
          response.deleted[findIndex] = {
            id: obj.id_descricao_planos.toString(),
            title: obj.descricao,
            tasks: obj.descriptionPlans?.plans.map((item) => {
              return {
                id: item.task.id.toString() || null,
                description: item.task.tarefa || null,
              };
            }),
          };
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-task-planning')
  async listDescriptionPlanningTask(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    // const filter = query.timestamp
    //   ? { log_date: { gte: query.timestamp } }
    //   : undefined;

    const allDescriptionPlan =
      await this.logDescriptionMaintenancePlanningRepository.listByWhere(
        user.clientId,
        user.branches,
        {
          ...(query.timestamp && {
            log_date: {
              gte: query.timestamp,
            },
          }),
        },
      );

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const deletedIds = new Set(response.deleted.map((item) => item.id));

    allDescriptionPlan.forEach((obj) => {
      if (!query.timestamp) {
        if (obj.acao === 'DELETE') {
          deletedIds.add(obj.descriptionPlanning.id.toString());
          return;
        }

        const findIndex = response.created.findIndex(
          (value) => value.id === obj.descriptionPlanning.id.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: obj.descriptionPlanning.id.toString(),
            title: obj.descriptionPlanning.descricao,
            tasks: obj.descriptionPlanning.taskPlanningMaintenance.map(
              (item) => {
                return {
                  id: item.task.id.toString() || null,
                  description: item.task.tarefa || null,
                };
              },
            ),
          });
        } else {
          response.created[findIndex] = {
            id: obj.descriptionPlanning.id.toString(),
            title: obj.descriptionPlanning.descricao,
            tasks: obj.descriptionPlanning.taskPlanningMaintenance.map(
              (item) => {
                return {
                  id: item.task.id.toString() || null,
                  description: item.task.tarefa || null,
                };
              },
            ),
          };
        }
      } else if (
        obj.acao === 'INSERT' &&
        !deletedIds.has(obj.descriptionPlanning.id.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === obj.descriptionPlanning.id.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: obj.descriptionPlanning.id.toString(),
            title: obj.descriptionPlanning.descricao,
            tasks: obj.descriptionPlanning.taskPlanningMaintenance.map(
              (item) => {
                return {
                  id: item.task.id.toString() || null,
                  description: item.task.tarefa || null,
                };
              },
            ),
          });
        } else {
          response.created[findIndex] = {
            id: obj.descriptionPlanning.id.toString(),
            title: obj.descriptionPlanning.descricao,
            tasks: obj.descriptionPlanning.taskPlanningMaintenance.map(
              (item) => {
                return {
                  id: item.task.id.toString() || null,
                  description: item.task.tarefa || null,
                };
              },
            ),
          };
        }
      } else if (
        obj.acao === 'UPDATE' &&
        !deletedIds.has(obj.descriptionPlanning.id.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === obj.descriptionPlanning.id.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: obj.descriptionPlanning.id.toString(),
            title: obj.descriptionPlanning.descricao,
            tasks: obj.descriptionPlanning.taskPlanningMaintenance.map(
              (item) => {
                return {
                  id: item.task.id.toString() || null,
                  description: item.task.tarefa || null,
                };
              },
            ),
          });
        } else {
          response.updated[findIndex] = {
            id: obj.descriptionPlanning.id.toString(),
            title: obj.descriptionPlanning.descricao,
            tasks: obj.descriptionPlanning.taskPlanningMaintenance.map(
              (item) => {
                return {
                  id: item.task.id.toString() || null,
                  description: item.task.tarefa || null,
                };
              },
            ),
          };
        }
      } else if (obj.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value.id === obj.descriptionPlanning.id.toString(),
        );

        if (findIndex === -1) {
          deletedIds.add(obj.descriptionPlanning.id.toString());
          response.deleted.push({
            id: obj.descriptionPlanning.id.toString(),
            title: obj.descriptionPlanning.descricao,
            tasks: obj.descriptionPlanning.taskPlanningMaintenance.map(
              (item) => {
                return {
                  id: item.task.id.toString() || null,
                  description: item.task.tarefa || null,
                };
              },
            ),
          });
        } else {
          response.deleted[findIndex] = {
            id: obj.descriptionPlanning.id.toString(),
            title: obj.descriptionPlanning.descricao,
            tasks: obj.descriptionPlanning.taskPlanningMaintenance.map(
              (item) => {
                return {
                  id: item.task.id.toString() || null,
                  description: item.task.tarefa || null,
                };
              },
            ),
          };
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/status-request-service')
  async listStatusRequestService(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    const allStatus = await this.logStatusRequestServiceRepository.listByClient(
      user.clientId,
      {
        ...(query.timestamp && {
          log_date: {
            gte: query.timestamp
              ? query.timestamp
              : new Date('2010-01-01').toISOString(),
          },
        }),
      },
    );

    allStatus.forEach((item) => {
      if (!query.timestamp) {
        if (item.registro === 'DELETE') {
          return;
        }

        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_status.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_status.toString(),
            description: item.descricao,
            action: item.acao,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_status.toString(),
            description: item.descricao,
            action: item.acao,
          };
        }
      } else if (
        item.registro === 'INSERT' &&
        !updatedIds.has(item.id_status.toString()) &&
        !deletedIds.has(item.id_status.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_status.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_status.toString(),
            description: item.descricao,
            action: item.acao,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_status.toString(),
            description: item.descricao,
            action: item.acao,
          };
        }
      } else if (
        item.registro === 'UPDATE' &&
        !deletedIds.has(item.id_status.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id_status.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: item.id_status.toString(),
            description: item.descricao,
            action: item.acao,
          });
          updatedIds.add(item.id_status.toString());
        } else {
          response.updated[findIndex] = {
            id: item.id_status.toString(),
            description: item.descricao,
            action: item.acao,
          };
        }
      } else if (item.registro === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value.id === item.id_status.toString(),
        );

        if (findIndex === -1) {
          response.deleted.push({
            id: item.id_status.toString(),
            description: item.descricao,
            action: item.acao,
          });
          deletedIds.add(item.id_status.toString());
        } else {
          response.deleted[findIndex] = {
            id: item.id_status.toString(),
            description: item.descricao,
            action: item.acao,
          };
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/unity-of-mensure-plan')
  async listUnityOfMensurePlan(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      timestamp: z.coerce.date().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const response = {
      created: [],
      updated: [],
      deleted: [],
    };

    const updatedIds = new Set(response.updated.map((item) => item.id));
    const deletedIds = new Set(response.deleted.map((item) => item.id));

    const allStatus = await this.logUnityOfMensurePlansRepository.listByClient(
      user.clientId,
      {
        log_date: {
          gte: query.timestamp
            ? query.timestamp
            : new Date('2010-01-01').toISOString(),
        },
      },
    );

    allStatus.forEach((item) => {
      if (!query.timestamp) {
        if (item.acao === 'DELETE') {
          return;
        }

        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_unidade.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_unidade.toString(),
            description: item.unidade,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_unidade.toString(),
            description: item.unidade,
          };
        }
      } else if (
        item.acao === 'INSERT' &&
        !updatedIds.has(item.id_unidade.toString()) &&
        !deletedIds.has(item.id_unidade.toString())
      ) {
        const findIndex = response.created.findIndex(
          (value) => value.id === item.id_unidade.toString(),
        );

        if (findIndex === -1) {
          response.created.push({
            id: item.id_unidade.toString(),
            description: item.unidade,
          });
        } else {
          response.created[findIndex] = {
            id: item.id_unidade.toString(),
            description: item.unidade,
          };
        }
      } else if (
        item.acao === 'UPDATE' &&
        !deletedIds.has(item.id_unidade.toString())
      ) {
        const findIndex = response.updated.findIndex(
          (value) => value.id === item.id_unidade.toString(),
        );

        if (findIndex === -1) {
          response.updated.push({
            id: item.id_unidade.toString(),
            description: item.unidade,
          });
          updatedIds.add(item.id_unidade.toString());
        } else {
          response.updated[findIndex] = {
            id: item.id_unidade.toString(),
            description: item.unidade,
          };
        }
      } else if (item.acao === 'DELETE') {
        const findIndex = response.deleted.findIndex(
          (value) => value.id === item.id_unidade.toString(),
        );

        if (findIndex === -1) {
          response.deleted.push({
            id: item.id_unidade.toString(),
            description: item.unidade,
          });
          deletedIds.add(item.id_unidade.toString());
        } else {
          response.deleted[findIndex] = {
            id: item.id_unidade.toString(),
            description: item.unidade,
          };
        }
      }
    });

    // Remover IDs duplicados dos arrays created
    response.created = response.created.filter(
      (item) => !updatedIds.has(item.id),
    );
    // Remover IDs duplicados dos arrays created e updated
    response.created = response.created.filter(
      (item) => !deletedIds.has(item.id),
    );
    response.updated = response.updated.filter(
      (item) => !deletedIds.has(item.id),
    );

    return {
      ...response,
    };
  }
}
