import { Module } from '@nestjs/common';
// import { compositionModule } from './composition/composition.module';
// import { CostCenterModule } from './costCenter/costCenter.module';
// import { dashboardFinanceModule } from './dashboard-finance/dashboard-finance.module';
import { CompositionController } from './composition/composition.controller';
import { CostCenterController } from './costCenter/costCenter.controller';
import { DashboardFinanceController } from './dashboard-finance/dashboard-finance.controller';
import { JwtService } from '@nestjs/jwt';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import { CostCenterRepository } from 'src/repositories/cost-center-repository';
// import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
// import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
// import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
// import { CostCenterRepositoryPrisma } from 'src/repositories/prisma/cost-center-repository-prisma';
// import { DescriptionCostCenterRepositoryPrisma } from 'src/repositories/prisma/description-cost-center-repository-prisma';
// import { FinanceItemRepositoryPrisma } from 'src/repositories/prisma/finance-item-repository-prisma';
// import { FinancePaymentRepositoryPrisma } from 'src/repositories/prisma/finance-payment-repository-prisma';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { FTPService } from 'src/service/ftp.service';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';
import { DateService } from 'src/service/data.service';

@Module({
  imports: [
    //compositionModule,
    //CostCenterModule,
    // dashboardFinanceModule
    TenantRepositoriesModule,
  ],
  controllers: [
    CompositionController,
    CostCenterController,
    DashboardFinanceController,
  ],
  providers: [
    JwtService,
    ENVService,
    FTPService,
    DateService,
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
    // {
    //   provide: ModuleRepository,
    //   useClass: ModuleRepositoryPrisma,
    // },
    // {
    //   provide: BranchesByUserRepository,
    //   useClass: BranchesByUserRepositoryPrisma,
    // },
    // {
    //   provide: CostCenterRepository,
    //   useClass: CostCenterRepositoryPrisma,
    // },
    // {
    //   provide: FinancePaymentRepository,
    //   useClass: FinancePaymentRepositoryPrisma,
    // },
    // {
    //   provide: FinanceItemRepository,
    //   useClass: FinanceItemRepositoryPrisma,
    // },
    // {
    //   provide: DescriptionCostCenterRepository,
    //   useClass: DescriptionCostCenterRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
  ],
})
export class financialReportsModule {}
