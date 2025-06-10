import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import FinanceBankRepository from 'src/repositories/finance-bank-repository';
// import { FinancePaymentViewRepository } from 'src/repositories/finance-payment-view-repository';
// import FinanceTributesRepository from 'src/repositories/finance-tributes-repository';
// import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
// import FinanceBankTransactionRepository from 'src/repositories/financeBankTransaction-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import FinanceBankRepositoryPrisma from 'src/repositories/prisma/finance-bank-repository-prisma';
// import { FinancePaymentViewRepositoryPrisma } from 'src/repositories/prisma/finance-payment-view-repository-prisma';
// import FinanceTributesRepositoryPrisma from 'src/repositories/prisma/finance-tributes-repository-prisma';
// import FinanceTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
// import FinanceBankTransactionRepositoryPrisma from 'src/repositories/prisma/financeBankTransaction-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import { UserRepository } from 'src/repositories/user-repository';
import { DateService } from 'src/service/data.service';
import { ENVService } from 'src/service/env.service';
import { FTPService } from 'src/service/ftp.service';
// import { AccountScripCaseModule } from './account/account-script-case.module';
// import { TransactionScriptCaseModule } from './bank/transaction/transaction-script-case.module';
// import { EmissionScriptCaseModule } from './emission/emission-script-case.module';
import FinancialScriptCaseController from './financial-script-case.controller';
// // import { FinancialReportsScriptCaseModule } from './reports/financial-reports-script-case.module';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';
import TransactionScriptCaseController from './bank/transaction/transaction-script-case.controller';
import EmissionScriptCaseController from './emission/emission-script-case.controller';
import FinancialReportsScriptCaseController from './reports/financial-reports-script-case.controller';
import AccountScriptCaseController from './account/account-script-case.controller';
// import FinanceRepository from 'src/repositories/finance-repository';
// import FinanceRepositoryPrisma from 'src/repositories/prisma/finance-repository-prisma';
// import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
// import ProviderRepository from 'src/repositories/provider-repository';
// import { BranchRepository } from 'src/repositories/branch-repository';
// import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
// import FinanceTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
// import FinanceTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-typeDocument-repository-prisma';
// import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
// import { FinanceItemRepositoryPrisma } from 'src/repositories/prisma/finance-item-repository-prisma';
// import MaterialRepository from 'src/repositories/material-repository';
// import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
// import { CompositionItemRepository } from 'src/repositories/composition-item-repository';
// import EquipmentRepository from 'src/repositories/equipment-repository';
// import FinanceControlRepository from 'src/repositories/finance-control-repository';
// import FinanceItemBoundRepository from 'src/repositories/finance-item-bound-repository';
// import FinanceNumberRepository from 'src/repositories/finance-number-repository';
// import FinanceNumberTypeDocumentRepository from 'src/repositories/finance-numberTypeDocument-repository';
// import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
// import LogFinanceRepository from 'src/repositories/log-finance-repository';
// import ServiceOrderRepository from 'src/repositories/service-order-repository';
import { FileService } from 'src/service/file.service';
// import { CompositionItemRepositoryPrisma } from 'src/repositories/prisma/composition-item-repository-prisma';
// import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
// import FinanceControlRepositoryPrisma from 'src/repositories/prisma/finance-control-repository-prisma';
// import FinanceItemBoundRepositoryPrisma from 'src/repositories/prisma/finance-item-bound-repository-prisma';
// import FinanceNumberRepositoryPrisma from 'src/repositories/prisma/finance-number-repository-prisma';
// import FinanceNumberTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-numberTypeDocument-repository-prisma';
// import { FinancePaymentRepositoryPrisma } from 'src/repositories/prisma/finance-payment-repository-prisma';
// import LogFinanceRepositoryPrisma from 'src/repositories/prisma/log-finance-repository-prisma';
// import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
// import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
// import ContractTypeInputRepositoryPrisma from 'src/repositories/prisma/contract-type-input-repository-prisma';
// import FinanceBankTransferRepository from 'src/repositories/finance-bank-transfer-repository';
// import FinanceBankTransferRepositoryPrisma from 'src/repositories/prisma/finance-bank-transfer-repository-prisma';
// import FinanceEmissionItemRepository from 'src/repositories/finance-emissionItem-repository';
// import FinanceEmissionItemRepositoryPrisma from 'src/repositories/prisma/finance-emissionItem-repository-prisma';
// import FinanceEmissionRepository from 'src/repositories/finance-emission-repository';
// import FinanceEmissionRepositoryPrisma from 'src/repositories/prisma/finance-emission-repository-prisma';

@Module({
  imports: [
    // AccountScripCaseModule,
    // TransactionScriptCaseModule,
    // FinancialReportsScriptCaseModule,
    // EmissionScriptCaseModule,
    TenantRepositoriesModule,
  ],
  controllers: [
    FinancialScriptCaseController,
    AccountScriptCaseController,
    TransactionScriptCaseController,
    FinancialReportsScriptCaseController,
    EmissionScriptCaseController,
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
    //   provide: FinanceTypePaymentRepository,
    //   useClass: FinanceTypePaymentRepositoryPrisma,
    // },
    // {
    //   provide: FinanceTributesRepository,
    //   useClass: FinanceTributesRepositoryPrisma,
    // },
    // {
    //   provide: FinanceBankRepository,
    //   useClass: FinanceBankRepositoryPrisma,
    // },
    // {
    //   provide: FinanceBankTransactionRepository,
    //   useClass: FinanceBankTransactionRepositoryPrisma,
    // },
    // {
    //   provide: FinancePaymentViewRepository,
    //   useClass: FinancePaymentViewRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
    // {
    //   provide: FinanceRepository,
    //   useClass: FinanceRepositoryPrisma,
    // },
    // {
    //   provide: ProviderRepository,
    //   useClass: ProviderRepositoryPrisma,
    // },
    // {
    //   provide: BranchRepository,
    //   useClass: BranchRepositoryPrisma,
    // },
    // {
    //   provide: FinanceTypeDocumentRepository,
    //   useClass: FinanceTypeDocumentRepositoryPrisma,
    // },
    // {
    //   provide: FinanceItemRepository,
    //   useClass: FinanceItemRepositoryPrisma,
    // },
    // {
    //   provide: MaterialRepository,
    //   useClass: MaterialRepositoryPrisma,
    // },
    // {
    //   provide: FinanceTypePaymentRepository,
    //   useClass: FinanceTypePaymentRepositoryPrisma,
    // },
    // {
    //   provide: FinancePaymentRepository,
    //   useClass: FinancePaymentRepositoryPrisma,
    // },
    // {
    //   provide: FinanceControlRepository,
    //   useClass: FinanceControlRepositoryPrisma,
    // },
    // {
    //   provide: FinanceNumberRepository,
    //   useClass: FinanceNumberRepositoryPrisma,
    // },
    // {
    //   provide: FinanceNumberTypeDocumentRepository,
    //   useClass: FinanceNumberTypeDocumentRepositoryPrisma,
    // },
    // {
    //   provide: LogFinanceRepository,
    //   useClass: LogFinanceRepositoryPrisma,
    // },
    // {
    //   provide: EquipmentRepository,
    //   useClass: EquipmentRepositoryPrisma,
    // },
    // {
    //   provide: ServiceOrderRepository,
    //   useClass: ServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: CompositionItemRepository,
    //   useClass: CompositionItemRepositoryPrisma,
    // },
    // {
    //   provide: FinanceItemBoundRepository,
    //   useClass: FinanceItemBoundRepositoryPrisma,
    // },
    // {
    //   provide: ContractTypeInputRepository,
    //   useClass: ContractTypeInputRepositoryPrisma,
    // },
    // {
    //   provide: FinanceBankTransferRepository,
    //   useClass: FinanceBankTransferRepositoryPrisma,
    // },
    // {
    //   provide: FinanceEmissionRepository,
    //   useClass: FinanceEmissionRepositoryPrisma,
    // },
    // {
    //   provide: FinanceEmissionItemRepository,
    //   useClass: FinanceEmissionItemRepositoryPrisma,
    // },
    // {
    //   provide: LogFinanceRepository,
    //   useClass: LogFinanceRepositoryPrisma,
    // },
    // {
    //   provide: ContractTypeInputRepository,
    //   useClass: ContractTypeInputRepositoryPrisma,
    // },
  ],
})
export class FinancialScriptCaseModule {}
