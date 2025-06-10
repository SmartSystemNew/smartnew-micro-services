import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { BuyNumberFiscalRepository } from 'src/repositories/buy-number-fiscal-repository';
import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
import { CheckListStatusActionRepository } from 'src/repositories/checklist-status-action-repository';
import { CheckListStatusRepository } from 'src/repositories/checklist-status-repository';
import { LoginRepository } from 'src/repositories/login-repository';
import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
import { BuyNumberFiscalRepositoryPrisma } from 'src/repositories/prisma/buy-number-fiscal-repository-prisma';
import { CheckListPeriodRepositoryPrisma } from 'src/repositories/prisma/checklist-period-repository-prisma';
import { CheckListStatusActionRepositoryPrisma } from 'src/repositories/prisma/checklist-status-action-repository-prisma';
import { CheckListStatusRepositoryPrisma } from 'src/repositories/prisma/checklist-status-repository-prisma';
import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
import { ProductionRegisterRepositoryPrisma } from 'src/repositories/prisma/production-register-repository-prisma';
import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
import { ProductionRegisterRepository } from 'src/repositories/production-register-repository';
import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { CheckListController } from './check-list.controller';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
import SmartChecklistRepositoryPrisma from 'src/repositories/prisma/smart-checklist-repository-prisma';
import SmartChecklistRepository from 'src/repositories/smart-checklist-repository';
import { ModuleRepository } from 'src/repositories/module-repository';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import ChecklistService from 'src/service/checklist.service';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

@Module({
  imports: [],
  controllers: [CheckListController],
  providers: [
    JwtService,
    ENVService,
    FileService,
    ChecklistService,
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
      provide: ProductionRegisterRepository,
      useClass: ProductionRegisterRepositoryPrisma,
    },
    {
      provide: CheckListPeriodRepository,
      useClass: CheckListPeriodRepositoryPrisma,
    },
    {
      provide: CheckListStatusRepository,
      useClass: CheckListStatusRepositoryPrisma,
    },
    {
      provide: CheckListStatusActionRepository,
      useClass: CheckListStatusActionRepositoryPrisma,
    },
    {
      provide: BranchesByUserRepository,
      useClass: BranchesByUserRepositoryPrisma,
    },
    {
      provide: BuyNumberFiscalRepository,
      useClass: BuyNumberFiscalRepositoryPrisma,
    },
    {
      provide: SmartChecklistRepository,
      useClass: SmartChecklistRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export class CheckListModule {}
