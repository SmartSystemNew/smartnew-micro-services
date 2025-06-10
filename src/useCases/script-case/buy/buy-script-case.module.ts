import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { BranchRepository } from 'src/repositories/branch-repository';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import BuyApprobationRepository from 'src/repositories/buy-approbation-repository';
// import BuyConditionAnswerRepository from 'src/repositories/buy-condition-answer-repository';
// import BuyConditionRepository from 'src/repositories/buy-condition-repository';
// import BuyConfigurationRepository from 'src/repositories/buy-configuration-repository';
// import BuyControlQuotationRepository from 'src/repositories/buy-control-quotation-repository';
// import BuyElevationsRepository from 'src/repositories/buy-elevations-repository';
// import BuyItemRepository from 'src/repositories/buy-item-repository';
// import BuyPreFinancePaymentRepository from 'src/repositories/buy-pre-finance-payment-repository';
// import BuyPreFinanceRepository from 'src/repositories/buy-pre-finance-repository';
// import BuyPriorityRepository from 'src/repositories/buy-priority-repository';
// import BuyQuotationItemRepository from 'src/repositories/buy-quotation-item-repository';
// import BuyQuotationRepository from 'src/repositories/buy-quotation-repository';
// import BuyQuotationSelectedRepository from 'src/repositories/buy-quotation-selected-repository';
// import BuyRepository from 'src/repositories/buy-repository';
// import BuyRequestFaultRepository from 'src/repositories/buy-request-fault-repository';
// import BuyRequestItemRepository from 'src/repositories/buy-request-item-repository';
// import BuyRequestRepository from 'src/repositories/buy-request-repository';
// import BuyRequestStatusRepository from 'src/repositories/buy-request-status-repository';
// import BuyResponsibleQuotationRepository from 'src/repositories/buy-responsible-quotation-repository';
// import BuyStatusRepository from 'src/repositories/buy-status-repository';
// import { CompositionItemRepository } from 'src/repositories/composition-item-repository';
// import ElevationRepository from 'src/repositories/elevation-repository';
// import EquipmentRepository from 'src/repositories/equipment-repository';
// import FinanceControlRepository from 'src/repositories/finance-control-repository';
// import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
// import FinanceNumberRepository from 'src/repositories/finance-number-repository';
// import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
// import FinanceRepository from 'src/repositories/finance-repository';
// import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
// import LogFinanceRepository from 'src/repositories/log-finance-repository';
// import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';
// import MaterialRepository from 'src/repositories/material-repository';
// import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import BuyApprobationRepositoryPrisma from 'src/repositories/prisma/buy-approbation-repository-prisma';
// import BuyConditionAnswerRepositoryPrisma from 'src/repositories/prisma/buy-condition-answer-repository-prisma';
// import BuyConditionRepositoryPrisma from 'src/repositories/prisma/buy-condition-repository-prisma';
// import BuyConfigurationRepositoryPrisma from 'src/repositories/prisma/buy-configuration-repository-prisma';
// import BuyControlQuotationRepositoryPrisma from 'src/repositories/prisma/buy-control-quotation-repository-prisma';
// import BuyElevationsRepositoryPrisma from 'src/repositories/prisma/buy-elevations-repository-prisma';
// import BuyItemRepositoryPrisma from 'src/repositories/prisma/buy-item-repository-prisma';
// import BuyPreFinancePaymentRepositoryPrisma from 'src/repositories/prisma/buy-pre-finance-payment-repository-prisma';
// import BuyPreFinanceRepositoryPrisma from 'src/repositories/prisma/buy-pre-finance-repository-prisma';
// import BuyPriorityRepositoryPrisma from 'src/repositories/prisma/buy-priority-repository-prisma';
// import BuyQuotationItemRepositoryPrisma from 'src/repositories/prisma/buy-quotation-item-repository-prisma';
// import BuyQuotationRepositoryPrisma from 'src/repositories/prisma/buy-quotation-repository-prisma';
// import BuyQuotationSelectedRepositoryPrisma from 'src/repositories/prisma/buy-quotation-selected-repository-prisma';
// import { BuyRepositoryPrisma } from 'src/repositories/prisma/buy-repository-prisma';
// import BuyRequestFaultRepositoryPrisma from 'src/repositories/prisma/buy-request-fault-repository-prisma';
// import BuyRequestItemRepositoryPrisma from 'src/repositories/prisma/buy-request-item-repository-prisma';
// import BuyRequestRepositoryPrisma from 'src/repositories/prisma/buy-request-repository-prisma';
// import BuyRequestStatusRepositoryPrisma from 'src/repositories/prisma/buy-request-status-repository-prisma';
// import BuyResponsibleQuotationRepositoryPrisma from 'src/repositories/prisma/buy-responsible-quotation-repository-prisma';
// import BuyStatusRepositoryPrisma from 'src/repositories/prisma/buy-status-repository-prisma';
// import { CompositionItemRepositoryPrisma } from 'src/repositories/prisma/composition-item-repository-prisma';
// import ElevationRepositoryPrisma from 'src/repositories/prisma/elevation-repository-prisma';
// import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
// import FinanceControlRepositoryPrisma from 'src/repositories/prisma/finance-control-repository-prisma';
// import { FinanceItemRepositoryPrisma } from 'src/repositories/prisma/finance-item-repository-prisma';
// import FinanceNumberRepositoryPrisma from 'src/repositories/prisma/finance-number-repository-prisma';
// import { FinancePaymentRepositoryPrisma } from 'src/repositories/prisma/finance-payment-repository-prisma';
// import FinanceRepositoryPrisma from 'src/repositories/prisma/finance-repository-prisma';
// import FinanceTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
// import LogFinanceRepositoryPrisma from 'src/repositories/prisma/log-finance-repository-prisma';
// import MaterialEstoqueRepositoryPrisma from 'src/repositories/prisma/material-estoque-repository-prisma';
// import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
// import MaterialServiceOrderRepositoryPrisma from 'src/repositories/prisma/material-service-order-repository-prisma';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import ProviderBankRepositoryPrisma from 'src/repositories/prisma/provider-bank-repository-prisma';
// import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
// import SectorExecutingRepositoryPrisma from 'src/repositories/prisma/sector-executing-repository-prisma';
// import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
// import StatusServiceOrderRepositoryPrisma from 'src/repositories/prisma/status-service-order-repository-prisma';
// import StockInventoryRepositoryPrisma from 'src/repositories/prisma/stock-inventory-repository-prisma';
// import StockRepositoryPrisma from 'src/repositories/prisma/stock-repository-prisma';
// import TypeMaintenanceRepositoryPrisma from 'src/repositories/prisma/type-maintenance-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import ProviderBankRepository from 'src/repositories/provider-bank-repository';
// import ProviderRepository from 'src/repositories/provider-repository';
// import { SectorExecutingRepository } from 'src/repositories/sector-executing-repository';
// import ServiceOrderRepository from 'src/repositories/service-order-repository';
// import { StatusServiceOrderRepository } from 'src/repositories/status-service-order-repository';
// import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
// import StockRepository from 'src/repositories/stock-repository';
// import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
// import { UserRepository } from 'src/repositories/user-repository';
import { DateService } from 'src/service/data.service';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { FTPService } from 'src/service/ftp.service';
import BuyApprobationController from './approbation/approbation-script-case.controller';
import BuyController from './buy-script-case.controller';
import ControlQuotationController from './control-quotation/control-quotation-script-case.controller';
import BuyElevationsController from './elevations/elevations-buy-scriptcase.controller';
// import MaterialCodeRepository from 'src/repositories/material-code-repository';
// import MaterialCodeRepositoryPrisma from 'src/repositories/prisma/material-code-repository-prisma';
import QuotationScriptCaseController from './quotation/quotation-script-case.controller';
import ReportBuyScriptCaseController from './report/report-buy-script-case.controller';
import RequestScriptCaseController from './request/request-script-case.controller';
import WarehouseBuyScriptCaseController from './warehouse/warehouse-buy-scriptcase.controller';
// import BuyResponsibleRepository from 'src/repositories/buy-responsible-repository';
// import BuyResponsibleRepositoryPrisma from 'src/repositories/prisma/buy-responsible-repository-prisma';
// import BuyRequestProviderRepository from 'src/repositories/buy-request-provider-repository';
// import BuyRequestProviderRepositoryPrisma from 'src/repositories/prisma/buy-request-provider-repository-prisma';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';

@Module({
  imports: [TenantRepositoriesModule],
  controllers: [
    ControlQuotationController,
    QuotationScriptCaseController,
    BuyApprobationController,
    RequestScriptCaseController,
    ReportBuyScriptCaseController,
    BuyElevationsController,
    BuyController,
    WarehouseBuyScriptCaseController,
  ],
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
    //   provide: BuyPriorityRepository,
    //   useClass: BuyPriorityRepositoryPrisma,
    // },
    // {
    //   provide: BuyRepository,
    //   useClass: BuyRepositoryPrisma,
    // },
    // {
    //   provide: BuyItemRepository,
    //   useClass: BuyItemRepositoryPrisma,
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
    //   provide: MaterialRepository,
    //   useClass: MaterialRepositoryPrisma,
    // },
    // {
    //   provide: CompositionItemRepository,
    //   useClass: CompositionItemRepositoryPrisma,
    // },
    // {
    //   provide: BuyStatusRepository,
    //   useClass: BuyStatusRepositoryPrisma,
    // },
    // {
    //   provide: BuyResponsibleQuotationRepository,
    //   useClass: BuyResponsibleQuotationRepositoryPrisma,
    // },
    // {
    //   provide: BuyQuotationRepository,
    //   useClass: BuyQuotationRepositoryPrisma,
    // },
    // {
    //   provide: ProviderRepository,
    //   useClass: ProviderRepositoryPrisma,
    // },
    // {
    //   provide: BuyConditionRepository,
    //   useClass: BuyConditionRepositoryPrisma,
    // },
    // {
    //   provide: BuyPreFinanceRepository,
    //   useClass: BuyPreFinanceRepositoryPrisma,
    // },
    // {
    //   provide: BuyConditionAnswerRepository,
    //   useClass: BuyConditionAnswerRepositoryPrisma,
    // },
    // {
    //   provide: BuyPreFinancePaymentRepository,
    //   useClass: BuyPreFinancePaymentRepositoryPrisma,
    // },
    // {
    //   provide: FinanceTypePaymentRepository,
    //   useClass: FinanceTypePaymentRepositoryPrisma,
    // },
    // {
    //   provide: BuyQuotationSelectedRepository,
    //   useClass: BuyQuotationSelectedRepositoryPrisma,
    // },
    // {
    //   provide: BuyQuotationItemRepository,
    //   useClass: BuyQuotationItemRepositoryPrisma,
    // },
    // {
    //   provide: ElevationRepository,
    //   useClass: ElevationRepositoryPrisma,
    // },
    // {
    //   provide: BuyApprobationRepository,
    //   useClass: BuyApprobationRepositoryPrisma,
    // },
    // {
    //   provide: ModuleRepository,
    //   useClass: ModuleRepositoryPrisma,
    // },
    // {
    //   provide: FinanceRepository,
    //   useClass: FinanceRepositoryPrisma,
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
    //   provide: FinanceNumberRepository,
    //   useClass: FinanceNumberRepositoryPrisma,
    // },
    // {
    //   provide: BuyPreFinancePaymentRepository,
    //   useClass: BuyPreFinancePaymentRepositoryPrisma,
    // },
    // {
    //   provide: BuyRequestRepository,
    //   useClass: BuyRequestRepositoryPrisma,
    // },
    // {
    //   provide: ProviderBankRepository,
    //   useClass: ProviderBankRepositoryPrisma,
    // },
    // {
    //   provide: BuyRequestItemRepository,
    //   useClass: BuyRequestItemRepositoryPrisma,
    // },
    // {
    //   provide: BuyRequestStatusRepository,
    //   useClass: BuyRequestStatusRepositoryPrisma,
    // },
    // {
    //   provide: FinanceItemRepository,
    //   useClass: FinanceItemRepositoryPrisma,
    // },
    // {
    //   provide: BuyRequestFaultRepository,
    //   useClass: BuyRequestFaultRepositoryPrisma,
    // },
    // {
    //   provide: StockRepository,
    //   useClass: StockRepositoryPrisma,
    // },
    // {
    //   provide: StockInventoryRepository,
    //   useClass: StockInventoryRepositoryPrisma,
    // },
    // {
    //   provide: MaterialServiceOrderRepository,
    //   useClass: MaterialServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: TypeMaintenanceRepository,
    //   useClass: TypeMaintenanceRepositoryPrisma,
    // },
    // {
    //   provide: StatusServiceOrderRepository,
    //   useClass: StatusServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: SectorExecutingRepository,
    //   useClass: SectorExecutingRepositoryPrisma,
    // },
    // {
    //   provide: FinancePaymentRepository,
    //   useClass: FinancePaymentRepositoryPrisma,
    // },
    // {
    //   provide: BuyConfigurationRepository,
    //   useClass: BuyConfigurationRepositoryPrisma,
    // },
    // {
    //   provide: StockInventoryRepository,
    //   useClass: StockInventoryRepositoryPrisma,
    // },
    // {
    //   provide: BuyControlQuotationRepository,
    //   useClass: BuyControlQuotationRepositoryPrisma,
    // },
    // {
    //   provide: BuyElevationsRepository,
    //   useClass: BuyElevationsRepositoryPrisma,
    // },
    // {
    //   provide: BranchRepository,
    //   useClass: BranchRepositoryPrisma,
    // },
    // {
    //   provide: MaterialEstoqueRepository,
    //   useClass: MaterialEstoqueRepositoryPrisma,
    // },
    // {
    //   provide: MaterialCodeRepository,
    //   useClass: MaterialCodeRepositoryPrisma,
    // },
    // {
    //   provide: BuyResponsibleRepository,
    //   useClass: BuyResponsibleRepositoryPrisma,
    // },
    // {
    //   provide: BuyRequestProviderRepository,
    //   useClass: BuyRequestProviderRepositoryPrisma,
    // },
    // {
    //   provide: ServiceOrderRepository,
    //   useClass: ServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
  ],
})
export class BuyScriptCaseModule {}
