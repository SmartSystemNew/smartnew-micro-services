import {
  Prisma,
  log_smartnewsystem_financeiro_descricao_titulos,
} from '@prisma/client';

export default abstract class LogFinanceRepository {
  abstract insert(
    data: Prisma.log_smartnewsystem_financeiro_descricao_titulosUncheckedCreateInput,
  ): Promise<log_smartnewsystem_financeiro_descricao_titulos>;
}
