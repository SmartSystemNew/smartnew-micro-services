import { Prisma, sofman_cad_solicitantes } from '@prisma/client';
import IMaintenanceRequester from 'src/models/IMaintenanceRequester';

export default abstract class MaintenanceRequesterRepository {
  abstract findById(
    id: number,
  ): Promise<IMaintenanceRequester['findById'] | null>;
  abstract listByBranch(
    branches: number[],
  ): Promise<IMaintenanceRequester['listByBranches'][]>;

  abstract listByClient(
    idClient: number,
    filter?: Prisma.sofman_cad_solicitantesWhereInput | null,
  ): Promise<IMaintenanceRequester['listByClient'][]>;

  abstract create(
    data: Prisma.sofman_cad_solicitantesUncheckedCreateInput,
  ): Promise<sofman_cad_solicitantes>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_solicitantesUncheckedUpdateInput,
  ): Promise<sofman_cad_solicitantes>;

  abstract delete(id: number): Promise<boolean>;
}
