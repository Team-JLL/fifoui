import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDrawer, MatSidenav} from '@angular/material/sidenav';
import {Router} from "@angular/router";
import {AppConstants} from "../../utilities/AppConstants";
import {CryptoService} from "../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawer', {static: true}) drawer!: MatSidenav;
  @ViewChild('sidenav', {static: true}) sidenav!: MatSidenav;

  role = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.role));

  constructor( private router : Router,
               private Cryptoservice: CryptoService,
               private cookie: CookieService) {
  }

  ngOnInit() {

  }

  openSideBar() {
    return ((window.innerWidth <= 800) || (window.innerHeight <= 600));
  }

  goToDashboard(){
    this.router.navigate(['/'])
  }

  goToUserMaster(){
    this.router.navigate(['userMaster'])
  }

  goToRepository(){
    this.router.navigate(['repository'])
  }


}
