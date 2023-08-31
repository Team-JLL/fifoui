import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {UrlConstants} from './UrlConstants';
import {AppConstants} from "./AppConstants";
import {CookieService} from 'ngx-cookie-service';
import {CryptoService} from "../services/crypto.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private cookie: CookieService,
              private cryptoService: CryptoService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401].indexOf(err.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        this.cookie.deleteAll('/');
        this.cookie.set('appid', this.cryptoService.encryptData(AppConstants.AppId), 1, '/');
        window.location.href =  UrlConstants.loginAppUrl;
      }
      if ([403].indexOf(err.status) !== -1) {
        console.log('error',err.status)
        // window.location.href = UrlConstants.loginAppUrl.concat('403');
      }
      if ([405].indexOf(err.status) !== -1) {
        window.location.href = UrlConstants.loginAppUrl + 'apps';
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
