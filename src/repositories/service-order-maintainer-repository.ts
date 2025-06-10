import { Prisma, smartnewsystem_mantenedores_os } from '@prisma/client';
import IServiceOrderMaintainer from 'src/models/IServiceOrderMaintainer';

export default abstract class ServiceOrderMaintainerRepository {
  abstract create(
    data: Prisma.smartnewsystem_mantenedores_osUncheckedCreateInput,
  ): Promise<smartnewsystem_mantenedores_os>;

  abstract findById(id: number): Promise<smartnewsystem_mantenedores_os | null>;

  abstract createOrderAndCollaborator(
    data: Prisma.smartnewsystem_mantenedores_osUncheckedCreateInput,
  ): Promise<smartnewsystem_mantenedores_os>;

  abstract updateOrderAndCollaborattor(
    id: number,
    data: Prisma.smartnewsystem_mantenedores_osUncheckedUpdateInput,
  ): Promise<smartnewsystem_mantenedores_os>;

  abstract delete(id: number): Promise<boolean>;

  abstract findByOrderAndCollaborator(
    orderId: number,
    collaboratorId: number,
  ): Promise<smartnewsystem_mantenedores_os | null>;

  abstract listByService(
    serviceOrderId: number,
  ): Promise<smartnewsystem_mantenedores_os[]>;

  abstract createOrdersMaintainerInBulk(
    ordersId: number[],
    collaboratorId: number[],
  ): Promise<void>;

  abstract listAsyncMaintainers(
    branchId: number[],
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput,
  ): Promise<IServiceOrderMaintainer['listAsyncMaintainers'][]>;

  abstract listByBranch(
    branches: number[],
    filter?: Prisma.smartnewsystem_mantenedores_osWhereInput | null,
  ): Promise<IServiceOrderMaintainer['listByBranch'][]>;
}
