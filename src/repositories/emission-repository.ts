import { Prisma, smartnewsystem_financeiro_emissao } from '@prisma/client';
import { IEmission } from 'src/models/IEmission';

export default abstract class EmissionRepository {
  abstract findById(id: number): Promise<IEmission['findById'] | null>;
  abstract insert(
    data: Prisma.smartnewsystem_financeiro_emissaoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_emissao>;
  abstract update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_emissaoUncheckedUpdateInput,
  ): Promise<IEmission['update']>;
  abstract delete(id: number): Promise<boolean>;
}
