import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DashboardService} from "../../services/dashboard.service";
import {SnackBarService} from "../../services/snack-bar.service";
import {CryptoService} from "../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {SpinnerService} from "../../services/spinner.service";
import {ColDef, GridApi} from 'ag-grid-community';
import {AddNewUserComponent} from "./add-new-user/add-new-user.component";
import {UrlConstants} from "../../utilities/UrlConstants";
import {UploadErrorsComponent} from "../file-upload/file-upload-errors/upload-errors.component";
import {AngularFileUploaderComponent} from "angular-file-uploader";
import {AdvancedFilterComponent} from "../../shared/advanced-filter/advanced-filter.component";
import {ReplaySubject, Subject, takeUntil} from "rxjs";
import {User} from "../../model/User";
import {FormControl, FormGroup} from "@angular/forms";
import {Depot} from "../../model/Depot";
import {Channel} from "../../model/Channel";

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent {
  @ViewChild('userMappingTemplate', { static: true }) userMappingTemplate!: TemplateRef<any>;
  @Output() result: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('usrMasterBulkUpload', {static: true}) private usrMasterBulkUpload!: AngularFileUploaderComponent;
  @ViewChild('advancedFilter') advancedFilter!: AdvancedFilterComponent;

  protected _onDestroy = new Subject<void>();

  users!: User[];
  public userFIlter: FormControl = new FormControl();
  public filteredUsers: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

  depots!: Depot[];
  public depotFIlter: FormControl = new FormControl();
  public filteredDepots: ReplaySubject<Depot[]> = new ReplaySubject<Depot[]>(1);

  channels!: Channel[];
  public channelFIlter: FormControl = new FormControl();
  public filteredChannels: ReplaySubject<Channel[]> = new ReplaySubject<Channel[]>(1);
  filterForm!: FormGroup ;
  searchFilter = new FormControl('');


  search = '';
  gridApi !: GridApi;
  selectedRequests: any = [];
  enable: boolean = true
  legendLayout: any = {left: 350, top: 50, width: 50, height: 70, flow: 'vertical'};
  padding: any = {left: 5, top: 5, right: 5, bottom: 5};
  titlePadding: any = {left: 0, top: 0, right: 0, bottom: 10};
  rowData?: any
  datafifo: any = []
  errData: { errMsg: string; errSuggestion: string }[] = [];
  showFilter: boolean = false;
  selectedUserIds: number[] = [];

  productFilterFields: any[] = [];
  userMappingList = []
  filteredMappingList = []


  afuConfig = {
    multiple: false,
    formatsAllowed: '.xlsx,.xls',
    maxSize: 100,
    hideProgressBar: false,
    hideResetBtn: true,
    replaceTexts: {
      selectFileBtn: 'Choose file to upload',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: '',
      afterUploadMsg_error: '',
      sizeLimit: 'Size Limit'
    },
    uploadAPI: {
      url: UrlConstants.uploadUserMasterData,
    }
  };

  selectedFile: any;

  fifoUserAccessSearch: string = '';
  fifoUserAccessList: any[] = [];
  filteredUserAccessList : any[] = [];
  appliedFilters: any = {};


  public defaultColDef: ColDef = {
    filter: true,
    floatingFilter: true,
    cellStyle: {textAlign: 'left'}
  };

  public columnDefs: ColDef[] = [
    {field: 'index', headerName: 'No', width: 100, valueGetter: (node: any) => String(node.node.rowIndex + 1)},
    {field: 'mappingId', headerName: 'mappingId', width: 10 , hide:true},
    {field: 'rqstrId', headerName: 'rqstrId', width: 10 , hide:true},
    {field: 'rqstrName', headerName: 'Bypass Requester', width: 150},
    {field: 'rqstrType', headerName: 'Requester Type', width: 130},
    {field: 'channelId', headerName: 'channelId', width: 10 , hide:true},
    {field: 'channelName', headerName:'Channel', width: 100},
    {field: 'depotId', headerName: 'depotId', width: 10 , hide:true},
    {field: 'depotCd', headerName: 'Depot Code', width: 120},
    {field: 'depotName', headerName: 'Depot Name', width: 300},
    {field: 'liqdtnUsrId', headerName: 'liqdtnUsrId', width: 10 , hide:true},
    {field: 'liqdtnUsrName', headerName: 'Liquidation User', width: 250},
    {field: 'demandPlnrId', headerName: 'demandPlnrId', width: 10 , hide:true},
    {field: 'demandPlnrName', headerName: 'Demand Planner', width: 250},
    {field: 'zsm_user', headerName: 'zsm_user', width: 10, hide:true},
    {field: 'zsm_mails', headerName: 'ZSM', width: 250},
    {field: 'edit', headerName: 'Edit',width: 80,
      cellRenderer: function () {
        return '<img src="assets/pencil.png" alt="" aria-hidden="true" width="12px" height="12px" style="margin-left: 25%;cursor: pointer;" />';
      }
    },
    {field: 'delete', headerName: 'Delete',width: 80,
      cellRenderer: function () {
        return '<img src="assets/delete.png" alt="" aria-hidden="true" width="12px" height="12px" style="margin-left: 25%;cursor: pointer;" />';
      }
    },
  ];


  constructor(private dialog: MatDialog, private router: Router, private dashboardservice: DashboardService,
              private toaster: SnackBarService, private Cryptoservice: CryptoService,
              private cookie: CookieService, private spinner : SpinnerService) {
  }

  ngOnInit() {
    this.getBypassUserMapping()
    this.getDetailsForAddNewMapping()
    this.getUsersRoleAccess()
  }

  onGridReady(params:any): void {
    this.gridApi = params.api;
  }

  omit_special_char(event:any) {
    let k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  globalSearch(search:any) {
    this.gridApi.setQuickFilter(search);
  }

  cellClickEvent(event: any) {

    if(event.colDef.field === 'edit'){
      const dataForEdit = this.rowData.filter((s: any) => s.mappingId == event.data.mappingId);
      const userMappingDialog = this.dialog.open(AddNewUserComponent, {
        width: '500px',
        height: '550px',
        data: {dataForEdit, edit: true}
      });
      userMappingDialog.afterClosed().subscribe(result => {
        if (result) {
          this.getBypassUserMapping();
        }
      });
    }

    if (event.colDef.field === 'delete') {
      this.dashboardservice.deleteBypassUserMapping(event.data.mappingId).subscribe(()=>{
        this.toaster.showSuccess("Successfully deleted ")
        this.getBypassUserMapping()
      });
    }
  }

  onFilterApplied(filters: any) {
    this.getBypassUserMapping(filters);
    this.appliedFilters = filters;
  }

  getBypassUserMapping(filters?: any) {
    const spine = this.spinner.start();
    const spinnerTimeout = setTimeout(() => {
      this.spinner.stop(spine);
    }, 4000); // 4 seconds timeout

    this.dashboardservice.getBypassUserMapping(filters || {}).subscribe({
      next: (response) => {
        this.rowData = response.data;
        this.spinner.stop(spine);
        clearTimeout(spinnerTimeout);
        if (response['retVal'] == 0) {
          this.userMappingList = response['data']
          this.filteredMappingList = response['data']
          this.toaster.showSuccess(this.userMappingList.length + ' record found');
        } else {
          if (response['retVal'] === -1) {
            this.toaster.showWarning(response['retMsg']);
          } else {
            this.toaster.showError('Something went Wrong',);
          }
        }
      }
    })
  }


  addNewUserMapping(){
    const addNewMappingDialogue = this.dialog.open(AddNewUserComponent, {
      width: '500px',
      height: '550px',
      data: {}
    });
    addNewMappingDialogue.afterClosed().subscribe(result => {
      if (result) {
        this.getBypassUserMapping();
      }
    });
  }


  openTemplateDownloadWarning() {
    this.dialog.open(this.userMappingTemplate, {width: '50vw', height: '24vw'});
  }

  downloadUserMappingTemplate() {
    const spine = this.spinner.start();
    this.dashboardservice.downloadUserMasterTemplate().subscribe((response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'FIFO_User_Master_Template.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.spinner.stop(spine);
    }));
  }


  afterUpload(event: any) {
    const spine = this.spinner.start();

    try {
      if (!event.body) {
        this.toaster.showError('No response data received.');
        return;
      }

      const retVal = event.body.retVal;

      switch (retVal) {
        case -1:
          this.dialog.open(UploadErrorsComponent, {
            width: '800px',
            height: '500px',
            data: { errorData: event.body?.Errordata }
          });
          this.toaster.showError('Upload Failed!');
          break;

        case -888:
          this.dialog.open(UploadErrorsComponent, {
            width: '800px',
            height: '500px',
            data: { errorData: event.body?.Errordata }
          });
          this.toaster.showError('Upload Failed! Mapping already exists');
          break;

        case -2:
          this.toaster.showError('Please choose a valid file');
          break;

        case 1:
          this.toaster.showSuccess('Successfully Uploaded!');
          break;

        case -777:
          this.toaster.showError('Failed to save new mapping.');
          break;

        default:
          this.toaster.showError('Please upload a valid file.');
          break;
      }
    } catch (error) {
      console.error('Error handling upload:', error);
      this.toaster.showError('An unexpected error occurred.');
    } finally {
      this.spinner.stop(spine);
    }
  }


  getUsersRoleAccess() {
    const spine = this.spinner.start();
    const moduleCode = 'FIFO';

    this.dashboardservice.getAllUsersRoleWithModule(moduleCode).subscribe({
      next: (response) => {
        console.log(response?.data || "No data received");
        this.fifoUserAccessList = response?.data ?? [];
        this.filteredUserAccessList = [...this.fifoUserAccessList];
        if (response?.retVal === 0) {
          this.toaster.showSuccess(response?.retMsg || "Data fetched successfully");
        } else {
          this.toaster.showError(response?.retMsg || "Failed to fetch data");
        }

        this.spinner.stop(spine);
      },
      error: (error) => {
        console.error("Error fetching bypass user mapping:", error?.message || error);
        this.toaster.showError("Something went wrong while fetching data");
        this.spinner.stop(spine);
      },
      complete: () => {
        this.spinner.stop(spine);
      },
    });
  }


  getDetailsForAddNewMapping(){

    this.dashboardservice.getDetailsForAddNewMapping().subscribe(response => {

      this.users = response['userList'];
      this.filteredUsers.next(this.users.slice());

      this.depots = response['depotList'];
      this.filteredDepots.next(this.depots.slice());

      this.channels = response['channelList'];
      this.filteredChannels.next(this.channels.slice());

      this.initializeFieldsForFilter(this.users,this.depots,this.channels);


    });

  }


  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  closeFilter() {
    this.showFilter = !this.showFilter;
    this.advancedFilter.resetFilters();
    this.getBypassUserMapping()
  }

  onFilterReset() {
    console.log('Filters Reset');
  }


  initializeFieldsForFilter(users:any,depots:any,channels:any) {

    this.productFilterFields = [
      { key: 'requester', label: 'Requester', type: 'dropdown', options: (users || []).map((usr: any) => ({
          label: usr.usrName, value: usr.usrId}))
      },

      { key: 'channel', label: 'Channel', type: 'dropdown',options: (channels || []).map((ch: any) => ({
          label: ch.channelName, value: ch.channelId}))
      },

      { key: 'depot', label: 'Depot', type: 'dropdown', options: (depots || []).map((dp: any) => ({
          label: dp.depotName, value: dp.depotId}))
      },

      { key: 'liquidationUser', label: 'Liquidation User', type: 'dropdown', options: (users || []).map((usr: any) => ({
          label: usr.usrName, value: usr.usrId}))
      },

      { key: 'zsmUser', label: 'ZSM User', type: 'dropdown', options: (users || []).map((usr: any) => ({
          label: usr.usrName, value: usr.usrId}))
      },

     //{ key: 'availableFrom', label: 'Available From', type: 'date' }
    ];
  }

  downloadUserMaster(){
    const spine = this.spinner.start();
    let fileName = 'FIFO_User_Master.xlsx';

    this.dashboardservice.downloadUserMaster(this.appliedFilters).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      this.spinner.stop(spine);
    }, error => {
      console.error('Error downloading report:', error);
      this.spinner.stop(spine);
    });

  }

  searchForText(event: any) {
    this.fifoUserAccessSearch = event.target.value.trim().toLowerCase();

    // If the search field is empty, reset the list to show all data
    if (!this.fifoUserAccessSearch) {
      this.filteredUserAccessList = [...this.fifoUserAccessList];
      return;
    }

    // Perform filtering only if there's input
    this.filteredUserAccessList = this.fifoUserAccessList.filter(user => {
      return user.userCode.toLowerCase().includes(this.fifoUserAccessSearch) ||
        user.UserName.toLowerCase().includes(this.fifoUserAccessSearch) ||
        user.UserEmail.toLowerCase().includes(this.fifoUserAccessSearch) ||
        user.RoleName.toLowerCase().includes(this.fifoUserAccessSearch);
    });
  }


}
