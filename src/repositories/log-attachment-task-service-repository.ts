import { Prisma } from '@prisma/client';
import ILogAttachmentTaskServiceOrder from 'src/models/ILogAttachmentTaskService';

export default abstract class LogAttachmentTaskServiceRepository {
  abstract listByBranch(
    branches: number[],
    filter?: Prisma.log_smartnewsystem_manutencao_tarefa_servico_anexoWhereInput | null,
  ): Promise<ILogAttachmentTaskServiceOrder['listByBranch'][]>;
}
