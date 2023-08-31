import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {CryptoService} from "./services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {AppConstants} from "./utilities/AppConstants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fifoui';

  role = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.role));

  constructor(private route : Router,
              private cryptoservice: CryptoService,
              private cookie : CookieService,
              private Cryptoservice : CryptoService) {

       sessionStorage.setItem(AppConstants.screenId,AppConstants.dashboard)


  }





}
