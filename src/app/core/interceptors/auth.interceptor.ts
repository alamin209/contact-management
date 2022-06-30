import { Injectable } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, finalize, retry } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ResponseService } from '../services/response.service';
import { LoaderService } from '../services/loader.service';
import { TokenStorageService } from '../services/token-storage.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private token: TokenStorageService,
    private jwtHelper: JwtHelperService,
    private readonly responseService: ResponseService,
    public loaderService: LoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken();
    console.log(token);
    
    if (token != null) {
      authReq = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token),
      });
      console.log(authReq);
      const tokenDate = this.jwtHelper.getTokenExpirationDate(token) as Date;
      if (tokenDate) {
        this.expirationCounter(tokenDate);
      }
    }

    this.loaderStatusChange();

    return next.handle(authReq).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        this.loaderService.isLoading.next(false);
        if (error.status !== 401) {
          if (error.status === 0) {
            this.responseService.message(
              'Looks like api service is not running!!'
            );
          } else {
            this.responseService.fire(error);
          }
        }
        return throwError(error);
      }),
      finalize(() => {
        this.loaderService.isLoading.next(false);
      })
    );
  }

  loaderStatusChange = async () => {
    await this.loaderService.noLoading.toPromise().then((res) => {
      if (!res) {
        this.loaderService.isLoading.next(true);
      } else {
        this.loaderService.noLoading.next(false);
      }
    });
  };

  expirationCounter = (date: Date) => {
    const diff = date.getTime() < Date.now();
    if (diff) {
      this.responseService.message('Expired due to inactivity!!', false);
      this.token.signOut();
    }
  };
}

export const authInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
