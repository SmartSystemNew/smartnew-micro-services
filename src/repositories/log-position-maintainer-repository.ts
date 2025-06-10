// import { log_sofman_cad_cargos_mantenedores } from '@prisma/client';
import { ILogPositionMaintainer } from 'src/models/ILogPositionMaintainer';

export default abstract class LogPositionMaintainerRepository {
  abstract findById(id: number): Promise<ILogPositionMaintainer['findById']>;

  abstract list(clientId: number): Promise<ILogPositionMaintainer['list'][]>;
}
