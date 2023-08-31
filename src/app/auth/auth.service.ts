import { Injectable } from '@angular/core';
import {CONSTRUCTOR} from '@angular/compiler-cli/ngcc/src/host/esm2015_host';
import {CookieService} from 'ngx-cookie-service';
import {AppConstants} from '../utilities/AppConstants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieservice: CookieService) {}

  public loggedIn() {
    return !! this.cookieservice.get(AppConstants.AUTHKEY);
  }

}
