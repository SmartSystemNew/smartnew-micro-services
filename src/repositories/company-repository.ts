import { Prisma, cadastro_de_empresas } from '@prisma/client';
import { ICompany } from 'src/models/ICompany';

export abstract class CompanyRepository {
  abstract insert(
    data: Prisma.cadastro_de_empresasUncheckedCreateInput,
  ): Promise<cadastro_de_empresas>;

  abstract findById(id: number): Promise<ICompany['findById'] | null>;

  abstract update(
    data: Prisma.cadastro_de_empresasUncheckedCreateInput,
  ): Promise<cadastro_de_empresas>;
}
