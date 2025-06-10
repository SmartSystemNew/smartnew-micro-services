import {
  $Enums,
  Prisma,
  smartnewsystem_financeiro_descricao_titulos,
} from '@prisma/client';
import { IFinance } from 'src/models/IFinance';

export default abstract class FinanceRepository {
  abstract insert(
    data: Prisma.smartnewsystem_financeiro_descricao_titulosUncheckedCreateInput,
  ): Promise<smartnewsystem_financeiro_descricao_titulos>;

  abstract findLast(
    clientId: number,
  ): Promise<smartnewsystem_financeiro_descricao_titulos>;

  abstract findIfExist(
    typeDocument: number,
    issue: number,
    sender: number,
    numberFiscal: string,
    direction: 'pagar' | 'receber',
  ): Promise<smartnewsystem_financeiro_descricao_titulos | null>;

  abstract findByNotControl(
    clientId: number,
    type: 'pagar' | 'receber',
  ): Promise<smartnewsystem_financeiro_descricao_titulos[]>;

  abstract listFinanceByClient(
    clientId: number,
  ): Promise<IFinance['listFinanceByClient'][]>;
  abstract listByClientAndStatus(
    clientId: number,
    type: $Enums.smartnewsystem_financeiro_descricao_titulos_direcao,
    status: $Enums.smartnewsystem_financeiro_descricao_titulos_status,
  ): Promise<IFinance['listByClientAndStatus'][]>;

  abstract listByFilterDynamic(
    where: Prisma.smartnewsystem_financeiro_descricao_titulosWhereInput,
  ): Promise<IFinance['listByFilterDynamic'][]>;

  abstract findById(id: number): Promise<IFinance['findById'] | null>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_financeiro_descricao_titulosUncheckedUpdateInput,
  ): Promise<smartnewsystem_financeiro_descricao_titulos>;

  abstract delete(id: number): Promise<boolean>;
}
