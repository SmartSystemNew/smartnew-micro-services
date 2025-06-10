import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { CostCenterRepository } from 'src/repositories/cost-center-repository';
import { LoginRepository } from 'src/repositories/login-repository';
import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
import { CostCenterRepositoryPrisma } from 'src/repositories/prisma/cost-center-repository-prisma';
import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { FTPService } from 'src/service/ftp.service';
import { CompositionController } from './composition.controller';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import { FinancePaymentRepositoryPrisma } from 'src/repositories/prisma/finance-payment-repository-prisma';
import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
import { FinanceItemRepositoryPrisma } from 'src/repositories/prisma/finance-item-repository-prisma';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
import { DescriptionCostCenterRepositoryPrisma } from 'src/repositories/prisma/description-cost-center-repository-prisma';
import { ModuleRepository } from 'src/repositories/module-repository';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

@Module({
  imports: [],
  controllers: [CompositionController],
  providers: [
    JwtService,
    ENVService,
    FTPService,
    {
      provide: LoginRepository,
      useClass: LoginRepositoryPrisma,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    {
      provide: PermissionRepository,
      useClass: PermissionRepositoryPrisma,
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
      provide: CostCenterRepository,
      useClass: CostCenterRepositoryPrisma,
    },
    {
      provide: FinancePaymentRepository,
      useClass: FinancePaymentRepositoryPrisma,
    },
    {
      provide: FinanceItemRepository,
      useClass: FinanceItemRepositoryPrisma,
    },
    {
      provide: DescriptionCostCenterRepository,
      useClass: DescriptionCostCenterRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export class compositionModule {}
