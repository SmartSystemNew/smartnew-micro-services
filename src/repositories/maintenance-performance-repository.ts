import { Prisma, sofman_prospect_escala_trabalho } from '@prisma/client';
import IMaintenancePerformance from 'src/models/IMaintenancePerformance';

export default abstract class MaintenancePerformanceRepository {
  abstract gridIndicatorPerformanceMaintenance(
    clientId: number,
    startDate: string,
    endDate: string,
    page: number | null,
    perPage: number | null,
    filters?: {
      equipamento?: string;
      localizacao?: string;
      familia?: string;
      tipo_equipamento?: string;
      ordensServico?: number[];
      globalFilter?: string;
      filterColumn?: string;
      filterText?: string;
    },
  ): Promise<IMaintenancePerformance['gridIndicatorPerformanceMaintenance'][]>;

  abstract gridPerformance(
    clienteId: number,
    idFilial: number[],
    startDate: Date,
    endDate: Date,
    index: number | null,
    perPage: number | null,
    filter?: Prisma.controle_de_ordens_de_servicoWhereInput | null,
  ): Promise<IMaintenancePerformance['gridPerformance'][]>;

  abstract listProspectScale(
    id: number,
  ): Promise<sofman_prospect_escala_trabalho[]>;
}
