import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import {AppConstants} from "./AppConstants";
import {CookieService} from 'ngx-cookie-service';
import { CryptoService } from '../services/crypto.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookie: CookieService,
              private cryptoService: CryptoService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const authKey = this.cryptoService.decryptData(this.cookie.get(AppConstants.AUTHKEY));
    // const otpEnabled = this.cookie.get(AppConstants.OtpEnabled);
    const appId = AppConstants.AppId;
    const screenId = sessionStorage.getItem(AppConstants.screenId);
    if (authKey != null ) {
      request = request.clone({
        setHeaders: {
          Authorization: `${authKey}`,
          AppId: `${appId}`,
          screenId: `${screenId}`,
          // otpEnabled: `${otpEnabled}`
        }
      });
    }
    return next.handle(request);
  }
}
