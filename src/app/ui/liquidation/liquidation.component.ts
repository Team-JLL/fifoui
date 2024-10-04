import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DatePickerComponent} from "./liqdtn_date-picker/date-picker.component";
import {AgGridAngular} from 'ag-grid-angular';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DashboardService} from "../../services/dashboard.service";
import {SnackBarService} from "../../services/snack-bar.service";
import {CryptoService} from "../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {SpinnerService} from "../../services/spinner.service";
import {ColDef, GridApi, GridOptions} from "ag-grid-community";
import {LiqdtnRemarksComponent} from "./liqdtn-remarks/liqdtn-remarks.component";
import {ApproveBarComponent} from "../../layouts/approve-popup/approve-bar/approve-bar.component";
import {RejectionPopupComponent} from "../../layouts/rejection-popup/rejection-popup.component";
import {EventPopupComponent} from "../event-popup/event-popup.component";
import {AppConstants} from "../../utilities/AppConstants";



@Component({
  selector: 'app-liquidation',
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.css']
})
export class LiquidationComponent {
  @ViewChild('agGrid', {static: true}) ahGrid!: AgGridAngular;
  @Output() newItemEvent = new EventEmitter<string>();
  loginUser = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.USERNAME) );

  selectedRequests: any = [];
  liquidateDates: any = [];
  enable: boolean = true
  legendLayout: any = {left: 350, top: 50, width: 50, height: 70, flow: 'vertical'};
  padding: any = {left: 5, top: 5, right: 5, bottom: 5};
  titlePadding: any = {left: 0, top: 0, right: 0, bottom: 10};
  datafifo: any = []
  value: any;
  bypassId: any;
  rowData?: any;
  gridOption?: GridOptions;
  gridApi !: GridApi;
  search = '';
  availStore : any;
  viewEnabled:boolean = true;
  hideBtn : boolean = false;
  cancelBtn : boolean = true;
  history:any;
  _cardHistory ="P";
  _cardStatus = "My Activity";
  role = '';


  public defaultColDef: ColDef = {
    filter: true,
    floatingFilter: true,
    cellStyle: {textAlign: 'left'}
  };

  colDef1 = function () {
    return '<i class="fa fa-history" aria-hidden="true" style="color: #366389; font-size: 16px"></i>';
  };

  public columnDefs: ColDef[] = [
    // {field: '', checkboxSelection: true, width: 30, floatingFilter:false},
    // {field: 'index', headerName: 'No', width: 80, valueGetter: (node: any) => String(node.node.rowIndex + 1)},
    {field: 'bypassRqstId', headerName: 'ReqId', width: 150, checkboxSelection: true, headerCheckboxSelection: true,floatingFilter:true},
    {field: 'bypassRequestCd', headerName: 'Request Code', width: 200,},
    {field: 'historyEvent', headerName: 'History', filter: false, width: 80, cellRenderer: this.colDef1,cellStyle: {textAlign: 'center'}},
    {field: 'status', headerName: 'Status', filter: true, width: 100,
      cellStyle: params => {
        if (params.value === 'Rejected') {
          return {color: 'red'};
        } else if(params.value === 'Completed'){
          return {color: 'darkgreen'};
        }else if (params.value === 'Cancelled'){
          return {color: '#ff6f09'};
        } else{
          return {color: 'orange'};
        }
      }
    },
    {field: 'workstage', headerName: 'WorkStage', filter: true, width: 200},
    {field: 'pendingWith', headerName: 'Pending with', filter: true, width: 300},
    {field: 'fifoReportId', headerName: 'FIFO Id', width: 100,},
    {field: 'validFrom', headerName: 'Valid From', width: 150, },
    {field: 'validTo', headerName: 'Valid To', width: 150, },
    {field: 'depotCd', headerName: 'Depot', width: 100, },
    {field: 'depotDesc', headerName: 'Depot Desc', width: 200, },
    {field: 'salesDocType', headerName: 'Sales doc type',width: 150, },
    {field: 'mainMaterialCd', headerName: 'Main item', width: 150, },
    {field: 'mainMaterialDesc', headerName: 'Main item desc.', width: 300, },
    {field: 'childMtrlCd', headerName: 'Obstacle item', width: 150, },
    {field: 'childMaterialDesc', headerName: 'Obstacle item desc.', width: 300, },
    {field: 'uomName', headerName: 'UOM',  width: 100, },
    {field: 'genStoreStock', headerName: 'General',width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'gen1StoreStock', headerName: 'General1',width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'slobStoreStock', headerName: 'Slob',width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'creationUser', headerName: 'Requested By', filter: true, width: 200, },
    {field: 'availableStore', headerName: 'availableStore', filter: true, width: 200,hide: true },
    //index22
    {field: 'liquidationDate', headerName: 'Liquidation Date', filter: true, width: 200,
      cellRenderer: DatePickerComponent,
      cellRendererParams: {
        callbackDate: this.getSelectedDate.bind(this)
      }
    },
    {field: 'liquidationDate', headerName: 'Liquidation Date', filter: true, width: 200,},
    {field: 'liqdtnRemark', headerName: 'Remarks', filter: true,width: 220,wrapText: true, autoHeight: true,
      cellRenderer: LiqdtnRemarksComponent,
      cellRendererParams: {
        callbackRemarks: this.getRemarks.bind(this),
      },
    },
    {field: 'liqdtnRemark', headerName: 'Remarks', filter: true,width: 400,wrapText: true, autoHeight: true,suppressColumnsToolPanel:true},

  ];


  constructor(private dialog: MatDialog,
              private router: Router,
              private dashboardservice: DashboardService,
              private toaster: SnackBarService,
              private Cryptoservice: CryptoService,
              private cookie: CookieService,
              private spinner: SpinnerService) {
    this.role = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.role));

  }


  ngOnInit(): void {
    this.getAllRequestedFifos();
    this.columnDefs[23].hide = true;
    this.columnDefs[25].hide = true;

  }

  getAllRequestedFifos() {
    this.dashboardservice.getAllRequestedFifos().subscribe(response => {
      this.rowData = response.data
    })
  }

  //setting data into grid on card click
  public setNewRowData(newRows: any[],_status:any): void {
    //this.gridApi.setRowData(newRows);
    this.rowData = newRows
    this._cardHistory = _status;

    if(_status.match('P') ){
      this.columnDefs[22].hide = false; //Date
      this.columnDefs[23].hide = true; //Remark
      this.columnDefs[24].hide = false;
      this.columnDefs[25].hide = true;
      this.gridApi.setColumnDefs(this.columnDefs);
      this.hideBtn = false
    } else{
      this.columnDefs[22].hide = true;
      this.columnDefs[23].hide = false;
      this.columnDefs[24].hide = true;
      this.columnDefs[25].hide = false;
      this.gridApi.setColumnDefs(this.columnDefs);
      this.hideBtn = true
    }

    if(_status.match('T')){
      this.cancelBtn = false
    }else{
      this.cancelBtn = true
    }


    //The Pending , workStage column will be hidden in the Completed section
    if(_status.match('C')){
      this.columnDefs[6].hide = true
      this.columnDefs[7].hide = true
      this.gridApi.setColumnDefs(this.columnDefs);
    }else{
      this.columnDefs[6].hide = false
      this.columnDefs[7].hide = false
      this.gridApi.setColumnDefs(this.columnDefs);
    }




    switch (_status){
      case 'T':
        this._cardStatus = "Total Bypass"
        break;
      case 'W':
        this._cardStatus = "WIP/Rejected Bypass"
        break
      case 'C':
        this._cardStatus = "Completed Bypass"
        break
      default:
        this._cardStatus = "My Activity"
    }

  }


  cellClickEvent(e: any) {
    const bypassReqId = e.data.bypassRqstId

    if (e.colDef.field == 'liquidationDate' || e.colDef.field == 'liqdtnRemark') { // cell is from non-select column
      e.node.setSelected(false)
    } else if (e.colDef.field == 'historyEvent'){
        e.node.setSelected(false);
        this.getEventHistory(bypassReqId);
      }
    }

  getEventHistory(bypassReqId:any) {
    this.dashboardservice.BypassEventHistory(bypassReqId).subscribe((response) => {
      this.history = response.data
      this.dialog.open(EventPopupComponent, {data: this.history, width: '600px', height: '500px'})
    })
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


  activitySelected(event: any): void {
    if (event.node.selected === true) {
      this.selectedRequests.push(event.data);

      this.selectedRequests.forEach((element:any,idx:any,_:any)=>{
        if (element.fifoReportId == event.data.fifoReportId){
          if(element.slobStoreStock != 0 ){
            this.availStore = 'slob'
          }else{
            this.availStore = 'general'
          }
          element.availableStore = this.availStore
        }
      })
      this.datafifo.push(event.data)
    } else if (event.node.selected === false) {
      const updateSelect = [];
      for (const el of this.selectedRequests) {
        if (el !== event.data) {
          updateSelect.push(el);
        }
      }
      this.selectedRequests = updateSelect;
    }
  }


  getSelectedDate(date: any,fifoId:any) {
    let row;
    row = this.rowData.filter((s: any) => s.fifoReportId == fifoId);
    if (row.length === 1) {
      const index = this.rowData.indexOf(row[0]);
      let node = this.rowData[index];
      node.liquidationDate = date;
      //console.log("- node.liquidationDate -"+ node.liquidationDate )
    }
  }

  getRemarks(remark:any,fifoId:any) {
    let row;
    row = this.rowData.filter((s: any) => s.fifoReportId == fifoId);
    if (row.length === 1) {
      const index = this.rowData.indexOf(row[0]);
      let node = this.rowData[index];
      node.liqdtnRemark = remark;
    }
  }

  approveBypass() {
    let emptyLiquidDate = false ;
    let emptyLiquidRemark = false ;

    this.selectedRequests.forEach((element:any,index:any,_:any) =>{
      //console.log("- Liquidation dates -"+ element.liquidationDate)
      if (element.liquidationDate == '' || element.liquidationDate == null) {
        emptyLiquidDate = true
      }
      if (element.liqdtnRemark == '' || element.liqdtnRemark == null) {
        emptyLiquidRemark = true  }
    })


    if (this.selectedRequests.length == 0) {
        this.toaster.showError("Please select item for bypass")
      } else if(this.role.match('FIFOLQDUSR') && emptyLiquidDate){
        this.toaster.showError("Liquidation Date can't be empty!")
      } else if(this.role.match('FIFOLQDUSR') && emptyLiquidRemark) {
        this.toaster.showError("Liquidation Remark can't be empty!")
      }
      else {
        const aprvepop = this.dialog.open(ApproveBarComponent, {width: '80vh'})
        aprvepop.afterClosed().subscribe(
          data => {
            if (data !== undefined) {
              this.BypassFromLiquidation(data)
            }
          })
      }
    }

  BypassFromLiquidation(remarks:any) {
      const spine = this.spinner.start()
      this.dashboardservice.BypassFromLiquidation(this.selectedRequests,remarks).subscribe({
        next: (response) => {
          if(response.retVal == 0) {
            this.spinner.stop(spine)
            this.getAllRequestedFifos();
            this.selectedRequests = [];
            this.newItemEvent.emit();
            this.toaster.showSuccess('Bypass request sent')
          }
        },
        error: () => {
          spine.close();
          this.toaster.showError('Something went wrong')
        },
      })
  }

  rejectRequest(){
    let bypassRequestCd = "";
    let actionDenied = false;
    this.selectedRequests.forEach((element:any, idx:any, _:any) => {
      if (element.creationUser == this.loginUser) {
        actionDenied = true;
        bypassRequestCd += element.bypassRequestCd +","
      }
    })

    if (this.selectedRequests.length == 0) {
      this.toaster.showError("Please select item for rejection")
    } else if (actionDenied){
      this.toaster.showWarning("The item ( " + bypassRequestCd + " ) is created by you. It cannot be rejected..!")
    } else
    {
      const rejectPopUp = this.dialog.open(RejectionPopupComponent, {width: '80vh'})
      rejectPopUp.afterClosed().subscribe(
        data => {
          if (data !== undefined) {
            this.RejectionFromAllStage(data)
          }
        })
    }
  }

 RejectionFromAllStage(remarks:any){
   const spine = this.spinner.start()
   this.dashboardservice.RejectionFromAllStage(this.selectedRequests,remarks).subscribe({
     next: (response) => {
       if(response.retVal == 0) {
         this.spinner.stop(spine)
         this.getAllRequestedFifos();
         this.selectedRequests = [];
         this.newItemEvent.emit();
         this.toaster.showSuccess('Bypass request rejected')
       }
     },
     error: () => {
       spine.close();
       this.toaster.showError(' Rejection Failed')
     },
   })
 }



  cancelRequest(btn_status:any){
    let bypassRequestCd = "";
    let actionDenied = false;
    let status = false;
    this.selectedRequests.forEach((element: any, idx: any, _: any) => {
      if (element.creationUser !== this.loginUser ) {
        actionDenied = true;
        bypassRequestCd += element.bypassRequestCd + ","
      } if(element.status == 'Completed'){
        status = true;
      }
    })

    if (this.selectedRequests.length == 0) {
      this.toaster.showError("Please select item for cancel")
    } else if (actionDenied) {
      this.toaster.showWarning("The item ( " + bypassRequestCd + " ) is not created by you. It cannot be cancelled..!")
    } else if(status) {
      this.toaster.showError("Completed request can't be cancelled!")
    }
      else{
        const rejectPopUp = this.dialog.open(RejectionPopupComponent,
          {width: '80vh', data: btn_status})
        rejectPopUp.afterClosed().subscribe(
          data => {
            if (data !== undefined) {
              this.cancelTheRequest(data)
            }
          })
      }
  }


  cancelTheRequest(remarks:any) {
    const spine = this.spinner.start()
      this.dashboardservice.cancelRequest(this.selectedRequests, remarks).subscribe({
        next: (response) => {
          if (response.retVal == 0) {
            this.spinner.stop(spine)
            this.getAllRequestedFifos();
            this.selectedRequests = [];
            this.newItemEvent.emit();
            this.toaster.showSuccess('Bypass Request Cancelled')
          }
        },
        error: () => {
          spine.close();
          this.toaster.showError('Cancel Failed')
        },
      })
    }

  downloadBypassHistory(_cardHistory:any) {

    let fileName = 'FIFO_Bypass_History_Report.xlsx';

    this.dashboardservice.downloadBypassHistoryReport(_cardHistory).subscribe((response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove(); // remove the element
    }));
  }



}
