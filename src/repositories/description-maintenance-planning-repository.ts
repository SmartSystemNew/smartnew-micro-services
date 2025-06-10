import {
  Prisma,
  sofman_descricao_planejamento_manutencao,
} from '@prisma/client';
import { IDescriptionMaintenancePlanning } from 'src/models/IDescriptionMaintenancePlanning';

export default abstract class DescriptionMaintenancePlanningRepository {
  abstract insert(
    data: Prisma.sofman_descricao_planejamento_manutencaoUncheckedCreateInput,
  ): Promise<sofman_descricao_planejamento_manutencao>;

  abstract findByEquipmentCode(
    clientId: number,
    code: string,
  ): Promise<IDescriptionMaintenancePlanning['findByEquipmentCode'] | null>;

  abstract findByEquipmentAndNameAndUnityAndSectorAndType(
    clientId: number,
    equipmentId: number,
    name: string,
    unityId: number,
    sectorId: number,
    typeMaintenanceId: number,
  ): Promise<sofman_descricao_planejamento_manutencao | null>;

  abstract findByEquipmentAndName(
    clientId: number,
    equipmentId: number,
    name: string,
  ): Promise<sofman_descricao_planejamento_manutencao | null>;
}
