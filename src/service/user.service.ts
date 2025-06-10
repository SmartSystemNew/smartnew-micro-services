import { Injectable, Scope } from '@nestjs/common';
import { IUserInfo } from 'src/models/IUser';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserService {
  private static readonly instance: UserService = new UserService();
  private user: IUserInfo;

  constructor() {}

  public static getInstance(): UserService {
    return this.instance;
  }

  setUser(user: IUserInfo) {
    this.user = user;
  }

  getUser(): IUserInfo {
    return this.user;
  }
}
