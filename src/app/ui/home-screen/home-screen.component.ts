import {Component, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SnackBarService} from "../../services/snack-bar.service";
import {DashboardService} from "../../services/dashboard.service";
import {CryptoService} from "../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {AppConstants} from "../../utilities/AppConstants";
import {Router} from "@angular/router";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {LiquidationComponent} from "../liquidation/liquidation.component";
import {ApprovalFeasibilityComponent} from "../approval-feasibility/approval-feasibility.component";
import {FinalBypassComponent} from "../final-bypass/final-bypass.component";
import {AllRequestComponent} from "../all-request/all-request.component";
import {SpinnerService} from "../../services/spinner.service";

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent {

  @ViewChild(DashboardComponent) dashboardComponent!: DashboardComponent;
  @ViewChild(LiquidationComponent) liquidationComponet!: LiquidationComponent;
  @ViewChild(ApprovalFeasibilityComponent)aprovalFsbltyComponent!: ApprovalFeasibilityComponent;
  @ViewChild(FinalBypassComponent)finalBypassComponet!:FinalBypassComponent;
  @ViewChild(AllRequestComponent)allRequestComponent!:AllRequestComponent;

  selectedIndex: number = 0;
  role = "";
  title = 'Dashboard';
  totalCount = 0;
  pendCount = 0;
  wipCount = 0;
  comCount = 0;
  bypassCardData: any= []
  tabComponent: any;


  username = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.USERNAME));

  constructor(private dialog: MatDialog,
              private toaster: SnackBarService,
              private dashboardservice: DashboardService,
              private Cryptoservice: CryptoService,
              private cookie: CookieService,
              private router: Router,
              private spinner : SpinnerService){

    this.role = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.role));

  }

  ngOnInit(): void {
    this.setScreenTitile();
    this.getCountData();
  }

  setScreenTitile(){

    if (this.role == 'FIFOUSR'){
      this.title = 'Requester Dashboard'
    } else if (this.role == 'FIFOLQDUSR'){
      this.title = 'Liquidation'
    }else if (this.role == 'FIFOAFUSR'){
      this.title = 'Approval Feasibility'
    }else if (this.role == 'FIFOFBUSR'){
      this.title = 'Final Bypass'
    } else{
      this.title = 'Admin Dashboard'
    }
  }

  public getCountData() {
    this.dashboardservice.getCountData().subscribe(response => {
      this.totalCount = response.data.totalCount
      this.pendCount  = response.data.pendCount
      this.wipCount   = response.data.wipCount
      this.comCount   = response.data.comCount
    })
  }


  getBypassCardData(status:any){
    this.selectedIndex =1
    const spine = this.spinner.start()
    this.dashboardservice.getDataForCards(status).subscribe({
      next: (response) => {
        this.bypassCardData = response.data
        if(response.retVal == 0) {
          this.spinner.stop(spine)
          if (this.role.match('FIFOLQDUSR')){
                 this.liquidationComponet.setNewRowData(this.bypassCardData,status);
              }else if (this.role.match('FIFOAFUSR')){
                this.aprovalFsbltyComponent.setNewRowData(this.bypassCardData,status);
              }else if (this.role.match('FIFOFBUSR')){
                this.finalBypassComponet.setNewRowData(this.bypassCardData,status)
              }else {
                this.dashboardComponent.setNewRowData(this.bypassCardData,status)
              }
        }
      },
      error: () => {
        spine.close();
        this.toaster.showError('Something went wrong!')
      },
    })
  }


  onTabChanged($event:any) {
    let clickedIndex = $event.index;
    if (clickedIndex == 1)  {
      this.selectedIndex = 1
    }else{
      this.selectedIndex = 0
    }
  }



}
