import { Module } from '@nestjs/common';
//import { CheckListModule } from './check-list/check-list.module';
//import { FamilyModule } from './family/family.module';
//import { TaskModule } from './task/task.module';
//import { BoundModule } from './bound/bound.module';
//import { ActionModule } from './action/action.module';
//import { DiverseModule } from './diverse/diverse.module';
//import { locationModule } from './location/location.module';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';
import { JwtService } from '@nestjs/jwt';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import { CheckListPeriodRepositoryPrisma } from 'src/repositories/prisma/checklist-period-repository-prisma';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import { ProductionChecklistActionGroupRepositoryPrisma } from 'src/repositories/prisma/production-checklist-action-group-repository-prisma';
// import { ProductionChecklistActionRepositoryPrisma } from 'src/repositories/prisma/production-checklist-action-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import { ProductionChecklistActionGroupRepository } from 'src/repositories/production-checklist-action-group-repository';
// import { ProductionChecklistActionRepository } from 'src/repositories/production-checklist-action-repository';
// import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { ActionController } from './action/action.controller';
import { BoundController } from './bound/bound.controller';
import { CheckListController } from './check-list/check-list.controller';
import { DiverseController } from './diverse/diverse.controller';
import { FamilyController } from './family/family.controller';
import { LocationController } from './location/location.controller';
import { TaskController } from './task/task.controller';
import { PrismaService } from 'src/database/prisma.service';
// import { CheckListRepository } from 'src/repositories/checklist-repository';
// import { CheckListRepositoryPrisma } from 'src/repositories/prisma/checklist-repository-prisma';
// import { FamilyRepository } from 'src/repositories/family-repository';
// import { FamilyRepositoryPrisma } from 'src/repositories/prisma/family-repository-prisma';
// import { CheckListItemRepository } from 'src/repositories/checklist-item-repository';
// import { CheckListItemRepositoryPrisma } from 'src/repositories/prisma/checklist-item-repository-prisma';
// import { CheckListControlRepository } from 'src/repositories/checklist-control-repository';
// import { CheckListControlRepositoryPrisma } from 'src/repositories/prisma/checklist-control-repository-prisma';
// import LocationRepository from 'src/repositories/location-repository';
// import LocationRepositoryPrisma from 'src/repositories/prisma/location-repository-prisma';
import ChecklistService from 'src/service/checklist.service';
import { DateService } from 'src/service/data.service';
// import EquipmentRepository from 'src/repositories/equipment-repository';
// import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
// import { ProductionRegisterRepositoryPrisma } from 'src/repositories/prisma/production-register-repository-prisma';
// import { ProductionRegisterRepository } from 'src/repositories/production-register-repository';
// import SmartChecklistRepositoryPrisma from 'src/repositories/prisma/smart-checklist-repository-prisma';
// import SmartChecklistRepository from 'src/repositories/smart-checklist-repository';
// import { CheckListStatusRepository } from 'src/repositories/checklist-status-repository';
// import { CheckListStatusRepositoryPrisma } from 'src/repositories/prisma/checklist-status-repository-prisma';
// import { CheckListStatusActionRepository } from 'src/repositories/checklist-status-action-repository';
// import { CheckListStatusActionRepositoryPrisma } from 'src/repositories/prisma/checklist-status-action-repository-prisma';
// import { BuyNumberFiscalRepository } from 'src/repositories/buy-number-fiscal-repository';
// import { BuyNumberFiscalRepositoryPrisma } from 'src/repositories/prisma/buy-number-fiscal-repository-prisma';
// import { CheckListTaskRepository } from 'src/repositories/checklist-task-repository';
// import { CheckListTaskRepositoryPrisma } from 'src/repositories/prisma/checklist-task-repository-prisma';
// import { ProductionCategoryDiverseRepositoryPrisma } from 'src/repositories/prisma/production-category-diverse-repository-prisma';
// import ProductionCategoryDiverseRepository from 'src/repositories/production-category-diverse-repository';
// import { BranchRepository } from 'src/repositories/branch-repository';
// import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
// import { ProductionCategoryItemsRepositoryPrisma } from 'src/repositories/prisma/production-category-items-repository-prisma';
// import { ProductionCategoryItemsRepository } from 'src/repositories/production-category-items-repository';
// import ChecklistCategoryDiverseRepository from 'src/repositories/checklist-category-diverse-repository';
// import ChecklistCategoryDiverseRepositoryPrisma from 'src/repositories/prisma/checklist-category-diverse-repository-prisma';

@Module({
  imports: [
    // CheckListModule,
    // FamilyModule,
    // TaskModule,
    // BoundModule,
    // //ActionModule,
    // DiverseModule,
    // locationModule,
    TenantRepositoriesModule,
  ],
  controllers: [
    ActionController,
    BoundController,
    CheckListController,
    FamilyController,
    TaskController,
    DiverseController,
    LocationController,
  ],
  providers: [
    PrismaService,
    JwtService,
    ENVService,
    FileService,
    ChecklistService,
    DateService,
    // {
    //   provide: BranchesByUserRepository,
    //   useClass: BranchesByUserRepositoryPrisma,
    // },
    // {
    //   provide: PermissionRepository,
    //   useClass: PermissionRepositoryPrisma,
    // },
    // {
    //   provide: ModuleRepository,
    //   useClass: ModuleRepositoryPrisma,
    // },
    // // {
    // //   provide: LoginRepository,
    // //   useClass: LoginRepositoryPrisma,
    // // },
    // {
    //   provide: UserRepository,
    //   useClass: UserRepositoryPrisma,
    // },
    // {
    //   provide: CheckListPeriodRepository,
    //   useClass: CheckListPeriodRepositoryPrisma,
    // },
    // {
    //   provide: ProductionChecklistActionRepository,
    //   useClass: ProductionChecklistActionRepositoryPrisma,
    // },
    // {
    //   provide: ProductionChecklistActionGroupRepository,
    //   useClass: ProductionChecklistActionGroupRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
    // {
    //   provide: CheckListRepository,
    //   useClass: CheckListRepositoryPrisma,
    // },
    // {
    //   provide: FamilyRepository,
    //   useClass: FamilyRepositoryPrisma,
    // },
    // {
    //   provide: CheckListItemRepository,
    //   useClass: CheckListItemRepositoryPrisma,
    // },
    // {
    //   provide: CheckListControlRepository,
    //   useClass: CheckListControlRepositoryPrisma,
    // },
    // {
    //   provide: LocationRepository,
    //   useClass: LocationRepositoryPrisma,
    // },
    // {
    //   provide: EquipmentRepository,
    //   useClass: EquipmentRepositoryPrisma,
    // },
    // {
    //   provide: ProductionRegisterRepository,
    //   useClass: ProductionRegisterRepositoryPrisma,
    // },
    // {
    //   provide: SmartChecklistRepository,
    //   useClass: SmartChecklistRepositoryPrisma,
    // },
    // {
    //   provide: CheckListStatusRepository,
    //   useClass: CheckListStatusRepositoryPrisma,
    // },
    // {
    //   provide: CheckListStatusActionRepository,
    //   useClass: CheckListStatusActionRepositoryPrisma,
    // },
    // {
    //   provide: BuyNumberFiscalRepository,
    //   useClass: BuyNumberFiscalRepositoryPrisma,
    // },
    // {
    //   provide: CheckListTaskRepository,
    //   useClass: CheckListTaskRepositoryPrisma,
    // },
    // {
    //   provide: ProductionCategoryDiverseRepository,
    //   useClass: ProductionCategoryDiverseRepositoryPrisma,
    // },
    // {
    //   provide: BranchRepository,
    //   useClass: BranchRepositoryPrisma,
    // },
    // {
    //   provide: ProductionCategoryItemsRepository,
    //   useClass: ProductionCategoryItemsRepositoryPrisma,
    // },
    // {
    //   provide: ChecklistCategoryDiverseRepository,
    //   useClass: ChecklistCategoryDiverseRepositoryPrisma,
    // },
  ],
})
export class smartListModule {}
