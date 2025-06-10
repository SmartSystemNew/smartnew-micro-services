import { $Enums } from '@prisma/client';

export default interface IFuellingControl {
  listByClient: {
    id: number;
    filtro_dia: number;
    modelo_PU: $Enums.smartnewsystem_abastecimento_controle_modelo_pu | null;
    inicio_controle: Date | null;
    company: {
      ID: number;
      razao_social: string;
    };
  };
}
