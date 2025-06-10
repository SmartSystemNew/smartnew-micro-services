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
import FinanceBankTransferRepository from 'src/repositories/finance-bank-transfer-repository';
import FinanceBankTransferRepositoryPrisma from 'src/repositories/prisma/finance-bank-transfer-repository-prisma';
import TransactionScriptCaseController from './transaction-script-case.controller';
import FinanceBankRepository from 'src/repositories/finance-bank-repository';
import FinanceBankRepositoryPrisma from 'src/repositories/prisma/finance-bank-repository-prisma';
import { BranchRepository } from 'src/repositories/branch-repository';
import { CompositionItemRepository } from 'src/repositories/composition-item-repository';
import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
import { CompositionItemRepositoryPrisma } from 'src/repositories/prisma/composition-item-repository-prisma';
import FinanceTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
import ProviderRepository from 'src/repositories/provider-repository';
import FinanceTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
import FinanceTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-typeDocument-repository-prisma';
import FinanceNumberRepository from 'src/repositories/finance-number-repository';
import FinanceNumberRepositoryPrisma from 'src/repositories/prisma/finance-number-repository-prisma';
import FinanceNumberTypeDocumentRepository from 'src/repositories/finance-numberTypeDocument-repository';
import FinanceNumberTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-numberTypeDocument-repository-prisma';
import FinanceControlRepository from 'src/repositories/finance-control-repository';
import FinanceControlRepositoryPrisma from 'src/repositories/prisma/finance-control-repository-prisma';
import MaterialRepository from 'src/repositories/material-repository';
import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
import { FinanceItemRepositoryPrisma } from 'src/repositories/prisma/finance-item-repository-prisma';
import FinanceRepository from 'src/repositories/finance-repository';
import FinanceRepositoryPrisma from 'src/repositories/prisma/finance-repository-prisma';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import { FinancePaymentRepositoryPrisma } from 'src/repositories/prisma/finance-payment-repository-prisma';
import FinanceEmissionRepository from 'src/repositories/finance-emission-repository';
import FinanceEmissionRepositoryPrisma from 'src/repositories/prisma/finance-emission-repository-prisma';
import FinanceEmissionItemRepository from 'src/repositories/finance-emissionItem-repository';
import FinanceEmissionItemRepositoryPrisma from 'src/repositories/prisma/finance-emissionItem-repository-prisma';
import LogFinanceRepository from 'src/repositories/log-finance-repository';
import LogFinanceRepositoryPrisma from 'src/repositories/prisma/log-finance-repository-prisma';
import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
import ContractTypeInputRepositoryPrisma from 'src/repositories/prisma/contract-type-input-repository-prisma';
import { ModuleRepository } from 'src/repositories/module-repository';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

@Module({
  imports: [],
  controllers: [TransactionScriptCaseController],
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
      provide: FinanceBankTransferRepository,
      useClass: FinanceBankTransferRepositoryPrisma,
    },
    {
      provide: FinanceBankRepository,
      useClass: FinanceBankRepositoryPrisma,
    },
    {
      provide: BranchRepository,
      useClass: BranchRepositoryPrisma,
    },
    {
      provide: ProviderRepository,
      useClass: ProviderRepositoryPrisma,
    },
    {
      provide: CompositionItemRepository,
      useClass: CompositionItemRepositoryPrisma,
    },
    {
      provide: FinanceTypePaymentRepository,
      useClass: FinanceTypePaymentRepositoryPrisma,
    },
    {
      provide: FinanceTypeDocumentRepository,
      useClass: FinanceTypeDocumentRepositoryPrisma,
    },
    {
      provide: FinanceNumberRepository,
      useClass: FinanceNumberRepositoryPrisma,
    },
    {
      provide: FinanceNumberTypeDocumentRepository,
      useClass: FinanceNumberTypeDocumentRepositoryPrisma,
    },
    {
      provide: FinanceControlRepository,
      useClass: FinanceControlRepositoryPrisma,
    },
    {
      provide: MaterialRepository,
      useClass: MaterialRepositoryPrisma,
    },
    {
      provide: FinanceRepository,
      useClass: FinanceRepositoryPrisma,
    },
    {
      provide: FinanceItemRepository,
      useClass: FinanceItemRepositoryPrisma,
    },
    {
      provide: FinancePaymentRepository,
      useClass: FinancePaymentRepositoryPrisma,
    },
    {
      provide: FinanceEmissionRepository,
      useClass: FinanceEmissionRepositoryPrisma,
    },
    {
      provide: FinanceEmissionItemRepository,
      useClass: FinanceEmissionItemRepositoryPrisma,
    },
    {
      provide: LogFinanceRepository,
      useClass: LogFinanceRepositoryPrisma,
    },
    {
      provide: ContractTypeInputRepository,
      useClass: ContractTypeInputRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export class TransactionScriptCaseModule {}
