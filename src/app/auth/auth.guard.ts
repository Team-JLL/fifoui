import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {CryptoService} from '../services/crypto.service';
import {CookieService} from 'ngx-cookie-service';
import {AppConstants} from '../utilities/AppConstants';
import {UrlConstants} from '../utilities/UrlConstants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
              private cookie: CookieService,
              private cryptoService: CryptoService) {
  }

  canActivate(): boolean {
    if (this.auth.loggedIn()) {
      return true;
    } else {
      this.cookie.deleteAll('/');
      this.cookie.set('appid', this.cryptoService.encryptData(AppConstants.AppId), 1, '/');
      window.location.href = UrlConstants.loginAppUrl;
      return false ;
    }


  }


}
