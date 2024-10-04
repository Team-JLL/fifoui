import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {AppConstants} from "../../utilities/AppConstants";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DashboardService} from "../../services/dashboard.service";
import {SnackBarService} from "../../services/snack-bar.service";
import {jqxGridComponent} from "jqwidgets-ng/jqxgrid";
import {ColDef, GridApi, GridOptions} from "ag-grid-community";
import {CryptoService} from "../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {SpinnerService} from "../../services/spinner.service";
import {RejectionPopupComponent} from "../../layouts/rejection-popup/rejection-popup.component";
import {EventPopupComponent} from "../event-popup/event-popup.component";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent{
  @ViewChild('dstGrid', {static: false}) dstGrid !: jqxGridComponent;
  @Output() newItemEvent = new EventEmitter<string>();

  loginUser = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.USERNAME) );

  role = "";
  selectedRequests: any = [];
  legendLayout: any = {left: 350, top: 50, width: 50, height: 70, flow: 'vertical'};
  padding: any = {left: 5, top: 5, right: 5, bottom: 5};
  titlePadding: any = {left: 0, top: 0, right: 0, bottom: 10};
  rowData?: any
  datafifo: any = []
  gridApi !: GridApi;
  rejectReson:any;
  gridOption?: GridOptions;
  search = '';
  history:any;
  _cardHistory ="T";
  hideCnclBtn : boolean = true;
  _cardStatus = "Total Bypass";



  public defaultColDef: ColDef = {
    filter: true,
    floatingFilter: true,
    cellStyle: {textAlign: 'left'}
  };

  colDef1 = function () {
    return '<i class="fa fa-history" aria-hidden="true" style="color: #366389; font-size: 16px"></i>';
  };

  public columnDefs: ColDef[] = [
    //{field: '', checkboxSelection: true,headerCheckboxSelection: true,floatingFilter:false,pinned:true},
    // {field: 'index', headerName: 'No', width: 80, valueGetter: (node: any) => String(node.node.rowIndex + 1),pinned:true},
    {field: 'bypassRqstId', headerName: ' ReqId', width: 150,checkboxSelection: true,headerCheckboxSelection: true,floatingFilter:true},
    {field: 'bypassRequestCd', headerName: 'Request Code', filter: true, width: 170,},
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
    {field: 'workstage', headerName: 'WorkStage', filter: true, width: 150},
    {field: 'pendingWith', headerName: 'Pending with', filter: true, width: 400,},
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
    {field: 'genStoreStock', headerName: 'General Store',width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'gen1StoreStock', headerName: 'General1 Store',width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'slobStoreStock', headerName: 'SLOB Store',width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'creationUser', headerName: 'Requested By', filter: true, width: 200,},
  ];

  @ViewChild('rejectWarning', {static: true}) approveWarning!: TemplateRef<any>;
  constructor(private dialog: MatDialog,
              private router: Router,
              private dashboardservice: DashboardService,
              private toaster: SnackBarService,
              private Cryptoservice: CryptoService,
              private cookie: CookieService,
              private spinner : SpinnerService) {

    this.role = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.role));

  }

  ngOnInit(): void {
    this.getAllRequestedFifos();
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

  cellClickEvent(event: any) {
    const bypassReqId = event.data.bypassRqstId
    if (event.colDef.field == 'historyEvent'){
      event.node.setSelected(false);
      this.getEventHistory(bypassReqId);
    }
  }


  getEventHistory(bypassReqId:any) {
    this.dashboardservice.BypassEventHistory(bypassReqId).subscribe((response) => {
      this.history = response.data
      this.dialog.open(EventPopupComponent, {data: this.history, width: '600px', height: '500px'})
    })
  }

    getAllRequestedFifos() {
    this.dashboardservice.getAllRequestedFifos().subscribe(response => {
      this.rowData = response.data
    })
  }

  //remove request permanantly
  cancelRequest(btn_status:any){

    let status = false;
    this.selectedRequests.forEach((element: any, idx: any, _: any) => {
      if(element.status == 'Completed'){
        status = true;
      }
    })

    if (this.selectedRequests.length == 0) {
      this.toaster.showError("Please select item for cancel")
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

  cancelTheRequest(remarks:any){
    const spine = this.spinner.start()
    this.dashboardservice.cancelRequest(this.selectedRequests,remarks).subscribe({
      next: (response) => {
        if(response.retVal == 0) {
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

  //setting data into grid on card click
  public setNewRowData(newRows: any[],_status:any): void {
    this.gridApi.setRowData(newRows);
    this._cardHistory = _status;
    if(_status.match('T') || _status.match('P')){
      this.hideCnclBtn = false
    } else{
      this.hideCnclBtn = true
    }


    //The Pending , workStage column will be hidden in the Completed section
    if(_status.match('C')){
      this.columnDefs[4].hide = true
      this.columnDefs[5].hide = true
      this.gridApi.setColumnDefs(this.columnDefs);
    }else{
      this.columnDefs[4].hide = false
      this.columnDefs[5].hide = false
      this.gridApi.setColumnDefs(this.columnDefs);
    }



    switch (_status){
      case 'P':
        this._cardStatus = "My Activity"
        break;
      case 'W':
        this._cardStatus = "WIP/Rejected Bypass"
        break
      case 'C':
        this._cardStatus = "Completed Bypass"
        break
      default:
        this._cardStatus = "Total Bypass"
    }
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

