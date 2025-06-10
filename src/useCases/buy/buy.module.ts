import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
// import { AttachmentsServiceOrderRepository } from 'src/repositories/attachments-service-order-repository';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import buyConditionAnswerRepository from 'src/repositories/buy-condition-answer-repository';
// import BuyConditionRepository from 'src/repositories/buy-condition-repository';
// import BuyElevationsRepository from 'src/repositories/buy-elevations-repository';
// import BuyItemQuotationReasonRepository from 'src/repositories/buy-item-quotation-reason-repository';
// import buyItemRepository from 'src/repositories/buy-item-repository';
// import BuyPreFinancePaymentRepository from 'src/repositories/buy-pre-finance-payment-repository';
// import buyPreFinanceRepository from 'src/repositories/buy-pre-finance-repository';
// import BuyQuotationDiscountRepository from 'src/repositories/buy-quotation-discount-repository';
// import BuyQuotationItemRepository from 'src/repositories/buy-quotation-item-repository';
// import BuyQuotationRepository from 'src/repositories/buy-quotation-repository';
// import BuyRepository from 'src/repositories/buy-repository';
// import BuyResponsibleQuotationRepository from 'src/repositories/buy-responsible-quotation-repository';
// import FinanceTributesRepository from 'src/repositories/finance-tributes-repository';
// import financeTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
// import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';
// import MaterialRepository from 'src/repositories/material-repository';
// import MaterialStockWithDrawalRepository from 'src/repositories/material-stock-withdrawal-repository';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import AttachmentsServiceOrderRepositoryPrisma from 'src/repositories/prisma/attachments-service-order-repository-prisma';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import buyConditionAnswerRepositoryPrisma from 'src/repositories/prisma/buy-condition-answer-repository-prisma';
// import BuyConditionRepositoryPrisma from 'src/repositories/prisma/buy-condition-repository-prisma';
// import BuyElevationsRepositoryPrisma from 'src/repositories/prisma/buy-elevations-repository-prisma';
// import BuyItemQuotationReasonRepositoryPrisma from 'src/repositories/prisma/buy-item-quotation-reason-repository-prisma';
// import buyItemRepositoryPrisma from 'src/repositories/prisma/buy-item-repository-prisma';
// import BuyPreFinancePaymentRepositoryPrisma from 'src/repositories/prisma/buy-pre-finance-payment-repository-prisma';
// import buyPreFinanceRepositoryPrisma from 'src/repositories/prisma/buy-pre-finance-repository-prisma';
// import BuyQuotationDiscountRepositoryPrisma from 'src/repositories/prisma/buy-quotation-discount-repository-prisma';
// import BuyQuotationItemRepositoryPrisma from 'src/repositories/prisma/buy-quotation-item-repository-prisma';
// import BuyQuotationRepositoryPrisma from 'src/repositories/prisma/buy-quotation-repository-prisma';
// import { BuyRepositoryPrisma } from 'src/repositories/prisma/buy-repository-prisma';
// import BuyResponsibleQuotationRepositoryPrisma from 'src/repositories/prisma/buy-responsible-quotation-repository-prisma';
// import FinanceTributesRepositoryPrisma from 'src/repositories/prisma/finance-tributes-repository-prisma';
// import financeTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
// import MaterialEstoqueRepositoryPrisma from 'src/repositories/prisma/material-estoque-repository-prisma';
// import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
// import MaterialStockWithDrawalRepositoryPrisma from 'src/repositories/prisma/material-stock- withdrawal-repository-prisma';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
// import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
// import StockInventoryRepositoryPrisma from 'src/repositories/prisma/stock-inventory-repository-prisma';
// import StockRepositoryPrisma from 'src/repositories/prisma/stock-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import ProviderRepository from 'src/repositories/provider-repository';
// import ServiceOrderRepository from 'src/repositories/service-order-repository';
// import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
// import StockRepository from 'src/repositories/stock-repository';
// import { UserRepository } from 'src/repositories/user-repository';
// import { AttachmentsServiceOrderRepository } from 'src/repositories/attachments-service-order-repository';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import buyConditionAnswerRepository from 'src/repositories/buy-condition-answer-repository';
// import BuyConditionRepository from 'src/repositories/buy-condition-repository';
// import BuyElevationsRepository from 'src/repositories/buy-elevations-repository';
// import BuyItemQuotationReasonRepository from 'src/repositories/buy-item-quotation-reason-repository';
// import buyItemRepository from 'src/repositories/buy-item-repository';
// import BuyPreFinancePaymentRepository from 'src/repositories/buy-pre-finance-payment-repository';
// import buyPreFinanceRepository from 'src/repositories/buy-pre-finance-repository';
// import BuyQuotationDiscountRepository from 'src/repositories/buy-quotation-discount-repository';
// import BuyQuotationItemRepository from 'src/repositories/buy-quotation-item-repository';
// import BuyQuotationRepository from 'src/repositories/buy-quotation-repository';
// import BuyRepository from 'src/repositories/buy-repository';
// import BuyResponsibleQuotationRepository from 'src/repositories/buy-responsible-quotation-repository';
// import FinanceTributesRepository from 'src/repositories/finance-tributes-repository';
// import financeTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
// import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';
// import MaterialRepository from 'src/repositories/material-repository';
// import MaterialStockWithDrawalRepository from 'src/repositories/material-stock-withdrawal-repository';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import AttachmentsServiceOrderRepositoryPrisma from 'src/repositories/prisma/attachments-service-order-repository-prisma';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import buyConditionAnswerRepositoryPrisma from 'src/repositories/prisma/buy-condition-answer-repository-prisma';
// import BuyConditionRepositoryPrisma from 'src/repositories/prisma/buy-condition-repository-prisma';
// import BuyElevationsRepositoryPrisma from 'src/repositories/prisma/buy-elevations-repository-prisma';
// import BuyItemQuotationReasonRepositoryPrisma from 'src/repositories/prisma/buy-item-quotation-reason-repository-prisma';
// import buyItemRepositoryPrisma from 'src/repositories/prisma/buy-item-repository-prisma';
// import BuyPreFinancePaymentRepositoryPrisma from 'src/repositories/prisma/buy-pre-finance-payment-repository-prisma';
// import buyPreFinanceRepositoryPrisma from 'src/repositories/prisma/buy-pre-finance-repository-prisma';
// import BuyQuotationDiscountRepositoryPrisma from 'src/repositories/prisma/buy-quotation-discount-repository-prisma';
// import BuyQuotationItemRepositoryPrisma from 'src/repositories/prisma/buy-quotation-item-repository-prisma';
// import BuyQuotationRepositoryPrisma from 'src/repositories/prisma/buy-quotation-repository-prisma';
// import { BuyRepositoryPrisma } from 'src/repositories/prisma/buy-repository-prisma';
// import BuyResponsibleQuotationRepositoryPrisma from 'src/repositories/prisma/buy-responsible-quotation-repository-prisma';
// import FinanceTributesRepositoryPrisma from 'src/repositories/prisma/finance-tributes-repository-prisma';
// import financeTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
// import MaterialEstoqueRepositoryPrisma from 'src/repositories/prisma/material-estoque-repository-prisma';
// import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
// import MaterialStockWithDrawalRepositoryPrisma from 'src/repositories/prisma/material-stock- withdrawal-repository-prisma';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
// import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
// import StockInventoryRepositoryPrisma from 'src/repositories/prisma/stock-inventory-repository-prisma';
// import StockRepositoryPrisma from 'src/repositories/prisma/stock-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import ProviderRepository from 'src/repositories/provider-repository';
// import ServiceOrderRepository from 'src/repositories/service-order-repository';
// import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
// import StockRepository from 'src/repositories/stock-repository';
// import { UserRepository } from 'src/repositories/user-repository';
import { DateService } from 'src/service/data.service';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { FTPService } from 'src/service/ftp.service';
import QuotationScriptCaseController from './quotation/quotation.controller';
import WarehouseController from './warehouse/warehouse.controller';
import LiberationController from './liberation/liberation.controller';
// import BuyResponsibleRepository from 'src/repositories/buy-responsible-repository';
// import BuyResponsibleRepositoryPrisma from 'src/repositories/prisma/buy-responsible-repository-prisma';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';
//import { TenantPrismaService } from 'src/service/tenant.prisma.service';
import ReportBuyController from './reports/report-buy.controller';
import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
import MaterialServiceOrderRepositoryPrisma from 'src/repositories/prisma/material-service-order-repository-prisma';
import MaterialCodeRepository from 'src/repositories/material-code-repository';
import MaterialCodeRepositoryPrisma from 'src/repositories/prisma/material-code-repository-prisma';

@Module({
  imports: [TenantRepositoriesModule],
  controllers: [
    QuotationScriptCaseController,
    WarehouseController,
    LiberationController,
    ReportBuyController,
  ],
  providers: [
    PrismaService,
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
    //   provide: ModuleRepository,
    //   useClass: ModuleRepositoryPrisma,
    // },
    // {
    //   provide: BuyQuotationRepository,
    //   useClass: BuyQuotationRepositoryPrisma,
    // },
    // {
    //   provide: BuyElevationsRepository,
    //   useClass: BuyElevationsRepositoryPrisma,
    // },
    // {
    //   provide: BuyRepository,
    //   useClass: BuyRepositoryPrisma,
    // },
    // {
    //   provide: buyItemRepository,
    //   useClass: buyItemRepositoryPrisma,
    // },
    // {
    //   provide: BuyResponsibleQuotationRepository,
    //   useClass: BuyResponsibleQuotationRepositoryPrisma,
    // },
    // {
    //   provide: buyPreFinanceRepository,
    //   useClass: buyPreFinanceRepositoryPrisma,
    // },
    // {
    //   provide: buyConditionAnswerRepository,
    //   useClass: buyConditionAnswerRepositoryPrisma,
    // },
    // {
    //   provide: financeTypePaymentRepository,
    //   useClass: financeTypePaymentRepositoryPrisma,
    // },
    // {
    //   provide: ProviderRepository,
    //   useClass: ProviderRepositoryPrisma,
    // },
    // {
    //   provide: BuyPreFinancePaymentRepository,
    //   useClass: BuyPreFinancePaymentRepositoryPrisma,
    // },
    // {
    //   provide: BuyConditionRepository,
    //   useClass: BuyConditionRepositoryPrisma,
    // },
    // {
    //   provide: BuyQuotationItemRepository,
    //   useClass: BuyQuotationItemRepositoryPrisma,
    // },
    // {
    //   provide: BuyItemQuotationReasonRepository,
    //   useClass: BuyItemQuotationReasonRepositoryPrisma,
    // },
    // {
    //   provide: MaterialEstoqueRepository,
    //   useClass: MaterialEstoqueRepositoryPrisma,
    // },
    // {
    //   provide: MaterialRepository,
    //   useClass: MaterialRepositoryPrisma,
    // },
    // {
    //   provide: BuyQuotationDiscountRepository,
    //   useClass: BuyQuotationDiscountRepositoryPrisma,
    // },
    // {
    //   provide: FinanceTributesRepository,
    //   useClass: FinanceTributesRepositoryPrisma,
    // },
    // {
    //   provide: MaterialStockWithDrawalRepository,
    //   useClass: MaterialStockWithDrawalRepositoryPrisma,
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
    //   provide: ServiceOrderRepository,
    //   useClass: ServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: AttachmentsServiceOrderRepository,
    //   useClass: AttachmentsServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: BuyResponsibleRepository,
    //   useClass: BuyResponsibleRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
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
    //   provide: ModuleRepository,
    //   useClass: ModuleRepositoryPrisma,
    // },
    // {
    //   provide: BuyQuotationRepository,
    //   useClass: BuyQuotationRepositoryPrisma,
    // },
    // {
    //   provide: BuyElevationsRepository,
    //   useClass: BuyElevationsRepositoryPrisma,
    // },
    // {
    //   provide: BuyRepository,
    //   useClass: BuyRepositoryPrisma,
    // },
    // {
    //   provide: buyItemRepository,
    //   useClass: buyItemRepositoryPrisma,
    // },
    // {
    //   provide: BuyResponsibleQuotationRepository,
    //   useClass: BuyResponsibleQuotationRepositoryPrisma,
    // },
    // {
    //   provide: buyPreFinanceRepository,
    //   useClass: buyPreFinanceRepositoryPrisma,
    // },
    // {
    //   provide: buyConditionAnswerRepository,
    //   useClass: buyConditionAnswerRepositoryPrisma,
    // },
    // {
    //   provide: financeTypePaymentRepository,
    //   useClass: financeTypePaymentRepositoryPrisma,
    // },
    // {
    //   provide: ProviderRepository,
    //   useClass: ProviderRepositoryPrisma,
    // },
    // {
    //   provide: BuyPreFinancePaymentRepository,
    //   useClass: BuyPreFinancePaymentRepositoryPrisma,
    // },
    // {
    //   provide: BuyConditionRepository,
    //   useClass: BuyConditionRepositoryPrisma,
    // },
    // {
    //   provide: BuyQuotationItemRepository,
    //   useClass: BuyQuotationItemRepositoryPrisma,
    // },
    // {
    //   provide: BuyItemQuotationReasonRepository,
    //   useClass: BuyItemQuotationReasonRepositoryPrisma,
    // },
    // {
    //   provide: MaterialEstoqueRepository,
    //   useClass: MaterialEstoqueRepositoryPrisma,
    // },
    // {
    //   provide: MaterialRepository,
    //   useClass: MaterialRepositoryPrisma,
    // },
    // {
    //   provide: BuyQuotationDiscountRepository,
    //   useClass: BuyQuotationDiscountRepositoryPrisma,
    // },
    // {
    //   provide: FinanceTributesRepository,
    //   useClass: FinanceTributesRepositoryPrisma,
    // },
    // {
    //   provide: MaterialStockWithDrawalRepository,
    //   useClass: MaterialStockWithDrawalRepositoryPrisma,
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
    //   provide: ServiceOrderRepository,
    //   useClass: ServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: AttachmentsServiceOrderRepository,
    //   useClass: AttachmentsServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: BuyResponsibleRepository,
    //   useClass: BuyResponsibleRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
  ],
})
export class BuyModule {}
