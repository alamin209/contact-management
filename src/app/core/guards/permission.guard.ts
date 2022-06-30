import {
  Router,
  UrlTree,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ResponseService } from '@core/services/response.service';
import { TokenStorageService } from '@core/services/token-storage.service';
import { RoleName } from '@core/enum/role-name.enum';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    private location: Location,
    private readonly token: TokenStorageService,
    private readonly responseService: ResponseService // private routeActivated: ActivatedRoute,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let permissions = [];
    if (route.data['permissions']) {
      permissions = route.data['permissions'];
    }

    if (permissions.length) {
      let permitted = false;

      permissions.some((role: string) => {
        let permission = role;

        if (permission == RoleName.ADMIN_ROLE && this.token.isAdmin()) {
          permitted = true;
        }

        if (permission == RoleName.EDITOR_ROLE && this.token.isEditor()) {
          permitted = true;
        }

        if (
          permission == RoleName.SUPER_ADMIN_ROLE &&
          this.token.isSuperAdmin()
        ) {
          permitted = true;
        }

        if (permitted == true) {
          return true;
        } else {
          return false;
        }
      });

      if (permitted == false) {
        console.log(this.location);
        this.location.back();

        // this.router.navigate(['/dashboard']);

        this.responseService.message(
          'You have no permission to access this!!!',
          true,
          10000
        );

        return false;
      }

      return true;
    }

    return true;
  }
}
