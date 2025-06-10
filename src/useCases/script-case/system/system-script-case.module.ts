import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
// import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
// import FinanceTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
// import MaterialRepository from 'src/repositories/material-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import ContractTypeInputRepositoryPrisma from 'src/repositories/prisma/contract-type-input-repository-prisma';
// import { DescriptionCostCenterRepositoryPrisma } from 'src/repositories/prisma/description-cost-center-repository-prisma';
// import FinanceTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-typeDocument-repository-prisma';
// import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import ProviderRepository from 'src/repositories/provider-repository';
// import { UserRepository } from 'src/repositories/user-repository';
import { DateService } from 'src/service/data.service';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { FTPService } from 'src/service/ftp.service';
import SystemScriptCaseController from './system-script-case.controller';
// import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
// import FinanceTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
// import FinanceTributesRepository from 'src/repositories/finance-tributes-repository';
// import FinanceTributesRepositoryPrisma from 'src/repositories/prisma/finance-tributes-repository-prisma';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
// import ServiceOrderRepository from 'src/repositories/service-order-repository';
// import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
// import MaterialServiceOrderRepositoryPrisma from 'src/repositories/prisma/material-service-order-repository-prisma';
// import EquipmentRepository from 'src/repositories/equipment-repository';
// import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
// import { CostCenterRepository } from 'src/repositories/cost-center-repository';
// import { CostCenterRepositoryPrisma } from 'src/repositories/prisma/cost-center-repository-prisma';
// import GroupRepository from 'src/repositories/group-repository';
// import GroupRepositoryPrisma from 'src/repositories/prisma/group-repository-prisma';
// import UserGroupRepositoryPrisma from 'src/repositories/prisma/user-group-repository-prisma';
// import UserGroupRepository from 'src/repositories/user-group-repository';
// import { MenuRepository } from 'src/repositories/menu-repository';
// import { MenuRepositoryPrisma } from 'src/repositories/prisma/menu-repository-prisma';
// import UserPermissionRepositoryPrisma from 'src/repositories/prisma/user-permission-repository-prisma';
// import UserPermissionRepository from 'src/repositories/user-permission-repository';
import PermissionScriptCaseController from './permission/permission-script-case.controller';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';
import MaterialCodeRepository from 'src/repositories/material-code-repository';
import MaterialCodeRepositoryPrisma from 'src/repositories/prisma/material-code-repository-prisma';

@Module({
  imports: [TenantRepositoriesModule],
  controllers: [SystemScriptCaseController, PermissionScriptCaseController],
  providers: [
    JwtService,
    ENVService,
    FileService,
    FTPService,
    DateService,
    // {
    //   provide: BranchesByUserRepository,
    //   useClass: BranchesByUserRepositoryPrisma,
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
    //   provide: PermissionRepository,
    //   useClass: PermissionRepositoryPrisma,
    // },
    // {
    //   provide: ModuleRepository,
    //   useClass: ModuleRepositoryPrisma,
    // },
    // {
    //   provide: MaterialRepository,
    //   useClass: MaterialRepositoryPrisma,
    // },
    // {
    //   provide: ContractTypeInputRepository,
    //   useClass: ContractTypeInputRepositoryPrisma,
    // },
    // {
    //   provide: ProviderRepository,
    //   useClass: ProviderRepositoryPrisma,
    // },
    // {
    //   provide: FinanceTypeDocumentRepository,
    //   useClass: FinanceTypeDocumentRepositoryPrisma,
    // },
    // {
    //   provide: DescriptionCostCenterRepository,
    //   useClass: DescriptionCostCenterRepositoryPrisma,
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
    //   provide: ServiceOrderRepository,
    //   useClass: ServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: MaterialServiceOrderRepository,
    //   useClass: MaterialServiceOrderRepositoryPrisma,
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
    //   provide: GroupRepository,
    //   useClass: GroupRepositoryPrisma,
    // },
    // {
    //   provide: UserGroupRepository,
    //   useClass: UserGroupRepositoryPrisma,
    // },
    // {
    //   provide: MenuRepository,
    //   useClass: MenuRepositoryPrisma,
    // },
    // {
    //   provide: UserPermissionRepository,
    //   useClass: UserPermissionRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
  ],
})
export class SystemScriptCaseModule {}
