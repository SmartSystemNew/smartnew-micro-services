import { Module } from '@nestjs/common';
import { financialReportsModule } from './reports/reports.module';
//import { accountModule } from './account/account.module';
import { AccountController } from './account/account.controller';
import { JwtService } from '@nestjs/jwt';
// import { BranchRepository } from 'src/repositories/branch-repository';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import contractTypeInputRepository from 'src/repositories/contract-type-input-repository';
// import EmissionRepository from 'src/repositories/emission-repository';
// import EquipmentRepository from 'src/repositories/equipment-repository';
// import financeBankRepository from 'src/repositories/finance-bank-repository';
// import FinanceControlRepository from 'src/repositories/finance-control-repository';
// import financeEmissionItemRepository from 'src/repositories/finance-emissionItem-repository';
// import FinanceItemBoundRepository from 'src/repositories/finance-item-bound-repository';
// import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
// import FinanceNumberRepository from 'src/repositories/finance-number-repository';
// import FinanceNumberTypeDocumentRepository from 'src/repositories/finance-numberTypeDocument-repository';
// import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
// import { FinancePaymentViewRepository } from 'src/repositories/finance-payment-view-repository';
// import financeRegisterTributeRepository from 'src/repositories/finance-registerTribute-repository';
// import FinanceRepository from 'src/repositories/finance-repository';
// import financeStatusRepository from 'src/repositories/finance-status-repository';
// import financeTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
// import financeTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
// import financeBankTransactionRepository from 'src/repositories/financeBankTransaction-repository';
// import financeEmissionTaxationRepository from 'src/repositories/financeEmissionTaxation-repository';
// import financeTaxationRepository from 'src/repositories/financeTaxation-repository';
// import LogFinanceRepository from 'src/repositories/log-finance-repository';
// //import { LoginRepository } from 'src/repositories/login-repository';
// import materialRepository from 'src/repositories/material-repository';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
// import contractTypeInputRepositoryPrisma from 'src/repositories/prisma/contract-type-input-repository-prisma';
// import EmissionRepositoryPrisma from 'src/repositories/prisma/emission-repository-prisma';
// import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
// import financeBankRepositoryPrisma from 'src/repositories/prisma/finance-bank-repository-prisma';
// import FinanceControlRepositoryPrisma from 'src/repositories/prisma/finance-control-repository-prisma';
// import financeEmissionItemRepositoryPrisma from 'src/repositories/prisma/finance-emissionItem-repository-prisma';
// import FinanceItemBoundRepositoryPrisma from 'src/repositories/prisma/finance-item-bound-repository-prisma';
// import { FinanceItemRepositoryPrisma } from 'src/repositories/prisma/finance-item-repository-prisma';
// import FinanceNumberRepositoryPrisma from 'src/repositories/prisma/finance-number-repository-prisma';
// import FinanceNumberTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-numberTypeDocument-repository-prisma';
// import { FinancePaymentRepositoryPrisma } from 'src/repositories/prisma/finance-payment-repository-prisma';
// import { FinancePaymentViewRepositoryPrisma } from 'src/repositories/prisma/finance-payment-view-repository-prisma';
// import FinanceRegisterTributeRepositoryPrisma from 'src/repositories/prisma/finance-registerTribute-repository-prisma';
// import FinanceRepositoryPrisma from 'src/repositories/prisma/finance-repository-prisma';
// import financeStatusRepositoryPrisma from 'src/repositories/prisma/finance-status-repository-prisma';
// import financeTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-typeDocument-repository-prisma';
// import financeTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
// import FinanceBankTransactionRepositoryPrisma from 'src/repositories/prisma/financeBankTransaction-repository-prisma';
// import financeEmissionTaxationRepositoryPrisma from 'src/repositories/prisma/financeEmissionTaxation-repository-prisma';
// import financeTaxationRepositoryPrisma from 'src/repositories/prisma/financeTaxation-repository-prisma';
// import LogFinanceRepositoryPrisma from 'src/repositories/prisma/log-finance-repository-prisma';
// //import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
// import materialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
// import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import ProviderRepository from 'src/repositories/provider-repository';
// import ServiceOrderRepository from 'src/repositories/service-order-repository';
// import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { FTPService } from 'src/service/ftp.service';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';
import { CostCenterController } from './cost-center/cost-center.controller';
import { DateService } from 'src/service/data.service';
// import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
// import { DescriptionCostCenterRepositoryPrisma } from 'src/repositories/prisma/description-cost-center-repository-prisma';
// import { CostCenterRepository } from 'src/repositories/cost-center-repository';
// import { CostCenterRepositoryPrisma } from 'src/repositories/prisma/cost-center-repository-prisma';
//import { accountModule } from './account/account.module';
// import { AccountController } from './account/account.controller';
// import { JwtService } from '@nestjs/jwt';
// import { BranchRepository } from 'src/repositories/branch-repository';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import contractTypeInputRepository from 'src/repositories/contract-type-input-repository';
// import EmissionRepository from 'src/repositories/emission-repository';
// import EquipmentRepository from 'src/repositories/equipment-repository';
// import financeBankRepository from 'src/repositories/finance-bank-repository';
// import FinanceControlRepository from 'src/repositories/finance-control-repository';
// import financeEmissionItemRepository from 'src/repositories/finance-emissionItem-repository';
// import FinanceItemBoundRepository from 'src/repositories/finance-item-bound-repository';
// import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
// import FinanceNumberRepository from 'src/repositories/finance-number-repository';
// import FinanceNumberTypeDocumentRepository from 'src/repositories/finance-numberTypeDocument-repository';
// import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
// import { FinancePaymentViewRepository } from 'src/repositories/finance-payment-view-repository';
// import financeRegisterTributeRepository from 'src/repositories/finance-registerTribute-repository';
// import FinanceRepository from 'src/repositories/finance-repository';
// import financeStatusRepository from 'src/repositories/finance-status-repository';
// import financeTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
// import financeTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
// import financeBankTransactionRepository from 'src/repositories/financeBankTransaction-repository';
// import financeEmissionTaxationRepository from 'src/repositories/financeEmissionTaxation-repository';
// import financeTaxationRepository from 'src/repositories/financeTaxation-repository';
// import LogFinanceRepository from 'src/repositories/log-finance-repository';
// //import { LoginRepository } from 'src/repositories/login-repository';
// import materialRepository from 'src/repositories/material-repository';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
// import contractTypeInputRepositoryPrisma from 'src/repositories/prisma/contract-type-input-repository-prisma';
// import EmissionRepositoryPrisma from 'src/repositories/prisma/emission-repository-prisma';
// import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
// import financeBankRepositoryPrisma from 'src/repositories/prisma/finance-bank-repository-prisma';
// import FinanceControlRepositoryPrisma from 'src/repositories/prisma/finance-control-repository-prisma';
// import financeEmissionItemRepositoryPrisma from 'src/repositories/prisma/finance-emissionItem-repository-prisma';
// import FinanceItemBoundRepositoryPrisma from 'src/repositories/prisma/finance-item-bound-repository-prisma';
// import { FinanceItemRepositoryPrisma } from 'src/repositories/prisma/finance-item-repository-prisma';
// import FinanceNumberRepositoryPrisma from 'src/repositories/prisma/finance-number-repository-prisma';
// import FinanceNumberTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-numberTypeDocument-repository-prisma';
// import { FinancePaymentRepositoryPrisma } from 'src/repositories/prisma/finance-payment-repository-prisma';
// import { FinancePaymentViewRepositoryPrisma } from 'src/repositories/prisma/finance-payment-view-repository-prisma';
// import FinanceRegisterTributeRepositoryPrisma from 'src/repositories/prisma/finance-registerTribute-repository-prisma';
// import FinanceRepositoryPrisma from 'src/repositories/prisma/finance-repository-prisma';
// import financeStatusRepositoryPrisma from 'src/repositories/prisma/finance-status-repository-prisma';
// import financeTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-typeDocument-repository-prisma';
// import financeTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
// import FinanceBankTransactionRepositoryPrisma from 'src/repositories/prisma/financeBankTransaction-repository-prisma';
// import financeEmissionTaxationRepositoryPrisma from 'src/repositories/prisma/financeEmissionTaxation-repository-prisma';
// import financeTaxationRepositoryPrisma from 'src/repositories/prisma/financeTaxation-repository-prisma';
// import LogFinanceRepositoryPrisma from 'src/repositories/prisma/log-finance-repository-prisma';
// //import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
// import materialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
// import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import ProviderRepository from 'src/repositories/provider-repository';
// import ServiceOrderRepository from 'src/repositories/service-order-repository';
// import { UserRepository } from 'src/repositories/user-repository';
// import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
// import { DescriptionCostCenterRepositoryPrisma } from 'src/repositories/prisma/description-cost-center-repository-prisma';
// import { CostCenterRepository } from 'src/repositories/cost-center-repository';
// import { CostCenterRepositoryPrisma } from 'src/repositories/prisma/cost-center-repository-prisma';

@Module({
  imports: [
    TenantRepositoriesModule,
    financialReportsModule,
    //accountModule
  ],
  controllers: [AccountController, CostCenterController],
  providers: [
    JwtService,
    ENVService,
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
    //   provide: FinancePaymentViewRepository,
    //   useClass: FinancePaymentViewRepositoryPrisma,
    // },
    // {
    //   provide: FinancePaymentRepository,
    //   useClass: FinancePaymentRepositoryPrisma,
    // },
    // {
    //   provide: EmissionRepository,
    //   useClass: EmissionRepositoryPrisma,
    // },
    // {
    //   provide: financeBankRepository,
    //   useClass: financeBankRepositoryPrisma,
    // },
    // {
    //   provide: financeBankTransactionRepository,
    //   useClass: FinanceBankTransactionRepositoryPrisma,
    // },
    // {
    //   provide: financeTaxationRepository,
    //   useClass: financeTaxationRepositoryPrisma,
    // },
    // {
    //   provide: financeEmissionTaxationRepository,
    //   useClass: financeEmissionTaxationRepositoryPrisma,
    // },
    // {
    //   provide: financeEmissionItemRepository,
    //   useClass: financeEmissionItemRepositoryPrisma,
    // },
    // {
    //   provide: financeStatusRepository,
    //   useClass: financeStatusRepositoryPrisma,
    // },
    // {
    //   provide: financeTypeDocumentRepository,
    //   useClass: financeTypeDocumentRepositoryPrisma,
    // },
    // {
    //   provide: financeTypePaymentRepository,
    //   useClass: financeTypePaymentRepositoryPrisma,
    // },
    // {
    //   provide: BranchRepository,
    //   useClass: BranchRepositoryPrisma,
    // },
    // {
    //   provide: ProviderRepository,
    //   useClass: ProviderRepositoryPrisma,
    // },
    // {
    //   provide: FinanceRepository,
    //   useClass: FinanceRepositoryPrisma,
    // },
    // {
    //   provide: FinanceNumberTypeDocumentRepository,
    //   useClass: FinanceNumberTypeDocumentRepositoryPrisma,
    // },
    // {
    //   provide: FinanceNumberRepository,
    //   useClass: FinanceNumberRepositoryPrisma,
    // },
    // {
    //   provide: LogFinanceRepository,
    //   useClass: LogFinanceRepositoryPrisma,
    // },
    // {
    //   provide: FinanceControlRepository,
    //   useClass: FinanceControlRepositoryPrisma,
    // },
    // {
    //   provide: ServiceOrderRepository,
    //   useClass: ServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: EquipmentRepository,
    //   useClass: EquipmentRepositoryPrisma,
    // },
    // {
    //   provide: FinanceItemRepository,
    //   useClass: FinanceItemRepositoryPrisma,
    // },
    // {
    //   provide: FinanceItemBoundRepository,
    //   useClass: FinanceItemBoundRepositoryPrisma,
    // },
    // {
    //   provide: contractTypeInputRepository,
    //   useClass: contractTypeInputRepositoryPrisma,
    // },
    // {
    //   provide: materialRepository,
    //   useClass: materialRepositoryPrisma,
    // },
    // {
    //   provide: financeRegisterTributeRepository,
    //   useClass: FinanceRegisterTributeRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
    // {
    //   provide: DescriptionCostCenterRepository,
    //   useClass: DescriptionCostCenterRepositoryPrisma,
    // },
    // {
    //   provide: CostCenterRepository,
    //   useClass: CostCenterRepositoryPrisma,
    // },
  ],
})
export class financialModule {}
