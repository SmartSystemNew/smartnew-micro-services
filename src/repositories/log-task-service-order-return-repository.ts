import {
  log_smartnewsystem_manutencao_tarefas_retorno,
  Prisma,
} from '@prisma/client';
import ILogTaskServiceOrderReturn from 'src/models/ILogTaskServiceOrderReturn';

export default abstract class LogTaskServiceOrderReturnRepository {
  abstract listByClient(
    clientId: number,
    filter?: Prisma.log_smartnewsystem_manutencao_tarefas_retornoWhereInput | null,
  ): Promise<ILogTaskServiceOrderReturn['listByClient'][]>;

  abstract last(
    where?: Prisma.log_smartnewsystem_manutencao_tarefas_retornoWhereInput | null,
  ): Promise<log_smartnewsystem_manutencao_tarefas_retorno>;

  abstract lasts(
    where?: Prisma.log_smartnewsystem_manutencao_tarefas_retornoWhereInput | null,
  ): Promise<log_smartnewsystem_manutencao_tarefas_retorno[]>;

  abstract update(
    id: number,
    data: Prisma.log_smartnewsystem_manutencao_tarefas_retornoUncheckedUpdateInput,
  ): Promise<log_smartnewsystem_manutencao_tarefas_retorno>;
}
