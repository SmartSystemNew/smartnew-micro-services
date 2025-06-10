import {
  Prisma,
  smartnewsystem_gestor_empresa_x_usuario,
} from '@prisma/client';
import { IManagerCompany } from 'src/models/IManagerCompany';

export default abstract class ManagerCompanyRepository {
  abstract listByLogin(
    login: string,
  ): Promise<IManagerCompany['listByLogin'][]>;

  abstract create(
    data: Prisma.smartnewsystem_gestor_empresa_x_usuarioUncheckedCreateInput,
  ): Promise<smartnewsystem_gestor_empresa_x_usuario>;

  abstract delete(
    id: number,
    data: Prisma.smartnewsystem_gestor_empresa_x_usuarioUncheckedUpdateInput,
  ): Promise<smartnewsystem_gestor_empresa_x_usuario>;
}
