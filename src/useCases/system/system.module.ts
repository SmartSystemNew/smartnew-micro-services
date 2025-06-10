import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { CheckListItemRepository } from 'src/repositories/checklist-item-repository';
// import { CheckListRepository } from 'src/repositories/checklist-repository';
// import { CheckListTaskRepository } from 'src/repositories/checklist-task-repository';
// import { ComponentsRepository } from 'src/repositories/components-repository';
// import { CostCenterRepository } from 'src/repositories/cost-center-repository';
// import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
// import { DescriptionCostServiceOrderRepository } from 'src/repositories/description-cost-service-order-repository';
// import { EmployeeRepository } from 'src/repositories/employee-repository';
// import { EquipmentComponentRepository } from 'src/repositories/equipment-component-repository';
// import EquipmentRepository from 'src/repositories/equipment-repository';
// import { EquipmentTypeRepository } from 'src/repositories/equipment-type-repository';
// import { FailureActionRepository } from 'src/repositories/failure-action-repository';
// import { FailureCauseRepository } from 'src/repositories/failure-cause-repository';
// import { FailureSymptomsRepository } from 'src/repositories/failure-symptoms-repository';
// import { FamilyRepository } from 'src/repositories/family-repository';
// import FinanceTributesRepository from 'src/repositories/finance-tributes-repository';
// import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
// import LocationRepository from 'src/repositories/location-repository';
// import MaintenanceRequesterRepository from 'src/repositories/maintenance-requester-repository';
// import ManagerCompanyRepository from 'src/repositories/manager-company-repository';
// import MaterialRepository from 'src/repositories/material-repository';
// import { MenuRepository } from 'src/repositories/menu-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { CheckListItemRepositoryPrisma } from 'src/repositories/prisma/checklist-item-repository-prisma';
// import { CheckListRepositoryPrisma } from 'src/repositories/prisma/checklist-repository-prisma';
// import { CheckListTaskRepositoryPrisma } from 'src/repositories/prisma/checklist-task-repository-prisma';
// import ComponentsRepositoryPrisma from 'src/repositories/prisma/components-repository-prisma';
// import { CostCenterRepositoryPrisma } from 'src/repositories/prisma/cost-center-repository-prisma';
// import { DescriptionCostCenterRepositoryPrisma } from 'src/repositories/prisma/description-cost-center-repository-prisma';
// import DescriptionCostServiceOrderRepositoryPrisma from 'src/repositories/prisma/description-cost-service-order-repository-prisma';
// import EmployeeRepositoryPrisma from 'src/repositories/prisma/employees-repository-prisma';
// import EquipmentComponentRepositoryPrisma from 'src/repositories/prisma/equipment-component-repository-prisma';
// import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
// import EquipmentTypeRepositoryPrisma from 'src/repositories/prisma/equipment-type-repository-prisma';
// import FailureActionRepositoryPrisma from 'src/repositories/prisma/failure-action-repository-prisma';
// import FailureSymptomsRepositoryPrisma from 'src/repositories/prisma/failure-symptoms-repository-prisma';
// import { FamilyRepositoryPrisma } from 'src/repositories/prisma/family-repository-prisma';
// import FinanceTributesRepositoryPrisma from 'src/repositories/prisma/finance-tributes-repository-prisma';
// import FinanceTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
// import LocationRepositoryPrisma from 'src/repositories/prisma/location-repository-prisma';
// import MaintenanceRequesterRepositoryPrisma from 'src/repositories/prisma/maintenance-requester-repository-prisma';
// import ManagerCompanyRepositoryPrisma from 'src/repositories/prisma/manager-company-repository-prisma';
// import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
// import { MenuRepositoryPrisma } from 'src/repositories/prisma/menu-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
// import SectorExecutingRepositoryPrisma from 'src/repositories/prisma/sector-executing-repository-prisma';
// import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
// import StatusServiceOrderRepositoryPrisma from 'src/repositories/prisma/status-service-order-repository-prisma';
// import SubGroupRepositoryPrisma from 'src/repositories/prisma/subgroup-repository-prisma';
// import TypeMaintenanceRepositoryPrisma from 'src/repositories/prisma/type-maintenance-repository-prisma';
// import UnityOfMensurePlansRepositoryPrisma from 'src/repositories/prisma/unity-of-mensure-plans-repository-prisma';
// import ProviderRepository from 'src/repositories/provider-repository';
// import { SectorExecutingRepository } from 'src/repositories/sector-executing-repository';
// import ServiceOrderRepository from 'src/repositories/service-order-repository';
// import { StatusServiceOrderRepository } from 'src/repositories/status-service-order-repository';
// import { SubGroupRepository } from 'src/repositories/subgroup-repository';
// import TaskRepository from 'src/repositories/task-repository';
// import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
// import UnityOfMensurePlansRepository from 'src/repositories/unity-of-mensure-plans-repository';
import { DateService } from 'src/service/data.service';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { FTPService } from 'src/service/ftp.service';
// import FailureCauseRepositoryPrisma from '../../repositories/prisma/failure-cause-repository-prisma';
// import TaskRepositoryPrisma from '../../repositories/prisma/task-repository-prisma';
import ChoiceController from './choices/choice.controllers';
import { SystemController } from './system.controller';
// import PriorityServiceOrderRepository from 'src/repositories/priority-service-order-repository';
// import PriorityServiceOrderRepositoryPrisma from 'src/repositories/prisma/priority-service-order-repository-prisma';
// import ClassificationServiceOrderRepository from 'src/repositories/classification-service-order-repository';
// import ClassificationServiceOrderRepositoryPrisma from 'src/repositories/prisma/classification-service-order-repository-prisma';
// import PeriodicityBoundRepository from 'src/repositories/periodicity-bound-repository';
// import PeriodicityBoundRepositoryPrisma from 'src/repositories/prisma/periodicity-bound-repository-prisma';
// import { CheckListStatusRepository } from 'src/repositories/checklist-status-repository';
// import { CheckListStatusRepositoryPrisma } from 'src/repositories/prisma/checklist-status-repository-prisma';
import EquipmentController from './equipment/equipment-system.controller';
import LogSystemController from './log/log-system.controller';
// import LogChecklistRepository from 'src/repositories/log-checklist-repository';
// import LogChecklistRepositoryPrisma from 'src/repositories/prisma/log-checklist-repository-prisma';
import MaterialSystemController from './material/material-system.controller';
// import LegendTaskRepository from 'src/repositories/legend-task-repository';
// import LegendTaskRepositoryPrisma from 'src/repositories/prisma/legend-task-repository-prisma';
// import DescriptionPlanRepository from 'src/repositories/description-plan-repository';
// import DescriptionPlanRepositoryPrisma from 'src/repositories/prisma/description-plan-repository-prisma';
// import MaterialCodeRepository from 'src/repositories/material-code-repository';
// import MaterialCodeRepositoryPrisma from 'src/repositories/prisma/material-code-repository-prisma';
// import MaterialBoundRepository from 'src/repositories/material-bound-repository';
// import MaterialBoundRepositoryPrisma from 'src/repositories/prisma/material-bound-repository-prisma';
// import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';
// import MaterialEstoqueRepositoryPrisma from 'src/repositories/prisma/material-estoque-repository-prisma';
// import CategoryMaterialRepository from 'src/repositories/category-material-repository';
// import CategoryMaterialRepositoryPrisma from 'src/repositories/prisma/category-material-repository-prisma';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';
import ImageController from './image/image.controller';

@Module({
  imports: [
    //ImageModule,
    TenantRepositoriesModule,
  ],
  controllers: [
    SystemController,
    ChoiceController,
    EquipmentController,
    MaterialSystemController,
    LogSystemController,
    ImageController,
  ],
  providers: [
    JwtService,
    ENVService,
    FTPService,
    DateService,
    FileService,
    // {
    //   provide: BranchesByUserRepository,
    //   useClass: BranchesByUserRepositoryPrisma,
    // },
    // {
    //   provide: LoginRepository,
    //   useClass: LoginRepositoryPrisma,
    // },
    // {
    //   provide: UserRepository,
    //   useClass: UserRepositoryPrisma,
    // },
    // {
    //   provide: PermissionRepository,
    //   useClass: PermissionRepositoryPrisma,
    // },
    // // {
    // //   provide: ModuleRepository,
    // //   useClass: ModuleRepositoryPrisma,
    // // },
    // {
    //   provide: DescriptionCostCenterRepository,
    //   useClass: DescriptionCostCenterRepositoryPrisma,
    // },
    // // {
    // //   provide: BranchRepository,
    // //   useClass: BranchRepositoryPrisma,
    // // },
    // {
    //   provide: LocationRepository,
    //   useClass: LocationRepositoryPrisma,
    // },
    // {
    //   provide: ManagerCompanyRepository,
    //   useClass: ManagerCompanyRepositoryPrisma,
    // },
    // {
    //   provide: EquipmentRepository,
    //   useClass: EquipmentRepositoryPrisma,
    // },
    // {
    //   provide: CostCenterRepository,
    //   useClass: CostCenterRepositoryPrisma,
    // },
    // {
    //   provide: FamilyRepository,
    //   useClass: FamilyRepositoryPrisma,
    // },
    // {
    //   provide: EquipmentTypeRepository,
    //   useClass: EquipmentTypeRepositoryPrisma,
    // },
    // {
    //   provide: EquipmentComponentRepository,
    //   useClass: EquipmentComponentRepositoryPrisma,
    // },
    // {
    //   provide: UnityOfMensurePlansRepository,
    //   useClass: UnityOfMensurePlansRepositoryPrisma,
    // },
    // {
    //   provide: CheckListRepository,
    //   useClass: CheckListRepositoryPrisma,
    // },
    // {
    //   provide: CheckListTaskRepository,
    //   useClass: CheckListTaskRepositoryPrisma,
    // },
    // {
    //   provide: CheckListItemRepository,
    //   useClass: CheckListItemRepositoryPrisma,
    // },
    // {
    //   provide: MenuRepository,
    //   useClass: MenuRepositoryPrisma,
    // },
    // {
    //   provide: ProviderRepository,
    //   useClass: ProviderRepositoryPrisma,
    // },
    // {
    //   provide: SubGroupRepository,
    //   useClass: SubGroupRepositoryPrisma,
    // },
    // {
    //   provide: SectorExecutingRepository,
    //   useClass: SectorExecutingRepositoryPrisma,
    // },
    // {
    //   provide: TypeMaintenanceRepository,
    //   useClass: TypeMaintenanceRepositoryPrisma,
    // },
    // {
    //   provide: TaskRepository,
    //   useClass: TaskRepositoryPrisma,
    // },
    // {
    //   provide: EmployeeRepository,
    //   useClass: EmployeeRepositoryPrisma,
    // },
    // {
    //   provide: StatusServiceOrderRepository,
    //   useClass: StatusServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: FinanceTypePaymentRepository,
    //   useClass: FinanceTypePaymentRepositoryPrisma,
    // },
    // {
    //   provide: FinanceTributesRepository,
    //   useClass: FinanceTributesRepositoryPrisma,
    // },
    // {
    //   provide: MaintenanceRequesterRepository,
    //   useClass: MaintenanceRequesterRepositoryPrisma,
    // },
    // {
    //   provide: ServiceOrderRepository,
    //   useClass: ServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: MaterialRepository,
    //   useClass: MaterialRepositoryPrisma,
    // },
    // {
    //   provide: DescriptionCostServiceOrderRepository,
    //   useClass: DescriptionCostServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: ComponentsRepository,
    //   useClass: ComponentsRepositoryPrisma,
    // },
    // {
    //   provide: FailureSymptomsRepository,
    //   useClass: FailureSymptomsRepositoryPrisma,
    // },
    // {
    //   provide: FailureCauseRepository,
    //   useClass: FailureCauseRepositoryPrisma,
    // },
    // {
    //   provide: FailureActionRepository,
    //   useClass: FailureActionRepositoryPrisma,
    // },
    // {
    //   provide: PriorityServiceOrderRepository,
    //   useClass: PriorityServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: ClassificationServiceOrderRepository,
    //   useClass: ClassificationServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: PeriodicityBoundRepository,
    //   useClass: PeriodicityBoundRepositoryPrisma,
    // },
    // {
    //   provide: CheckListStatusRepository,
    //   useClass: CheckListStatusRepositoryPrisma,
    // },
    // {
    //   provide: LogChecklistRepository,
    //   useClass: LogChecklistRepositoryPrisma,
    // },
    // {
    //   provide: LegendTaskRepository,
    //   useClass: LegendTaskRepositoryPrisma,
    // },
    // {
    //   provide: UnityOfMensurePlansRepository,
    //   useClass: UnityOfMensurePlansRepositoryPrisma,
    // },
    // {
    //   provide: DescriptionPlanRepository,
    //   useClass: DescriptionPlanRepositoryPrisma,
    // },
    // {
    //   provide: MaterialCodeRepository,
    //   useClass: MaterialCodeRepositoryPrisma,
    // },
    // {
    //   provide: MaterialBoundRepository,
    //   useClass: MaterialBoundRepositoryPrisma,
    // },
    // {
    //   provide: MaterialEstoqueRepository,
    //   useClass: MaterialEstoqueRepositoryPrisma,
    // },
    // {
    //   provide: CategoryMaterialRepository,
    //   useClass: CategoryMaterialRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
  ],
})
export class systemModule {}
