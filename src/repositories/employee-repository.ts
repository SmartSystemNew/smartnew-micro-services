import { Prisma, sofman_cad_colaboradores } from '@prisma/client';
import { IEmployee } from 'src/models/Employee';

export abstract class EmployeeRepository {
  abstract listByClientId(
    clientId: number,
    filter?: Prisma.sofman_cad_colaboradoresWhereInput | null,
  ): Promise<IEmployee['listByClientId'][]>;
  abstract findById(id: number): Promise<IEmployee['findById'] | null>;

  abstract create(
    data: Prisma.sofman_cad_colaboradoresUncheckedCreateInput,
  ): Promise<sofman_cad_colaboradores>;

  abstract delete(id: number): Promise<boolean>;

  abstract listByClient(
    idClient: number,
    filters?: Prisma.sofman_cad_colaboradoresWhereInput | any,
    fields?: string[],
  ): Promise<IEmployee['listByClient'][]>;

  abstract selectMaintainersByClient(
    idClient: number,
    userLogin: string,
    idServiceOrder?: number,
  ): Promise<{ id: number; nome: string }[]>;

  abstract update(
    id: number,
    data: Prisma.sofman_cad_colaboradoresUncheckedUpdateInput,
  ): Promise<sofman_cad_colaboradores>;
}
