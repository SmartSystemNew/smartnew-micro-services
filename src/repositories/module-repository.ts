import { IListAll } from 'src/models/IModule';

export abstract class ModuleRepository {
  abstract listAll(): Promise<IListAll[]>;
}
