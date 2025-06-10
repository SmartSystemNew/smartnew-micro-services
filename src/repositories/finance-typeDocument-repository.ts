import {
  Prisma,
  smartnewsystem_financeiro_tipo_documento,
} from '@prisma/client';
import IFinanceTypeDocument from 'src/models/IFinanceTypeDocument';

export default abstract class FinanceTypeDocumentRepository {
  abstract create(
    data: Prisma.smartnewsystem_financeiro_tipo_documentoUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_tipo_documento>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_tipo_documentoUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_tipo_documento>;

  abstract delete(id: number): Promise<boolean>;

  abstract listByClient(
    clientId: number,
  ): Promise<IFinanceTypeDocument['listByClient'][]>;
  abstract findById(
    id: number,
  ): Promise<IFinanceTypeDocument['findById'] | null>;

  abstract findByClientAndName(
    clientId: number,
    name: string,
  ): Promise<IFinanceTypeDocument['findByClientAndName'] | null>;
}
