import { smartnewsystem_configuracao_tabela, Prisma } from '@prisma/client';

export default abstract class ConfigTableRepository {
  abstract findById(
    id: number,
  ): Promise<smartnewsystem_configuracao_tabela | null>;

  abstract listByClient(
    clientId: number,
    filter?: Prisma.smartnewsystem_configuracao_tabelaWhereInput,
  ): Promise<smartnewsystem_configuracao_tabela[]>;

  abstract findByClientOnly(
    clientId: number,
    filter?: Prisma.smartnewsystem_configuracao_tabelaWhereInput,
  ): Promise<smartnewsystem_configuracao_tabela | null>;

  abstract findByUserOnly(
    clientId: number,
    user: string,
    filter?: Prisma.smartnewsystem_configuracao_tabelaWhereInput,
  ): Promise<smartnewsystem_configuracao_tabela | null>;

  abstract create(
    data: Prisma.smartnewsystem_configuracao_tabelaUncheckedCreateInput,
  ): Promise<smartnewsystem_configuracao_tabela>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_configuracao_tabelaUncheckedUpdateInput,
  ): Promise<smartnewsystem_configuracao_tabela>;

  abstract delete(id: number): Promise<boolean>;
}
