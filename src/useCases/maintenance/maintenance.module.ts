import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import AttachmentRequestServiceRepository from 'src/repositories/attachment-request-service-repository';
// import AttachmentTaskServiceRepository from 'src/repositories/attachment-task-service-repository';
// import { AttachmentsServiceOrderRepository } from 'src/repositories/attachments-service-order-repository';
// import { BranchRepository } from 'src/repositories/branch-repository';
// import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
// import { CheckListItemRepository } from 'src/repositories/checklist-item-repository';
// import { CheckListPeriodRepository } from 'src/repositories/checklist-period-repository';
// import { CheckListRepository } from 'src/repositories/checklist-repository';
// import CheckListTurnRepository from 'src/repositories/checklist-turn-repository';
// import ClassificationServiceOrderRepository from 'src/repositories/classification-service-order-repository';
// import ColaboratorRepository from 'src/repositories/colaborator-repository';
// import { CompanyRepository } from 'src/repositories/company-repository';
// import { ComponentsRepository } from 'src/repositories/components-repository';
// import ControlClosedOrderServiceRepository from 'src/repositories/control-closed-order-service-repository';
// import { CostCenterRepository } from 'src/repositories/cost-center-repository';
// import { CostServiceOrderRepository } from 'src/repositories/cost-service-order-repository';
// import DescriptionPlanRepository from 'src/repositories/description-plan-repository';
// import DescriptionPlanningRepository from 'src/repositories/description-planning-repository';
// import { EmployeeRepository } from 'src/repositories/employee-repository';
// import EquipmentRepository from 'src/repositories/equipment-repository';
// import { EquipmentTypeRepository } from 'src/repositories/equipment-type-repository';
// import { FailureAnalysisServiceOrderRepository } from 'src/repositories/failure-analysis-service-order-repository';
// import JustifyStatusServiceOrderRepository from 'src/repositories/justify-status-service-order-repository';
// import LegendTaskRepository from 'src/repositories/legend-task-repository';
// import LocationRepository from 'src/repositories/location-repository';
// import LogAppointmentServiceOrderRepository from 'src/repositories/log-appointment-service-order-repository';
// import LogAttachmentRequestServiceRepository from 'src/repositories/log-attachment-request-service-repository';
// import LogAttachmentServiceOrderRepository from 'src/repositories/log-attachment-service-order-repository';
// import LogAttachmentTaskServiceRepository from 'src/repositories/log-attachment-task-service-repository';
// import { LogCostServiceOrderRepository } from 'src/repositories/log-cost-service-order-repository';
// import LogEmployeesRepository from 'src/repositories/log-employees-repository';
// import LogEquipmentRepository from 'src/repositories/log-equipment-repository';
// import LogMaintenanceAppointmentManualRepository from 'src/repositories/log-maintenance-appointment-manual-repository';
// import LogMaterialRepository from 'src/repositories/log-material-repository';
// import LogMaterialServiceOrderRepository from 'src/repositories/log-material-service-order-repository';
// import { LogNoteStopServiceOrderRepository } from 'src/repositories/log-note-stop-service-order-repository';
// import LogRegisterHourTaskServiceRepository from 'src/repositories/log-register-hour-task-service-repository';
// import LogRequestServiceRepository from 'src/repositories/log-request-service-repository';
// import LogServiceOrderMaintainerRepository from 'src/repositories/log-service-order-maintainer-repository';
// import LogServiceOrderRepository from 'src/repositories/log-service-order-repository';
// import LogServiceOrderSignatureRepository from 'src/repositories/log-service-order-signature-repository';
// import LogStatusRequestServiceRepository from 'src/repositories/log-status-request-service-repository';
// import LogTaskListOptionRepository from 'src/repositories/log-task-list-option-repository';
// import LogTaskOptionRepository from 'src/repositories/log-task-option-repository';
// import LogTaskServiceOrderRepository from 'src/repositories/log-task-service-order-repository';
// import LogTaskServiceOrderReturnRepository from 'src/repositories/log-task-service-order-return-repository';
// import LogUnityOfMensurePlansRepository from 'src/repositories/log-unity-of-mensure-plans-repository';
// import { LogDescriptionCostServiceOrderRepository } from 'src/repositories/log_description-cost-service-order-repository';
// import MaintenanceAppointmentManualRepository from 'src/repositories/maintenance-appointment-manual-repository';
// import MaintenanceControlStockRepository from 'src/repositories/maintenance-control-stock-repository';
// import MaintenanceDisplacementRepository from 'src/repositories/maintenance-displacement-repository';
// import MaintenanceRequesterRepository from 'src/repositories/maintenance-requester-repository';
// import MaterialCodeRepository from 'src/repositories/material-code-repository';
// import MaterialRepository from 'src/repositories/material-repository';
// import { MaterialServiceOrderRepository } from 'src/repositories/material-service-order-repository';
// import { ModuleRepository } from 'src/repositories/module-repository';
// import { NoteServiceOrderRepository } from 'src/repositories/note-service-order-repository';
// import { NoteStopServiceOrderRepository } from 'src/repositories/note-stop-service-order-repository';
// import NumberRequestServiceRepository from 'src/repositories/number-request-service-repository';
// import PeriodicityBoundRepository from 'src/repositories/periodicity-bound-repository';
// import { PermissionRepository } from 'src/repositories/permission-repository';
// import { PlanDescriptionRepository } from 'src/repositories/plan-description-repository';
// import { PlanMaintenanceRepository } from 'src/repositories/plan-maintenance-repository';
// import PreventivePlanRepository from 'src/repositories/preventive-plan-repository';
// import PriorityServiceOrderRepository from 'src/repositories/priority-service-order-repository';
// import AttachmentRequestServiceRepositoryPrisma from 'src/repositories/prisma/attachment-request-service-repository-prisma';
// import AttachmentTaskServiceRepositoryPrisma from 'src/repositories/prisma/attachment-task-service-repository-prisma';
// import AttachmentsServiceOrderRepositoryPrisma from 'src/repositories/prisma/attachments-service-order-repository-prisma';
// import { BranchRepositoryPrisma } from 'src/repositories/prisma/branch-repository-prisma';
// import { BranchesByUserRepositoryPrisma } from 'src/repositories/prisma/branches-by-user-repository-prisma';
// import { CheckListItemRepositoryPrisma } from 'src/repositories/prisma/checklist-item-repository-prisma';
// import { CheckListPeriodRepositoryPrisma } from 'src/repositories/prisma/checklist-period-repository-prisma';
// import { CheckListRepositoryPrisma } from 'src/repositories/prisma/checklist-repository-prisma';
// import CheckListTurnRepositoryPrisma from 'src/repositories/prisma/checklist-turn-repository-prisma';
// import ClassificationServiceOrderRepositoryPrisma from 'src/repositories/prisma/classification-service-order-repository-prisma';
// import ColaboratorRepositoryPrisma from 'src/repositories/prisma/colaborator-repository-prisma';
// import CompanyRepositoryPrisma from 'src/repositories/prisma/company-repository-prisma';
// import ComponentsRepositoryPrisma from 'src/repositories/prisma/components-repository-prisma';
// import ControlClosedOrderServiceRepositoryPrisma from 'src/repositories/prisma/control-closed-order-service-repository-prisma';
// import { CostCenterRepositoryPrisma } from 'src/repositories/prisma/cost-center-repository-prisma';
// import CostServiceOrderRepositoryPrisma from 'src/repositories/prisma/cost-service-order-repository-prisma';
// import DescriptionPlanRepositoryPrisma from 'src/repositories/prisma/description-plan-repository-prisma';
// import DescriptionPlanningRepositoryPrisma from 'src/repositories/prisma/description-planning-repository-prisma';
// import EmployeeRepositoryPrisma from 'src/repositories/prisma/employees-repository-prisma';
// import EquipmentRepositoryPrisma from 'src/repositories/prisma/equipment-repository-prisma';
// import EquipmentTypeRepositoryPrisma from 'src/repositories/prisma/equipment-type-repository-prisma';
// import FailureAnalysisServiceOrderRepositoryPrisma from 'src/repositories/prisma/failure-analysis-service-order-repository-prisma';
// import JustifyStatusServiceOrderRepositoryPrisma from 'src/repositories/prisma/justify-status-service-order-repository-prisma';
// import LegendTaskRepositoryPrisma from 'src/repositories/prisma/legend-task-repository-prisma';
// import LocationRepositoryPrisma from 'src/repositories/prisma/location-repository-prisma';
// import LogAppointmentServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-appointment-service-order-repository-prisma';
// import LogAttachmentRequestServiceRepositoryPrisma from 'src/repositories/prisma/log-attachment-request-service-repository-prisma';
// import LogAttachmentServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-attachment-service-order-repository-prisma';
// import LogAttachmentTaskServiceRepositoryPrisma from 'src/repositories/prisma/log-attachment-task-service-repository-prisma';
// import LogCostServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-cost-service-order-repository-prisma';
// import LogEmployeesRepositoryPrisma from 'src/repositories/prisma/log-employees-repository-prisma';
// import LogEquipmentRepositoryPrisma from 'src/repositories/prisma/log-equipment-repository-prisma';
// import LogMaintenanceAppointmentManualRepositoryPrisma from 'src/repositories/prisma/log-maintenance-appointment-manual-repository-prisma';
// import LogMaterialRepositoryPrisma from 'src/repositories/prisma/log-material-repository-prisma';
// import LogMaterialServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-material-service-order-repository-prisma';
// import LogNoteStopServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-note-stop-service-order-repository-prisma';
// import LogRegisterHourTaskServiceRepositoryPrisma from 'src/repositories/prisma/log-register-hour-task-service-repository-prisma';
// import LogRequestServiceRepositoryPrisma from 'src/repositories/prisma/log-request-service-repository-prisma';
// import LogServiceOrderMaintainerRepositoryPrisma from 'src/repositories/prisma/log-service-order-maintainer-repository-prisma';
// import LogServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-service-order-repository-prisma';
// import LogServiceOrderSignatureRepositoryPrisma from 'src/repositories/prisma/log-service-order-signature-repository-prisma';
// import LogStatusRequestServiceRepositoryPrisma from 'src/repositories/prisma/log-status-request-service-repository-prisma';
// import LogTaskListOptionRepositoryPrisma from 'src/repositories/prisma/log-task-list-option-repository-prisma';
// import LogTaskOptionRepositoryPrisma from 'src/repositories/prisma/log-task-option-repository-prisma';
// import LogTaskServiceOrderRepositoryPrisma from 'src/repositories/prisma/log-task-service-order-repository-prisma';
// import LogTaskServiceOrderReturnRepositoryPrisma from 'src/repositories/prisma/log-task-service-order-return-repository-prisma';
// import LogUnityOfMensurePlansRepositoryPrisma from 'src/repositories/prisma/log-unity-of-mensure-plans-repository-prisma';
// import LogDescriptionCostServiceOrderPrisma from 'src/repositories/prisma/log_description-cost-service-order-prisma';
// import MaintenanceAppointmentManualRepositoryPrisma from 'src/repositories/prisma/maintenance-appointment-manual-repository-prisma';
// import MaintenanceControlStockRepositoryPrisma from 'src/repositories/prisma/maintenance-control-stock-repository-prisma';
// import MaintenanceDisplacementRepositoryPrisma from 'src/repositories/prisma/maintenance-displacement-repository-prisma';
// import MaintenanceRequesterRepositoryPrisma from 'src/repositories/prisma/maintenance-requester-repository-prisma';
// import MaterialCodeRepositoryPrisma from 'src/repositories/prisma/material-code-repository-prisma';
// import MaterialRepositoryPrisma from 'src/repositories/prisma/material-repository-prisma';
// import MaterialServiceOrderRepositoryPrisma from 'src/repositories/prisma/material-service-order-repository-prisma';
// import { ModuleRepositoryPrisma } from 'src/repositories/prisma/module-repository-prisma';
// import NoteServiceOrderRepositoryPrisma from 'src/repositories/prisma/note-service-order-repository-prisma';
// import NoteStopServiceOrderRepositoryPrisma from 'src/repositories/prisma/note-stop-service-order-repository-prisma';
// import NumberRequestServiceRepositoryPrisma from 'src/repositories/prisma/number-request-service-repository';
// import PeriodicityBoundRepositoryPrisma from 'src/repositories/prisma/periodicity-bound-repository-prisma';
// import { PermissionRepositoryPrisma } from 'src/repositories/prisma/permission-repository-prisma';
// import PlanDescriptionRepositoryPrisma from 'src/repositories/prisma/plan-description-repository-prisma';
// import PlanMaintenanceRepositoryPrisma from 'src/repositories/prisma/plan-maintenance-repository-prisma';
// import PreventivePlanRepositoryPrisma from 'src/repositories/prisma/preventive-plan-repository-prisma.ts';
// import PriorityServiceOrderRepositoryPrisma from 'src/repositories/prisma/priority-service-order-repository-prisma';
// import RegisterHourTaskServiceRepositoryPrisma from 'src/repositories/prisma/register-hour-task-service-repository-prisma';
// import RegisterTurnRepositoryPrisma from 'src/repositories/prisma/register-turn-repository-prisma';
// import RequestServiceRepositoryPrisma from 'src/repositories/prisma/request-service-repository-prisma';
// import SectorExecutingRepositoryPrisma from 'src/repositories/prisma/sector-executing-repository-prisma';
// import ServiceOrderMaintainerRepositoryPrisma from 'src/repositories/prisma/service-order-maintainer-repository-prisma';
// import ServiceOrderRepositoryPrisma from 'src/repositories/prisma/service-order-repository-prisma';
// import ServiceOrderSignatureRepositoryPrisma from 'src/repositories/prisma/service-order-signature-repository-prisma';
// import SmartChecklistRepositoryPrisma from 'src/repositories/prisma/smart-checklist-repository-prisma';
// import StatusServiceOrderRepositoryPrisma from 'src/repositories/prisma/status-service-order-repository-prisma';
// import SubGroupRepositoryPrisma from 'src/repositories/prisma/subgroup-repository-prisma';
// import TaskPlanningMaintenanceRepositoryPrisma from 'src/repositories/prisma/task-planning-maintenance-repository-prisma';
// import TaskRepositoryPrisma from 'src/repositories/prisma/task-repository-prisma';
// import TaskServiceOrderRepositoryPrisma from 'src/repositories/prisma/task-service-order-repository-prisma';
// import TaskServiceOrderReturnRepositoryPrisma from 'src/repositories/prisma/task-service-order-return-repository-prisma';
// import TypeMaintenanceRepositoryPrisma from 'src/repositories/prisma/type-maintenance-repository-prisma';
// import TypeRequestRepositoryPrisma from 'src/repositories/prisma/type-request-repository-prisma';
// import { UserRepositoryPrisma } from 'src/repositories/prisma/user-repository-prisma';
// import RegisterHourTaskServiceRepository from 'src/repositories/register-hour-task-service-repository';
// import RegisterTurnRepository from 'src/repositories/register-turn-repository';
// import RequestServiceRepository from 'src/repositories/request-service-repository';
// import { SectorExecutingRepository } from 'src/repositories/sector-executing-repository';
// import ServiceOrderMaintainerRepository from 'src/repositories/service-order-maintainer-repository';
// import ServiceOrderRepository from 'src/repositories/service-order-repository';
// import ServiceOrderSignatureRepository from 'src/repositories/service-order-signature-repository';
// import SmartChecklistRepository from 'src/repositories/smart-checklist-repository';
// import { StatusServiceOrderRepository } from 'src/repositories/status-service-order-repository';
// import { SubGroupRepository } from 'src/repositories/subgroup-repository';
// import TaskPlanningMaintenanceRepository from 'src/repositories/task-planning-maintenance-repository';
// import TaskRepository from 'src/repositories/task-repository';
// import TaskServiceOrderRepository from 'src/repositories/task-service-order-repository';
// import TaskServiceOrderReturnRepository from 'src/repositories/task-service-order-return-repository';
// import { TypeMaintenanceRepository } from 'src/repositories/type-maintenance-repository';
// import TypeRequestRepository from 'src/repositories/type-request-repository';
// import { UserRepository } from 'src/repositories/user-repository';
import { DateService } from 'src/service/data.service';
import DescriptionPlanningService from 'src/service/descriptionPlanning.service';
import { ENVService } from 'src/service/env.service';
import { FileService } from 'src/service/file.service';
import { FTPService } from 'src/service/ftp.service';
import { ModuleService } from 'src/service/module.service';
// import { FamilyRepository } from '../../repositories/family-repository';
// import { FamilyRepositoryPrisma } from '../../repositories/prisma/family-repository-prisma';
import MaintainersController from './maintainers/maintainers.controller';
import MaintenanceController from './maintenance.controller';
import PlanController from './plan/plan.controller';
import PlanningController from './planning/planning.controller';
import ReportsController from './reports/reports.controller';
import AppServiceOrderController from './service-order/app/app-service-order.controller';
import AppServiceOrderChoiceController from './service-order/app/choices/service-order-app-choices.controller';
import SyncAppServiceOrderController from './service-order/app/sync/sync-app-service-order.controller';
import ChecklistServiceOrderController from './service-order/check-list/check-list-service-order-controller';
import ServiceOrderController from './service-order/service-order.controller';
// import PositionMaintainerRepository from 'src/repositories/position-maintainer-repository';
// import { PositionMaintainerRepositoryPrisma } from 'src/repositories/prisma/position-maintainer-repository-prisma';
// import LogPositionMaintainerRepository from 'src/repositories/log-position-maintainer-repository';
// import { LogPositionMaintainerRepositoryPrisma } from 'src/repositories/prisma/log-position-maintainer-repository-prisma';
// import MaintenancePerformanceRepository from 'src/repositories/maintenance-performance-repository';
// import MaintenancePerformanceRepositoryPrisma from 'src/repositories/prisma/maintenance-performance-repository-prisma';
// import BuyRepository from 'src/repositories/buy-repository';
// import { BuyRepositoryPrisma } from 'src/repositories/prisma/buy-repository-prisma';
// import BuyPriorityRepository from 'src/repositories/buy-priority-repository';
// import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';
// import BuyPriorityRepositoryPrisma from 'src/repositories/prisma/buy-priority-repository-prisma';
// import MaterialEstoqueRepositoryPrisma from 'src/repositories/prisma/material-estoque-repository-prisma';
// import BuyItemRepository from 'src/repositories/buy-item-repository';
// import BuyItemRepositoryPrisma from 'src/repositories/prisma/buy-item-repository-prisma';
// import LogDescriptionPlanRepository from 'src/repositories/log_description-plan-repository';
// import LogDescriptionPlanRepositoryPrisma from 'src/repositories/prisma/log_description-plan-repository-prisma';
// import CustoDiversosRepository from 'src/repositories/custo-diversos-repository';
// import CustoDiversosRepositoryPrisma from 'src/repositories/prisma/custo-diversos-repository-prisma';
import { TenantRepositoriesModule } from 'src/core/multi-tenant/tenant-repositories.module';
import RequestServiceController from './request-service/request-service.controller';
import OutController from './stock/out/out.controller';
// import StockInventoryRepositoryPrisma from 'src/repositories/prisma/stock-inventory-repository-prisma';
// import StockInventoryRepository from 'src/repositories/stock-inventory-repository';
@Module({
  imports: [
    //requestServiceModule,
    //StockModule,
    TenantRepositoriesModule,
  ],
  controllers: [
    MaintenanceController,
    ReportsController,
    ServiceOrderController,
    ChecklistServiceOrderController,
    PlanController,
    PlanningController,
    AppServiceOrderController,
    AppServiceOrderChoiceController,
    SyncAppServiceOrderController,
    MaintainersController,
    RequestServiceController,
    OutController,
  ],
  providers: [
    JwtService,
    ENVService,
    FileService,
    FTPService,
    DateService,
    ModuleService,
    DescriptionPlanningService,
    // {
    //   provide: BranchRepository,
    //   useClass: BranchRepositoryPrisma,
    // },
    // {
    //   provide: BranchesByUserRepository,
    //   useClass: BranchesByUserRepositoryPrisma,
    // },
    // // {
    // //   provide: LoginRepository,
    // //   useClass: LoginRepositoryPrisma,
    // // },
    // {
    //   provide: PermissionRepository,
    //   useClass: PermissionRepositoryPrisma,
    // },
    // {
    //   provide: ModuleRepository,
    //   useClass: ModuleRepositoryPrisma,
    // },
    // {
    //   provide: TypeMaintenanceRepository,
    //   useClass: TypeMaintenanceRepositoryPrisma,
    // },

    // {
    //   provide: ServiceOrderRepository,
    //   useClass: ServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: StatusServiceOrderRepository,
    //   useClass: StatusServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: NoteServiceOrderRepository,
    //   useClass: NoteServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: NoteStopServiceOrderRepository,
    //   useClass: NoteStopServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: MaterialServiceOrderRepository,
    //   useClass: MaterialServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: CostServiceOrderRepository,
    //   useClass: CostServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: FailureAnalysisServiceOrderRepository,
    //   useClass: FailureAnalysisServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: AttachmentsServiceOrderRepository,
    //   useClass: AttachmentsServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
    // {
    //   provide: MaintenanceRequesterRepository,
    //   useClass: MaintenanceRequesterRepositoryPrisma,
    // },
    // {
    //   provide: MaterialServiceOrderRepository,
    //   useClass: MaterialServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: PlanDescriptionRepository,
    //   useClass: PlanDescriptionRepositoryPrisma,
    // },
    // {
    //   provide: PlanMaintenanceRepository,
    //   useClass: PlanMaintenanceRepositoryPrisma,
    // },
    // {
    //   provide: SubGroupRepository,
    //   useClass: SubGroupRepositoryPrisma,
    // },
    // {
    //   provide: UserRepository,
    //   useClass: UserRepositoryPrisma,
    // },
    // {
    //   provide: EquipmentRepository,
    //   useClass: EquipmentRepositoryPrisma,
    // },
    // {
    //   provide: PriorityServiceOrderRepository,
    //   useClass: PriorityServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: ClassificationServiceOrderRepository,
    //   useClass: ClassificationServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: SmartChecklistRepository,
    //   useClass: SmartChecklistRepositoryPrisma,
    // },
    // {
    //   provide: LocationRepository,
    //   useClass: LocationRepositoryPrisma,
    // },
    // {
    //   provide: CheckListPeriodRepository,
    //   useClass: CheckListPeriodRepositoryPrisma,
    // },
    // {
    //   provide: CheckListRepository,
    //   useClass: CheckListRepositoryPrisma,
    // },
    // {
    //   provide: CheckListItemRepository,
    //   useClass: CheckListItemRepositoryPrisma,
    // },
    // {
    //   provide: CheckListTurnRepository,
    //   useClass: CheckListTurnRepositoryPrisma,
    // },
    // {
    //   provide: RegisterTurnRepository,
    //   useClass: RegisterTurnRepositoryPrisma,
    // },
    // {
    //   provide: PeriodicityBoundRepository,
    //   useClass: PeriodicityBoundRepositoryPrisma,
    // },
    // {
    //   provide: SectorExecutingRepository,
    //   useClass: SectorExecutingRepositoryPrisma,
    // },
    // {
    //   provide: DescriptionPlanningRepository,
    //   useClass: DescriptionPlanningRepositoryPrisma,
    // },
    // {
    //   provide: FamilyRepository,
    //   useClass: FamilyRepositoryPrisma,
    // },
    // {
    //   provide: ServiceOrderMaintainerRepository,
    //   useClass: ServiceOrderMaintainerRepositoryPrisma,
    // },
    // {
    //   provide: ColaboratorRepository,
    //   useClass: ColaboratorRepositoryPrisma,
    // },
    // {
    //   provide: EmployeeRepository,
    //   useClass: EmployeeRepositoryPrisma,
    // },
    // {
    //   provide: TypeRequestRepository,
    //   useClass: TypeRequestRepositoryPrisma,
    // },
    // {
    //   provide: ComponentsRepository,
    //   useClass: ComponentsRepositoryPrisma,
    // },
    // {
    //   provide: CostCenterRepository,
    //   useClass: CostCenterRepositoryPrisma,
    // },
    // {
    //   provide: EquipmentTypeRepository,
    //   useClass: EquipmentTypeRepositoryPrisma,
    // },
    // {
    //   provide: RequestServiceRepository,
    //   useClass: RequestServiceRepositoryPrisma,
    // },
    // {
    //   provide: LogRequestServiceRepository,
    //   useClass: LogRequestServiceRepositoryPrisma,
    // },
    // {
    //   provide: LogServiceOrderMaintainerRepository,
    //   useClass: LogServiceOrderMaintainerRepositoryPrisma,
    // },
    // {
    //   provide: TaskRepository,
    //   useClass: TaskRepositoryPrisma,
    // },
    // {
    //   provide: TaskPlanningMaintenanceRepository,
    //   useClass: TaskPlanningMaintenanceRepositoryPrisma,
    // },
    // {
    //   provide: LogServiceOrderRepository,
    //   useClass: LogServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: NumberRequestServiceRepository,
    //   useClass: NumberRequestServiceRepositoryPrisma,
    // },
    // {
    //   provide: AttachmentRequestServiceRepository,
    //   useClass: AttachmentRequestServiceRepositoryPrisma,
    // },
    // {
    //   provide: TaskServiceOrderRepository,
    //   useClass: TaskServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: LegendTaskRepository,
    //   useClass: LegendTaskRepositoryPrisma,
    // },
    // {
    //   provide: LogTaskServiceOrderRepository,
    //   useClass: LogTaskServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: LogRegisterHourTaskServiceRepository,
    //   useClass: LogRegisterHourTaskServiceRepositoryPrisma,
    // },
    // {
    //   provide: RegisterHourTaskServiceRepository,
    //   useClass: RegisterHourTaskServiceRepositoryPrisma,
    // },
    // {
    //   provide: LogAttachmentServiceOrderRepository,
    //   useClass: LogAttachmentServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: LogDescriptionCostServiceOrderRepository,
    //   useClass: LogDescriptionCostServiceOrderPrisma,
    // },
    // {
    //   provide: LogCostServiceOrderRepository,
    //   useClass: LogCostServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: LogAttachmentRequestServiceRepository,
    //   useClass: LogAttachmentRequestServiceRepositoryPrisma,
    // },
    // {
    //   provide: LogMaterialServiceOrderRepository,
    //   useClass: LogMaterialServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: TaskServiceOrderReturnRepository,
    //   useClass: TaskServiceOrderReturnRepositoryPrisma,
    // },
    // {
    //   provide: LogTaskOptionRepository,
    //   useClass: LogTaskOptionRepositoryPrisma,
    // },
    // {
    //   provide: LogTaskListOptionRepository,
    //   useClass: LogTaskListOptionRepositoryPrisma,
    // },
    // {
    //   provide: LogTaskServiceOrderReturnRepository,
    //   useClass: LogTaskServiceOrderReturnRepositoryPrisma,
    // },
    // {
    //   provide: MaintenanceAppointmentManualRepository,
    //   useClass: MaintenanceAppointmentManualRepositoryPrisma,
    // },
    // {
    //   provide: LogMaintenanceAppointmentManualRepository,
    //   useClass: LogMaintenanceAppointmentManualRepositoryPrisma,
    // },
    // {
    //   provide: AttachmentTaskServiceRepository,
    //   useClass: AttachmentTaskServiceRepositoryPrisma,
    // },
    // {
    //   provide: LogAttachmentTaskServiceRepository,
    //   useClass: LogAttachmentTaskServiceRepositoryPrisma,
    // },
    // {
    //   provide: MaintenanceDisplacementRepository,
    //   useClass: MaintenanceDisplacementRepositoryPrisma,
    // },
    // {
    //   provide: MaterialRepository,
    //   useClass: MaterialRepositoryPrisma,
    // },
    // {
    //   provide: LogMaterialRepository,
    //   useClass: LogMaterialRepositoryPrisma,
    // },
    // {
    //   provide: LogEmployeesRepository,
    //   useClass: LogEmployeesRepositoryPrisma,
    // },
    // {
    //   provide: LogEquipmentRepository,
    //   useClass: LogEquipmentRepositoryPrisma,
    // },
    // {
    //   provide: LogStatusRequestServiceRepository,
    //   useClass: LogStatusRequestServiceRepositoryPrisma,
    // },
    // {
    //   provide: LogUnityOfMensurePlansRepository,
    //   useClass: LogUnityOfMensurePlansRepositoryPrisma,
    // },
    // {
    //   provide: ControlClosedOrderServiceRepository,
    //   useClass: ControlClosedOrderServiceRepositoryPrisma,
    // },
    // {
    //   provide: JustifyStatusServiceOrderRepository,
    //   useClass: JustifyStatusServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: DescriptionPlanRepository,
    //   useClass: DescriptionPlanRepositoryPrisma,
    // },
    // {
    //   provide: PreventivePlanRepository,
    //   useClass: PreventivePlanRepositoryPrisma,
    // },
    // {
    //   provide: LogAppointmentServiceOrderRepository,
    //   useClass: LogAppointmentServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: LogServiceOrderSignatureRepository,
    //   useClass: LogServiceOrderSignatureRepositoryPrisma,
    // },
    // {
    //   provide: ServiceOrderSignatureRepository,
    //   useClass: ServiceOrderSignatureRepositoryPrisma,
    // },
    // {
    //   provide: MaintenanceControlStockRepository,
    //   useClass: MaintenanceControlStockRepositoryPrisma,
    // },
    // {
    //   provide: NoteStopServiceOrderRepository,
    //   useClass: NoteStopServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: LogNoteStopServiceOrderRepository,
    //   useClass: LogNoteStopServiceOrderRepositoryPrisma,
    // },
    // {
    //   provide: MaterialCodeRepository,
    //   useClass: MaterialCodeRepositoryPrisma,
    // },
    // {
    //   provide: PositionMaintainerRepository,
    //   useClass: PositionMaintainerRepositoryPrisma,
    // },
    // {
    //   provide: LogPositionMaintainerRepository,
    //   useClass: LogPositionMaintainerRepositoryPrisma,
    // },
    // {
    //   provide: MaintenancePerformanceRepository,
    //   useClass: MaintenancePerformanceRepositoryPrisma,
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
    //   provide: BuyPriorityRepository,
    //   useClass: BuyPriorityRepositoryPrisma,
    // },
    // {
    //   provide: MaterialEstoqueRepository,
    //   useClass: MaterialEstoqueRepositoryPrisma,
    // },
    // {
    //   provide: LogDescriptionPlanRepository,
    //   useClass: LogDescriptionPlanRepositoryPrisma,
    // },
    // {
    //   provide: CustoDiversosRepository,
    //   useClass: CustoDiversosRepositoryPrisma,
    // },
    // {
    //   provide: CompanyRepository,
    //   useClass: CompanyRepositoryPrisma,
    // },
    // {
    //   provide: StockInventoryRepository,
    //   useClass: StockInventoryRepositoryPrisma,
    // },
  ],
})
export class maintenanceModule {}
