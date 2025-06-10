import { Prisma, controle_de_ordens_de_servico } from '@prisma/client';
import IServiceOrder from 'src/models/IServiceOrder';

export default abstract class ServiceOrderRepository {
  abstract findByWhere(
    where: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['findByWhere'] | null>;
  abstract findById(id: number): Promise<IServiceOrder['findById'] | null>;
  abstract findByIdAndRequest(
    id: number,
    requestId: number,
  ): Promise<IServiceOrder['findByIdAndRequest'] | null>;

  abstract listByMaintenairs(
    clientId: number,
    branches: number[],
    colaborador_id: number,
    filters?: Prisma.controle_de_ordens_de_servicoWhereInput | null,
  ): Promise<IServiceOrder['listByMaintenairs'][]>;

  abstract findByCodeAndEquipment(
    clientId: number,
    code: string,
    equipmentId: number,
  ): Promise<IServiceOrder['findByCodeAndEquipment'] | null>;

  abstract listByClient(
    clientId: number,
  ): Promise<IServiceOrder['listByClient'][]>;

  abstract listPositionMaterial(
    branchId: number[],
    filters?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listPositionMaterial'][]>;

  abstract listByWhere(
    where: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listByWhere'][]>;
  abstract listByBranch(
    branchId: number[],
  ): Promise<IServiceOrder['listByBranch'][]>;

  abstract listServiceOrder(
    branchId: number[],
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listServiceOrder'][]>;

  abstract listServiceOrderByKanban(
    branchId: number[],
    index?: number | null,
    perPage?: number | null,
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listServiceOrderByKanban'][]>;

  abstract listForStatusTable(
    branchId: number[],
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listForStatusTable'][]>;

  abstract countListServiceOrder(
    branchId: number[],
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<number>;

  abstract listOrdensMaintainer(
    branchId: number[],
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listOrdensMaintainer'][]>;

  abstract listOrdersCalendarTypeMaintenance(
    branchId: number[],
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listOrdersCalendarTypeMaintenance'][]>;

  abstract listOrdersCalendar(
    branchId: number[],
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listOrdersCalendar'][]>;

  abstract listServiceOrderWithFilter(
    branchId: number[],
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['listServiceOrderWithFilter'][]>;

  abstract graficPerformanceIndicatorsKPIS(
    clientId: number,
    startDate: string,
    endDate: string,
    typeMaintenance?: number[],
  ): Promise<any[]>;

  abstract stopRecordTypeMaintenance(
    branchId: number[],
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrder['stopRecordTypeMaintenance'][]>;

  abstract serviceOrderById(
    id: number,
  ): Promise<IServiceOrder['serviceOrderById'] | null>;

  abstract findUnissgnedOrders(
    orderId: number[],
    clientId: number,
  ): Promise<Partial<IServiceOrder['listByClient']>[]>;

  abstract create(
    data: Prisma.controle_de_ordens_de_servicoUncheckedCreateInput,
  ): Promise<controle_de_ordens_de_servico>;
  abstract update(
    id: number,
    data: Prisma.controle_de_ordens_de_servicoUncheckedUpdateInput,
  ): Promise<controle_de_ordens_de_servico>;
  abstract delete(id: number): Promise<boolean>;

  abstract countOrderServiceGroupEquipmentWithNoteStop(
    clientId: number,
    branchId: number[],
    startDate: Date,
    endDate: Date,
  ): Promise<IServiceOrder['countOrderServiceGroupEquipmentWithNoteStop'][]>;
}
