import {
  Prisma,
  smartnewsystem_abastecimento_entrada_produto,
} from '@prisma/client';
import IInputProduct from 'src/models/IInputProduct';

export default abstract class FuellingInputProductRepository {
  abstract listByInput(
    inputId: number,
  ): Promise<IInputProduct['listByInput'][]>;

  abstract findById(id: number): Promise<IInputProduct['findById'] | null>;

  abstract create(
    data: Prisma.smartnewsystem_abastecimento_entrada_produtoUncheckedCreateInput,
  ): Promise<smartnewsystem_abastecimento_entrada_produto>;

  abstract update(
    id: number,
    data: Prisma.smartnewsystem_abastecimento_entrada_produtoUncheckedUpdateInput,
  ): Promise<smartnewsystem_abastecimento_entrada_produto>;

  abstract delete(id: number): Promise<boolean>;
}
