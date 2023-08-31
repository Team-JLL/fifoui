import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppConstants} from '../../utilities/AppConstants';
import {CryptoService} from '../../services/crypto.service';
import {CookieService} from 'ngx-cookie-service';
import {UrlConstants} from '../../utilities/UrlConstants';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() menuClicked = new EventEmitter();

  username = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.USERNAME));
  department = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.DEPARTMENT));
  role = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.role));

  constructor(private Cryptoservice: CryptoService,
              private cookie: CookieService) {
  }

  ngOnInit() {
  }



  onMenuClicked() {
    this.menuClicked.emit();
  }

  logOut() {
    sessionStorage.clear();
    this.cookie.deleteAll('/');
    window.location.href = UrlConstants.loginAppUrl;
  }


}
