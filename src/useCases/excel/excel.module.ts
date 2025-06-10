import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { JwtService } from '@nestjs/jwt';
import { ENVService } from 'src/service/env.service';
import { FTPService } from 'src/service/ftp.service';
//import { LoginRepository } from 'src/repositories/login-repository';
//import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
import { UserRepository } from 'src/repositories/user-repository';
import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
import ProviderRepository from 'src/repositories/provider-repository';
import ContractTypeRepository from 'src/repositories/contract-type-repository';
import ContractTypeRepositoryPrisma from 'src/repositories/prisma/contract-type-repository-prisma';
import EquipmentRepository from 'src/repositories/equipment-repository';
import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
import UnityOfMensurePlansRepositoryPrisma from 'src/repositories/prisma/unity-of-mensure-plans-repository-prisma';
import UnityOfMensurePlansRepository from 'src/repositories/unity-of-mensure-plans-repository';
import DescriptionMaintenancePlanningRepository from 'src/repositories/description-maintenance-planning-repository';
import DescriptionMaintenancePlanningRepositoryPrisma from 'src/repositories/prisma/description-maintenance-planning-repository-prisma';
import TaskRepositoryPrisma from 'src/repositories/prisma/task-repository-prisma';
import TaskRepository from 'src/repositories/task-repository';
import TaskPlanningMaintenanceRepositoryPrisma from 'src/repositories/prisma/task-planning-maintenance-repository-prisma';
import TaskPlanningMaintenanceRepository from 'src/repositories/task-planning-maintenance-repository';
import { DateService } from 'src/service/data.service';
import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
import ContractTypeInputRepositoryPrisma from 'src/repositories/prisma/contract-type-input-repository-prisma';
import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
import { DescriptionCostCenterRepositoryPrisma } from 'src/repositories/prisma/description-cost-center-repository-prisma';
import { CostCenterRepository } from 'src/repositories/cost-center-repository';
import { CostCenterRepositoryPrisma } from 'src/repositories/prisma/cost-center-repository-prisma';
import { BranchRepository } from 'src/repositories/branch-repository';
import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
import { ContractNumberRepository } from 'src/repositories/contract-number-repository';
import ContractNumberRepositoryPrisma from 'src/repositories/prisma/contract-number-repository-prisma';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import { ContractRepository } from 'src/repositories/contract-repository';
import ContractRepositoryPrisma from 'src/repositories/prisma/contract-repository-prisma';
import { ContractStatusRepository } from 'src/repositories/contract-status-repository';
import ContractStatusRepositoryPrisma from 'src/repositories/prisma/contract-status-repository-prisma';
import { ContractScopeRepository } from 'src/repositories/contract-scope-repository';
import ContractScopeRepositoryPrisma from 'src/repositories/prisma/contract-scope-repository-prisma';
import { ContractItemRepository } from 'src/repositories/contract-item-repository';
import ContractItemRepositoryPrisma from 'src/repositories/prisma/contract-item-repository-prisma';
import { LogOperationRepository } from 'src/repositories/log-operation-repository';
import LogOperationRepositoryPrisma from 'src/repositories/prisma/log-operation-repository-prisma';
import { FamilyRepository } from 'src/repositories/family-repository';
import { FamilyRepositoryPrisma } from 'src/repositories/prisma/family-repository-prisma';
import { CheckListItemRepository } from 'src/repositories/checklist-item-repository';
import { CheckListRepository } from 'src/repositories/checklist-repository';
import { CheckListTaskRepository } from 'src/repositories/checklist-task-repository';
import { CheckListItemRepositoryPrisma } from 'src/repositories/prisma/checklist-item-repository-prisma';
import { CheckListRepositoryPrisma } from 'src/repositories/prisma/checklist-repository-prisma';
import { CheckListTaskRepositoryPrisma } from 'src/repositories/prisma/checklist-task-repository-prisma';
import LocationRepository from 'src/repositories/location-repository';
import LocationRepositoryPrisma from 'src/repositories/prisma/location-repository-prisma';
import CategoryMaterialRepository from 'src/repositories/category-material-repository';
import MaterialRepository from 'src/repositories/material-repository';
import CategoryMaterialRepositoryPrisma from 'src/repositories/prisma/category-material-repository-prisma';
import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
import { ModuleRepository } from 'src/repositories/module-repository';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import { EquipmentTypeRepository } from 'src/repositories/equipment-type-repository';
import EquipmentTypeRepositoryPrisma from 'src/repositories/prisma/equipment-type-repository-prisma';
import StockRepositoryPrisma from 'src/repositories/prisma/stock-repository-prisma';
import StockRepository from 'src/repositories/stock-repository';
import StockInventoryRepositoryPrisma from 'src/repositories/prisma/stock-inventory-repository-prisma';
import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import TypeMaintenanceRepositoryPrisma from 'src/repositories/prisma/type-maintenance-repository-prisma';
import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
import SectorExecutingRepositoryPrisma from 'src/repositories/prisma/sector-executing-repository-prisma';
import StatusServiceOrderRepositoryPrisma from 'src/repositories/prisma/status-service-order-repository-prisma';
import { SectorExecutingRepository } from 'src/repositories/sector-executing-repository';
import { StatusServiceOrderRepository } from 'src/repositories/status-service-order-repository';
import ColaboratorRepository from 'src/repositories/colaborator-repository';
import ColaboratorRepositoryPrisma from 'src/repositories/prisma/colaborator-repository-prisma';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';

@Module({
  imports: [TenantRepositoriesModule],
  controllers: [ExcelController],
  providers: [
    JwtService,
    ENVService,
    FTPService,
    DateService,
    {
      provide: BranchesByUserRepository,
      useClass: BranchesByUserRepositoryPrisma,
    },
    // {
    //   provide: LoginRepository,
    //   useClass: LoginRepositoryPrisma,
    // },
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    {
      provide: ModuleRepository,
      useClass: ModuleRepositoryPrisma,
    },
    {
      provide: BranchesByUserRepository,
      useClass: BranchesByUserRepositoryPrisma,
    },
    {
      provide: ProviderRepository,
      useClass: ProviderRepositoryPrisma,
    },
    {
      provide: ContractTypeRepository,
      useClass: ContractTypeRepositoryPrisma,
    },
    {
      provide: EquipmentRepository,
      useClass: EquipmentRepositoryPrisma,
    },
    {
      provide: UnityOfMensurePlansRepository,
      useClass: UnityOfMensurePlansRepositoryPrisma,
    },
    {
      provide: DescriptionMaintenancePlanningRepository,
      useClass: DescriptionMaintenancePlanningRepositoryPrisma,
    },
    {
      provide: TaskRepository,
      useClass: TaskRepositoryPrisma,
    },
    {
      provide: TaskPlanningMaintenanceRepository,
      useClass: TaskPlanningMaintenanceRepositoryPrisma,
    },
    {
      provide: ContractTypeInputRepository,
      useClass: ContractTypeInputRepositoryPrisma,
    },
    {
      provide: DescriptionCostCenterRepository,
      useClass: DescriptionCostCenterRepositoryPrisma,
    },
    {
      provide: CostCenterRepository,
      useClass: CostCenterRepositoryPrisma,
    },
    {
      provide: BranchRepository,
      useClass: BranchRepositoryPrisma,
    },
    {
      provide: ContractNumberRepository,
      useClass: ContractNumberRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
    {
      provide: ContractRepository,
      useClass: ContractRepositoryPrisma,
    },
    {
      provide: ContractStatusRepository,
      useClass: ContractStatusRepositoryPrisma,
    },
    {
      provide: ContractScopeRepository,
      useClass: ContractScopeRepositoryPrisma,
    },
    {
      provide: ContractItemRepository,
      useClass: ContractItemRepositoryPrisma,
    },
    {
      provide: LogOperationRepository,
      useClass: LogOperationRepositoryPrisma,
    },
    {
      provide: FamilyRepository,
      useClass: FamilyRepositoryPrisma,
    },
    {
      provide: CheckListRepository,
      useClass: CheckListRepositoryPrisma,
    },
    {
      provide: CheckListItemRepository,
      useClass: CheckListItemRepositoryPrisma,
    },
    {
      provide: CheckListTaskRepository,
      useClass: CheckListTaskRepositoryPrisma,
    },
    {
      provide: LocationRepository,
      useClass: LocationRepositoryPrisma,
    },
    {
      provide: MaterialRepository,
      useClass: MaterialRepositoryPrisma,
    },
    {
      provide: CategoryMaterialRepository,
      useClass: CategoryMaterialRepositoryPrisma,
    },
    {
      provide: EquipmentTypeRepository,
      useClass: EquipmentTypeRepositoryPrisma,
    },
    {
      provide: StockRepository,
      useClass: StockRepositoryPrisma,
    },
    {
      provide: StockInventoryRepository,
      useClass: StockInventoryRepositoryPrisma,
    },
    {
      provide: ServiceOrderRepository,
      useClass: ServiceOrderRepositoryPrisma,
    },
    {
      provide: TypeMaintenanceRepository,
      useClass: TypeMaintenanceRepositoryPrisma,
    },
    {
      provide: SectorExecutingRepository,
      useClass: SectorExecutingRepositoryPrisma,
    },
    {
      provide: StatusServiceOrderRepository,
      useClass: StatusServiceOrderRepositoryPrisma,
    },
    {
      provide: ColaboratorRepository,
      useClass: ColaboratorRepositoryPrisma,
    },
  ],
})
export class excelModule {}
