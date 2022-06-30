import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ApiConfigService } from './api-config.service';
import { StorageService } from './storage.service';
import { RoleName } from '../enum/role-name.enum';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const storage = 'localStorage'; // sessionStorage

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  DASHBOARD = '/dashboard';

  constructor(
    private readonly router: Router,
    private readonly apiConfigService: ApiConfigService,
    private storageService: StorageService,
    private readonly jwtHelper: JwtHelperService
  ) {}

  public saveToken = (token: string): void => {
    this.storageService.saveData(TOKEN_KEY, token);
  };

  public getToken = (): string | null => this.storageService.getData(TOKEN_KEY);

  public removeToken = (): void => {
    this.storageService.removeData(TOKEN_KEY);
  };

  public saveUser = (user: any): void => {
    this.storageService.saveData(USER_KEY, user, true);
    // window[storage].removeItem(USER_KEY);
    // window[storage].setItem(USER_KEY, JSON.stringify(user));
  };

  public removeUser = (): void => {
    // window[storage].removeItem(USER_KEY);
    this.storageService.removeData(USER_KEY);
  };

  public signOut = (): void => {
    this.storageService.clear();
    this.router.navigate(['/auth/login']);
  };

  public getUser = (): any => {
    // const user = window[storage].getItem(USER_KEY);
    const user = this.storageService.getData(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  };

  public getUserId = (): any => {
    const user = this.storageService.getData(USER_KEY);
    if (user) {
      return JSON.parse(user).payload.data.userId;
    }

    return {};
  };

  public isLoggedIn = (): boolean => !!this.getToken();

  public getRoles = () => {
    if (this.isLoggedIn()) {
      return this.getUser().payload?.data?.roles?.role;
    }
    return '';
  };

  public isEditor = (): boolean => {
    return this.getRoles() == RoleName.EDITOR_ROLE;
  };

  public isSuperAdmin = (): boolean => {
    return this.getRoles() == RoleName.SUPER_ADMIN_ROLE;
  };

  // public isAdmin = (): boolean => {
  //   return this.getRoles() == RoleName.EDITOR_ROLE;
  // };

  public isAdmin = (): boolean => {
    return this.getRoles() == RoleName.EDITOR_ROLE || this.isSuperAdmin();
  };

  static getToken = (): string | null => window[storage].getItem(TOKEN_KEY);
  public static isLogged: boolean = !!TokenStorageService.getToken();
}
