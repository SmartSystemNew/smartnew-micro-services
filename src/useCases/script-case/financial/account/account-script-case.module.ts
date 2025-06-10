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
import FinanceRepository from 'src/repositories/finance-repository';
import FinanceRepositoryPrisma from 'src/repositories/prisma/finance-repository-prisma';
import AccountScriptCaseController from './account-script-case.controller';
import { BranchRepository } from 'src/repositories/branch-repository';
import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
import ProviderRepository from 'src/repositories/provider-repository';
import FinanceTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
import FinanceTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-typeDocument-repository-prisma';
import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
import { FinanceItemRepositoryPrisma } from 'src/repositories/prisma/finance-item-repository-prisma';
import MaterialRepository from 'src/repositories/material-repository';
import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
import ContractTypeInputRepositoryPrisma from 'src/repositories/prisma/contract-type-input-repository-prisma';
import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
import FinanceTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import { FinancePaymentRepositoryPrisma } from 'src/repositories/prisma/finance-payment-repository-prisma';
import FinanceControlRepository from 'src/repositories/finance-control-repository';
import FinanceControlRepositoryPrisma from 'src/repositories/prisma/finance-control-repository-prisma';
import FinanceNumberRepository from 'src/repositories/finance-number-repository';
import FinanceNumberRepositoryPrisma from 'src/repositories/prisma/finance-number-repository-prisma';
import FinanceNumberTypeDocumentRepository from 'src/repositories/finance-numberTypeDocument-repository';
import FinanceNumberTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-numberTypeDocument-repository-prisma';
import LogFinanceRepository from 'src/repositories/log-finance-repository';
import LogFinanceRepositoryPrisma from 'src/repositories/prisma/log-finance-repository-prisma';
import EquipmentRepository from 'src/repositories/equipment-repository';
import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
import { CompositionItemRepository } from 'src/repositories/composition-item-repository';
import { CompositionItemRepositoryPrisma } from 'src/repositories/prisma/composition-item-repository-prisma';
import FinanceItemBoundRepository from 'src/repositories/finance-item-bound-repository';
import FinanceItemBoundRepositoryPrisma from 'src/repositories/prisma/finance-item-bound-repository-prisma';
import { ModuleRepository } from 'src/repositories/module-repository';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import { FileService } from 'src/service/file.service';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import FinanceEmissionItemRepository from 'src/repositories/finance-emissionItem-repository';
import FinanceEmissionItemRepositoryPrisma from 'src/repositories/prisma/finance-emissionItem-repository-prisma';
import FinanceRegisterTributeRepository from 'src/repositories/finance-registerTribute-repository';
import FinanceTaxationRepository from 'src/repositories/financeTaxation-repository';
import FinanceRegisterTributeRepositoryPrisma from 'src/repositories/prisma/finance-registerTribute-repository-prisma';
import FinanceTaxationRepositoryPrisma from 'src/repositories/prisma/financeTaxation-repository-prisma';
import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
import MaterialServiceOrderRepositoryPrisma from 'src/repositories/prisma/material-service-order-repository-prisma';

@Module({
  imports: [],
  controllers: [AccountScriptCaseController],
  providers: [
    JwtService,
    ENVService,
    FTPService,
    DateService,
    FileService,
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
      provide: FinanceRepository,
      useClass: FinanceRepositoryPrisma,
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
      provide: FinanceTypeDocumentRepository,
      useClass: FinanceTypeDocumentRepositoryPrisma,
    },
    {
      provide: FinanceItemRepository,
      useClass: FinanceItemRepositoryPrisma,
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
      provide: FinanceTypePaymentRepository,
      useClass: FinanceTypePaymentRepositoryPrisma,
    },
    {
      provide: FinanceControlRepository,
      useClass: FinanceControlRepositoryPrisma,
    },
    {
      provide: FinancePaymentRepository,
      useClass: FinancePaymentRepositoryPrisma,
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
      provide: LogFinanceRepository,
      useClass: LogFinanceRepositoryPrisma,
    },
    {
      provide: EquipmentRepository,
      useClass: EquipmentRepositoryPrisma,
    },
    {
      provide: ServiceOrderRepository,
      useClass: ServiceOrderRepositoryPrisma,
    },
    {
      provide: CompositionItemRepository,
      useClass: CompositionItemRepositoryPrisma,
    },
    {
      provide: FinanceItemBoundRepository,
      useClass: FinanceItemBoundRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
    {
      provide: FinanceEmissionItemRepository,
      useClass: FinanceEmissionItemRepositoryPrisma,
    },
    {
      provide: FinanceTaxationRepository,
      useClass: FinanceTaxationRepositoryPrisma,
    },
    {
      provide: FinanceRegisterTributeRepository,
      useClass: FinanceRegisterTributeRepositoryPrisma,
    },
    {
      provide: MaterialServiceOrderRepository,
      useClass: MaterialServiceOrderRepositoryPrisma,
    },
  ],
})
export class AccountScripCaseModule {}
