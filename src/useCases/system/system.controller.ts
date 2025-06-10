import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
import ListDescriptionCostCenterQuery from './dtos/listDescriptionCostCenter-query';
import { IUserInfo } from 'src/models/IUser';
import { BranchRepository } from 'src/repositories/branch-repository';
import LocationRepository from 'src/repositories/location-repository';
import ManagerCompanyRepository from 'src/repositories/manager-company-repository';
import EquipmentRepository from 'src/repositories/equipment-repository';
import { CostCenterRepository } from 'src/repositories/cost-center-repository';
import { FamilyRepository } from 'src/repositories/family-repository';
import { EquipmentTypeRepository } from 'src/repositories/equipment-type-repository';
import { DateService } from 'src/service/data.service';
import { EquipmentComponentRepository } from 'src/repositories/equipment-component-repository';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import UnityOfMensurePlansRepository from 'src/repositories/unity-of-mensure-plans-repository';
import { CheckListRepository } from 'src/repositories/checklist-repository';
import { CheckListTaskRepository } from 'src/repositories/checklist-task-repository';
import { CheckListItemRepository } from 'src/repositories/checklist-item-repository';
import { MenuRepository } from 'src/repositories/menu-repository';
import ListMenuResponse from './dtos/listMenu-response';
import ProviderRepository from 'src/repositories/provider-repository';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import TaskRepository from 'src/repositories/task-repository';
import { MessageService } from 'src/service/message.service';
import ListReturnTaskResponseSwagger from './dtos/swagger/listReturnTask-response-swagger';

@ApiTags('System')
@ApiBearerAuth()
@Controller('system')
export class SystemController {
  constructor(
    private env: ENVService,
    private fileService: FileService,
    private descriptionCostCenter: DescriptionCostCenterRepository,
    private branchRepository: BranchRepository,
    private locationRepository: LocationRepository,
    private managerCompanyRepository: ManagerCompanyRepository,
    private equipmentRepository: EquipmentRepository,
    private costCenterRepository: CostCenterRepository,
    private familyRepository: FamilyRepository,
    private equipmentTypeRepository: EquipmentTypeRepository,
    private dateService: DateService,
    private equipmentComponentRepository: EquipmentComponentRepository,
    private unityOfMensurePlansRepository: UnityOfMensurePlansRepository,
    private checklistRepository: CheckListRepository,
    private checklistTaskRepository: CheckListTaskRepository,
    private checklistItemRepository: CheckListItemRepository,
    private menuRepository: MenuRepository,
    private providerRepository: ProviderRepository,
    private taskRepository: TaskRepository,
  ) {}

  @Get('/leads2b')
  async test(@Req() req) {
    console.log(req.query);
    console.log(req.body);
    return {
      test: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/menu')
  async listMenu(@Req() req) {
    const user: IUserInfo = req.user;
    const allMenu = await this.menuRepository.listMenuAndPermissionByGroup(
      user.group.id,
    );

    const menu: ListMenuResponse = {
      module: [],
    };

    allMenu.forEach((application) => {
      let index = menu.module.findIndex(
        (module) => module.id === application.module.id,
      );

      if (index < 0) {
        menu.module.push({
          id: application.module.id,
          name: application.module.nome,
          icon: application.module.icone,
          order: application.module.ordem,
          access: application.module.clientes.includes(
            user.clientId.toString(),
          ),
          menu: [],
        });

        index = menu.module.length - 1;
      }

      const hasFather = application.id_pai;

      let indexMenu = null;

      if (hasFather !== 0) {
        indexMenu = menu.module[index].menu.findIndex(
          (current) => current.value === hasFather,
        );
      }

      const permission = {
        access: null,
        update: null,
        delete: null,
        export: null,
        print: null,
      };

      if (application.permission.length) {
        const indexModel = application.permission.findIndex(
          (value) => value.module.id === menu.module[index].id,
        );

        if (indexModel >= 0) {
          const indexPermissionUser = application.permission[
            indexModel
          ].userPermission.findIndex(
            (value) => value.users.login === user.login,
          );

          if (indexPermissionUser >= 0) {
            permission.access =
              application.permission[indexModel].userPermission[
                indexPermissionUser
              ].access === 'Y';
            permission.update =
              application.permission[indexModel].userPermission[
                indexPermissionUser
              ].update === 'Y';
            permission.delete =
              application.permission[indexModel].userPermission[
                indexPermissionUser
              ].delete === 'Y';
            permission.export =
              application.permission[indexModel].userPermission[
                indexPermissionUser
              ].export === 'Y';
            permission.print =
              application.permission[indexModel].userPermission[
                indexPermissionUser
              ].print === 'Y';
          } else {
            permission.access =
              application.permission[indexModel].access === 'Y';
            permission.update =
              application.permission[indexModel].update === 'Y';
            permission.delete =
              application.permission[indexModel].delete === 'Y';
            permission.export =
              application.permission[indexModel].export === 'Y';
            permission.print = application.permission[indexModel].print === 'Y';
          }
        }
      }

      if (indexMenu !== null && indexMenu >= 0) {
        const screen = {
          value: application.id,
          application: application.aplicacao,
          icon: application.icone,
          label: application.nome,
          order: Number(application.ordem),
          access: permission.access ?? null,
          permission,
          children: null,
        };

        menu.module[index].menu[indexMenu].children.push(screen);
        menu.module[index].menu[indexMenu].children.sort(
          (a, b) => a.order - b.order,
        );
      } else {
        const screen = {
          value: application.id,
          application: application.aplicacao,
          icon: application.icone,
          label: application.nome,
          access: permission.access ?? null,
          order: Number(application.ordem),
          permission,
          children: [],
        };

        menu.module[index].menu.push(screen);
      }

      menu.module[index].menu.sort((a, b) => a.order - b.order);
    });

    menu.module.sort((a, b) => a.order - b.order);

    return {
      data: menu,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/description-cost-center')
  async listDescriptionCostCenter(
    @Query() query: ListDescriptionCostCenterQuery,
  ) {
    const description = await this.descriptionCostCenter.listByBranchesComplete(
      query.branchId.map((item) => Number(item)),
    );

    return {
      data: description.map((item) => {
        return {
          value: item.id,
          label: item.descricao_centro_custo,
          children: item.costCenter.map((costCenter) => {
            return {
              value: costCenter.ID,
              label: `${costCenter.centro_custo} - ${costCenter.descricao}`,
              children: costCenter.compositionGroup.map((compositionGroup) => {
                return {
                  value: compositionGroup.id,
                  label: `${compositionGroup.composicao} - ${compositionGroup.descricao}`,
                  children: compositionGroup.compositionGroupItem.map(
                    (compositionGroupItem) => {
                      return {
                        value: compositionGroupItem.id,
                        label: `${compositionGroupItem.composicao} - ${compositionGroupItem.descricao}`,
                      };
                    },
                  ),
                };
              }),
            };
          }),
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-cost-center')
  async listCostCenter(@Req() req) {
    const user: IUserInfo = req.user;

    const allCostCenter = await this.costCenterRepository.byBranches(
      user.branches,
    );

    return {
      data: allCostCenter.map((costCenter) => {
        return {
          value: costCenter.ID.toString(),
          label: `${costCenter.centro_custo}-${costCenter.descricao}`,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-branch')
  async listBranch(@Req() req) {
    const user: IUserInfo = req.user;

    const branch = await this.branchRepository.listByIds(user.branches);

    return {
      data: branch.map((item) => {
        return {
          value: item.ID.toString(),
          label: item.filial_numero,
        };
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Get('/list-diverse')
  async listDiverse(@Req() req) {
    const user: IUserInfo = req.user;

    const allDiverse = await this.locationRepository.findByBranch(
      user.branches,
    );

    return allDiverse.map((location) => {
      return {
        value: location.id.toString(),
        label: location.tag
          ? `${location.tag}-${location.localizacao}`
          : location.localizacao,
      };
    });
  }

  @UseGuards(AuthGuard)
  @Get('/list-company')
  async listCompany(@Req() req) {
    const user: IUserInfo = req.user;

    const company = await this.managerCompanyRepository.listByLogin(user.login);

    return company.map((item) => {
      return {
        value: item.companyBound.ID.toString(),
        label: `${item.companyBound.razao_social}/${item.companyBound.cnpj}`,
      };
    });
  }

  @UseGuards(AuthGuard)
  @Get('/list-provider')
  async listProvider(@Req() req) {
    const user: IUserInfo = req.user;

    const provider = await this.providerRepository.listByClient(user.clientId);

    return provider.map((item) => {
      const formatter =
        item.cnpj.length === 14
          ? item.cnpj.replace(
              /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
              '$1.$2.$3/$4-$5',
            )
          : item.cnpj.length === 8
          ? item.cnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
          : item.cnpj;

      return {
        value: item.ID.toString(),
        label: `${item.razao_social} / ${formatter}`,
      };
    });
  }

  @UseGuards(AuthGuard)
  @Get('/smart-list/bound-task')
  async boundTask(@Req() req) {
    const user: IUserInfo = req.user;

    const allChecklist = await this.checklistRepository.listByClient(
      user.clientId,
    );

    const allTask = await this.checklistTaskRepository.listByClient(
      user.clientId,
      undefined,
    );

    for await (const checklist of allChecklist) {
      for await (const task of allTask) {
        const validTask =
          await this.checklistItemRepository.findByCheckListAndTask(
            checklist.id,
            task.id,
          );

        if (validTask) {
          continue;
        }

        await this.checklistItemRepository.create({
          id_checklist: checklist.id,
          id_controle: 1,
          id_tarefa: task.id,
          log_user: user.login,
        });
      }
    }
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    type: ListReturnTaskResponseSwagger,
  })
  @Get('/task/:id/return')
  async listReturnTask(@Param('id') id: string) {
    const task = await this.taskRepository.findById(Number(id));

    if (!task) {
      throw new NotFoundException(MessageService.Task_id_missing);
    }

    const response = {
      id: task.id,
      description: task.tarefa,
      type: task.tipo_dado,
      option: task.taskList.map((item) => {
        return {
          id: item.id,
          optionId: item.option.id,
          description: item.option.descricao,
        };
      }),
    };

    return {
      data: response,
    };
  }
}
