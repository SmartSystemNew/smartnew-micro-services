import {
  Prisma,
  smartnewsystem_manutencao_tarefa_servico_anexo,
} from '@prisma/client';
import IAttachmentTaskService from 'src/models/IAttachmentTaskService';

export default abstract class AttachmentTaskServiceRepository {
  abstract findByTask(
    taskId: number,
  ): Promise<smartnewsystem_manutencao_tarefa_servico_anexo[]>;

  abstract findById(
    id: number,
  ): Promise<IAttachmentTaskService['findById'] | null>;
  abstract create(
    data: Prisma.smartnewsystem_manutencao_tarefa_servico_anexoUncheckedCreateInput,
  ): Promise<smartnewsystem_manutencao_tarefa_servico_anexo>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_manutencao_tarefa_servico_anexoUncheckedUpdateInput,
  ): Promise<smartnewsystem_manutencao_tarefa_servico_anexo>;

  abstract delete(id: number): Promise<boolean>;
}
