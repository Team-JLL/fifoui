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

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent {
  @ViewChild('userMappingTemplate', { static: true }) userMappingTemplate!: TemplateRef<any>;
  @Output() result: EventEmitter<any> = new EventEmitter<any>();

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

  afuConfig = {
    multiple: false,
    formatsAllowed: '.xlsx,.xls',
    maxSize: 100,
    hideProgressBar: false,
    hideResetBtn: true,
    replaceTexts: {
      selectFileBtn: 'Select Template file to upload',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: 'Successfully Uploaded!',
      afterUploadMsg_error: 'Upload Failed!'
    },
    uploadAPI: {
      url: UrlConstants.uploadUserMasterData,
    }
  };


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

  getBypassUserMapping() {
    const spine = this.spinner.start();
    const spinnerTimeout = setTimeout(() => {
      this.spinner.stop(spine);
    }, 4000); //4 seconds timeout

    this.dashboardservice.getBypassUserMapping().subscribe({
      next: (response) => {
        this.rowData = response.data;
        this.spinner.stop(spine);
        clearTimeout(spinnerTimeout);
      },
      error: (error) => {
        console.error("Error fetching bypass user mapping", error);
        this.spinner.stop(spine);
        clearTimeout(spinnerTimeout);
      },
      complete: () => {
        clearTimeout(spinnerTimeout);
      }
    });
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
    this.dialog.open(this.userMappingTemplate, {width: '800px', height: '400px'});
  }

  downloadUserMappingTemplate() {
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
    }));
  }


  afterUpload(event: any) {
    if (event.body) {
      const retVal = event.body.retVal;

      if (retVal === -1) {
        this.dialog.open(UploadErrorsComponent, {
          width: '800px',
          height: '500px',
          data: { errorData: event.body?.Errordata }
        });
      } else if (retVal === -2) {
        this.toaster.showSuccess('Please choose a valid file');
      } else if (retVal === 0) {
        this.toaster.showSuccess('Successfully Uploaded!');
      } else {
        this.toaster.showError('Unexpected error occurred during upload.');
      }
    } else {
      // Handle the case when event.body is undefined or null
      this.toaster.showError('No response data received.');
    }
  }



}
