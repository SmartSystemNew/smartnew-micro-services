import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { LoginRepository } from 'src/repositories/login-repository';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { FTPService } from 'src/service/ftp.service';
import { DateService } from 'src/service/data.service';
import { FileService } from 'src/service/file.service';
import FinancialReportsScriptCaseController from './financial-reports-script-case.controller';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import { FinancePaymentRepositoryPrisma } from 'src/repositories/prisma/finance-payment-repository-prisma';
import { BranchRepository } from 'src/repositories/branch-repository';
import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
import ProviderRepository from 'src/repositories/provider-repository';
import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
import MaterialRepository from 'src/repositories/material-repository';
import ContractTypeInputRepositoryPrisma from 'src/repositories/prisma/contract-type-input-repository-prisma';
import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
import FinanceBankTransactionRepository from 'src/repositories/financeBankTransaction-repository';
import FinanceBankTransactionRepositoryPrisma from 'src/repositories/prisma/financeBankTransaction-repository-prisma';
import FinanceRepository from 'src/repositories/finance-repository';
import FinanceRepositoryPrisma from 'src/repositories/prisma/finance-repository-prisma';
import FinanceControlRepository from 'src/repositories/finance-control-repository';
import FinanceControlRepositoryPrisma from 'src/repositories/prisma/finance-control-repository-prisma';
import { ModuleRepository } from 'src/repositories/module-repository';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

@Module({
  imports: [],
  controllers: [FinancialReportsScriptCaseController],
  providers: [
    JwtService,
    ENVService,
    FileService,
    FTPService,
    DateService,
    {
      provide: BranchesByUserRepository,
      useClass: BranchesByUserRepositoryPrisma,
    },
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
      provide: FinancePaymentRepository,
      useClass: FinancePaymentRepositoryPrisma,
    },
    {
      provide: ProviderRepository,
      useClass: ProviderRepositoryPrisma,
    },
    {
      provide: BranchRepository,
      useClass: BranchRepositoryPrisma,
    },
    {
      provide: MaterialRepository,
      useClass: MaterialRepositoryPrisma,
    },
    {
      provide: ContractTypeInputRepository,
      useClass: ContractTypeInputRepositoryPrisma,
    },
    {
      provide: FinanceBankTransactionRepository,
      useClass: FinanceBankTransactionRepositoryPrisma,
    },
    {
      provide: FinanceRepository,
      useClass: FinanceRepositoryPrisma,
    },
    {
      provide: FinanceControlRepository,
      useClass: FinanceControlRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export class FinancialReportsScriptCaseModule {}
