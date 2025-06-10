import { IFindLogin } from 'src/models/IUser';

export abstract class LoginRepository {
  abstract findLogin(login: string): Promise<IFindLogin | null>;
}
