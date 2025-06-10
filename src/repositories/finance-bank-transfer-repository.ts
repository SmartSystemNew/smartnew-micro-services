import {
  Prisma,
  smartnewsystem_financeiro_banco_transferencia,
} from '@prisma/client';
import IFinanceBankTransfer from 'src/models/IFinanceBankTransfer';

export default abstract class FinanceBankTransferRepository {
  abstract listByClient(
    clientId: number,
  ): Promise<IFinanceBankTransfer['listByClient'][]>;

  abstract findById(id: number): Promise<IFinanceBankTransfer['findById']>;

  abstract createTransaction(
    user: { clientId: number; login: string },
    dueDate: Date,
    dateFormat: Date,
    value: number,
    bankOriginId: number,
    bankDestinationId: number,
    branchId: number,
    providerId: number,
    compositionId: number,
    financeTypePaymentId: number,
    typeDocumentId: number,
    materialId: number,
    contractTypeInputId: number,
  ): Promise<{
    success: boolean;
    errorMessage: string | null;
    message: string | null;
  }>;
  abstract create(
    data: Prisma.smartnewsystem_financeiro_banco_transferenciaUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_banco_transferencia>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_banco_transferenciaUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_banco_transferencia>;

  abstract delete(id: number): Promise<boolean>;

  abstract deleteTransaction(id: number): Promise<{
    success: boolean;
    errorMessage: string | null;
    message: string;
  }>;
}
