import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ReplaySubject, Subject, take, takeUntil} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SnackBarService} from "../../../services/snack-bar.service";
import {DashboardService} from "../../../services/dashboard.service";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {CryptoService} from "../../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {SpinnerService} from "../../../services/spinner.service";


@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css']
})
export class AddNewUserComponent   implements OnInit, AfterViewInit, OnDestroy{
  protected _onDestroy = new Subject<void>();

  users!: User[];
  public userFIlter: FormControl = new FormControl();
  public filteredUsers: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

  depots!: depot[];
  public depotFIlter: FormControl = new FormControl();
  public filteredDepots: ReplaySubject<depot[]> = new ReplaySubject<depot[]>(1);

  channels!: channel[];
  public channelFIlter: FormControl = new FormControl();
  public filteredChannels: ReplaySubject<channel[]> = new ReplaySubject<channel[]>(1);

  requesterIds: any ;
  liquidUsrIds: any = [];
  dmndPlnrUsrIds: any = [] ;
  channel: any ;
  depot: any;
  requesterType: any;
  mappingId = 0;
  zsmUsr: any = []
  title: string = 'Add ';
  selectedUserIds: number[] = [];

  constructor(private dialogRef: MatDialogRef<AddNewUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private router: Router,
              private dashboardservice: DashboardService,
              private toaster: SnackBarService,
              private Cryptoservice: CryptoService,
              private cookie: CookieService,
              private spinner : SpinnerService,
              ) {
  }


  ngOnInit() {

    this.getDetailsForAddNewMapping()
    this.editActions()

  }

  editActions(){
    if(this.data.edit){
      this.title = 'Update'
      this.getDataFieldsForEdit()
    }
  }

  checkingBtnAction() {
    if (this.data.edit) {
      this.editBypassMapping();
    } else {
      this.addNewBypassMapping();
    }
  }

  disableUnEditFields() {
    return this.data.edit ;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngAfterViewInit(): void {
  }


  getDetailsForAddNewMapping(){

    this.dashboardservice.getDetailsForAddNewMapping().subscribe(response => {

      this.users = response['userList'];
      this.filteredUsers.next(this.users.slice());
      this.userFIlter.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filteredActors();
        });

      this.depots = response['depotList'];
      this.filteredDepots.next(this.depots.slice());
      this.depotFIlter.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filteredDepotList();
        });

      this.channels = response['channelList'];
      this.filteredChannels.next(this.channels.slice());
      this.channelFIlter.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filteredChannelList();
        });


    });

  }

  onSelectionChange(selectedIds: number[]) {
    this.selectedUserIds = selectedIds;
  }

  private filteredActors() {

    // Get the search keyword
    let search = this.userFIlter.value;
    if (!search) {
      this.filteredUsers.next(this.users.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    const filtered = this.users.filter(fpr => fpr.usrName.toLowerCase().indexOf(search) > -1);

    const selectedUsers = this.users.filter(user => this.selectedUserIds.includes(user.usrId));
    const uniqueFiltered = new Set([...filtered, ...selectedUsers]);
    this.filteredUsers.next(Array.from(uniqueFiltered));
  }


  private filteredChannelList() {
    let search = this.channelFIlter.value;
    if (!search) {
      this.filteredChannels.next(this.channels.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredChannels.next(
      this.channels.filter(channel => channel.channelName.toLowerCase().indexOf(search) > -1)
    );
  }


  private filteredDepotList() {
    let search = this.depotFIlter.value;
    if (!search) {
      this.filteredDepots.next(this.depots.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredDepots.next(
      this.depots.filter(depot => depot.depotName.toLowerCase().indexOf(search) > -1)
    );
  }


  getRequesterType(reqstrId:any){
    this.users.forEach((element:any,idx:any,_:any)=> {
      if (element.usrId == reqstrId) {
        this.requesterType = element.usrType
      }
    })
  }

  clearFileds() {
    this.requesterIds = null;
    this.requesterType = null;
    this.channel = null;
    this.depot = null;
    this.dmndPlnrUsrIds = null;
    this.liquidUsrIds = [];
    this.zsmUsr = null;
  }


  addNewBypassMapping() {

    if (this.requesterIds == 0 || this.requesterIds == null) {
      this.toaster.showWarning("Please select requester")
    } else if (this.channel == 0 || this.channel == null) {
      this.toaster.showWarning("Please select channel")
    } else if (this.depot == 0 || this.depot == null) {
      this.toaster.showWarning("Please select Depot")
    } else if (this.liquidUsrIds == 0 || this.liquidUsrIds == null) {
      this.toaster.showWarning("Please select Liquidation users")
    } else if (this.dmndPlnrUsrIds == 0 || this.dmndPlnrUsrIds == null) {
      this.toaster.showWarning("Please select Demand Planner")
    } else {
      this.dashboardservice.addNewBypassMapping(this.requesterIds, this.channel, this.depot, this.liquidUsrIds,
        this.dmndPlnrUsrIds, this.requesterType, this.zsmUsr).subscribe({
        next: (response) => {
          if (response.retVal == 0) {
            this.getDetailsForAddNewMapping();
            this.clearFileds()
            this.toaster.showSuccess('Successfully mapped')
          } else if (response.retVal == -999) {
            this.getDetailsForAddNewMapping();
            this.clearFileds()
            this.toaster.showSuccess('Mapping is existing! Please try with another data')
          }
        },
        error: () => {
          this.toaster.showError('Something went wrong')
        },
      })
    }
  }

  getDataFieldsForEdit(){
    const innerdata = this.data.dataForEdit[0];
    this.mappingId = innerdata.mappingId;
    this.requesterIds = innerdata.rqstrId;
    this.requesterType = innerdata.rqstrType;
    this.channel = innerdata.channelId;
    this.depot = innerdata.depotId;
    this.liquidUsrIds.push(innerdata.liqdtnUsrId);

    /* Decimal (Base 10): 10 (this is what used radix as 10 - parseInt(id, 10)) */
    this.dmndPlnrUsrIds = innerdata.demandPlnrId.split(',').map((id: string) => parseInt(id, 10));
    this.zsmUsr = innerdata.zsm_user.split(',').map((id: string) => parseInt(id, 10));

  }

  editBypassMapping() {

    if (this.channel == 0 || this.channel == null) {
      this.toaster.showWarning("Please select channel")
    } else if (this.depot == 0 || this.depot == null) {
      this.toaster.showWarning("Please select Depot")
    } else if (this.liquidUsrIds == 0 || this.liquidUsrIds == null) {
      this.toaster.showWarning("Please select Liquidation users")
    } else {
      this.dashboardservice.editBypassMapping(this.mappingId, this.requesterIds, this.channel, this.depot, this.liquidUsrIds,
        this.dmndPlnrUsrIds, this.requesterType, this.zsmUsr).subscribe({
        next: (response) => {
          if (response.retVal == 0) {
            this.getDetailsForAddNewMapping();
            this.clearFileds()
            this.toaster.showSuccess('Successfully Updated')
          }
        },
        error: () => {
          this.toaster.showError('Something went wrong')
        },
      })
    }
  }

  close() {
    this.dialogRef.close();
    this.getDetailsForAddNewMapping();
  }

}


interface User {
  usrId: number;
  usrName: string;
  usrType: string;
}

interface depot {
  depotId: number;
  depotName: string;
}

interface channel {
  channelId: number;
  channelName: string;
}
