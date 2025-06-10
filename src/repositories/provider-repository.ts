import { Prisma, sofman_cad_fornecedores } from '@prisma/client';
import { IProvider } from 'src/models/IProvider';

export default abstract class ProviderRepository {
  abstract create(
    data: Prisma.sofman_cad_fornecedoresUncheckedCreateInput,
  ): Promise<sofman_cad_fornecedores>;
  abstract findByClientAndCNPJ(
    clientId: number,
    cnpj: string,
  ): Promise<IProvider['findByClientAndCNPJ'] | null>;
  abstract listByClient(clientId: number): Promise<IProvider['listByClient'][]>;
  abstract listByBranches(
    branches: number[],
    clientId: number,
  ): Promise<IProvider['listByClient'][]>;
  abstract findById(id: number): Promise<IProvider['findById'] | null>;
}
