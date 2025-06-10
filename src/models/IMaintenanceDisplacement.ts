import { Decimal } from '@prisma/client/runtime/library';

export default interface IMaintenanceDisplacement {
  listByOrder: {
    id: number;
    inicio: number;
    fim: number;
    distance: string;
    distance_going: string;
    distance_return: string;
    serviceOrder: {
      ID: number;
    };
    pathDisplacement: {
      id: number;
      tipo: number;
      longitude: Decimal;
      latitude: Decimal;
    }[];
  };
  listByBranches: {
    id: number;
    inicio: number;
    fim: number;
    distance: string;
    distance_going: string;
    distance_return: string;
    serviceOrder: {
      ID: number;
    };
    pathDisplacement: {
      id: number;
      tipo: number;
      longitude: Decimal;
      latitude: Decimal;
    }[];
  };
  listByServiceOrder: {
    id: number;
    inicio: number;
    fim: number;
    distance: string;
    distance_going: string;
    distance_return: string;
    log_date: Date | null;
    serviceOrder: {
      ID: number;
    };
    pathDisplacement: {
      id: number;
      tipo: number;
      longitude: Decimal;
      latitude: Decimal;
      log_date: Date | null;
    }[];
  };
}
