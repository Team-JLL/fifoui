import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatDrawer, MatSidenav} from '@angular/material/sidenav';
import {Router} from "@angular/router";
import {AppConstants} from "../../utilities/AppConstants";
import {CryptoService} from "../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {MaintenanceService} from "../../services/maintenance.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('drawer', {static: true}) drawer!: MatSidenav;
  @ViewChild('sidenav', {static: true}) sidenav!: MatSidenav;

  role = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.role));

  maintenanceActive = false;
  maintenanceDetails: any = null;
  private maintenancePollHandle: any;
  // Bound once so the exact same reference can be passed to add/removeEventListener.
  private maintenanceVisibilityHandler = () => {
    if (document.visibilityState === 'visible') {
      this.checkMaintenanceStatus();
    }
  };

  constructor( private router : Router,
               private Cryptoservice: CryptoService,
               private cookie: CookieService,
               private maintenanceService: MaintenanceService) {
  }

  ngOnInit() {
    this.checkMaintenanceStatus();
    this.maintenancePollHandle = setInterval(() => this.checkMaintenanceStatus(), 30000);
    // Background/inactive tabs get their setInterval throttled by the browser (can stall well
    // past 30s), so the interval alone can leave a stale banner showing until the user happens
    // to switch back. Re-checking immediately on visibility regain closes that gap.
    document.addEventListener('visibilitychange', this.maintenanceVisibilityHandler);
  }

  checkMaintenanceStatus() {
    this.maintenanceService.getMaintenanceStatus().subscribe({
      next: (response: any) => {
        const data = response['data'];
        this.maintenanceActive = !!(data && data.isActive);
        this.maintenanceDetails = this.maintenanceActive ? data : null;
      },
      error: (err) => {
        console.log('Failed to fetch maintenance status', err);
      }
    });
  }

  ngOnDestroy() {
    if (this.maintenancePollHandle) {
      clearInterval(this.maintenancePollHandle);
    }
    document.removeEventListener('visibilitychange', this.maintenanceVisibilityHandler);
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
