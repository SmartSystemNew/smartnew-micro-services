import { Prisma, smartnewsystem_contrato_tipo_insumo } from '@prisma/client';
import { IContractTypeInput } from 'src/models/IContractTypeInput';

export default abstract class ContractTypeInputRepository {
  abstract create(
    data: Prisma.smartnewsystem_contrato_tipo_insumoUncheckedCreateInput,
  ): Promise<smartnewsystem_contrato_tipo_insumo>;
  abstract listByClient(
    clientId: number,
  ): Promise<IContractTypeInput['listByClient'][]>;

  abstract findById(id: number): Promise<IContractTypeInput['findById'] | null>;

  abstract findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<IContractTypeInput['findByClientAndName'] | null>;
}
