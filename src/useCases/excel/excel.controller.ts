import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Decimal } from '@prisma/client/runtime/library';
import { AuthGuard } from 'src/guard/auth.guard';
import { IExcel, TypeColumn } from 'src/models/IExcel';
import { TypeDiverse } from 'src/models/IType';
import { IUserInfo } from 'src/models/IUser';
import { BranchRepository } from 'src/repositories/branch-repository';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { CheckListItemRepository } from 'src/repositories/checklist-item-repository';
import { CheckListRepository } from 'src/repositories/checklist-repository';
import { CheckListTaskRepository } from 'src/repositories/checklist-task-repository';
import { CompanyRepository } from 'src/repositories/company-repository';
import { ContractItemRepository } from 'src/repositories/contract-item-repository';
import { ContractNumberRepository } from 'src/repositories/contract-number-repository';
import { ContractRepository } from 'src/repositories/contract-repository';
import { ContractScopeRepository } from 'src/repositories/contract-scope-repository';
import { ContractStatusRepository } from 'src/repositories/contract-status-repository';
import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
import ContractTypeRepository from 'src/repositories/contract-type-repository';
import { CostCenterRepository } from 'src/repositories/cost-center-repository';
import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
import DescriptionMaintenancePlanningRepository from 'src/repositories/description-maintenance-planning-repository';
import EquipmentRepository from 'src/repositories/equipment-repository';
import { FamilyRepository } from 'src/repositories/family-repository';
import LocationRepository from 'src/repositories/location-repository';
import { LogOperationRepository } from 'src/repositories/log-operation-repository';
import ProviderRepository from 'src/repositories/provider-repository';
import TaskPlanningMaintenanceRepository from 'src/repositories/task-planning-maintenance-repository';
import TaskRepository from 'src/repositories/task-repository';
import UnityOfMensurePlansRepository from 'src/repositories/unity-of-mensure-plans-repository';
import { DateService } from 'src/service/data.service';
import { MessageService } from 'src/service/message.service';
import { read, utils } from 'xlsx';
import { ChangeValueBasicForEquipment } from './dtos/changeValueBasicForEquipment-body';
import EquipmentBoundCostCenterBody from './dtos/equipmentBoundCostCenter-body';
import ImportChecklistAndTaskAndFamily from './dtos/importChecklistAndTaskAndFamily-body';
import { ImportContractBody } from './dtos/importContract-body';
import ImportDiverseAndChecklistAndTaskBody from './dtos/importDiverseAndChecklistAndTask-body';
import ImportEquipmentAndFamilyBody from './dtos/importEquipmentAndFamily-body';
import ImportPlansR2Body from './dtos/importPlansR2-body';
import { InsertLogOperationBody } from './dtos/insertLogOperation-body';
import ReadExcelBody from './dtos/readExcel-body';
import CategoryMaterialRepository from 'src/repositories/category-material-repository';
import MaterialRepository from 'src/repositories/material-repository';
import ImportMaterialBody from './dtos/importMaterial-body';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';
import ImportEquipmentBody from './dtos/importEquipment-body';
import ImportEquipmentBodySwagger from './dtos/swagger/importEquipment-body';
import ImportFamilyBody from './dtos/importFamily-body';
import ImportFamilyBodySwagger from './dtos/swagger/importFamily-body';
import UpdateEquipmentBody from './dtos/updateEquipment-body';
import UpdateEquipmentBodySwagger from './dtos/swagger/updateEquipment-body';
import { EquipmentTypeRepository } from 'src/repositories/equipment-type-repository';
import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
import StockRepository from 'src/repositories/stock-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
import { SectorExecutingRepository } from 'src/repositories/sector-executing-repository';
import { StatusServiceOrderRepository } from 'src/repositories/status-service-order-repository';
import ColaboratorRepository from 'src/repositories/colaborator-repository';

@ApiBearerAuth()
@ApiTags('Importação')
@Controller('excel')
export class ExcelController {
  constructor(
    private dateService: DateService,
    private branchByUsersRepository: BranchesByUserRepository,
    private providerRepository: ProviderRepository,
    private contractTypeRepository: ContractTypeRepository,
    private equipmentRepository: EquipmentRepository,
    private unityOfMensurePlansRepository: UnityOfMensurePlansRepository,
    private descriptionMaintenancePlanningRepository: DescriptionMaintenancePlanningRepository,
    private taskRepository: TaskRepository,
    private taskPlanningMaintenanceRepository: TaskPlanningMaintenanceRepository,
    private contractTypeInput: ContractTypeInputRepository,
    private descriptionCostCenterRepository: DescriptionCostCenterRepository,
    private costCenterRepository: CostCenterRepository,
    private branchRepository: BranchRepository,
    private contractNumberRepository: ContractNumberRepository,
    private companyRepository: CompanyRepository,
    private contractRepository: ContractRepository,
    private contractStatusRepository: ContractStatusRepository,
    private contractScopeRepository: ContractScopeRepository,
    private contractItemRepository: ContractItemRepository,
    private logOperationRepository: LogOperationRepository,
    private familyRepository: FamilyRepository,
    private checklistRepository: CheckListRepository,
    private checklistTaskRepository: CheckListTaskRepository,
    private checklistItemRepository: CheckListItemRepository,
    private locationRepository: LocationRepository,
    private materialRepository: MaterialRepository,
    private categoryMaterial: CategoryMaterialRepository,
    private equipmentTypeRepository: EquipmentTypeRepository,
    private stockInventoryRepository: StockInventoryRepository,
    private stockRepository: StockRepository,
    private serviceOrderRepository: ServiceOrderRepository,
    private typeMaintenanceRepository: TypeMaintenanceRepository,
    private sectorExecutingRepository: SectorExecutingRepository,
    private statusServiceOrderRepository: StatusServiceOrderRepository,
    private collaboratorRepository: ColaboratorRepository,
  ) {}

  private userPermission = ['bruno.matias', 'suporte3'];

  private types: IExcel = {
    contract: {
      id: TypeColumn.ID,
      contrato: TypeColumn.Number,
      sync: TypeColumn.Boolean || TypeColumn.Null,
      filial: TypeColumn.SelectFilial,
      fornecedor: TypeColumn.SelectFornecedor,
      'tipo contrato': TypeColumn.SelectTipoContrato,
      'data inicial': TypeColumn.Date,
      'data final': TypeColumn.Date,
      observacao: TypeColumn.String,
      children: {
        id: TypeColumn.ID,
        id_pai: TypeColumn.Number,
        sync: TypeColumn.Boolean || TypeColumn.Null,
        contrato: TypeColumn.Number,
        tipo: TypeColumn.TipoItem,
        insumo: TypeColumn.EnumItemInsumo,
        equipamento: TypeColumn.EnumItemEquipamento,
        unidade: TypeColumn.String,
        preco: TypeColumn.Number,
        quantidade: TypeColumn.Number,
      },
    },
    plansR2: {
      cliente: TypeColumn.String,
      plano_de_manutencao: TypeColumn.String,
      equipamento: TypeColumn.String,
      tarefa: TypeColumn.String,
      unidade: TypeColumn.String,
      periodicidade_de_uso: TypeColumn.Number,
    },
  };

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Patch('/read')
  @UseInterceptors(FileInterceptor('file'))
  async readExcel(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Body() body: ReadExcelBody,
  ) {
    const user: IUserInfo = req.user;
    const clientId = Number(body.clientId);

    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData = utils.sheet_to_json(sheetHeader, options);

    jsonData.forEach((row, ind) => {
      // Verifique se a célula de data final contém um número
      const keys = Object.keys(row);
      const keysFilter = keys.filter((value) => {
        const valueToLowerCase = value.toLowerCase();
        return this.types[body.type].hasOwnProperty(valueToLowerCase);
      });

      row['id'] = ind + 1;
      row['sync'] = null;

      for (const propriety of keysFilter) {
        if (
          typeof row[propriety] === 'number' &&
          this.types[body.type][propriety] === 'Date'
        ) {
          const dataFinalNumber = row[propriety];
          const dataFinalString = this.excelDateToJSDate(dataFinalNumber);
          row[propriety] = this.dateService.dayjs(dataFinalString).toDate();
        } else if (this.types[body.type][propriety] === 'Date') {
          const dateSplit = row[propriety].split('/');
          row[propriety] = this.dateService
            .dayjs(`${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`)
            .toDate();
        }
      }
      row['children'] = [];
    });

    const keysTypes = Object.keys(this.types[body.type]);

    const columns = await this.formatReturnExcel(
      keysTypes,
      this.types[body.type],
      user.login,
      clientId,
      user.branches,
    );

    let columnsItem = {};

    if (this.types[body.type].hasOwnProperty('children')) {
      const sheetItem = wb.Sheets[sheetName[1]];

      const jsonItem = utils.sheet_to_json(sheetItem, options);

      jsonItem.forEach((row, ind) => {
        // Verifique se a célula de data final contém um número
        const keys = Object.keys(row);
        const keysFilter = keys.filter((value) => {
          const valueToLowerCase = value.toLowerCase();
          return this.types[body.type].children.hasOwnProperty(
            valueToLowerCase,
          );
        });

        row['id'] = ind + 1;
        row['sync'] = null;

        if (body.type === 'contract') {
          row['id_pai'] = row['contrato'];
        }

        for (const propriety of keysFilter) {
          if (
            typeof row[propriety] === 'number' &&
            this.types[body.type][propriety] === 'Date'
          ) {
            const dataFinalNumber = row[propriety];
            const dataFinalString = this.excelDateToJSDate(dataFinalNumber);
            row[propriety] = this.dateService.dayjs(dataFinalString).toDate();
          } else if (this.types[body.type].children[propriety] === 'Date') {
            const dateSplit = row[propriety].split('/');
            row[propriety] = this.dateService
              .dayjs(`${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`)
              .toDate();
          }
        }
        const indexHeader = jsonData.findIndex(
          (ind) => ind['contrato'] === row['contrato'],
        );
        if (indexHeader >= 0) {
          (jsonData[indexHeader] as { children: Array<unknown> }).children.push(
            row,
          );
        }
      });

      const keysTypesItem = Object.keys(this.types[body.type].children);

      columnsItem = await this.formatReturnExcel(
        keysTypesItem,
        this.types[body.type].children,
        user.login,
        clientId,
        user.branches,
      );
    }

    jsonData.forEach((item) => {
      const keys = Object.keys(item);

      keys.forEach((key) => {
        if (
          key !== 'children' &&
          this.types[body.type][key].includes('select_')
        ) {
          const findValue = (columns[key] as TypeDiverse['select'][]).find(
            (value) =>
              value.label.toLowerCase().includes(item[key].toLowerCase()),
          );

          if (findValue) {
            item[key] = findValue.value;
          }
        }
      });
    });

    return {
      data: jsonData,
      columns,
      columnsItem,
    };
  }

  async formatReturnExcel(
    keysTypes: string[],
    allTypes: ObjectConstructor,
    login: string,
    clientId: number,
    branches: number[],
  ) {
    const data: {
      [string: string]: string | TypeDiverse['select'][];
    } = {};

    for await (const key of keysTypes) {
      switch (allTypes[key]) {
        case TypeColumn.SelectFilial:
          data[key] = await this.select_filial(clientId, login);
          break;

        case TypeColumn.SelectFornecedor:
          data[key] = await this.select_fornecedor(clientId);
          break;

        case TypeColumn.SelectTipoContrato:
          data[key] = await this.select_tipo_contrato(clientId);
          break;

        case TypeColumn.EnumItemEquipamento:
          data[key] = await this.select_equipamento(branches);
          break;

        case TypeColumn.EnumItemInsumo:
          data[key] = await this.select_insumo(clientId);
          break;

        case TypeColumn.TipoItem:
          data[key] = [
            { value: 'insumo', label: 'insumo' },
            { value: 'equipamento', label: 'equipamento' },
          ];
          break;

        default:
          data[key] = allTypes[key];
          break;
      }
    }

    return data;
  }

  async select_filial(
    clientId: number,
    user: string,
  ): Promise<TypeDiverse['select'][]> {
    const branch = await this.branchByUsersRepository.listByClientAndUser(
      clientId,
      user,
    );

    return branch.map((branch) => {
      return {
        value: branch.id_filial.toString(),
        label: `${branch.branch.filial_numero}/${branch.branch.cnpj}`,
      };
    });
  }

  async select_fornecedor(clientId: number): Promise<TypeDiverse['select'][]> {
    const provider = await this.providerRepository.listByClient(clientId);

    return provider.map((item) => {
      return {
        value: item.ID.toString(),
        label: `${item.razao_social}/${item.cnpj}`,
      };
    });
  }

  async select_tipo_contrato(
    clientId: number,
  ): Promise<TypeDiverse['select'][]> {
    const type = await this.contractTypeRepository.listByClient(clientId);

    return type.map((type) => {
      return {
        value: type.id.toString(),
        label: `${type.tipoContrato}`,
      };
    });
  }

  async select_equipamento(branches: number[]) {
    const equipment = await this.equipmentRepository.listByBranch(branches);

    return equipment.map((item) => {
      return {
        value: item.ID.toString(),
        label: `${item.equipamento_codigo} - ${item.descricao}`,
      };
    });
  }

  async select_insumo(clientId: number) {
    const input = await this.contractTypeInput.listByClient(clientId);

    return input.map((item) => {
      return {
        value: item.id.toString(),
        label: item.insumo,
      };
    });
  }

  excelDateToJSDate(serial: number) {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);

    // Adiciona a quantidade de milissegundos desde a meia-noite
    const fractionalDay = serial - Math.floor(serial) + 0.0000001;
    let totalSeconds = Math.floor(86400 * fractionalDay);

    const seconds = totalSeconds % 60;
    totalSeconds -= seconds;

    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor(totalSeconds / 60) % 60;

    dateInfo.setUTCHours(hours, minutes, seconds, 0);
    return dateInfo;
  }

  async importPlansR2(data: ImportPlansR2Body[]) {
    const sectorIdFix = 1570;
    const typeMaintenanceIdFix = 4430;

    const response = [];
    const noLance = [];

    for await (const item of data) {
      if (item.unity === undefined) {
        noLance.push(item);
        continue;
      }

      const equipment = await this.equipmentRepository.findByClientAndCode(
        item.clientId,
        item.equipment,
      );

      if (!equipment) {
        noLance.push(item);
        continue;
        throw new NotFoundException(MessageService.Equipment_not_found);
      }

      let unityPlans =
        await this.unityOfMensurePlansRepository.findByClientAndName(
          item.clientId,
          item.unity,
        );

      if (!unityPlans) {
        unityPlans = await this.unityOfMensurePlansRepository.insert({
          id_cliente: item.clientId,
          unidade: item.unity,
        });
      }

      let descriptionMaintenancePlanning =
        await this.descriptionMaintenancePlanningRepository.findByEquipmentAndNameAndUnityAndSectorAndType(
          item.clientId,
          equipment.ID,
          item.descriptionPlan,
          unityPlans.id,
          sectorIdFix,
          typeMaintenanceIdFix,
        );

      if (!descriptionMaintenancePlanning) {
        descriptionMaintenancePlanning =
          await this.descriptionMaintenancePlanningRepository.insert({
            id_cliente: item.clientId,
            descricao: item.descriptionPlan,
            id_equipamento: equipment.ID,
            id_setor_executante: sectorIdFix,
            id_tipo_manutencao: typeMaintenanceIdFix,
            id_unidade_medida: unityPlans.id,
          });
      }

      let task = await this.taskRepository.findByClientAndName(
        item.clientId,
        item.task,
      );

      if (!task) {
        task = await this.taskRepository.insert({
          id_cliente: item.clientId,
          tarefa: item.task,
        });
      }

      let taskPlanningMaintenance =
        await this.taskPlanningMaintenanceRepository.findByPlanningAndTask(
          descriptionMaintenancePlanning.id,
          task.id,
        );

      if (!taskPlanningMaintenance) {
        taskPlanningMaintenance =
          await this.taskPlanningMaintenanceRepository.insert({
            id_cliente: item.clientId,
            id_planejamento: descriptionMaintenancePlanning.id,
            id_tarefa: task.id,
            log_user: 'admin',
            seq: 1,
            periodicidade_uso: item.priorityUse || 0,
          });
      }
      const indexResponse = response.findIndex(
        (value) => value.id === descriptionMaintenancePlanning.id,
      );

      if (indexResponse > -1) {
        response[indexResponse].children.push(taskPlanningMaintenance);
      } else {
        response.push({
          ...descriptionMaintenancePlanning,
          children: [taskPlanningMaintenance],
        });
      }
    }

    return { response, noLance };
  }

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Put('/maintenance/change-value-basic-for-equipment')
  async changeValueBasicForEquipment(
    @Body() body: ChangeValueBasicForEquipment,
  ) {
    const response: {
      updated: any[];
      notChange: any[];
    } = {
      updated: [],
      notChange: [],
    };

    body.data.forEach((value) => {
      if (typeof value.date === 'string' && !Number(value.date)) {
        const parts = value.date.split('/');
        value.date = this.dateService
          .dayjs(`${parts[2]}-${Number(parts[1])}-${parts[0]}`)
          .toDate();
      } else {
        value.date = this.excelDateToJSDate(Number(value.date));
      }
    });

    for await (const item of body.data) {
      const descriptionMaintenancePlanning =
        await this.descriptionMaintenancePlanningRepository.findByEquipmentCode(
          body.clientId,
          item.equipment,
        );

      if (descriptionMaintenancePlanning) {
        response.updated.push(descriptionMaintenancePlanning);

        for await (const taskPlanning of descriptionMaintenancePlanning.taskPlanningMaintenance) {
          await this.taskPlanningMaintenanceRepository.update(taskPlanning.id, {
            valor_base: Number(item.lastHour),
          });

          taskPlanning.valor_base = new Decimal(item.lastHour);
        }
      } else {
        response.notChange.push(item);
      }
    }

    return { response };
  }

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Post('/maintenance/log-operation')
  async insertLogOperation(@Body() body: InsertLogOperationBody) {
    const company = await this.companyRepository.findById(body.clientId);

    if (!company) {
      throw new NotFoundException(MessageService.Excel_company_not_found);
    }

    const response: {
      inserted: any[];
      noInserted: any[];
    } = {
      inserted: [],
      noInserted: [],
    };

    let typeUnityValue = 'HORA';

    body.data.forEach((value) => {
      if (typeof value.date === 'string' && !Number(value.date)) {
        const parts = value.date.split('/');
        value.date = this.dateService
          .dayjs(`${parts[2]}-${Number(parts[1])}-${parts[0]}`)
          .toDate();
      } else {
        value.date = this.excelDateToJSDate(Number(value.date));
      }
    });

    // return {
    //   response: body.data,
    // };

    for await (const data of body.data) {
      const equipment = await this.equipmentRepository.findByClientAndCode(
        company.ID,
        data.equipment,
      );

      if (!equipment) {
        response.noInserted.push(data);
        continue;
        //throw new NotFoundException(MessageService.Equipment_not_found);
      }

      const existsLog =
        await this.logOperationRepository.findByEquipmentAndRegister(
          equipment.ID,
          data.date as Date,
        );

      if (existsLog) {
        continue;
      }

      if (data.equipment === 'CM 03') {
        typeUnityValue = 'KM';
      }

      const typeUnity =
        await this.unityOfMensurePlansRepository.findByClientAndName(
          company.ID,
          typeUnityValue,
        );

      if (!typeUnity) {
        throw new NotFoundException('Tipo unidade nao encontrado');
      }

      const logOperation = await this.logOperationRepository.insert({
        id_filial: equipment.branch.ID,
        id_equipamento: equipment.ID,
        data_leitura: new Date(data.date),
        valor_real: data.nowHour,
        unidade_medida: typeUnity.id,
      });

      response.inserted.push(logOperation);
    }

    return {
      response,
    };
  }

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Patch('/equipment/change-location')
  @UseInterceptors(FileInterceptor('file'))
  async changeLocation(
    @UploadedFile() file: Express.Multer.File,
    //@Req() req,
    @Body() body: ReadExcelBody,
  ) {
    //const user: IUserInfo = req.user;
    const clientId = Number(body.clientId);

    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      ITEM: string;
      NUMERACAO: number;
      LOCALIZAÇÃO: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    const allEquipment = [];

    for await (const data of jsonData) {
      if (data.ITEM === undefined) {
        continue;
      }

      const equipment = await this.equipmentRepository.findByClientAndCode(
        clientId,
        data.NUMERACAO.toString(),
      );

      if (!equipment) {
        return {
          message: 'Equipamento nao encontrado!',
          data,
        };
      }

      const equipmentUpdated = await this.equipmentRepository.update(
        equipment.ID,
        {
          localizacao: data['LOCALIZAÇÃO'],
        },
      );

      allEquipment.push(equipmentUpdated);
    }

    return allEquipment;
  }

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Patch('/equipment/bound-cost-center')
  @UseInterceptors(FileInterceptor('file'))
  async equipmentBoundCostCenter(
    @UploadedFile() file: Express.Multer.File,
    //@Req() req,
    @Body() body: EquipmentBoundCostCenterBody,
  ) {
    //const user: IUserInfo = req.user;
    const clientId = Number(body.clientId);

    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      ITEM: string;
      NUMERACAO: number;
      CODIGO?: string;
      'CENTRO CUSTO': string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    const allEquipment = [];
    const equipmentNotFound = [];

    const descriptionCostCenter =
      await this.descriptionCostCenterRepository.findById(
        Number(body.descriptionCostCenterId),
      );

    if (!descriptionCostCenter) {
      throw new NotFoundException(
        MessageService.DescriptionCostCenterId_not_found,
      );
    }

    for await (const data of jsonData) {
      if (data.ITEM === undefined) {
        continue;
      }

      const equipment = await this.equipmentRepository.findByClientAndCode(
        clientId,
        data.NUMERACAO.toString(),
      );

      if (!equipment) {
        equipmentNotFound.push(data);
        continue;
        // return {
        //   message: 'Equipamento nao encontrado!',
        //   data,
        // };
      }

      const costCenter =
        await this.costCenterRepository.findByDescriptionAndName(
          descriptionCostCenter.id,
          data['CENTRO CUSTO'],
        );

      if (!costCenter) {
        const countCostCenter =
          await this.costCenterRepository.countByDescription(
            descriptionCostCenter.id,
          );

        const code = body.code
          ? body.code + `-${countCostCenter + 1}`
          : data.CODIGO;

        const newCostCenter = await this.costCenterRepository.insert({
          ID_cliente: clientId,
          ID_centro_custo: descriptionCostCenter.id,
          centro_custo: code,
          descricao: data['CENTRO CUSTO'],
        });

        const equipmentUpdated = await this.equipmentRepository.update(
          equipment.ID,
          {
            id_centro_custo: newCostCenter.ID,
            centro_custo: data['CENTRO CUSTO'],
          },
        );

        allEquipment.push(equipmentUpdated);
      } else {
        const equipmentUpdated = await this.equipmentRepository.update(
          equipment.ID,
          {
            id_centro_custo: costCenter.ID,
            centro_custo: data['CENTRO CUSTO'],
          },
        );

        allEquipment.push(equipmentUpdated);
      }
    }

    return {
      allEquipment,
      equipmentNotFound,
    };
  }

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Post('/import-contract')
  async importContract(@Req() req, @Body() body: ImportContractBody) {
    const user: IUserInfo = req.user;

    const company = await this.companyRepository.findById(body.clientId);

    if (!company) {
      throw new NotFoundException(MessageService.Excel_company_not_found);
    }

    const branch = await this.branchRepository.findById(Number(body.filial));

    if (!branch) {
      throw new NotFoundException(
        MessageService.Excel_contract_branch_not_found,
      );
    }

    const provider = await this.providerRepository.findById(
      Number(body.fornecedor),
    );

    if (!provider) {
      throw new NotFoundException(
        MessageService.Excel_contract_provider_not_found,
      );
    }

    const typeContract = await this.contractTypeRepository.findById(
      Number(body['tipo contrato']),
    );

    if (!typeContract) {
      throw new NotFoundException(
        MessageService.Excel_contract_typeContract_not_found,
      );
    }

    const contractNumber =
      await this.contractNumberRepository.findLastByClientAndBranch(
        company.ID,
        branch.ID,
      );

    await this.contractNumberRepository.create({
      id_cliente: company.ID,
      id_filial: branch.ID,
      numero: contractNumber + 1,
    });

    const status = await this.contractStatusRepository.findOpen(company.ID);

    const contract = await this.contractRepository.create({
      id_cliente: company.ID,
      id_filial: branch.ID,
      id_fornecedor: provider.ID,
      id_tipo_contrato: typeContract.id,
      id_status_contrato: status.id,
      n_contrato: contractNumber + 1,
      data_final: body['data final'],
      data_inicial: body['data inicial'],
      descricao: body.observacao,
    });

    try {
      for await (const item of body.children) {
        const typeInput = await this.contractTypeInput.findById(
          Number(item.insumo),
        );

        const scope = await this.contractScopeRepository.findById(
          Number(item.escopo),
        );

        const equipment = await this.equipmentRepository.findById(
          Number(item.equipamento),
        );

        await this.contractItemRepository.create({
          id_contrato: contract.id,
          id_unidade: item.unidade,
          log_user: user.login,
          preco_unitario: item.preco,
          total: item.quantidade * item.preco,
          type: item.tipo,
          volume: item.quantidade,
          id_equipamento: equipment.ID || null,
          id_escopo: scope.id || null,
          id_insumo: typeInput.id || null,
        });
      }
    } catch (error) {
      await this.contractRepository.delete(contract.id);
      //await this.contractRepository
    }

    return {
      inserted: true,
    };
  }

  @ApiExcludeEndpoint()
  @Post('/import-diverse-and-checklist-and-task')
  @UseInterceptors(FileInterceptor('file'))
  async importDiverseAndChecklistAndTask(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportDiverseAndChecklistAndTaskBody,
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      'EQUIPAMENTO/DIVERSO': string;
      DESCRICAO: string;
      'NOME CHECKLIST': string;
      TAREFAS: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    for await (const item of jsonData) {
      let diverse = await this.locationRepository.findByFilter({
        id_filial: {
          in: body.branches.map((value) => Number(value)),
        },
        localizacao: item.DESCRICAO.trim(),
      });

      if (!diverse) {
        //throw new NotFoundException(MessageService.Bound_familyId_not_found);
        diverse = await this.locationRepository.create({
          id_filial: Number(body.branches[0]),
          localizacao: item.DESCRICAO.trim(),
          log_user: body.logUser,
        });
      }

      const valid = await this.checklistRepository.findByLocationAndDescription(
        diverse.id,
        item['NOME CHECKLIST'].trim(),
      );

      let checklist = { id: null };

      if (!valid) {
        checklist = await this.checklistRepository.create({
          id_localizacao: diverse.id,
          descricao: item['NOME CHECKLIST'].trim(),
          log_user: body.logUser,
        });
      } else {
        checklist.id = valid.id;
      }

      let task = await this.checklistTaskRepository.findByClientAndTask(
        Number(body.clientId),
        item.TAREFAS.trim(),
      );

      if (!task) {
        task = await this.checklistTaskRepository.create({
          id_cliente: Number(body.clientId),
          descricao: item.TAREFAS,
          log_user: body.logUser,
        });
      }

      const bound = await this.checklistItemRepository.findByCheckListAndTask(
        checklist.id,
        task.id,
      );

      if (!bound) {
        await this.checklistItemRepository.create({
          id_checklist: checklist.id,
          id_tarefa: task.id,
          id_controle: 1,
          log_user: body.logUser,
        });
      }

      // const allBound = await this.checklistItemRepository.listByTask(task.id)

      // for await (const boundItem of allBound){
      //   if(boundItem.id_checklist === null && )
      // }
    }

    return {
      inserted: true,
      jsonData,
    };
  }

  @ApiExcludeEndpoint()
  @Post('/import-checklist-and-task-and-family')
  @UseInterceptors(FileInterceptor('file'))
  async importChecklistAndTaskAndFamily(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportChecklistAndTaskAndFamily,
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      CHECKLIST: string;
      TAREFA: string;
      FAMILIA: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    for await (const item of jsonData) {
      let family = await this.familyRepository.findByClientAndName(
        Number(body.clientId),
        item.FAMILIA.trim(),
      );

      if (!family) {
        //throw new NotFoundException(MessageService.Bound_familyId_not_found);
        family = await this.familyRepository.insert({
          clientId: Number(body.clientId),
          family: item.FAMILIA.trim(),
          branchId: 517, // estático
        });
      }

      const valid = await this.checklistRepository.findByFamilyAndDescription(
        family.ID,
        item.CHECKLIST.trim(),
      );

      let checklist = { id: null };

      if (!valid) {
        checklist = await this.checklistRepository.create({
          id_familia: family.ID,
          descricao: item.CHECKLIST.trim(),
          log_user: body.logUser,
        });
      } else {
        checklist.id = valid.id;
      }

      let task = await this.checklistTaskRepository.findByClientAndTask(
        Number(body.clientId),
        item.TAREFA.trim(),
      );

      if (!task) {
        task = await this.checklistTaskRepository.create({
          id_cliente: Number(body.clientId),
          descricao: item.TAREFA,
          log_user: body.logUser,
        });
      }

      const bound = await this.checklistItemRepository.findByCheckListAndTask(
        checklist.id,
        task.id,
      );

      if (!bound) {
        await this.checklistItemRepository.create({
          id_checklist: checklist.id,
          id_tarefa: task.id,
          id_controle: 1,
          log_user: body.logUser,
        });
      }

      // const allBound = await this.checklistItemRepository.listByTask(task.id)

      // for await (const boundItem of allBound){
      //   if(boundItem.id_checklist === null && )
      // }
    }

    return {
      inserted: true,
    };
  }

  @ApiExcludeEndpoint()
  @Post('/bound-equipment-in-family')
  @UseInterceptors(FileInterceptor('file'))
  async boundEquipmentInFamily(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportEquipmentAndFamilyBody,
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      ['Equipamento Codigo']: string;
      ['Descricao Tag']: string;
      Familia: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    for await (const data of jsonData) {
      const equipment = await this.equipmentRepository.findByClientAndCode(
        Number(body.clientId),
        data['Equipamento Codigo'],
      );

      if (!equipment) {
        throw new NotFoundException(MessageService.Equipment_not_found);
      }
      const family = await this.familyRepository.findByClientAndName(
        Number(body.clientId),
        data.Familia,
      );

      if (!family) {
        throw new NotFoundException(MessageService.Bound_family_not_found);
      }
      //return;
      await this.equipmentRepository.update(equipment.ID, {
        ID_familia: family.ID,
      });
    }

    return {
      jsonData,
    };
  }

  excelFileFilter = (req, file, callback) => {
    if (
      !file.mimetype.match(
        /(vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.ms-excel)$/,
      )
    ) {
      return callback(
        new BadRequestException('Somente arquivos Excel são permitidos!'),
        false,
      );
    }
    callback(null, true);
  };

  @UseGuards(AuthGuard)
  @Post('/import-equipment')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ImportEquipmentBodySwagger,
  })
  @UseInterceptors(FileInterceptor('file'))
  async importEquipment(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportEquipmentBody,
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      ['Filial']: string;
      ['Equipamento Codigo']: string;
      ['Descricao Tag']: string;
      ['Centro Custo']: string;
      Familia: string;
      Unidade: string;
      Fabricante: string;
      Marca: string;
      Modelo: string;
      Placa: string;
      Chassi: string;
      ['Ano Fabric']: number;
      ['Equipamento Pai']: string;
      Tipo: string;
      Status: string;
      Localizacao: string | null;
    }[] = utils.sheet_to_json(sheetHeader, options);

    for await (const data of jsonData) {
      //console.log(data);
      let branch = await this.branchRepository.findByClientAndName(
        Number(body.clientId),
        data.Filial.trim(),
      );

      if (!branch) {
        await this.branchRepository.create({
          ID_cliente: Number(body.clientId),
          filial_numero: data.Filial.trim(),
          nome_fantasia: data.Filial.trim(),
          cnpj: '',
        });

        branch = await this.branchRepository.findByClientAndName(
          Number(body.clientId),
          data.Filial.trim(),
        );
      }

      let family = await this.familyRepository.findByClientAndName(
        Number(body.clientId),
        data.Familia && data.Familia.length > 0
          ? data?.Familia?.trim()
          : 'MODERADO',
      );

      if (!family) {
        await this.familyRepository.insert({
          clientId: Number(body.clientId),
          family: data.Familia.trim(), // TODO: Criar a branchId do Branch 25075
        });

        family = await this.familyRepository.findByClientAndName(
          Number(body.clientId),
          data.Familia.trim(),
        );
      }

      const equipment = await this.equipmentRepository.findByClientAndCode(
        Number(body.clientId),
        data['Equipamento Codigo'].toString(),
      );

      // const equipmentFather =
      //   await this.equipmentRepository.findByClientAndCode(
      //     Number(body.clientId),
      //     data['Equipamento Pai'],
      //   );

      const typeEquipment =
        await this.equipmentTypeRepository.findByClientAndName(
          Number(body.clientId),
          data.Tipo,
        );

      let allDescriptionCostCenter =
        await this.descriptionCostCenterRepository.listByBranch(branch.ID);

      let descriptionCostCenterIndex = allDescriptionCostCenter.findIndex(
        (value) => value.descricao_centro_custo === branch.filial_numero,
      );

      if (descriptionCostCenterIndex === -1) {
        await this.descriptionCostCenterRepository.insert({
          id_cliente: Number(body.clientId),
          id_filial: branch.ID,
          descricao_centro_custo: branch.filial_numero,
          log_user: body.logUser,
        });

        allDescriptionCostCenter =
          await this.descriptionCostCenterRepository.listByBranch(branch.ID);

        descriptionCostCenterIndex = allDescriptionCostCenter.findIndex(
          (value) => value.descricao_centro_custo === branch.filial_numero,
        );
      }

      const descriptionCostCenter =
        allDescriptionCostCenter[descriptionCostCenterIndex];

      let allCostCenter = await this.costCenterRepository.byBranches([
        branch.ID,
      ]);

      const costCenter = {
        id: null,
      };

      if (data['Centro Custo'] && data['Centro Custo'].length > 0) {
        const findIndexCostCenter = allCostCenter.findIndex(
          (value) => value.descricao === data['Centro Custo'],
        );

        if (findIndexCostCenter === -1) {
          const countByDescription =
            await this.costCenterRepository.countByDescription(
              descriptionCostCenter.id,
            );

          const tempCost = await this.costCenterRepository.insert({
            ID_cliente: Number(body.clientId),
            ID_centro_custo: descriptionCostCenter.id,
            centro_custo: (countByDescription + 1).toString(),
            descricao: data['Centro Custo'],
            log_user: body.logUser,
          });

          allCostCenter = await this.costCenterRepository.byBranches([
            branch.ID,
          ]);

          costCenter.id === tempCost.ID;
        } else {
          costCenter.id = allCostCenter[findIndexCostCenter].ID;
        }
      }

      if (!equipment) {
        await this.equipmentRepository.create({
          ID_filial: branch.ID,
          ID_cliente: Number(body.clientId),
          equipamento_codigo: data['Equipamento Codigo'].toString(),
          //tag_vinculada: equipmentFather?.ID || null,
          ID_tipoeqto: typeEquipment?.ID || null,
          descricao: data['Descricao Tag'],
          id_centro_custo: costCenter.id,
          ID_familia: family.ID,
          fabricante: data.Fabricante,
          marca: data.Marca,
          placa: data.Placa,
          modelo: data.Modelo,
          chassi: String(data.Chassi),
          // ano_fabricacao: this.dateService
          //   .dayjs(new Date())
          //   .set('year', data['Ano Fabric'])
          //   .toDate(),
          //tipo_consumo: data.Tipo,
          status_equipamento: data.Status || 'Ativo',
        });
        //throw new NotFoundException(MessageService.Equipment_not_found);
      } else {
        // await this.equipmentRepository.update(equipment.ID, {
        //   ID_filial: branch.ID,
        //   id_centro_custo: costCenter.id,
        // });
      }

      //return;
    }

    return {
      jsonData,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/update-equipment')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateEquipmentBodySwagger,
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateEquipment(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateEquipmentBody,
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      ['Equipamento Codigo']: string;
      ['Consumo Previsto']: number;
      ['Tipo Consumo']: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    const errorFind = [];

    for await (const data of jsonData) {
      const company = await this.companyRepository.findById(
        Number(body.clientId),
      );

      if (!company) {
        console.error(`Empresa não encontrada: ${body.clientId}`);
        errorFind.push({
          data,
          message: 'Empresa não encontrada',
        });
      }

      const equipment = await this.equipmentRepository.findByClientAndCode(
        company.ID,
        data['Equipamento Codigo'].toString(),
      );

      if (equipment) {
        await this.equipmentRepository.update(equipment.ID, {
          tipo_consumo: data['Tipo Consumo'],
          consumo_previsto: data['Consumo Previsto'],
        });
      } else {
        console.error(
          `Equipamento não encontrado: ${data['Equipamento Codigo']}`,
        );
        errorFind.push({
          data,
          message: 'Equipamento não encontrado',
        });
      }

      //return;
    }

    return {
      jsonData,
      error: errorFind,
    };
  }

  @ApiExcludeEndpoint()
  @Post('/import-equipment-complete')
  @UseInterceptors(FileInterceptor('file'))
  async importEquipmentComplete(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      clientId: number;
    },
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      ['CNPJ Filial']: string;
      Filial: string;
      ['Centro Custo']: string;
      ['Equipamento Codigo']: string;
      ['Descricao Tag']: string;
      Familia: string;
      Placa: string;
      Status: string;
      Tipo: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    for await (const data of jsonData) {
      let branch = data['CNPJ Filial'].length
        ? await this.branchRepository.findByClientAndCNPJ(
            Number(body.clientId),
            data['CNPJ Filial']
              .replace(/\./g, '')
              .replace('/', '')
              .replace('-', ''),
          )
        : await this.branchRepository.findByClientAndName(
            Number(body.clientId),
            data.Filial.trim(),
          );

      if (!branch) {
        branch = await this.branchRepository.create({
          ID_cliente: Number(body.clientId),
          filial_numero: data.Filial.trim(),
          nome_fantasia: data.Filial.trim(),
          cnpj: '01',
        });
      }

      let description =
        await this.descriptionCostCenterRepository.findByClientAndBranchAndName(
          Number(body.clientId),
          branch.ID,
          branch.filial_numero,
        );

      if (!description) {
        description = await this.descriptionCostCenterRepository.insert({
          id_cliente: Number(body.clientId),
          id_filial: branch.ID,
          descricao_centro_custo: branch.filial_numero,
        });
      }

      const validCostCenter =
        await this.costCenterRepository.findByDescriptionAndName(
          description.id,
          data['Centro Custo'].trim(),
        );

      let costCenter: { ID: number } = { ID: 0 };

      if (!validCostCenter) {
        costCenter = await this.costCenterRepository.insert({
          ID_cliente: Number(body.clientId),
          ID_centro_custo: description.id,
          centro_custo: '01',
          descricao: data['Centro Custo'].trim(),
        });
      }

      let family = await this.familyRepository.findByClientAndName(
        Number(body.clientId),
        data.Familia.trim(),
      );

      if (!family) {
        // throw new NotFoundException(MessageService.Bound_family_not_found);
        family = await this.familyRepository.insert({
          clientId: Number(body.clientId),
          family: data.Familia.trim(),
          branchId: branch.ID,
        });
      }

      const equipment = await this.equipmentRepository.findByClientAndCode(
        Number(body.clientId),
        data['Equipamento Codigo'].trim(),
      );

      if (!equipment) {
        await this.equipmentRepository.create({
          ID_cliente: Number(body.clientId),
          ID_filial: branch.ID,
          id_centro_custo: costCenter.ID,
          equipamento_codigo: data['Equipamento Codigo'].toString(),
          descricao: data['Descricao Tag'],
          ID_familia: family.ID,
          placa: `${data.Placa}` || '',
          status_equipamento: data.Status.trim(),
        });
        //throw new NotFoundException(MessageService.Equipment_not_found);
      } else {
        await this.equipmentRepository.update(equipment.ID, {
          id_centro_custo: costCenter.ID,
          equipamento_codigo: data['Equipamento Codigo'].toString(),
          descricao: data['Descricao Tag'],
          ID_familia: family.ID,
          placa: `${data.Placa}` || '',
          status_equipamento: data.Status.trim(),
          tipo_consumo: data.Tipo,
        });
      }

      //return;
    }

    return {
      jsonData,
    };
  }

  @ApiExcludeEndpoint()
  @Post('/import-material')
  @UseInterceptors(FileInterceptor('file'))
  async importMaterial(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportMaterialBody,
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      codigo: string;
      ['codigo auxiliar']: string;
      ['codigo secundario']: string;
      material: string;
      marca: string;
      unidade: string;
      custo: string;
      categoria: string;
      localizacao: string;
      valor: string;
      ['estoque min']: string;
      ['estoque max']: string;
      ['estoque real']: string;
      status: string;
      saldo: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    const response = [];

    console.log(jsonData[0]);

    for await (const data of jsonData) {
      if (data.codigo === '' || data.material === '') {
        continue;
      }

      let category: {
        id: number | null;
      } = { id: null };

      if (data.categoria) {
        category = await this.categoryMaterial.findByClientAndName(
          Number(body.clientId),
          data.categoria,
        );

        if (!category) {
          category = await this.categoryMaterial.create({
            id_cliente: Number(body.clientId),
            descricao: data.categoria,
            log_user: body.logUser,
          });
        }
      }

      const material = await this.materialRepository.findByClientAndMaterial(
        Number(body.clientId),
        data.material,
      );

      if (!material) {
        const newMaterial = await this.materialRepository.create({
          id_cliente: Number(body.clientId),
          id_filial: 0,
          codigo: String(data.codigo),
          codigo_auxiliar: data['codigo auxiliar'],
          codigo_secundario: data['codigo secundario'],
          material: data.material,
          marca: data.marca,
          unidade: data.unidade,
          localizacao: data.localizacao,
          estoque_max: data['estoque max'],
          estoque_min: data['estoque min'],
          estoque_real: data['estoque real'],
          valor: Number(data.valor) || 1,
          Valor_venda: 1,
          id_categoria: category.id,
          log_user: body.logUser,
          materialCode: {
            create: {
              id_cliente: Number(body.clientId),
              codigo: String(data.codigo),
              marca: data.marca,
            },
          },
        });
        response.push(newMaterial);
      } else {
        const findStock = await this.stockInventoryRepository.listByMaterial(
          material.id,
        );

        if (findStock.length === 0) {
          const stock = await this.stockRepository.create({
            id_filial: 667,
            data_entrada: new Date(),
            id_cliente: Number(body.clientId),
            log_user: body.logUser,
          });

          await this.stockInventoryRepository.create({
            id_filial: 667,
            id_entrada: stock.id,
            data_entrada: new Date(),
            un_medida: data.unidade,
            valor_unitario: Number(data.valor) || 1,
            id_produto: material.id,
            quantidade: Number(data['estoque real']),
            log_user: body.logUser,
          });
        } else {
          await this.stockInventoryRepository.update(findStock[0].id, {
            quantidade: Number(data['estoque real']),
          });
        }
        response.push(material);
      }
    }

    return {
      response,
      data: jsonData,
    };
  }

  @ApiExcludeEndpoint()
  @Post('/import-material-with-stock')
  @UseInterceptors(FileInterceptor('file'))
  async importMaterialWithStock(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportMaterialBody,
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      codigo: string;
      material: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    //console.log(jsonData)

    const response = [];
    const branchId = 678;

    for await (const data of jsonData) {
      if (data.codigo === '' || data.material === '') {
        continue;
      }

      const material =
        await this.materialRepository.findByClientAndCodeAndMaterial(
          Number(body.clientId),
          data.codigo,
          data.material,
        );

      if (!material) {
        const newMaterial = await this.materialRepository.create({
          id_cliente: Number(body.clientId),
          id_filial: branchId,
          codigo: data.codigo,
          //codigo_auxiliar: data['codigo auxiliar'],
          material: data.material,
          // estoque_max: data['estoque max'],
          // estoque_min: data['estoque min'],
          estoque_real: data['estoque real'],
          valor: 1,
          Valor_venda: 1,
          log_user: body.logUser,
        });
        response.push(newMaterial);
      } else response.push(material);
    }

    return {
      response,
      data: jsonData,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/import-family')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ImportFamilyBodySwagger,
  })
  @UseInterceptors(FileInterceptor('file'))
  async importFamily(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportFamilyBody,
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      ['CNPJ Filial']: string;
      Familia: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    const errorFind = [];

    for await (const data of jsonData) {
      const company = await this.companyRepository.findById(
        Number(body.clientId),
      );

      if (!company) {
        console.error(`Empresa não encontrada: ${body.clientId}`);
        errorFind.push({
          data,
          message: 'Empresa não encontrada',
        });
      }

      const branch = await this.branchRepository.findByClientAndCNPJ(
        company.ID,
        data['CNPJ Filial'].toString(),
      );

      if (!branch) {
        console.error(`Filial não encontrada: ${data['CNPJ Filial']}`);
        errorFind.push({
          data,
          message: 'Filial não encontrada',
        });
      }

      const family = await this.familyRepository.findByClientAndName(
        company.ID,
        data.Familia.trim(),
      );

      if (!family) {
        await this.familyRepository.insert({
          clientId: company.ID,
          branchId: branch.ID,
          family: data.Familia.trim(),
        });
      }

      //return;
    }

    return {
      jsonData,
      error: errorFind,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/import-branch')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ImportFamilyBodySwagger,
  })
  @UseInterceptors(FileInterceptor('file'))
  async importBranch(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { clientId: number },
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      nome: string;
      ['nome fantasia']: string;
      cnpj: string;
      endereco: string;
      municipio: string;
      bairro: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    //const errorFind = [];

    for await (const item of jsonData) {
      const branchExist = await this.branchRepository.findByClientAndCNPJ(
        Number(body.clientId),
        item.cnpj.replace(/\D/g, ''),
      );

      console.log(item.cnpj.replace(/\D/g, ''));
      console.log(branchExist);

      if (!branchExist) {
        await this.branchRepository.create({
          ID_cliente: Number(body.clientId),
          filial_numero: item.nome,
          nome_fantasia: item['nome fantasia'],
          razao_social: item.nome,
          cnpj: item.cnpj.replace(/\D/g, ''),
          endereco: item.endereco,
          cidade: item.municipio,
          bairro: item.bairro,
        });

        // await this.companyRepository.update({
        //   ID: Number(body.clientId),
        //   : (Number(company.n_licencas) + 1).toString()
        // })
      }
    }

    return {
      data: jsonData,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/import-provider')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importProvider(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { clientId: number; logUser: string },
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy', // ou qualquer formato que você preferir
    };

    const jsonData: {
      ['Razao Social']: string;
      ['Nome Fantasia']: string;
      CNPJ: string;
      Endereco: string;
      CEP: string;
      Cidade: string;
      Bairro: string;
      Observacao: string;
      Telefone: string;
      Site: string;
      Estado: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    for await (const provider of jsonData) {
      if (provider.CNPJ == '0' || provider.CNPJ.length === 0) {
        continue;
      }
      const findExist = await this.providerRepository.findByClientAndCNPJ(
        Number(body.clientId),
        provider.CNPJ.replace(/\D/g, ''),
      );

      if (!findExist) {
        await this.providerRepository.create({
          ID_cliente: Number(body.clientId),
          razao_social: provider['Razao Social'],
          nome_fantasia: provider['Nome Fantasia'],
          cnpj: provider.CNPJ.replace(/\D/g, ''),
          endereco: String(provider.Endereco).slice(0, 200),
          cep: provider.CEP,
          cidade: provider.Cidade,
          bairro: provider.Bairro,
          observacoes: provider.Observacao,
          telefone: provider.Telefone,
          site: provider.Site,
          estado: provider.Estado,
          log_user: body.logUser,
          dias: 1,
        });
      }
    }

    return {
      jsonData,
    };
  }

  // Método para passar uma string de data
  parse(value: string | number): Date | null {
    if (!value) return null;

    // Se for um número (número serial do Excel)
    if (typeof value === 'number') {
      const excelEpoch = new Date(1900, 0, 1);
      const daysOffset = value - 2;
      return new Date(excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    }

    // Verifica se a string contém hh:mm
    const hasTime = value.includes(':');

    if (hasTime) {
      // Formato D/M/YY HH:mm (ex.: "29/4/23 16:02")
      const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{2})\s(\d{1,2}):(\d{2})$/;
      const match = value.match(regex);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // Meses em JavaScript são 0-11
        const year = parseInt(match[3], 10) + 2000; // Assume que "23" é "2023"
        const hours = parseInt(match[4], 10);
        const minutes = parseInt(match[5], 10);
        return new Date(year, month, day, hours, minutes);
      }
    } else {
      // Formato DD/MM/YYYY (ex.: "03/04/2023")
      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = value.match(regex);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // Meses em JavaScript são 0-11
        const year = parseInt(match[3], 10);
        return new Date(year, month, day);
      }
    }

    // Se não conseguir passar, tenta com new Date() diretamente
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date;
    }

    return null;
  }

  // Método para formatar datas
  format(date: Date, format: string): string | null {
    if (!date || isNaN(date.getTime())) return null;
    return format
      .replace('DD', String(date.getDate()).padStart(2, '0'))
      .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
      .replace('YYYY', String(date.getFullYear()))
      .replace('HH', String(date.getHours()).padStart(2, '0'))
      .replace('mm', String(date.getMinutes()).padStart(2, '0'));
  }

  filtrarArrayPorCampo(array, campo) {
    const registroUnico = {};
    const arrayFiltrado = [];

    for (const item of array) {
      const valor = item[campo];
      if (!registroUnico[valor]) {
        registroUnico[valor] = true;
        arrayFiltrado.push(item);
      }
    }

    return arrayFiltrado;
  }

  @UseGuards(AuthGuard)
  @Post('/import-service-order')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importServiceOrder(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { clientId: number; logUser: string; skip: number | null },
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy hh:mm', // ou qualquer formato que você preferir
    };

    const jsonData: {
      ['numero de OS']: string;
      ['id_equipamento']: number;
      ['equipamento']: string;
      ['localizacao']: string;
      ['tipo manutencao']: string;
      ['setor executante']: string;
      ['solicitante']: string;
      ['descricao']: string;
      ['descricao execucao']: string;
      ['status']: string;
      observacoes: string;
      ['data programada']: string | null;
      ['data emissao']: string | null;
      ['data encerramento']: string | null;
    }[] = utils.sheet_to_json(sheetHeader, options);

    // for await (const serviceOrder of this.filtrarArrayPorCampo(
    //   jsonData,
    //   'tipo manutencao',
    // )) {
    //   const typeMaintenance =
    //     await this.typeMaintenanceRepository.findByClientAndType(
    //       Number(body.clientId),
    //       serviceOrder['tipo manutencao'].trim(),
    //     );

    //   if (!typeMaintenance) {
    //     console.log(serviceOrder);

    //     //throw new NotFoundException('Type maintenance not found');
    //     await this.typeMaintenanceRepository.create({
    //       ID_cliente: Number(body.clientId),
    //       tipo_manutencao: serviceOrder['tipo manutencao'].trim(),
    //       sigla: serviceOrder['tipo manutencao'].slice(0, 3),
    //     });
    //   }
    // }

    // for await (const serviceOrder of this.filtrarArrayPorCampo(
    //   jsonData,
    //   'setor executante',
    // )) {
    //   const sector = await this.sectorExecutingRepository.findByClientAndSector(
    //     Number(body.clientId),
    //     serviceOrder['setor executante'].trim(),
    //   );

    //   if (!sector) {
    //     console.log(serviceOrder);

    //     throw new NotFoundException('Sector executing not found');
    //   }
    // }

    // for await (const serviceOrder of this.filtrarArrayPorCampo(
    //   jsonData,
    //   'status',
    // )) {
    //   const status =
    //     await this.statusServiceOrderRepository.findByClientAndStatus(
    //       Number(body.clientId),
    //       serviceOrder['status'].trim(),
    //     );

    //   if (!status) {
    //     console.log(serviceOrder);

    //     throw new NotFoundException('Status not found');
    //   }
    // }

    const orderNotImport = [];

    for await (const serviceOrder of jsonData) {
      let equipment: { ID: number; ID_filial: number } | null =
        await this.equipmentRepository.findByClientAndCode(
          Number(body.clientId),
          serviceOrder.equipamento.split(' -')[0],
        );

      if (!equipment) {
        console.log(serviceOrder);
        // if (
        //   !orderNotImport.find(
        //     (value) => value.code === serviceOrder.equipamento.split(' -')[0],
        //   )
        // ) {
        //   // console.log(serviceOrder.equipamento.split(' -')[0]);
        //   orderNotImport.push({
        //     item: serviceOrder,
        //     error: 'Equipment not found',
        //     code: serviceOrder.equipamento.split(' -')[0],
        //   });
        //   continue;
        // } else {
        //   continue;
        // }
        equipment = await this.equipmentRepository.create({
          ID_cliente: Number(body.clientId),
          equipamento_codigo: serviceOrder.equipamento.split(' -')[0],
          descricao: serviceOrder.equipamento.split(' -')[1],
          ID_filial: 2035,
        });

        //throw new NotFoundException('Equipment not found');
      }
      const branchId = equipment.ID_filial;

      //
      const typeMaintenance =
        await this.typeMaintenanceRepository.findByClientAndType(
          Number(body.clientId),
          serviceOrder['tipo manutencao'].trim(),
        );

      if (!typeMaintenance) {
        console.log(serviceOrder);

        throw new NotFoundException('Type maintenance not found');
      }

      const sector = await this.sectorExecutingRepository.findByClientAndSector(
        Number(body.clientId),
        serviceOrder['setor executante']
          ? serviceOrder['setor executante'].trim()
          : 'MECANICA',
      );

      if (!sector) {
        console.log(serviceOrder);

        throw new NotFoundException('Sector executing not found');
      }

      const status =
        await this.statusServiceOrderRepository.findByClientAndStatus(
          Number(body.clientId),
          serviceOrder['status'].trim(),
        );

      if (!status) {
        console.log(serviceOrder);

        throw new NotFoundException('Status not found');
      }

      let requester = await this.collaboratorRepository.findByClientAndName(
        Number(body.clientId),
        serviceOrder['solicitante'].trim(),
      );

      if (!requester) {
        console.log(serviceOrder);

        const allRequester = await this.collaboratorRepository.ListByClient(
          Number(body.clientId),
        );

        //throw new NotFoundException('Requester not found');
        requester = await this.collaboratorRepository.create({
          id_cliente: Number(body.clientId),
          nome: serviceOrder.solicitante.trim(),
          cod_colaborador:
            allRequester.length > 0
              ? (
                  Number(
                    allRequester[allRequester.length - 1].cod_colaborador,
                  ) + 1
                ).toString()
              : '1',
        });
      }

      const findServiceOrder = await this.serviceOrderRepository.findByWhere({
        ID_cliente: Number(body.clientId),
        ordem: serviceOrder['numero de OS'].toString().padStart(6, '0'),
        id_equipamento: equipment.ID,
      });

      if (!findServiceOrder) {
        await this.serviceOrderRepository.create({
          ID_cliente: Number(body.clientId),
          ID_filial: branchId,
          id_equipamento: equipment.ID,
          ordem: serviceOrder['numero de OS'].toString().padStart(6, '0'),
          localizacao: serviceOrder.localizacao,
          tipo_manutencao: typeMaintenance.ID,
          ID_setor: sector.Id,
          solicitante: 'PRODUÇÃO',
          descricao_solicitacao: serviceOrder.descricao,
          descricao_servico_realizado: serviceOrder['descricao execucao'],
          observacoes: serviceOrder.observacoes,
          status_os: status.id,
          data_hora_solicitacao: this.parse(serviceOrder['data programada']),
          log_date: this.parse(serviceOrder['data emissao']),
          data_hora_encerramento: this.parse(serviceOrder['data encerramento']),
        });
      }
    }

    // Formata as datas
    const formattedJsonData = jsonData.map((item) => ({
      ...item,
      'data programada': this.parse(item['data programada']),
      'data emissao': this.parse(item['data emissao']),
      'data encerramento': this.parse(item['data encerramento']),
    }));

    return {
      formattedJsonData,
      orderNotImport,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/import-planning-with-task')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importPlanningWithTask(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { clientId: number; logUser: string; skip: number | null },
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy hh:mm', // ou qualquer formato que você preferir
    };

    const jsonData: {
      equipamento_plano: string;
      tipo_manutencao: string;
      descricao: string;
      localizacao: string;
      tarefa: string;
      tempo_exe: number;
      periodicidade: number;
      data_base: string;
      antecipacao: string;
      unidade_uso: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    const planningNotImport = [];

    for await (const planning of jsonData) {
      const equipment = await this.equipmentRepository.findByClientAndCode(
        Number(body.clientId),
        planning.equipamento_plano.split(' -')[0],
      );

      if (!equipment) {
        // console.log(planning);
        // console.log(planning.equipamento_plano.split(' -')[0]);
        if (
          planningNotImport.find(
            (value) => value.code === planning.equipamento_plano.split(' -')[0],
          ) == null
        ) {
          planningNotImport.push({
            item: planning,
            error: 'Equipment not found',
            code: planning.equipamento_plano.split(' -')[0],
          });
          continue;
        } else {
          continue;
        }

        throw new NotFoundException('Equipment not found');
      }

      const typeMaintenance =
        await this.typeMaintenanceRepository.findByClientAndType(
          Number(body.clientId),
          planning?.tipo_manutencao?.trim() || 'PREVENTIVA',
        );

      if (!typeMaintenance) {
        console.log(planning);
        throw new NotFoundException('Type maintenance not found');
      }

      let task = await this.taskRepository.findByClientAndName(
        Number(body.clientId),
        planning.tarefa.replaceAll('_x000D_', ' ').trim(),
      );

      if (!task) {
        task = await this.taskRepository.insert({
          id_cliente: Number(body.clientId),
          tarefa: planning.tarefa.replaceAll('_x000D_', ' ').trim(),
        });
        //throw new NotFoundException('Task not found');
      }

      let sectorExecuting =
        await this.sectorExecutingRepository.findByClientAndSector(
          Number(body.clientId),
          'MECANICA',
        );

      if (!sectorExecuting) {
        sectorExecuting = await this.sectorExecutingRepository.create({
          id_cliente: Number(body.clientId),
          descricao: 'MECANICA',
        });
        //throw new NotFoundException('Task not found');
      }

      let descriptionPlanning: { id: number } | null =
        await this.descriptionMaintenancePlanningRepository.findByEquipmentAndName(
          Number(body.clientId),
          equipment.ID,
          planning.descricao,
        );

      if (!descriptionPlanning) {
        // console.log({
        //   id_cliente: Number(body.clientId),
        //   id_equipamento: equipment.ID,
        //   descricao: planning.descricao,
        //   id_setor_executante: sectorExecuting.Id,
        //   id_tipo_manutencao: typeMaintenance.ID,
        //   data_padrao: this.parse(planning.data_base),
        //   valor_padrao: planning.periodicidade,
        // });
        descriptionPlanning =
          await this.descriptionMaintenancePlanningRepository.insert({
            id_cliente: Number(body.clientId),
            id_filial: 2035,
            id_equipamento: equipment.ID,
            descricao: planning.descricao,
            id_setor_executante: sectorExecuting.Id,
            id_tipo_manutencao: typeMaintenance.ID,
            //data_padrao: this.parse(planning.data_base),
            valor_padrao: planning.periodicidade,
          });
      }

      const taskPlanning =
        await this.taskPlanningMaintenanceRepository.findByPlanningAndTask(
          descriptionPlanning.id,
          task.id,
        );

      if (!taskPlanning) {
        // console.log({
        //   id_cliente: Number(body.clientId),
        //   id_planejamento: descriptionPlanning.id,
        //   id_tarefa: task.id,
        //   log_user: body.logUser,
        //   seq: 1,
        //   data_base: this.parse(planning.data_base),
        //   //periodicidade_uso: planning.periodicidade,
        //   periodicidade_dias: planning.periodicidade,
        // });
        await this.taskPlanningMaintenanceRepository.insert({
          id_cliente: Number(body.clientId),
          id_planejamento: descriptionPlanning.id,
          id_tarefa: task.id,
          log_user: body.logUser,
          seq: 1,
          data_base: this.parse(planning.data_base),
          //periodicidade_uso: planning.periodicidade,
          periodicidade_dias: planning.periodicidade,
        });
      }
    }

    return {
      jsonData,
      planningNotImport,
    };
  }

  @UseGuards(AuthGuard)
  @Put('/import-update-planning-with-task')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importUpdatePlanningWithTask(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { clientId: number; logUser: string; skip: number | null },
  ) {
    if (file === undefined) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_NOT_FOUND);
    }

    const wb = read(file.buffer);

    if (wb.SheetNames.length === 0) {
      throw new NotFoundException(MessageService.SYSTEM_FILE_ERROR);
    }

    const sheetName = wb.SheetNames; // Pega o nome da primeira planilha
    const sheetHeader = wb.Sheets[sheetName[0]];

    const options = {
      // Define a interpretação de datas como objetos `Date` em JavaScript
      cellDates: true,
      // Formato de data desejado
      dateNF: 'dd/mm/yyyy hh:mm', // ou qualquer formato que você preferir
    };

    const jsonData: {
      equipamento_plano: string;
      descricao: string;
      tarefa: string;
      tempo_exe: number;
      periodicidade: number;
      data_base: string;
    }[] = utils.sheet_to_json(sheetHeader, options);

    const planningNotImport = [];

    for await (const planning of jsonData) {
      const equipment = await this.equipmentRepository.findByClientAndCode(
        Number(body.clientId),
        planning.equipamento_plano.split(' -')[0],
      );

      if (!equipment) {
        // console.log(planning);
        // console.log(planning.equipamento_plano.split(' -')[0]);
        if (
          planningNotImport.find(
            (value) => value.code === planning.equipamento_plano.split(' -')[0],
          ) == null
        ) {
          planningNotImport.push({
            item: planning,
            error: 'Equipment not found',
            code: planning.equipamento_plano.split(' -')[0],
          });
          continue;
        } else {
          continue;
        }

        throw new NotFoundException('Equipment not found');
      }

      let task = await this.taskRepository.findByClientAndName(
        Number(body.clientId),
        planning.tarefa.trim(),
      );

      if (!task) {
        task = await this.taskRepository.insert({
          id_cliente: Number(body.clientId),
          tarefa: planning.tarefa.trim(),
        });
        //throw new NotFoundException('Task not found');
      } else {
        await this.taskRepository.update(task.id, {
          tarefa: planning.tarefa.replace('_x000D_', '').trim(),
        });
      }

      const descriptionPlanning: { id: number } | null =
        await this.descriptionMaintenancePlanningRepository.findByEquipmentAndName(
          Number(body.clientId),
          equipment.ID,
          planning.descricao,
        );

      if (!descriptionPlanning) {
        console.log(planning);
        throw new NotFoundException({ message: 'Descricao não encontrada!' });
        // descriptionPlanning =
        //   await this.descriptionMaintenancePlanningRepository.insert({
        //     id_cliente: Number(body.clientId),
        //     id_equipamento: equipment.ID,
        //     descricao: planning.descricao,
        //     // id_setor_executante: sectorExecuting.Id,
        //     // id_tipo_manutencao: typeMaintenance.ID,
        //     //data_padrao: this.parse(planning.data_base),
        //     valor_padrao: planning.periodicidade,
        //   });
      }

      const taskPlanning =
        await this.taskPlanningMaintenanceRepository.findByPlanningAndTask(
          descriptionPlanning.id,
          task.id,
        );

      if (!taskPlanning) {
        console.log(descriptionPlanning.id, task.id);
        console.log(planning);
        throw new NotFoundException({
          message: 'Planejamento não encontrada!',
        });
        // await this.taskPlanningMaintenanceRepository.insert({
        //   id_cliente: Number(body.clientId),
        //   id_planejamento: descriptionPlanning.id,
        //   id_tarefa: task.id,
        //   log_user: body.logUser,
        //   seq: 1,
        //   data_base: this.parse(planning.data_base),
        //   periodicidade_uso: planning.periodicidade,
        // });
      } else {
        await this.taskPlanningMaintenanceRepository.update(taskPlanning.id, {
          data_base: this.parse(planning.data_base),
        });
      }
    }

    return {
      jsonData,
      planningNotImport,
    };
  }
}
