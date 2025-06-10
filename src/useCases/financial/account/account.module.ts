// import { Module } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { AccountController } from './account.controller';
// import { FinancePaymentViewRepository } from 'src/repositories/finance-payment-view-repository';
// import { FinancePaymentViewRepositoryPrisma } from 'src/repositories/prisma/finance-payment-view-repository-prisma';
// import { ENVService } from 'src/service/env.service';
// import { FTPService } from 'src/service/ftp.service';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import { LoginRepository } from 'src/repositories/login-repository';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import { UserRepository } from 'src/repositories/user-repository';
// import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
// import { FinancePaymentRepositoryPrisma } from 'src/repositories/prisma/finance-payment-repository-prisma';
// import EmissionRepository from 'src/repositories/emission-repository';
// import EmissionRepositoryPrisma from 'src/repositories/prisma/emission-repository-prisma';
// import financeBankRepository from 'src/repositories/finance-bank-repository';
// import financeBankRepositoryPrisma from 'src/repositories/prisma/finance-bank-repository-prisma';
// import financeBankTransactionRepository from 'src/repositories/financeBankTransaction-repository';
// import FinanceBankTransactionRepositoryPrisma from 'src/repositories/prisma/financeBankTransaction-repository-prisma';
// import financeTaxationRepository from 'src/repositories/financeTaxation-repository';
// import financeTaxationRepositoryPrisma from 'src/repositories/prisma/financeTaxation-repository-prisma';
// import financeEmissionTaxationRepository from 'src/repositories/financeEmissionTaxation-repository';
// import financeEmissionTaxationRepositoryPrisma from 'src/repositories/prisma/financeEmissionTaxation-repository-prisma';
// import financeEmissionItemRepository from 'src/repositories/finance-emissionItem-repository';
// import financeEmissionItemRepositoryPrisma from 'src/repositories/prisma/finance-emissionItem-repository-prisma';
// import financeStatusRepository from 'src/repositories/finance-status-repository';
// import financeStatusRepositoryPrisma from 'src/repositories/prisma/finance-status-repository-prisma';
// import financeTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
// import financeTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-typeDocument-repository-prisma';
// import financeTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
// import financeTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import { BranchRepository } from 'src/repositories/branch-repository';
// import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
// import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
// import ProviderRepository from 'src/repositories/provider-repository';
// import FinanceRepository from 'src/repositories/finance-repository';
// import FinanceRepositoryPrisma from 'src/repositories/prisma/finance-repository-prisma';
// import FinanceNumberTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-numberTypeDocument-repository-prisma';
// import FinanceNumberTypeDocumentRepository from 'src/repositories/finance-numberTypeDocument-repository';
// import FinanceNumberRepository from 'src/repositories/finance-number-repository';
// import FinanceNumberRepositoryPrisma from 'src/repositories/prisma/finance-number-repository-prisma';
// import LogFinanceRepository from 'src/repositories/log-finance-repository';
// import LogFinanceRepositoryPrisma from 'src/repositories/prisma/log-finance-repository-prisma';
// import FinanceControlRepository from 'src/repositories/finance-control-repository';
// import FinanceControlRepositoryPrisma from 'src/repositories/prisma/finance-control-repository-prisma';
// import ServiceOrderRepository from 'src/repositories/service-order-repository';
// import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
// import EquipmentRepository from 'src/repositories/equipment-repository';
// import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
// import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
// import { FinanceItemRepositoryPrisma } from 'src/repositories/prisma/finance-item-repository-prisma';
// import FinanceItemBoundRepository from 'src/repositories/finance-item-bound-repository';
// import FinanceItemBoundRepositoryPrisma from 'src/repositories/prisma/finance-item-bound-repository-prisma';
// import materialRepository from 'src/repositories/material-repository';
// import materialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
// import contractTypeInputRepository from 'src/repositories/contract-type-input-repository';
// import contractTypeInputRepositoryPrisma from 'src/repositories/prisma/contract-type-input-repository-prisma';
// import financeRegisterTributeRepository from 'src/repositories/finance-registerTribute-repository';
// import FinanceRegisterTributeRepositoryPrisma from 'src/repositories/prisma/finance-registerTribute-repository-prisma';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';

// @Module({
//   imports: [],
//   controllers: [AccountController],
//   providers: [
//     JwtService,
//     ENVService,
//     FTPService,
//     {
//       provide: BranchesByUserRepository,
//       useClass: BranchesByUserRepositoryPrisma,
//     },
//     {
//       provide: LoginRepository,
//       useClass: LoginRepositoryPrisma,
//     },
//     {
//       provide: UserRepository,
//       useClass: UserRepositoryPrisma,
//     },
//     {
//       provide: PermissionRepository,
//       useClass: PermissionRepositoryPrisma,
//     },
//     {
//       provide: ModuleRepository,
//       useClass: ModuleRepositoryPrisma,
//     },
//     {
//       provide: FinancePaymentViewRepository,
//       useClass: FinancePaymentViewRepositoryPrisma,
//     },
//     {
//       provide: FinancePaymentRepository,
//       useClass: FinancePaymentRepositoryPrisma,
//     },
//     {
//       provide: EmissionRepository,
//       useClass: EmissionRepositoryPrisma,
//     },
//     {
//       provide: financeBankRepository,
//       useClass: financeBankRepositoryPrisma,
//     },
//     {
//       provide: financeBankTransactionRepository,
//       useClass: FinanceBankTransactionRepositoryPrisma,
//     },
//     {
//       provide: financeTaxationRepository,
//       useClass: financeTaxationRepositoryPrisma,
//     },
//     {
//       provide: financeEmissionTaxationRepository,
//       useClass: financeEmissionTaxationRepositoryPrisma,
//     },
//     {
//       provide: financeEmissionItemRepository,
//       useClass: financeEmissionItemRepositoryPrisma,
//     },
//     {
//       provide: financeStatusRepository,
//       useClass: financeStatusRepositoryPrisma,
//     },
//     {
//       provide: financeTypeDocumentRepository,
//       useClass: financeTypeDocumentRepositoryPrisma,
//     },
//     {
//       provide: financeTypePaymentRepository,
//       useClass: financeTypePaymentRepositoryPrisma,
//     },
//     {
//       provide: BranchRepository,
//       useClass: BranchRepositoryPrisma,
//     },
//     {
//       provide: ProviderRepository,
//       useClass: ProviderRepositoryPrisma,
//     },
//     {
//       provide: FinanceRepository,
//       useClass: FinanceRepositoryPrisma,
//     },
//     {
//       provide: FinanceNumberTypeDocumentRepository,
//       useClass: FinanceNumberTypeDocumentRepositoryPrisma,
//     },
//     {
//       provide: FinanceNumberRepository,
//       useClass: FinanceNumberRepositoryPrisma,
//     },
//     {
//       provide: LogFinanceRepository,
//       useClass: LogFinanceRepositoryPrisma,
//     },
//     {
//       provide: FinanceControlRepository,
//       useClass: FinanceControlRepositoryPrisma,
//     },
//     {
//       provide: ServiceOrderRepository,
//       useClass: ServiceOrderRepositoryPrisma,
//     },
//     {
//       provide: EquipmentRepository,
//       useClass: EquipmentRepositoryPrisma,
//     },
//     {
//       provide: FinanceItemRepository,
//       useClass: FinanceItemRepositoryPrisma,
//     },
//     {
//       provide: FinanceItemBoundRepository,
//       useClass: FinanceItemBoundRepositoryPrisma,
//     },
//     {
//       provide: contractTypeInputRepository,
//       useClass: contractTypeInputRepositoryPrisma,
//     },
//     {
//       provide: materialRepository,
//       useClass: materialRepositoryPrisma,
//     },
//     {
//       provide: financeRegisterTributeRepository,
//       useClass: FinanceRegisterTributeRepositoryPrisma,
//     },
//     {
//       provide: CompanyRepository,
//       useClass: CompanyRepositoryPrisma,
//     },
//   ],
// })
// export class accountModule {}
