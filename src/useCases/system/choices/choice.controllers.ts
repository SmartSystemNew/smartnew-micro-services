import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { z } from 'zod';

import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import SelectResponseSwagger from 'src/models/swagger/select-response-swagger';
import { EmployeeRepository } from 'src/repositories/employee-repository';
import { FailureSymptomsRepository } from 'src/repositories/failure-symptoms-repository';
import { SectorExecutingRepository } from 'src/repositories/sector-executing-repository';
import { StatusServiceOrderRepository } from 'src/repositories/status-service-order-repository';

import { ComponentsRepository } from 'src/repositories/components-repository';
import { DescriptionCostServiceOrderRepository } from 'src/repositories/description-cost-service-order-repository';
import EquipmentRepository from 'src/repositories/equipment-repository';
import { FailureActionRepository } from 'src/repositories/failure-action-repository';
import { FailureCauseRepository } from 'src/repositories/failure-cause-repository';
import FinanceTributesRepository from 'src/repositories/finance-tributes-repository';
import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
import MaintenanceRequesterRepository from 'src/repositories/maintenance-requester-repository';
import MaterialRepository from 'src/repositories/material-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { SubGroupRepository } from 'src/repositories/subgroup-repository';
import TaskRepository from 'src/repositories/task-repository';
import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
import { FamilyRepository } from 'src/repositories/family-repository';
import listEquipmentQuerySwagger from './dtos/swagger/listEquipment-query-swagger';
import { UserRepository } from 'src/repositories/user-repository';
import ClassificationServiceOrderRepository from 'src/repositories/classification-service-order-repository';
import PriorityServiceOrderRepository from 'src/repositories/priority-service-order-repository';
import PeriodicityBoundRepository from 'src/repositories/periodicity-bound-repository';
import { CheckListStatusRepository } from 'src/repositories/checklist-status-repository';
import { CheckListRepository } from 'src/repositories/checklist-repository';
import LegendTaskRepository from 'src/repositories/legend-task-repository';
import UnityOfMensurePlansRepository from 'src/repositories/unity-of-mensure-plans-repository';
import DescriptionPlanRepository from 'src/repositories/description-plan-repository';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import ProviderRepository from 'src/repositories/provider-repository';
import MaterialCodeRepository from 'src/repositories/material-code-repository';
import { ListDescriptionPlanWithTaskResponseSwagger } from './dtos/swagger/listDescriptionPlanWithTask-response-swagger';
import CategoryMaterialRepository from 'src/repositories/category-material-repository';
import LocationRepository from 'src/repositories/location-repository';

@ApiTags('System - Choices')
@ApiBearerAuth()
@Controller('/system/choices')
export default class ChoiceController {
  constructor(
    private subGroupRepository: SubGroupRepository,
    private serviceOrderRepository: ServiceOrderRepository,
    private sectorExecutorRepository: SectorExecutingRepository,
    private typeMaintenanceRepository: TypeMaintenanceRepository,
    private taskRepository: TaskRepository,
    private employeeRepository: EmployeeRepository,
    private statusServiceOrderRepository: StatusServiceOrderRepository,
    private financeTypePaymentRepository: FinanceTypePaymentRepository,
    private maintenanceRequesterRepository: MaintenanceRequesterRepository,
    private financeTributesRepository: FinanceTributesRepository,
    private equipmentRepository: EquipmentRepository,
    private materialRepository: MaterialRepository,
    private descriptionCostServiceOrderRepository: DescriptionCostServiceOrderRepository,
    private componentsRepository: ComponentsRepository,
    private failureSymptomsRepository: FailureSymptomsRepository,
    private failureCauseRepository: FailureCauseRepository,
    private failureActionRepository: FailureActionRepository,
    private familyRepository: FamilyRepository,
    private userRepository: UserRepository,
    private priorityServiceOrderRepository: PriorityServiceOrderRepository,
    private classificationServiceOrderRepository: ClassificationServiceOrderRepository,
    private periodicityBoundRepository: PeriodicityBoundRepository,
    private checklistStatusRepository: CheckListStatusRepository,
    private checklistRepository: CheckListRepository,
    private legendTaskRepository: LegendTaskRepository,
    private unityOfMensurePlansRepository: UnityOfMensurePlansRepository,
    private descriptionPlanRepository: DescriptionPlanRepository,
    private branchByUserRepository: BranchesByUserRepository,
    private providerRepository: ProviderRepository,
    private materialCodeRepository: MaterialCodeRepository,
    private categoryMaterialRepository: CategoryMaterialRepository,
    private locationRepository: LocationRepository,
  ) {}

  /**
   * Retrieves a list of subgroups based on the user's branches.
   *
   * @param req - The request object containing user information.
   *
   * @returns An object containing the mapped subgroups.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @Get('/subgroup')
  @ApiOkResponse({
    description: 'Success',
    type: SelectResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async subGroup(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.subGroupRepository.listByBranches(
      user.branches,
      null,
      ['id', 'descricao'],
    );
    const response = {
      data: querySet.map((instance) => {
        return {
          value: instance.id.toString(),
          label: instance.descricao,
        };
      }),
    };
    return response;
  }

  /**
   * Retrieves a list of failure symptoms based on the user's client ID.
   *
   * @param req - The request object containing user information.
   *
   * @returns An object containing the mapped failure symptoms.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   *
   * @remarks
   * This function retrieves a list of failure symptoms for a specific client.
   * It uses the `AuthGuard` to ensure that only authenticated users can access the data.
   * The function then fetches the failure symptoms from the database using the `failureSymptomsRepository` and maps them to the required format.
   * Finally, it returns the response object containing the mapped failure symptoms.
   */
  @UseGuards(AuthGuard)
  @Get('/failure-symptoms')
  @ApiOkResponse({
    description: 'Success',
    type: SelectResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async FailureSymptoms(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.failureSymptomsRepository.listByClient(
      user.clientId,
      null,
      ['id', 'descricao'],
    );
    const response = {
      data: querySet.map((instance) => {
        return {
          value: instance.id.toString(),
          label: instance.descricao,
        };
      }),
    };
    return response;
  }

  /**
   * Retrieves a list of users based on the client ID and their active status.
   * The returned list is formatted for use in a select component.
   *
   * @param req - The request object containing user information.
   *
   * @returns An object containing the mapped users.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get('/requester')
  async requester(@Req() req) {
    const user: IUserInfo = req.user;

    const allUser = await this.maintenanceRequesterRepository.listByClient(
      user.clientId,
    );

    const response = allUser.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.nome,
      };
    });

    return {
      data: response,
    };
  }

  /**
   * Retrieves a list of sector executing options based on the client ID.
   * The returned list is formatted for use in a select component.
   *
   * @param req - The request object containing user information.
   *
   * @returns An object containing the mapped sector executing options.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/sector-executing')
  async listSectorExecuting(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.sectorExecutorRepository.listByClient(
      user.clientId,
      null,
      ['Id', 'descricao'],
    );

    const response = data.map((obj) => {
      return {
        value: obj.Id.toString(),
        label: obj.descricao,
      };
    });

    return {
      data: response,
    };
  }
  /**
   * Retrieves a list of failure cause options based on the user's client ID.
   * The returned list is formatted for use in a select component.
   *
   * @param req - The request object containing user information.
   *
   * @returns An object containing the mapped failure cause options.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   *
   * @remarks
   * This function retrieves a list of failure cause for a specific client.
   * It uses the `AuthGuard` to ensure that only authenticated users can access the data.
   * The function then fetches the failure cause from the database using the `failureCauseRepository` and maps them to the required format.
   * Finally, it returns the response object containing the mapped failure cause options.
   */
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/failure-cause')
  async failureCause(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.failureCauseRepository.listByClient(
      user.clientId,
      null,
      ['id', 'descricao'],
    );

    const response = data.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.descricao,
      };
    });

    return {
      data: response,
    };
  }
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/failure-action')
  async FailureAction(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.failureActionRepository.listByClient(
      user.clientId,
      null,
      ['id', 'descricao'],
    );

    const response = data.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.descricao,
      };
    });

    return {
      data: response,
    };
  }
  /**
   * Retrieves a list of cost service order options based on the client ID.
   * The returned list is formatted for use in a select component.
   *
   * @param req - The request object containing user information.
   * @returns An object containing the mapped cost service order options.
   *          The object has a 'data' property, which is an array of objects.
   *          Each object has 'value' and 'label' properties, representing the cost service order ID and a combined ID, description, and unit, respectively.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/cost-service-order')
  async costServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.descriptionCostServiceOrderRepository.listByClient(
      user.clientId,
      null,
      ['id', 'descricao', 'unidade'],
    );

    const response = data.map((obj) => {
      return {
        value: obj.id.toString(),
        label: `${obj.id} ${obj.descricao} ${obj.unidade}`,
      };
    });

    return {
      data: response,
    };
  }

  /**
   * Retrieves a list of type maintenance options based on the client ID.
   * The returned list is formatted for use in a select component.
   *
   * @param req - The request object containing user information.
   *
   * @returns An object containing the mapped type maintenance options.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @Get('/type-maintenance')
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async TypeMaintenance(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.typeMaintenanceRepository.listByClient(
      user.clientId,
      null,
      ['ID', 'tipo_manutencao'],
    );

    const response = data.map((obj) => {
      return {
        value: obj.ID.toString(),
        label: obj.tipo_manutencao,
      };
    });

    return {
      data: response,
    };
  }

  /**
   * Retrieves a list of task options based on the client ID.
   * The returned list is formatted for use in a select component.
   *
   * @param req - The request object containing user information.
   *
   * @returns An object containing the mapped task options.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @Get('/task')
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async task(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.taskRepository.listByClient(user.clientId, null, [
      'id',
      'tarefa',
    ]);
    const response = data.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.tarefa.replaceAll('\t', '').replaceAll('\n', ''),
      };
    });

    return {
      data: response,
    };
  }

  /**
   * Retrieves a list of employees based on the client ID.
   * The returned list is formatted for use in a select component.
   *
   * @param req - The request object containing user information.
   *
   * @returns An object containing the mapped employee options.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @Get('/employee')
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async employee(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.employeeRepository.listByClient(
      user.clientId,
      null,
      ['id', 'nome'],
    );
    const response = data.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.nome,
      };
    });

    return {
      data: response,
    };
  }
  @UseGuards(AuthGuard)
  @Get('/components')
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async components(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.componentsRepository.listByClient(
      user.clientId,
      null,
      ['id', 'componente'],
    );
    const response = data.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.componente,
      };
    });

    return {
      data: response,
    };
  }

  /**
   * Retrieves a list of materials based on the client ID and their active status.
   * The returned list is formatted for use in a select component.
   *
   * @param req - The request object containing user information.
   * @returns An object containing the mapped material options.
   *          The object has a 'data' property, which is an array of objects.
   *          Each object has 'value' and 'label' properties, representing the material ID and a combined code and description, respectively.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @Get('/material')
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async material(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      s: z.string().optional(),
      id: z
        .string()
        .transform((value) =>
          value === '' || value === 'null' ? null : Number(value),
        )
        .optional(),
      index: z.coerce.number().optional(),
    });

    const query = querySchema.parse(req.query);

    const page = 10;

    const data = await this.materialRepository.listByClientAndActive(
      user.clientId,
      query.s && query.s.length > 0
        ? {
            OR: [
              {
                material: {
                  contains: query.s,
                },
              },
              {
                codigo: {
                  contains: query.s,
                },
              },
            ],
          }
        : query.id
        ? {
            id: query.id,
          }
        : null,
      query.index,
      page,
    );

    const countItens = await this.materialRepository.countListByClientAndActive(
      user.clientId,
      query.s && query.s.length > 0
        ? {
            OR: [
              {
                material: {
                  contains: query.s,
                },
              },
              {
                codigo: {
                  contains: query.s,
                },
              },
            ],
          }
        : null,
    );

    const response = data.map((obj) => {
      return {
        value: obj.id.toString(),
        label: `${obj.codigo} - ${obj.material}`,
        type: obj.tipo,
        //stock,
      };
    });

    return {
      data: response,
      totalIndex: Math.ceil(countItens / page) - 1,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/material-code')
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async listSecondaryMaterial(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      s: z.string().optional(),
      id: z
        .string()
        .transform((value) =>
          value === '' || value === 'null' ? null : Number(value),
        )
        .optional(),
      index: z.coerce.number().optional(),
    });

    const query = querySchema.parse(req.query);

    const page = 10;

    const data = await this.materialCodeRepository.listByClient(
      user.clientId,
      query.index,
      page,
      query.s && query.s.length > 0
        ? {
            material: {
              tipo: 'stock',
            },
            OR: [
              {
                material: {
                  material: query.s,
                },
              },
              {
                codigo: {
                  contains: query.s,
                },
              },
            ],
          }
        : query.id
        ? {
            id: query.id,
          }
        : null,
    );

    const countItens = await this.materialCodeRepository.countListByClient(
      user.clientId,
      query.s && query.s.length > 0
        ? {
            OR: [
              {
                material: {
                  material: query.s,
                },
              },
              {
                codigo: {
                  contains: query.s,
                },
              },
            ],
          }
        : null,
    );

    const response = data.map((obj) => {
      return {
        value: obj.id.toString(),
        label: `${obj.codigo} - ${obj.material.material}`,
        //stock,
      };
    });

    return {
      data: response,
      totalIndex: Math.ceil(countItens / page) - 1,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/material/all')
  async materialAll(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.materialRepository.listByClientAndActive(
      user.clientId,
    );

    const response = data.map((obj) => ({
      id: obj.id.toString(),
      description: `${obj.codigo} - ${obj.material}`,
    }));

    return { data: response };
  }

  /**
   * Retrieves a list of employees who are considered maintainers based on the client ID.
   * The returned list is formatted for use in a select component.
   *
   * @param req - The request object containing user information.
   *
   * @returns An object containing the mapped employee options.
   *          The object has a 'data' property, which is an array of objects.
   *          Each object has 'value' and 'label' properties, representing the employee ID and name, respectively.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @Get('/maintainers')
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async maintainers(@Req() req, @Query() query) {
    const user: IUserInfo = req.user;

    const idServiceOrder = query.idServiceOrder
      ? parseInt(query.idServiceOrder)
      : null;

    const data = await this.employeeRepository.selectMaintainersByClient(
      user.clientId,
      user.login,
      idServiceOrder,
    );

    const response = data.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.nome,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/finance-type-payment')
  async financeTypePayment(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.financeTypePaymentRepository.listByClient(
      user.clientId,
    );

    const querySchema = z.object({
      type: z.string().optional().default('payment'),
    });

    const query = querySchema.parse(req.query);

    return {
      [query.type]: querySet.map((value) => {
        return {
          value: value.id,
          text: `${value.descricao}`,
          installment: value.parcela === 1,
        };
      }),
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/finance-tributes')
  async financeTributes(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.financeTributesRepository.listByClient(
      user.clientId,
    );

    const querySchema = z.object({
      type: z.string().optional().default('tributes'),
    });

    const query = querySchema.parse(req.query);

    return {
      [query.type]: querySet.map((value) => {
        return {
          value: value.id,
          text: `${value.descricao}`,
        };
      }),
      success: true,
    };
  }

  /**
   * Retrieves a list of service order statuses based on the user's client ID and type of access.
   *
   * @param req - The request object containing user information.
   * @returns An object containing a list of service order statuses.
   *
   * @remarks
   * This function is used to retrieve a list of service order statuses for a specific user.
   * It requires authentication and authorization to access the data.
   *
   * @example
   * ```typescript
   * const req = { user: { clientId: 123, typeAccess: 'admin' } };
   * const result = await listServiceOrderStatus(req);
   * ```
   */
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/status-service-order')
  async listServiceOrderStatus(@Req() req) {
    const user: IUserInfo = req.user;

    const data =
      await this.statusServiceOrderRepository.choiceServiceOrderStatus(
        user.clientId,
        user.typeAccess,
      );
    const response = data
      .map((obj) => {
        return {
          value: obj.id.toString(),
          label: obj.status,
          initial: obj.finalizacao === 2,
          hasFinished: obj.finalizacao === 1,
          hasJustify: obj.requer_justificativa === 'S',
          count: obj._count.serviceOrder,
        };
      })
      .sort((a, b) => {
        // Se o status for "EM ABERTO", ele deve ir para o início
        if (a.label === 'EM ABERTO') return -1;
        if (b.label === 'EM ABERTO') return 1;
        // Caso contrário, mantemos a ordem original
        return 0;
      });

    return {
      data: response,
    };
  }

  /**
   * Retrieves a list of equipment based on the user's branches.
   *
   * @remarks
   * This function is used to fetch a list of equipment for a specific client's branches.
   * It requires authentication and authorization to access the data.
   *
   * @param req - The request object containing user information.
   * @returns An object containing a list of equipment options.
   *          The object has a 'data' property, which is an array of objects.
   *          Each object has 'value' and 'label' properties, representing the equipment ID and a combined code and description, respectively.
   *
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/equipment-branches')
  async equipmentByBranches(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.equipmentRepository.listByBranch(user.branches);
    const response = data.map((obj) => {
      return {
        value: obj.ID.toString(),
        label: `${obj.equipamento_codigo} - ${obj.descricao}`,
      };
    });

    return {
      data: response,
    };
  }
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/service-order-branches')
  async serviceOrderByBranches(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.serviceOrderRepository.listServiceOrder(
      user.branches,
    );
    const response = querySet.map((obj) => {
      return {
        value: obj.ID.toString(),
        label: `${obj.ordem} - ${obj.descricao_solicitacao}`,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/list-priority-service-order')
  async listPriority(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.priorityServiceOrderRepository.listByClient(
      user.clientId,
    );

    const response = querySet.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.descricao,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/list-classification-service-order')
  async listClassificationServiceOrder(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet =
      await this.classificationServiceOrderRepository.listByClient(
        user.clientId,
      );

    const response = querySet.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.descricao,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/family')
  async listFamily(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.familyRepository.listByClient(user.clientId, {
      equipment: {
        some: {
          ID_filial: {
            in: user.branches,
          },
        },
      },
    });

    const response = querySet.map((obj) => {
      return {
        value: obj.ID.toString(),
        label: obj.familia,
        equipment: obj.equipment.map((eq) => ({
          value: eq.ID.toString(),
          label: `${eq.equipamento_codigo} - ${eq.descricao}`,
        })),
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiQuery({ type: listEquipmentQuerySwagger })
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/equipment')
  async listEquipment(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      familyId: z.coerce
        .string()
        .transform((value) => value.split(',').map(Number))
        .optional(),
    });

    const query = querySchema.parse(req.query);

    const querySet = await this.equipmentRepository.listByBranch(
      user.branches,
      {
        ...(query.familyId && {
          ID_familia: {
            in: query.familyId,
          },
        }),
      },
    );
    const response = querySet.map((obj) => {
      return {
        value: obj.ID.toString(),
        label: `${obj.equipamento_codigo}-${obj.descricao}`,
        tag: obj.equipamento_codigo,
        branch: {
          value: obj.branch.ID.toString(),
          label: obj.branch.filial_numero,
        },
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/user')
  async listUser(@Req() req) {
    const user: IUserInfo = req.user;

    const querySet = await this.userRepository.listUserByClientAndActive(
      user.clientId,
    );
    const response = querySet.map((obj) => {
      return {
        value: obj.login,
        label: obj.name,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/periodicity-bound')
  async listPeriodicityBound(@Req() req) {
    const user: IUserInfo = req.user;

    const allPeriodicity = await this.periodicityBoundRepository.list();

    const response = [];

    allPeriodicity.forEach((obj) => {
      if (
        obj.checklist === 1 &&
        user.module.findIndex((module) => module.id === 13) >= 0
      ) {
        response.push({
          value: obj.id.toString(),
          label: obj.descricao,
          requiredDay: obj.requer_dia === 1,
          requiredHour: obj.requer_hora === 1,
        });
      } else if (
        obj.manutencao === 1 &&
        user.module.findIndex((module) => module.id === 1) >= 0
      ) {
        response.push({
          value: obj.id.toString(),
          label: obj.descricao,
          requiredDay: obj.requer_dia === 1,
          requiredHour: obj.requer_hora === 1,
        });
      }
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/check-list-status')
  async listStatusChecklist(@Req() req) {
    const user: IUserInfo = req.user;

    const allChecklist = await this.checklistStatusRepository.listByClient(
      user.clientId,
    );

    const response = allChecklist.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.descricao,
        color: obj.cor,
        action: obj.acao === true,
        checkListControl: obj.checkListControl?.descricao,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/check-list')
  async listModelChecklist(@Req() req) {
    const user: IUserInfo = req.user;

    const allChecklist = await this.checklistRepository.listByBranch(
      user.branches,
    );

    const response = [];

    allChecklist.forEach((obj) => {
      if (obj.familyEquipment) {
        response.push({
          value: obj.id.toString(),
          label: obj.descricao,
        });
      }
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/list-legend-task')
  async listLegendTask(@Req() req) {
    const user: IUserInfo = req.user;

    const allLegendTask = await this.legendTaskRepository.listByClient(
      user.clientId,
    );

    const response = allLegendTask.map((obj) => {
      return {
        value: obj.id.toString(),
        label: `${obj.legenda}-${obj.descricao}`,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/list-unity-mensure')
  async listUnityOfMensure(@Req() req) {
    const user: IUserInfo = req.user;

    const allUnity = await this.unityOfMensurePlansRepository.findByClient(
      user.clientId,
    );

    const response = allUnity.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.unidade,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Success', type: SelectResponseSwagger })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/list-description-plan')
  async listDescriptionPlan(@Req() req) {
    const user: IUserInfo = req.user;

    const allDescriptionPlan =
      await this.descriptionPlanRepository.listByClient(user.clientId);

    const response = allDescriptionPlan.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.descricao,
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success',
    type: ListDescriptionPlanWithTaskResponseSwagger,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/list-description-plan-with-task')
  async listDescriptionPlanWithTask(@Req() req) {
    const user: IUserInfo = req.user;

    const allDescriptionPlan =
      await this.descriptionPlanRepository.listByClientWithTask(user.clientId);

    const response = allDescriptionPlan.map((obj) => {
      return {
        value: obj.id.toString(),
        label: obj.descricao,
        plan: obj.plans.map((item) => {
          return {
            id: item.ID,
            taskId: item.task.id,
            task: item.task.tarefa,
          };
        }),
      };
    });

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/branch')
  async listBranch(@Req() req) {
    const querySchema = z.object({
      page: z.coerce.number().optional().nullable(),
      perPage: z.coerce.number().optional().nullable(),
      s: z.string().optional().nullable(),
    });

    const query = querySchema.parse(req.query);

    const user: IUserInfo = req.user;

    const branch = await this.branchByUserRepository.listByClientAndUserForPage(
      user.clientId,
      user.login,
      Number(query.page) >= 0 ? query.page : null,
      query.perPage ? query.perPage : null,
      query.s,
    );

    const totalBranch =
      await this.branchByUserRepository.countListByClientAndUserForPage(
        user.clientId,
        user.login,
        query.s,
      );

    return {
      data: branch.map((item) => {
        return {
          value: item.branch.ID.toString(),
          label: item.branch.filial_numero,
        };
      }),
      totalItems: totalBranch,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/provider')
  async listProvider(@Req() req) {
    const user: IUserInfo = req.user;

    const allProvider = await this.providerRepository.listByBranches(
      user.branches,
      user.clientId,
    );
    //console.log(user);
    const querySchema = z.object({
      type: z.string().optional().default('provider'),
    });

    const query = querySchema.parse(req.query);

    const provider = allProvider.map((provider) => {
      return {
        value: provider.ID,
        text: `${provider.razao_social} ${provider.cnpj}`,
      };
    });

    return {
      [query.type]: provider,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/category-material')
  async listCategoryMaterial(@Req() req) {
    const user: IUserInfo = req.user;

    const allCategory = await this.categoryMaterialRepository.listByClient(
      user.clientId,
    );

    const querySchema = z.object({
      type: z.string().optional().default('provider'),
    });

    const query = querySchema.parse(req.query);

    const category = allCategory.map((category) => {
      return {
        value: category.id,
        label: category.descricao,
      };
    });

    return {
      [query.type]: category,
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/location')
  async listLocation(@Req() req) {
    const user: IUserInfo = req.user;

    const querySchema = z.object({
      type: z.string().optional().default('location'),
    });

    const query = querySchema.parse(req.query);

    const allLocation = await this.locationRepository.findByBranch(
      user.branches,
    );

    const response = allLocation.map((location) => {
      return {
        value: location.id.toString(),
        label: location.localizacao,
      };
    });

    return {
      [query.type]: response,
      success: true,
    };
  }
}
