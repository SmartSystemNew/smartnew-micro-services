import { Prisma, smartnewsystem_alcadas } from '@prisma/client';
import { IElevation } from 'src/models/IElevation';

export default abstract class ElevationRepository {
  abstract listByBranchAndModule(
    branchId: number,
    moduleId: number,
  ): Promise<smartnewsystem_alcadas[]>;
  abstract findById(id: number): Promise<IElevation['findById'] | null>;
  abstract findByLoginAndModuleAndBlank(
    login: string,
    branches: number[],
    moduleId: number,
    blank: string,
  ): Promise<smartnewsystem_alcadas[]>;
  abstract listByBranchAndModuleAndBlank(
    branchId: number,
    moduleId: number,
    blank: string,
  ): Promise<smartnewsystem_alcadas[]>;

  abstract listByBranchAndModuleAndBlankAndActive(
    branchId: number,
    moduleId: number,
    blank: string,
  ): Promise<smartnewsystem_alcadas[]>;

  abstract create(
    data: Prisma.smartnewsystem_alcadasUncheckedCreateInput,
  ): Promise<smartnewsystem_alcadas>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_alcadasUpdateInput,
  ): Promise<smartnewsystem_alcadas>;

  abstract delete(id: number): Promise<boolean>;
}
