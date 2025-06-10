import {
  Prisma,
  smartnewsystem_financeiro_numero_tipo_documento,
} from '@prisma/client';

export default abstract class FinanceNumberTypeDocumentRepository {
  abstract insert(
    data: Prisma.smartnewsystem_financeiro_numero_tipo_documentoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_numero_tipo_documento>;

  abstract lastNumber(
    clientId: number,
    typeDocumentId: number,
  ): Promise<number>;
}
