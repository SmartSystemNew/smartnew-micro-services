import { Prisma, mod_seguranca_permissoes_usuario } from '@prisma/client';

export default abstract class UserPermissionRepository {
  abstract update(
    id: number,
    login: string,
    dataUpdate: Prisma.mod_seguranca_permissoes_usuarioUncheckedUpdateInput,
    dataCreate: Prisma.mod_seguranca_permissoes_usuarioUncheckedCreateInput,
  ): Promise<mod_seguranca_permissoes_usuario>;
}
