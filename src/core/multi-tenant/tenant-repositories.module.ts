import {
  Module,
  //Scope
} from '@nestjs/common';
//import { TokenProvider } from 'src/models/TokenProvider';
import { TenantPrismaService } from 'src/service/tenant.prisma.service';
import { createTenantRepositoryProvider } from './tenant-repo.factory';
import { LoginRepositoryPrisma } from 'src/repositories/prisma/login-repository-prisma';
import { PrismaService } from 'src/database/prisma.service';
import { ENVService } from 'src/service/env.service';
import { LoginRepository } from 'src/repositories/login-repository';
import { CompanyRepository } from 'src/repositories/company-repository';
import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
import { UserRepository } from 'src/repositories/user-repository';
import { BranchRepository } from 'src/repositories/branch-repository';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { ModuleRepository } from 'src/repositories/module-repository';
import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
import BuyApprobationRepository from 'src/repositories/buy-approbation-repository';
import BuyConditionAnswerRepository from 'src/repositories/buy-condition-answer-repository';
import BuyConditionRepository from 'src/repositories/buy-condition-repository';
import BuyConfigurationRepository from 'src/repositories/buy-configuration-repository';
import BuyControlQuotationRepository from 'src/repositories/buy-control-quotation-repository';
import BuyElevationsRepository from 'src/repositories/buy-elevations-repository';
import BuyItemQuotationReasonRepository from 'src/repositories/buy-item-quotation-reason-repository';
import BuyItemRepository from 'src/repositories/buy-item-repository';
import { BuyNumberFiscalRepository } from 'src/repositories/buy-number-fiscal-repository';
import BuyPreFinancePaymentRepository from 'src/repositories/buy-pre-finance-payment-repository';
import BuyPreFinanceRepository from 'src/repositories/buy-pre-finance-repository';
import BuyPriorityRepository from 'src/repositories/buy-priority-repository';
import BuyQuotationDiscountRepository from 'src/repositories/buy-quotation-discount-repository';
import BuyQuotationItemRepository from 'src/repositories/buy-quotation-item-repository';
import BuyQuotationRepository from 'src/repositories/buy-quotation-repository';
import BuyQuotationSelectedRepository from 'src/repositories/buy-quotation-selected-repository';
import BuyRepository from 'src/repositories/buy-repository';
import BuyRequestFaultRepository from 'src/repositories/buy-request-fault-repository';
import BuyRequestItemRepository from 'src/repositories/buy-request-item-repository';
import BuyRequestProviderRepository from 'src/repositories/buy-request-provider-repository';
import BuyRequestRepository from 'src/repositories/buy-request-repository';
import BuyRequestStatusRepository from 'src/repositories/buy-request-status-repository';
import BuyResponsibleQuotationRepository from 'src/repositories/buy-responsible-quotation-repository';
import BuyResponsibleRepository from 'src/repositories/buy-responsible-repository';
import { CheckListItemRepository } from 'src/repositories/checklist-item-repository';
import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
import { CheckListRepository } from 'src/repositories/checklist-repository';
import { CheckListStatusActionRepository } from 'src/repositories/checklist-status-action-repository';
import { CheckListStatusRepository } from 'src/repositories/checklist-status-repository';
import { CheckListTaskRepository } from 'src/repositories/checklist-task-repository';
import ClassificationServiceOrderRepository from 'src/repositories/classification-service-order-repository';
import ContractTypeInputRepository from 'src/repositories/contract-type-input-repository';
import { CostCenterRepository } from 'src/repositories/cost-center-repository';
import { DescriptionCostCenterRepository } from 'src/repositories/description-cost-center-repository';
import EquipmentRepository from 'src/repositories/equipment-repository';
import { FamilyRepository } from 'src/repositories/family-repository';
import FinanceControlRepository from 'src/repositories/finance-control-repository';
import { FinanceItemRepository } from 'src/repositories/finance-item-repository';
import FinanceNumberRepository from 'src/repositories/finance-number-repository';
import FinanceNumberTypeDocumentRepository from 'src/repositories/finance-numberTypeDocument-repository';
import { FinancePaymentRepository } from 'src/repositories/finance-payment-repository';
import FinanceRepository from 'src/repositories/finance-repository';
import FinanceTributesRepository from 'src/repositories/finance-tributes-repository';
import FinanceTypeDocumentRepository from 'src/repositories/finance-typeDocument-repository';
import FinanceTypePaymentRepository from 'src/repositories/finance-typePayment-repository';
import LocationRepository from 'src/repositories/location-repository';
import LogFinanceRepository from 'src/repositories/log-finance-repository';
import MaterialCodeRepository from 'src/repositories/material-code-repository';
import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';
import MaterialRepository from 'src/repositories/material-repository';
import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
import PriorityServiceOrderRepository from 'src/repositories/priority-service-order-repository';
import BuyApprobationRepositoryPrisma from 'src/repositories/prisma/buy-approbation-repository-prisma';
import BuyConditionAnswerRepositoryPrisma from 'src/repositories/prisma/buy-condition-answer-repository-prisma';
import BuyConditionRepositoryPrisma from 'src/repositories/prisma/buy-condition-repository-prisma';
import BuyConfigurationRepositoryPrisma from 'src/repositories/prisma/buy-configuration-repository-prisma';
import BuyControlQuotationRepositoryPrisma from 'src/repositories/prisma/buy-control-quotation-repository-prisma';
import BuyElevationsRepositoryPrisma from 'src/repositories/prisma/buy-elevations-repository-prisma';
import BuyItemQuotationReasonRepositoryPrisma from 'src/repositories/prisma/buy-item-quotation-reason-repository-prisma';
import BuyItemRepositoryPrisma from 'src/repositories/prisma/buy-item-repository-prisma';
import { BuyNumberFiscalRepositoryPrisma } from 'src/repositories/prisma/buy-number-fiscal-repository-prisma';
import BuyPreFinancePaymentRepositoryPrisma from 'src/repositories/prisma/buy-pre-finance-payment-repository-prisma';
import BuyPreFinanceRepositoryPrisma from 'src/repositories/prisma/buy-pre-finance-repository-prisma';
import BuyPriorityRepositoryPrisma from 'src/repositories/prisma/buy-priority-repository-prisma';
import BuyQuotationDiscountRepositoryPrisma from 'src/repositories/prisma/buy-quotation-discount-repository-prisma';
import BuyQuotationItemRepositoryPrisma from 'src/repositories/prisma/buy-quotation-item-repository-prisma';
import BuyQuotationRepositoryPrisma from 'src/repositories/prisma/buy-quotation-repository-prisma';
import BuyQuotationSelectedRepositoryPrisma from 'src/repositories/prisma/buy-quotation-selected-repository-prisma';
import { BuyRepositoryPrisma } from 'src/repositories/prisma/buy-repository-prisma';
import BuyRequestFaultRepositoryPrisma from 'src/repositories/prisma/buy-request-fault-repository-prisma';
import BuyRequestItemRepositoryPrisma from 'src/repositories/prisma/buy-request-item-repository-prisma';
import BuyRequestProviderRepositoryPrisma from 'src/repositories/prisma/buy-request-provider-repository-prisma';
import BuyRequestRepositoryPrisma from 'src/repositories/prisma/buy-request-repository-prisma';
import BuyRequestStatusRepositoryPrisma from 'src/repositories/prisma/buy-request-status-repository-prisma';
import BuyResponsibleQuotationRepositoryPrisma from 'src/repositories/prisma/buy-responsible-quotation-repository-prisma';
import BuyResponsibleRepositoryPrisma from 'src/repositories/prisma/buy-responsible-repository-prisma';
import { CheckListItemRepositoryPrisma } from 'src/repositories/prisma/checklist-item-repository-prisma';
import { CheckListPeriodRepositoryPrisma } from 'src/repositories/prisma/checklist-period-repository-prisma';
import { CheckListRepositoryPrisma } from 'src/repositories/prisma/checklist-repository-prisma';
import { CheckListStatusActionRepositoryPrisma } from 'src/repositories/prisma/checklist-status-action-repository-prisma';
import { CheckListStatusRepositoryPrisma } from 'src/repositories/prisma/checklist-status-repository-prisma';
import { CheckListTaskRepositoryPrisma } from 'src/repositories/prisma/checklist-task-repository-prisma';
import ClassificationServiceOrderRepositoryPrisma from 'src/repositories/prisma/classification-service-order-repository-prisma';
import ContractTypeInputRepositoryPrisma from 'src/repositories/prisma/contract-type-input-repository-prisma';
import { CostCenterRepositoryPrisma } from 'src/repositories/prisma/cost-center-repository-prisma';
import { DescriptionCostCenterRepositoryPrisma } from 'src/repositories/prisma/description-cost-center-repository-prisma';
import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
import { FamilyRepositoryPrisma } from 'src/repositories/prisma/family-repository-prisma';
import FinanceControlRepositoryPrisma from 'src/repositories/prisma/finance-control-repository-prisma';
import { FinanceItemRepositoryPrisma } from 'src/repositories/prisma/finance-item-repository-prisma';
import FinanceNumberRepositoryPrisma from 'src/repositories/prisma/finance-number-repository-prisma';
import FinanceNumberTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-numberTypeDocument-repository-prisma';
import { FinancePaymentRepositoryPrisma } from 'src/repositories/prisma/finance-payment-repository-prisma';
import FinanceRepositoryPrisma from 'src/repositories/prisma/finance-repository-prisma';
import FinanceTributesRepositoryPrisma from 'src/repositories/prisma/finance-tributes-repository-prisma';
import FinanceTypeDocumentRepositoryPrisma from 'src/repositories/prisma/finance-typeDocument-repository-prisma';
import FinanceTypePaymentRepositoryPrisma from 'src/repositories/prisma/finance-typePayment-repository-prisma';
import LocationRepositoryPrisma from 'src/repositories/prisma/location-repository-prisma';
import LogFinanceRepositoryPrisma from 'src/repositories/prisma/log-finance-repository-prisma';
import MaterialCodeRepositoryPrisma from 'src/repositories/prisma/material-code-repository-prisma';
import MaterialEstoqueRepositoryPrisma from 'src/repositories/prisma/material-estoque-repository-prisma';
import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
import MaterialServiceOrderRepositoryPrisma from 'src/repositories/prisma/material-service-order-repository-prisma';
import PriorityServiceOrderRepositoryPrisma from 'src/repositories/prisma/priority-service-order-repository-prisma';
import ProviderRepositoryPrisma from 'src/repositories/prisma/provider-repository-prisma';
import SectorExecutingRepositoryPrisma from 'src/repositories/prisma/sector-executing-repository-prisma';
import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
import SmartChecklistRepositoryPrisma from 'src/repositories/prisma/smart-checklist-repository-prisma';
import StatusServiceOrderRepositoryPrisma from 'src/repositories/prisma/status-service-order-repository-prisma';
import StockInventoryRepositoryPrisma from 'src/repositories/prisma/stock-inventory-repository-prisma';
import StockRepositoryPrisma from 'src/repositories/prisma/stock-repository-prisma';
import TaskPlanningMaintenanceRepositoryPrisma from 'src/repositories/prisma/task-planning-maintenance-repository-prisma';
import TaskRepositoryPrisma from 'src/repositories/prisma/task-repository-prisma';
import TypeMaintenanceRepositoryPrisma from 'src/repositories/prisma/type-maintenance-repository-prisma';
import ProviderRepository from 'src/repositories/provider-repository';
import { SectorExecutingRepository } from 'src/repositories/sector-executing-repository';
import ServiceOrderRepository from 'src/repositories/service-order-repository';
import SmartChecklistRepository from 'src/repositories/smart-checklist-repository';
import { StatusServiceOrderRepository } from 'src/repositories/status-service-order-repository';
import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
import StockRepository from 'src/repositories/stock-repository';
import TaskPlanningMaintenanceRepository from 'src/repositories/task-planning-maintenance-repository';
import TaskRepository from 'src/repositories/task-repository';
import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
import { ComponentsRepository } from 'src/repositories/components-repository';
import { DescriptionCostServiceOrderRepository } from 'src/repositories/description-cost-service-order-repository';
import { EmployeeRepository } from 'src/repositories/employee-repository';
import { EquipmentComponentRepository } from 'src/repositories/equipment-component-repository';
import { EquipmentTypeRepository } from 'src/repositories/equipment-type-repository';
import { FailureActionRepository } from 'src/repositories/failure-action-repository';
import { FailureCauseRepository } from 'src/repositories/failure-cause-repository';
import { FailureSymptomsRepository } from 'src/repositories/failure-symptoms-repository';
import MaintenanceRequesterRepository from 'src/repositories/maintenance-requester-repository';
import ManagerCompanyRepository from 'src/repositories/manager-company-repository';
import { MenuRepository } from 'src/repositories/menu-repository';
import { SubGroupRepository } from 'src/repositories/subgroup-repository';
import ComponentsRepositoryPrisma from 'src/repositories/prisma/components-repository-prisma';
import DescriptionCostServiceOrderRepositoryPrisma from 'src/repositories/prisma/description-cost-service-order-repository-prisma';
import EmployeeRepositoryPrisma from 'src/repositories/prisma/employees-repository-prisma';
import EquipmentComponentRepositoryPrisma from 'src/repositories/prisma/equipment-component-repository-prisma';
import EquipmentTypeRepositoryPrisma from 'src/repositories/prisma/equipment-type-repository-prisma';
import FailureActionRepositoryPrisma from 'src/repositories/prisma/failure-action-repository-prisma';
import FailureCauseRepositoryPrisma from 'src/repositories/prisma/failure-cause-repository-prisma';
import FailureSymptomsRepositoryPrisma from 'src/repositories/prisma/failure-symptoms-repository-prisma';
import MaintenanceRequesterRepositoryPrisma from 'src/repositories/prisma/maintenance-requester-repository-prisma';
import ManagerCompanyRepositoryPrisma from 'src/repositories/prisma/manager-company-repository-prisma';
import { MenuRepositoryPrisma } from 'src/repositories/prisma/menu-repository-prisma';
import SubGroupRepositoryPrisma from 'src/repositories/prisma/subgroup-repository-prisma';
import { AttachmentsServiceOrderRepository } from 'src/repositories/attachments-service-order-repository';
import AttachmentsServiceOrderRepositoryPrisma from 'src/repositories/prisma/attachments-service-order-repository-prisma';
import MaterialStockWithDrawalRepository from 'src/repositories/material-stock-withdrawal-repository';
import MaterialStockWithDrawalRepositoryPrisma from 'src/repositories/prisma/material-stock- withdrawal-repository-prisma';
import { FinancePaymentViewRepository } from 'src/repositories/finance-payment-view-repository';
import { FinancePaymentViewRepositoryPrisma } from 'src/repositories/prisma/finance-payment-view-repository-prisma';
import EmissionRepository from 'src/repositories/emission-repository';
import EmissionRepositoryPrisma from 'src/repositories/prisma/emission-repository-prisma';
import FinanceBankRepository from 'src/repositories/finance-bank-repository';
import FinanceBankRepositoryPrisma from 'src/repositories/prisma/finance-bank-repository-prisma';
import FinanceBankTransactionRepository from 'src/repositories/financeBankTransaction-repository';
import FinanceBankTransactionRepositoryPrisma from 'src/repositories/prisma/financeBankTransaction-repository-prisma';
import FinanceTaxationRepository from 'src/repositories/financeTaxation-repository';
import FinanceTaxationRepositoryPrisma from 'src/repositories/prisma/financeTaxation-repository-prisma';
import FinanceEmissionTaxationRepository from 'src/repositories/financeEmissionTaxation-repository';
import FinanceEmissionTaxationRepositoryPrisma from 'src/repositories/prisma/financeEmissionTaxation-repository-prisma';
import FinanceEmissionItemRepository from 'src/repositories/finance-emissionItem-repository';
import FinanceEmissionItemRepositoryPrisma from 'src/repositories/prisma/finance-emissionItem-repository-prisma';
import FinanceStatusRepository from 'src/repositories/finance-status-repository';
import FinanceStatusRepositoryPrisma from 'src/repositories/prisma/finance-status-repository-prisma';
import FinanceItemBoundRepository from 'src/repositories/finance-item-bound-repository';
import FinanceItemBoundRepositoryPrisma from 'src/repositories/prisma/finance-item-bound-repository-prisma';
import FinanceRegisterTributeRepository from 'src/repositories/finance-registerTribute-repository';
import FinanceRegisterTributeRepositoryPrisma from 'src/repositories/prisma/finance-registerTribute-repository-prisma';
import FuellingTrainRepository from 'src/repositories/fuelling-train-repository';
import FuellingTrainRepositoryPrisma from 'src/repositories/prisma/fuelling-train-repository-prisma';
import FuellingTrainCompartmentRepository from 'src/repositories/fuelling-train-compartment-repository';
import FuellingTrainCompartmentRepositoryPrisma from 'src/repositories/prisma/fuelling-train-compartment-repository-prisma';
import { FuelRepository } from 'src/repositories/fuel-repository';
import { FuellingRepository } from 'src/repositories/fuelling-repository';
import FuelRepositoryPrisma from 'src/repositories/prisma/fuel-repository-prisma';
import FuellingRepositoryPrisma from 'src/repositories/prisma/fuelling-repository-prisma';
import FuellingControlRepository from 'src/repositories/fuelling-control-repository';
import FuellingControlRepositoryPrisma from 'src/repositories/prisma/fuelling-control-repository-prisma';
import TankRepositoryPrisma from 'src/repositories/prisma/tank-repository-prisma';
import { TankRepository } from 'src/repositories/tank-repository';
import FuellingTankCompartmentRepository from 'src/repositories/fuelling-tank-compartment-repository';
import FuellingTankCompartmentRepositoryPrisma from 'src/repositories/prisma/fuelling-tank-compartment-repository-prisma';
import FuellingInputFuelRepository from 'src/repositories/fuelling-input-fuel-repository';
import FuellingInputFuelRepositoryPrisma from 'src/repositories/prisma/fuelling-input-fuel-repository-prisma';
import FuellingInputProductRepository from 'src/repositories/fuelling-input-product-repository';
import FuellingInputProductRepositoryPrisma from 'src/repositories/prisma/fuelling-input-product-prisma';
import FuellingProductRepository from 'src/repositories/fuelling-product-repository';
import FuellingProductRepositoryPrisma from 'src/repositories/prisma/fuelling-product-repository-prisma';
import { FuellingControlUserRepository } from 'src/repositories/fuelling-control-user-repository';
import FuellingControlUserRepositoryPrisma from 'src/repositories/prisma/fuelling-control-user-repository-prisma';
import { FuelStationRepository } from 'src/repositories/fuel-station-repository';
import FuelStationRepositoryPrisma from 'src/repositories/prisma/fuel-station-repository-prisma';
import MaintenancePerformanceRepository from 'src/repositories/maintenance-performance-repository';
import MaintenancePerformanceRepositoryPrisma from 'src/repositories/prisma/maintenance-performance-repository-prisma';
import CustoDiversosRepository from 'src/repositories/custo-diversos-repository';
import CustoDiversosRepositoryPrisma from 'src/repositories/prisma/custo-diversos-repository-prisma';
import ServiceOrderMaintainerRepositoryPrisma from 'src/repositories/prisma/service-order-maintainer-repository-prisma';
import ServiceOrderMaintainerRepository from 'src/repositories/service-order-maintainer-repository';
import { NoteServiceOrderRepository } from 'src/repositories/note-service-order-repository';
import NoteServiceOrderRepositoryPrisma from 'src/repositories/prisma/note-service-order-repository-prisma';
import { NoteStopServiceOrderRepository } from 'src/repositories/note-stop-service-order-repository';
import NoteStopServiceOrderRepositoryPrisma from 'src/repositories/prisma/note-stop-service-order-repository-prisma';
import { CostServiceOrderRepository } from 'src/repositories/cost-service-order-repository';
import CostServiceOrderRepositoryPrisma from 'src/repositories/prisma/cost-service-order-repository-prisma';
import { FailureAnalysisServiceOrderRepository } from 'src/repositories/failure-analysis-service-order-repository';
import FailureAnalysisServiceOrderRepositoryPrisma from 'src/repositories/prisma/failure-analysis-service-order-repository-prisma';
import TaskServiceOrderRepositoryPrisma from 'src/repositories/prisma/task-service-order-repository-prisma';
import TaskServiceOrderRepository from 'src/repositories/task-service-order-repository';
import RegisterHourTaskServiceRepositoryPrisma from 'src/repositories/prisma/register-hour-task-service-repository-prisma';
import RegisterHourTaskServiceRepository from 'src/repositories/register-hour-task-service-repository';
import TaskServiceOrderReturnRepositoryPrisma from 'src/repositories/prisma/task-service-order-return-repository-prisma';
import TaskServiceOrderReturnRepository from 'src/repositories/task-service-order-return-repository';
import AttachmentTaskServiceRepository from 'src/repositories/attachment-task-service-repository';
import AttachmentTaskServiceRepositoryPrisma from 'src/repositories/prisma/attachment-task-service-repository-prisma';
import LogAttachmentTaskServiceRepository from 'src/repositories/log-attachment-task-service-repository';
import LogAttachmentTaskServiceRepositoryPrisma from 'src/repositories/prisma/log-attachment-task-service-repository-prisma';
import ControlClosedOrderServiceRepository from 'src/repositories/control-closed-order-service-repository';
import ControlClosedOrderServiceRepositoryPrisma from 'src/repositories/prisma/control-closed-order-service-repository-prisma';
import JustifyStatusServiceOrderRepository from 'src/repositories/justify-status-service-order-repository';
import JustifyStatusServiceOrderRepositoryPrisma from 'src/repositories/prisma/justify-status-service-order-repository-prisma';
import DescriptionPlanRepository from 'src/repositories/description-plan-repository';
import DescriptionPlanRepositoryPrisma from 'src/repositories/prisma/description-plan-repository-prisma';
import DescriptionPlanningRepository from 'src/repositories/description-planning-repository';
import DescriptionPlanningRepositoryPrisma from 'src/repositories/prisma/description-planning-repository-prisma';
import DescriptionMaintenancePlanningRepository from 'src/repositories/description-maintenance-planning-repository';
import DescriptionMaintenancePlanningRepositoryPrisma from 'src/repositories/prisma/description-maintenance-planning-repository-prisma';
import PreventivePlanRepository from 'src/repositories/preventive-plan-repository';
import PreventivePlanRepositoryPrisma from 'src/repositories/prisma/preventive-plan-repository-prisma.ts';
import LogServiceOrderMaintainerRepository from 'src/repositories/log-service-order-maintainer-repository';
import LogServiceOrderMaintainerRepositoryPrisma from 'src/repositories/prisma/log-service-order-maintainer-repository-prisma';
import LogTaskServiceOrderRepository from 'src/repositories/log-task-service-order-repository';
import LogTaskServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-task-service-order-repository-prisma';
import LogTaskServiceOrderReturnRepository from 'src/repositories/log-task-service-order-return-repository';
import LogTaskServiceOrderReturnRepositoryPrisma from 'src/repositories/prisma/log-task-service-order-return-repository-prisma';
import MaintenanceControlStockRepository from 'src/repositories/maintenance-control-stock-repository';
import MaintenanceControlStockRepositoryPrisma from 'src/repositories/prisma/maintenance-control-stock-repository-prisma';
import { PlanMaintenanceRepository } from 'src/repositories/plan-maintenance-repository';
import PlanMaintenanceRepositoryPrisma from 'src/repositories/prisma/plan-maintenance-repository-prisma';
import CheckListTurnRepository from 'src/repositories/checklist-turn-repository';
import CheckListTurnRepositoryPrisma from 'src/repositories/prisma/checklist-turn-repository-prisma';
import RegisterTurnRepositoryPrisma from 'src/repositories/prisma/register-turn-repository-prisma';
import RegisterTurnRepository from 'src/repositories/register-turn-repository';
import { PlanDescriptionRepository } from 'src/repositories/plan-description-repository';
import PlanDescriptionRepositoryPrisma from 'src/repositories/prisma/plan-description-repository-prisma';
import PeriodicityBoundRepository from 'src/repositories/periodicity-bound-repository';
import PeriodicityBoundRepositoryPrisma from 'src/repositories/prisma/periodicity-bound-repository-prisma';
import LogRequestServiceRepository from 'src/repositories/log-request-service-repository';
import LogRequestServiceRepositoryPrisma from 'src/repositories/prisma/log-request-service-repository-prisma';
import LogServiceOrderRepository from 'src/repositories/log-service-order-repository';
import LogServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-service-order-repository-prisma';
import LogRegisterHourTaskServiceRepository from 'src/repositories/log-register-hour-task-service-repository';
import LogRegisterHourTaskServiceRepositoryPrisma from 'src/repositories/prisma/log-register-hour-task-service-repository-prisma';
import LogAttachmentServiceOrderRepository from 'src/repositories/log-attachment-service-order-repository';
import LogAttachmentServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-attachment-service-order-repository-prisma';
import LogAttachmentRequestServiceRepository from 'src/repositories/log-attachment-request-service-repository';
import LogAttachmentRequestServiceRepositoryPrisma from 'src/repositories/prisma/log-attachment-request-service-repository-prisma';
import LogTaskOptionRepository from 'src/repositories/log-task-option-repository';
import LogTaskOptionRepositoryPrisma from 'src/repositories/prisma/log-task-option-repository-prisma';
import LogTaskListOptionRepository from 'src/repositories/log-task-list-option-repository';
import LogTaskListOptionRepositoryPrisma from 'src/repositories/prisma/log-task-list-option-repository-prisma';
import LogMaterialServiceOrderRepository from 'src/repositories/log-material-service-order-repository';
import LogMaterialServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-material-service-order-repository-prisma';
import LogMaterialRepository from 'src/repositories/log-material-repository';
import LogMaterialRepositoryPrisma from 'src/repositories/prisma/log-material-repository-prisma';
import MaintenanceDisplacementRepository from 'src/repositories/maintenance-displacement-repository';
import MaintenanceDisplacementRepositoryPrisma from 'src/repositories/prisma/maintenance-displacement-repository-prisma';
import LogAppointmentServiceOrderRepository from 'src/repositories/log-appointment-service-order-repository';
import LogAppointmentServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-appointment-service-order-repository-prisma';
import LogCostServiceOrderRepository from 'src/repositories/log-cost-service-order-repository';
import LogCostServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-cost-service-order-repository-prisma';
import LogServiceOrderSignatureRepository from 'src/repositories/log-service-order-signature-repository';
import LogServiceOrderSignatureRepositoryPrisma from 'src/repositories/prisma/log-service-order-signature-repository-prisma';
import { LogNoteStopServiceOrderRepository } from 'src/repositories/log-note-stop-service-order-repository';
import LogNoteStopServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-note-stop-service-order-repository-prisma';
import TypeRequestRepositoryPrisma from 'src/repositories/prisma/type-request-repository-prisma';
import TypeRequestRepository from 'src/repositories/type-request-repository';
import LegendTaskRepository from 'src/repositories/legend-task-repository';
import LegendTaskRepositoryPrisma from 'src/repositories/prisma/legend-task-repository-prisma';
import LogEmployeesRepository from 'src/repositories/log-employees-repository';
import LogEmployeesRepositoryPrisma from 'src/repositories/prisma/log-employees-repository-prisma';
import LogEquipmentRepository from 'src/repositories/log-equipment-repository';
import LogEquipmentRepositoryPrisma from 'src/repositories/prisma/log-equipment-repository-prisma';
import { LogDescriptionCostServiceOrderRepository } from 'src/repositories/log_description-cost-service-order-repository';
import LogDescriptionCostServiceOrderRepositoryPrisma from 'src/repositories/prisma/log_description-cost-service-order-prisma';
import LogDescriptionPlanRepository from 'src/repositories/log_description-plan-repository';
import LogDescriptionPlanRepositoryPrisma from 'src/repositories/prisma/log_description-plan-repository-prisma';
import LogStatusRequestServiceRepository from 'src/repositories/log-status-request-service-repository';
import LogStatusRequestServiceRepositoryPrisma from 'src/repositories/prisma/log-status-request-service-repository-prisma';
import LogUnityOfMensurePlansRepository from 'src/repositories/log-unity-of-mensure-plans-repository';
import LogUnityOfMensurePlansRepositoryPrisma from 'src/repositories/prisma/log-unity-of-mensure-plans-repository-prisma';
import PositionMaintainerRepository from 'src/repositories/position-maintainer-repository';
import { PositionMaintainerRepositoryPrisma } from 'src/repositories/prisma/position-maintainer-repository-prisma';
import RequestServiceRepositoryPrisma from 'src/repositories/prisma/request-service-repository-prisma';
import RequestServiceRepository from 'src/repositories/request-service-repository';
import NumberRequestServiceRepository from 'src/repositories/number-request-service-repository';
import NumberRequestServiceRepositoryPrisma from 'src/repositories/prisma/number-request-service-repository';
import AttachmentRequestServiceRepository from 'src/repositories/attachment-request-service-repository';
import AttachmentRequestServiceRepositoryPrisma from 'src/repositories/prisma/attachment-request-service-repository-prisma';
import MaintenanceAppointmentManualRepository from 'src/repositories/maintenance-appointment-manual-repository';
import MaintenanceAppointmentManualRepositoryPrisma from 'src/repositories/prisma/maintenance-appointment-manual-repository-prisma';
import LogMaintenanceAppointmentManualRepository from 'src/repositories/log-maintenance-appointment-manual-repository';
import LogMaintenanceAppointmentManualRepositoryPrisma from 'src/repositories/prisma/log-maintenance-appointment-manual-repository-prisma';
import ServiceOrderSignatureRepositoryPrisma from 'src/repositories/prisma/service-order-signature-repository-prisma';
import ServiceOrderSignatureRepository from 'src/repositories/service-order-signature-repository';
import ColaboratorRepository from 'src/repositories/colaborator-repository';
import ColaboratorRepositoryPrisma from 'src/repositories/prisma/colaborator-repository-prisma';
import ImageLoginRepository from 'src/repositories/image-login-repository';
import ImageLoginRepositoryPrisma from 'src/repositories/prisma/image-login-repository-prisma';
import ConfigTableRepository from 'src/repositories/config-table-repository';
import ConfigTableRepositoryPrisma from 'src/repositories/prisma/config-table-repository-prisma';
import { CompositionItemRepository } from 'src/repositories/composition-item-repository';
import { CompositionItemRepositoryPrisma } from 'src/repositories/prisma/composition-item-repository-prisma';
import FinanceBankTransferRepository from 'src/repositories/finance-bank-transfer-repository';
import FinanceBankTransferRepositoryPrisma from 'src/repositories/prisma/finance-bank-transfer-repository-prisma';
import FinanceEmissionRepository from 'src/repositories/finance-emission-repository';
import FinanceEmissionRepositoryPrisma from 'src/repositories/prisma/finance-emission-repository-prisma';
import GroupRepository from 'src/repositories/group-repository';
import GroupRepositoryPrisma from 'src/repositories/prisma/group-repository-prisma';
import UserGroupRepositoryPrisma from 'src/repositories/prisma/user-group-repository-prisma';
import UserGroupRepository from 'src/repositories/user-group-repository';
import UserPermissionRepositoryPrisma from 'src/repositories/prisma/user-permission-repository-prisma';
import UserPermissionRepository from 'src/repositories/user-permission-repository';
import ElevationRepository from 'src/repositories/elevation-repository';
import ElevationRepositoryPrisma from 'src/repositories/prisma/elevation-repository-prisma';
import ProviderBankRepositoryPrisma from 'src/repositories/prisma/provider-bank-repository-prisma';
import ProviderBankRepository from 'src/repositories/provider-bank-repository';
import BuyStatusRepository from 'src/repositories/buy-status-repository';
import BuyStatusRepositoryPrisma from 'src/repositories/prisma/buy-status-repository-prisma';
import { ProductionChecklistActionRepositoryPrisma } from 'src/repositories/prisma/production-checklist-action-repository-prisma';
import { ProductionChecklistActionRepository } from 'src/repositories/production-checklist-action-repository';
import { ProductionChecklistActionGroupRepositoryPrisma } from 'src/repositories/prisma/production-checklist-action-group-repository-prisma';
import { ProductionChecklistActionGroupRepository } from 'src/repositories/production-checklist-action-group-repository';
import { CheckListControlRepository } from 'src/repositories/checklist-control-repository';
import { CheckListControlRepositoryPrisma } from 'src/repositories/prisma/checklist-control-repository-prisma';
import { ProductionRegisterRepositoryPrisma } from 'src/repositories/prisma/production-register-repository-prisma';
import { ProductionRegisterRepository } from 'src/repositories/production-register-repository';
import { ProductionCategoryDiverseRepositoryPrisma } from 'src/repositories/prisma/production-category-diverse-repository-prisma';
import ProductionCategoryDiverseRepository from 'src/repositories/production-category-diverse-repository';
import { ProductionCategoryItemsRepositoryPrisma } from 'src/repositories/prisma/production-category-items-repository-prisma';
import { ProductionCategoryItemsRepository } from 'src/repositories/production-category-items-repository';
import ChecklistCategoryDiverseRepository from 'src/repositories/checklist-category-diverse-repository';
import ChecklistCategoryDiverseRepositoryPrisma from 'src/repositories/prisma/checklist-category-diverse-repository-prisma';
import UnityOfMensurePlansRepositoryPrisma from 'src/repositories/prisma/unity-of-mensure-plans-repository-prisma';
import UnityOfMensurePlansRepository from 'src/repositories/unity-of-mensure-plans-repository';
import CategoryMaterialRepository from 'src/repositories/category-material-repository';
import CategoryMaterialRepositoryPrisma from 'src/repositories/prisma/category-material-repository-prisma';
import MaterialBoundRepository from 'src/repositories/material-bound-repository';
import MaterialBoundRepositoryPrisma from 'src/repositories/prisma/material-bound-repository-prisma';
import LogChecklistRepository from 'src/repositories/log-checklist-repository';
import LogChecklistRepositoryPrisma from 'src/repositories/prisma/log-checklist-repository-prisma';

import {
  ContextService,
  //RequestContextService
} from 'src/service/request-context.service';
import LogDescriptionMaintenancePlanningRepository from 'src/repositories/log-description-maintenance-planning-repository';
import LogDescriptionMaintenancePlanningRepositoryPrisma from 'src/repositories/prisma/log-description-maintenance-planning-repository-prisma';
import BuyRelaunchRepository from 'src/repositories/buy-relaunch-repository';
import BuyRelaunchRepositoryPrisma from 'src/repositories/prisma/buy-relaunch-repository-prisma';
import BankBoundService from 'src/service/bank.bound.service';

const tenantRepositories = [
  createTenantRepositoryProvider(
    AttachmentRequestServiceRepository,
    (client) =>
      new AttachmentRequestServiceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    AttachmentsServiceOrderRepository,
    (client) =>
      new AttachmentsServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    AttachmentTaskServiceRepository,
    (client) =>
      new AttachmentTaskServiceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BranchRepository,
    (client) => new BranchRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BranchesByUserRepository,
    (client) => new BranchesByUserRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyApprobationRepository,
    (client) => new BuyApprobationRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyConditionAnswerRepository,
    (client) => new BuyConditionAnswerRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyConditionRepository,
    (client) => new BuyConditionRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyConfigurationRepository,
    (client) => new BuyConfigurationRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyControlQuotationRepository,
    (client) =>
      new BuyControlQuotationRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyElevationsRepository,
    (client) => new BuyElevationsRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyItemQuotationReasonRepository,
    (client) =>
      new BuyItemQuotationReasonRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyItemRepository,
    (client) => new BuyItemRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyNumberFiscalRepository,
    (client) => new BuyNumberFiscalRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyPreFinancePaymentRepository,
    (client) =>
      new BuyPreFinancePaymentRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyPreFinanceRepository,
    (client) => new BuyPreFinanceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyPriorityRepository,
    (client) => new BuyPriorityRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyQuotationDiscountRepository,
    (client) =>
      new BuyQuotationDiscountRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyQuotationItemRepository,
    (client) => new BuyQuotationItemRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyQuotationRepository,
    (client) => new BuyQuotationRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyQuotationSelectedRepository,
    (client) =>
      new BuyQuotationSelectedRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyRelaunchRepository,
    (client) => new BuyRelaunchRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyRepository,
    (client) => new BuyRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyRequestFaultRepository,
    (client) => new BuyRequestFaultRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyRequestItemRepository,
    (client) => new BuyRequestItemRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyRequestProviderRepository,
    (client) => new BuyRequestProviderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyRequestRepository,
    (client) => new BuyRequestRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyRequestStatusRepository,
    (client) => new BuyRequestStatusRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyResponsibleQuotationRepository,
    (client) =>
      new BuyResponsibleQuotationRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyResponsibleRepository,
    (client) => new BuyResponsibleRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    BuyStatusRepository,
    (client) => new BuyStatusRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CategoryMaterialRepository,
    (client) => new CategoryMaterialRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CheckListItemRepository,
    (client) => new CheckListItemRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CheckListPeriodRepository,
    (client) => new CheckListPeriodRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CheckListRepository,
    (client) => new CheckListRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ChecklistCategoryDiverseRepository,
    (client) =>
      new ChecklistCategoryDiverseRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CheckListControlRepository,
    (client) => new CheckListControlRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CheckListStatusActionRepository,
    (client) =>
      new CheckListStatusActionRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CheckListStatusRepository,
    (client) => new CheckListStatusRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CheckListTaskRepository,
    (client) => new CheckListTaskRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CheckListTurnRepository,
    (client) => new CheckListTurnRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ClassificationServiceOrderRepository,
    (client) =>
      new ClassificationServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ColaboratorRepository,
    (client) => new ColaboratorRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CompanyRepository,
    (client) => new CompanyRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ComponentsRepository,
    (client) => new ComponentsRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CompositionItemRepository,
    (client) => new CompositionItemRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ConfigTableRepository,
    (client) => new ConfigTableRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ContractTypeInputRepository,
    (client) => new ContractTypeInputRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ControlClosedOrderServiceRepository,
    (client) =>
      new ControlClosedOrderServiceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CostCenterRepository,
    (client) => new CostCenterRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CostServiceOrderRepository,
    (client) => new CostServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    CustoDiversosRepository,
    (client) => new CustoDiversosRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    DescriptionCostCenterRepository,
    (client) =>
      new DescriptionCostCenterRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    DescriptionCostServiceOrderRepository,
    (client) =>
      new DescriptionCostServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    DescriptionMaintenancePlanningRepository,
    (client) =>
      new DescriptionMaintenancePlanningRepositoryPrisma(
        client as PrismaService,
      ),
  ),
  createTenantRepositoryProvider(
    DescriptionPlanRepository,
    (client) => new DescriptionPlanRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    DescriptionPlanningRepository,
    (client) =>
      new DescriptionPlanningRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ElevationRepository,
    (client) => new ElevationRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    EmissionRepository,
    (client) => new EmissionRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    EmployeeRepository,
    (client) => new EmployeeRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    EquipmentComponentRepository,
    (client) => new EquipmentComponentRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    EquipmentRepository,
    (client) => new EquipmentRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    EquipmentTypeRepository,
    (client) => new EquipmentTypeRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FailureAnalysisServiceOrderRepository,
    (client) =>
      new FailureAnalysisServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FailureActionRepository,
    (client) => new FailureActionRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FailureCauseRepository,
    (client) => new FailureCauseRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FailureSymptomsRepository,
    (client) => new FailureSymptomsRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FamilyRepository,
    (client) => new FamilyRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceRepository,
    (client) => new FinanceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceBankRepository,
    (client) => new FinanceBankRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceBankTransactionRepository,
    (client) =>
      new FinanceBankTransactionRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceBankTransferRepository,
    (client) =>
      new FinanceBankTransferRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceControlRepository,
    (client) => new FinanceControlRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceEmissionRepository,
    (client) => new FinanceEmissionRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceEmissionItemRepository,
    (client) =>
      new FinanceEmissionItemRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceEmissionTaxationRepository,
    (client) =>
      new FinanceEmissionTaxationRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceItemRepository,
    (client) => new FinanceItemRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceItemBoundRepository,
    (client) => new FinanceItemBoundRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceNumberRepository,
    (client) => new FinanceNumberRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceNumberTypeDocumentRepository,
    (client) =>
      new FinanceNumberTypeDocumentRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinancePaymentRepository,
    (client) => new FinancePaymentRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinancePaymentViewRepository,
    (client) => new FinancePaymentViewRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceRegisterTributeRepository,
    (client) =>
      new FinanceRegisterTributeRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceStatusRepository,
    (client) => new FinanceStatusRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceTaxationRepository,
    (client) => new FinanceTaxationRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceTributesRepository,
    (client) => new FinanceTributesRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceTypeDocumentRepository,
    (client) =>
      new FinanceTypeDocumentRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FinanceTypePaymentRepository,
    (client) => new FinanceTypePaymentRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FuelRepository,
    (client) => new FuelRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FuelStationRepository,
    (client) => new FuelStationRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FuellingRepository,
    (client) => new FuellingRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FuellingControlRepository,
    (client) => new FuellingControlRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FuellingControlUserRepository,
    (client) =>
      new FuellingControlUserRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FuellingInputFuelRepository,
    (client) => new FuellingInputFuelRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FuellingInputProductRepository,
    (client) =>
      new FuellingInputProductRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FuellingProductRepository,
    (client) => new FuellingProductRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FuellingTankCompartmentRepository,
    (client) =>
      new FuellingTankCompartmentRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FuellingTrainRepository,
    (client) => new FuellingTrainRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    FuellingTrainCompartmentRepository,
    (client) =>
      new FuellingTrainCompartmentRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    GroupRepository,
    (client) => new GroupRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ImageLoginRepository,
    (client) => new ImageLoginRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    JustifyStatusServiceOrderRepository,
    (client) =>
      new JustifyStatusServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LegendTaskRepository,
    (client) => new LegendTaskRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LocationRepository,
    (client) => new LocationRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogAppointmentServiceOrderRepository,
    (client) =>
      new LogAppointmentServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogAttachmentRequestServiceRepository,
    (client) =>
      new LogAttachmentRequestServiceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogAttachmentServiceOrderRepository,
    (client) =>
      new LogAttachmentServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogAttachmentTaskServiceRepository,
    (client) =>
      new LogAttachmentTaskServiceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogChecklistRepository,
    (client) => new LogChecklistRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogCostServiceOrderRepository,
    (client) =>
      new LogCostServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogDescriptionCostServiceOrderRepository,
    (client) =>
      new LogDescriptionCostServiceOrderRepositoryPrisma(
        client as PrismaService,
      ),
  ),
  createTenantRepositoryProvider(
    LogDescriptionPlanRepository,
    (client) => new LogDescriptionPlanRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogDescriptionMaintenancePlanningRepository,
    (client) =>
      new LogDescriptionMaintenancePlanningRepositoryPrisma(
        client as PrismaService,
      ),
  ),
  createTenantRepositoryProvider(
    LogEmployeesRepository,
    (client) => new LogEmployeesRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogEquipmentRepository,
    (client) => new LogEquipmentRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogFinanceRepository,
    (client) => new LogFinanceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogMaterialRepository,
    (client) => new LogMaterialRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogMaintenanceAppointmentManualRepository,
    (client) =>
      new LogMaintenanceAppointmentManualRepositoryPrisma(
        client as PrismaService,
      ),
  ),
  createTenantRepositoryProvider(
    LogMaterialServiceOrderRepository,
    (client) =>
      new LogMaterialServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogNoteStopServiceOrderRepository,
    (client) =>
      new LogNoteStopServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogRegisterHourTaskServiceRepository,
    (client) =>
      new LogRegisterHourTaskServiceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogRequestServiceRepository,
    (client) => new LogRequestServiceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogServiceOrderRepository,
    (client) => new LogServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogServiceOrderSignatureRepository,
    (client) =>
      new LogServiceOrderSignatureRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogServiceOrderMaintainerRepository,
    (client) =>
      new LogServiceOrderMaintainerRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogStatusRequestServiceRepository,
    (client) =>
      new LogStatusRequestServiceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogTaskListOptionRepository,
    (client) => new LogTaskListOptionRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogTaskOptionRepository,
    (client) => new LogTaskOptionRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogTaskServiceOrderRepository,
    (client) =>
      new LogTaskServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogTaskServiceOrderReturnRepository,
    (client) =>
      new LogTaskServiceOrderReturnRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LogUnityOfMensurePlansRepository,
    (client) =>
      new LogUnityOfMensurePlansRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    LoginRepository,
    (client) => new LoginRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MaintenanceAppointmentManualRepository,
    (client) =>
      new MaintenanceAppointmentManualRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MaintenanceControlStockRepository,
    (client) =>
      new MaintenanceControlStockRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MaintenanceDisplacementRepository,
    (client) =>
      new MaintenanceDisplacementRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MaintenancePerformanceRepository,
    (client) =>
      new MaintenancePerformanceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MaintenanceRequesterRepository,
    (client) =>
      new MaintenanceRequesterRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ManagerCompanyRepository,
    (client) => new ManagerCompanyRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MaterialBoundRepository,
    (client) => new MaterialBoundRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MaterialCodeRepository,
    (client) => new MaterialCodeRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MaterialEstoqueRepository,
    (client) => new MaterialEstoqueRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MaterialRepository,
    (client) => new MaterialRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MaterialServiceOrderRepository,
    (client) =>
      new MaterialServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MaterialStockWithDrawalRepository,
    (client) =>
      new MaterialStockWithDrawalRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    MenuRepository,
    (client) => new MenuRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ModuleRepository,
    (client) => new ModuleRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    NoteStopServiceOrderRepository,
    (client) =>
      new NoteStopServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    NoteServiceOrderRepository,
    (client) => new NoteServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    NumberRequestServiceRepository,
    (client) =>
      new NumberRequestServiceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    PermissionRepository,
    (client) => new PermissionRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    PeriodicityBoundRepository,
    (client) => new PeriodicityBoundRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    PlanDescriptionRepository,
    (client) => new PlanDescriptionRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    PlanMaintenanceRepository,
    (client) => new PlanMaintenanceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    PositionMaintainerRepository,
    (client) => new PositionMaintainerRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    PreventivePlanRepository,
    (client) => new PreventivePlanRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    PriorityServiceOrderRepository,
    (client) =>
      new PriorityServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ProductionCategoryDiverseRepository,
    (client) =>
      new ProductionCategoryDiverseRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ProductionCategoryItemsRepository,
    (client) =>
      new ProductionCategoryItemsRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ProductionChecklistActionRepository,
    (client) =>
      new ProductionChecklistActionRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ProductionChecklistActionGroupRepository,
    (client) =>
      new ProductionChecklistActionGroupRepositoryPrisma(
        client as PrismaService,
      ),
  ),
  createTenantRepositoryProvider(
    ProductionRegisterRepository,
    (client) => new ProductionRegisterRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ProviderRepository,
    (client) => new ProviderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ProviderBankRepository,
    (client) => new ProviderBankRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    RegisterHourTaskServiceRepository,
    (client) =>
      new RegisterHourTaskServiceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    RegisterTurnRepository,
    (client) => new RegisterTurnRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    RequestServiceRepository,
    (client) => new RequestServiceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    SectorExecutingRepository,
    (client) => new SectorExecutingRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ServiceOrderRepository,
    (client) => new ServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ServiceOrderMaintainerRepository,
    (client) =>
      new ServiceOrderMaintainerRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    ServiceOrderSignatureRepository,
    (client) =>
      new ServiceOrderSignatureRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    SmartChecklistRepository,
    (client) => new SmartChecklistRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    StatusServiceOrderRepository,
    (client) => new StatusServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    StockInventoryRepository,
    (client) => new StockInventoryRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    StockRepository,
    (client) => new StockRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    SubGroupRepository,
    (client) => new SubGroupRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    TankRepository,
    (client) => new TankRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    TaskPlanningMaintenanceRepository,
    (client) =>
      new TaskPlanningMaintenanceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    TaskRepository,
    (client) => new TaskRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    TaskServiceOrderRepository,
    (client) => new TaskServiceOrderRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    TaskServiceOrderReturnRepository,
    (client) =>
      new TaskServiceOrderReturnRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    TypeMaintenanceRepository,
    (client) => new TypeMaintenanceRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    TypeRequestRepository,
    (client) => new TypeRequestRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    UnityOfMensurePlansRepository,
    (client) =>
      new UnityOfMensurePlansRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    UserRepository,
    (client) => new UserRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    UserGroupRepository,
    (client) => new UserGroupRepositoryPrisma(client as PrismaService),
  ),
  createTenantRepositoryProvider(
    UserPermissionRepository,
    (client) => new UserPermissionRepositoryPrisma(client as PrismaService),
  ),
];

@Module({
  providers: [
    ENVService,
    BankBoundService,
    TenantPrismaService,
    //RequestContextService,
    ContextService,
    {
      provide: 'PRISMA_CLIENT',
      //scope: Scope.REQUEST,
      useFactory: async (
        //requestContextService: RequestContextService,
        contextService: ContextService,
        tenantPrismaService: TenantPrismaService,
      ) => {
        const context = contextService.getContext();
        const requestId = context.requestId;
        const tenantId = context.tenantId;
        const origin = context.origin;
        const url = context.url;
        const login = context.login;

        return tenantPrismaService.getPrismaClient(tenantId, {
          requestId,
          origin,
          url,
          login,
        });
      },
      inject: [ContextService, TenantPrismaService],
    },
    ...tenantRepositories,
  ],
  exports: [...tenantRepositories],
})
export class TenantRepositoriesModule {}
