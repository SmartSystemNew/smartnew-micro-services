import { IFindByLogin, IFindGroup, IListUserByClient } from 'src/models/IUser';

export abstract class UserRepository {
  abstract findGroup(login: string): Promise<IFindGroup | null>;
  abstract listUserByClient(clientId: number): Promise<IListUserByClient[]>;
  abstract findByLogin(login: string): Promise<IFindByLogin | null>;

  abstract listUserByClientAndActive(
    clientId: number,
  ): Promise<IListUserByClient[]>;
}
