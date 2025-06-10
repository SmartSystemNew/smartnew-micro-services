import { smartnewsystem_imagem_login, Prisma } from '@prisma/client';

export default abstract class ImageLoginRepository {
  abstract findById(id: number): Promise<smartnewsystem_imagem_login | null>;
  abstract listImage(
    filter?: Prisma.smartnewsystem_imagem_loginWhereInput | null,
  ): Promise<smartnewsystem_imagem_login[]>;

  abstract create(
    data: Prisma.smartnewsystem_imagem_loginUncheckedCreateInput,
  ): Promise<smartnewsystem_imagem_login>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_imagem_loginUncheckedUpdateInput,
  ): Promise<smartnewsystem_imagem_login>;

  abstract delete(id: number): Promise<boolean>;
}
