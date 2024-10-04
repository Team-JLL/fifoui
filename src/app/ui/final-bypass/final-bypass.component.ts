import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {SnackBarService} from "../../services/snack-bar.service";
import {DashboardService} from "../../services/dashboard.service";
import {CryptoService} from "../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {SpinnerService} from "../../services/spinner.service";
import {BypassTagsComponent} from "./bypass-tags/bypass-tags.component";
import {ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent} from 'ag-grid-community';
import {ApproveBarComponent} from "../../layouts/approve-popup/approve-bar/approve-bar.component";
import {RejectionPopupComponent} from "../../layouts/rejection-popup/rejection-popup.component";
import {EventPopupComponent} from "../event-popup/event-popup.component";

@Component({
  selector: 'app-final-bypass',
  templateUrl: './final-bypass.component.html',
  styleUrls: ['./final-bypass.component.css']
})
export class FinalBypassComponent {
  @Output() newItemEvent = new EventEmitter<string>();
  selectedRequests: any = [];
  enable: boolean = true
  legendLayout: any = {left: 350, top: 50, width: 50, height: 70, flow: 'vertical'};
  padding: any = {left: 5, top: 5, right: 5, bottom: 5};
  titlePadding: any = {left: 0, top: 0, right: 0, bottom: 10};
  rowData?: any
  datafifo: any = []
  gridOption?: GridOptions;
  search = '';
  gridApi !: GridApi;
  hideBtn !: boolean;
  history: any;
  _cardHistory ="P";
  _cardStatus = "My Activity";

  public defaultColDef: ColDef = {
    filter: true,
    floatingFilter: true,
    cellStyle: {textAlign: 'left'}
  };

  colDef1 = function () {
    return '<i class="fa fa-history" aria-hidden="true" style="color: #366389; font-size: 16px"></i>';
  };

  public columnDefs: ColDef[] = [
    //{field: '', checkboxSelection: true, width: 30, headerCheckboxSelection: true, floatingFilter: false, },
    //{field: 'index', headerName: 'No.', width: 60, valueGetter: (node: any) => String(node.node.rowIndex + 1), floatingFilter: false,},
    {field: 'index', headerName: 'No.', width: 100,valueGetter: (node: any) => String(node.node.rowIndex + 1) , floatingFilter: false ,cellClass: 'cellCenter',
      checkboxSelection : function(params) {
        if (params.data.bypassFlag.match('BY')) {
          return true;
        }
        return false;
      },
    },
    {field: 'bypassRequestCd', headerName: 'Request Code', filter: true, width: 170, sortable: true,},
    {field: 'tag', headerName: 'Tag', filter: false, width: 110,//index2
      cellRenderer: BypassTagsComponent,
    },
    {field: 'historyEvent', headerName: 'History', filter: false, width: 70, cellRenderer: this.colDef1,cellStyle: {textAlign: 'center'}},
    {field: 'status', headerName: 'Status', filter: true, width: 100,
      cellStyle: params => {
        if (params.value === 'Rejected') {
          return {color: 'red'};
        } else if (params.value === 'Completed') {
          return {color: 'darkgreen'};
        } else if (params.value === 'Cancelled') {
          return {color: '#ff6f09'};
        } else {
          return {color: 'orange'};
        }
      }
    },
    {field: 'workstage', headerName: 'WorkStage', filter: true, width: 200},
    {field: 'pendingWith', headerName: 'Pending with', filter: true, width: 350,},//wrapText: true, autoHeight: true,
    {field: 'liquidationDate', headerName: 'Liquidation Date', filter: true, width: 150,},
    {field: 'liqdtnRemark', headerName: 'Liquidation Remark', filter: true, width: 300,},
    {field: 'fifoReportId', headerName: 'FIFO Id', width: 100,hide:true},
    {field: 'bypassRqstId', headerName: 'bypassRqstId', width: 100,hide:true},
    {field: 'validFrom', headerName: 'Valid From', width: 150,},
    {field: 'validTo', headerName: 'Valid To', width: 150,},
    {field: 'depotCd', headerName: 'Depot', width: 100,},
    {field: 'depotDesc', headerName: 'Depot Desc', width: 200,},
    {field: 'salesDocType', headerName: 'Sales doc type', width: 150,},
    {field: 'mainMaterialCd', headerName: 'Main item', width: 150,},
    {field: 'mainMaterialDesc', headerName: 'Main item desc.', width: 300,},
    {field: 'childMtrlCd', headerName: 'Obstacle item', width: 150,},
    {field: 'childMaterialDesc', headerName: 'Obstacle item desc.', width: 300,},
    {field: 'uomName', headerName: 'UOM', width: 100,},
    {field: 'genStoreStock', headerName: 'General Store', width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'gen1StoreStock', headerName: 'General1 Store', width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'slobStoreStock', headerName: 'SLOB Store', width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'creationUser', headerName: 'Requested By', filter: true, width: 200,},
  ];

  constructor(private dialog: MatDialog, private router: Router, private dashboardservice: DashboardService,
              private toaster: SnackBarService, private Cryptoservice: CryptoService,
              private cookie: CookieService, private spinner: SpinnerService,) {

  }

  ngOnInit(): void {
    this.getAllBypassedRequestsForMDM();
  }



  getAllBypassedRequestsForMDM() {
    this.dashboardservice.getAllBypassedRequestsForMDM().subscribe(response => {
      this.rowData = response.data
    })
  }


  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  omit_special_char(event:any) {
    let k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  globalSearch(search: any) {
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

  cellClickEvent(e: any) {
    const bypassReqId = e.data.bypassRqstId
    if (e.colDef.field == 'historyEvent') {
      e.node.setSelected(false);
      this.getEventHistory(bypassReqId);
    }
  }

  //setting data into grid on card click
  public setNewRowData(newRows: any[], _status: any): void {
    this.gridApi.setRowData(newRows);
    this._cardHistory = _status;

    if(_status.match('P')){
      this.columnDefs[2].hide = false
      this.gridApi.setColumnDefs(this.columnDefs);
      this.hideBtn = false;
    }else{
      this.columnDefs[2].hide = true
      this.gridApi.setColumnDefs(this.columnDefs)
      this.hideBtn = true;
    }

    //The Pending , workStage column will be hidden in the Completed section
    if(_status.match('C')){
      this.columnDefs[5].hide = true
      this.columnDefs[6].hide = true
      this.gridApi.setColumnDefs(this.columnDefs);
    }else{
      this.columnDefs[5].hide = false
      this.columnDefs[6].hide = false
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

  getEventHistory(bypassReqId: any) {
    this.dashboardservice.BypassEventHistory(bypassReqId).subscribe((response) => {
      this.history = response.data
      this.dialog.open(EventPopupComponent, {data: this.history, width: '600px', height: '500px'})
    })
  }


  approveBypass() {
    if (this.selectedRequests.length == 0) {
      this.toaster.showError("Please select item for bypass")
    } else {
      const aprvepop = this.dialog.open(ApproveBarComponent, {width: '80vh'})
      aprvepop.afterClosed().subscribe(
        data => {
          if (data !== undefined) {
            this.BypassFromMDM(data)
          }
        })
    }
  }


  BypassFromMDM(remarks: any) {
    const spine = this.spinner.start()
    this.dashboardservice.BypassFromMDM(this.selectedRequests, remarks).subscribe({
      next: (response) => {
        if (response.retVal == 0) {
          this.spinner.stop(spine)
          this.getAllBypassedRequestsForMDM();
          this.selectedRequests = [];
          this.newItemEvent.emit();
          this.toaster.showSuccess('FIFO Bypass Completed')
        }
      },
      error: () => {
        spine.close();
        this.toaster.showError('Something went wrong')
      },
    })
  }

  rejectBypass() {
    if (this.selectedRequests.length == 0) {
      this.toaster.showError("Please select item for rejection")
    } else {
      const rejectPopUp = this.dialog.open(RejectionPopupComponent, {width: '80vh'})
      rejectPopUp.afterClosed().subscribe(
        data => {
          if (data !== undefined) {
            this.RejectionFromMDM(data)
          }
        })
    }
  }

  RejectionFromMDM(remarks: any) {
    const spine = this.spinner.start()
    this.dashboardservice.RejectionFromAllStage(this.selectedRequests, remarks).subscribe({
      next: (response) => {
        if (response.retVal == 0) {
          this.spinner.stop(spine)
          this.getAllBypassedRequestsForMDM();
          this.selectedRequests = [];
          this.newItemEvent.emit();
          this.toaster.showSuccess('Bypass request rejected')
        }
      },
      error: () => {
        spine.close();
        this.toaster.showError('Something went wrong')
      },
    })
  }


  downloadFinalBypassReport(status:any ) {

    let fileName: string ;
    if(status.match('BY')){
      fileName = 'FIFO_Bypass_Report.xlsx';
    }else if (status.match('LQ')){
      fileName = 'Upload_New_FIFO_Report.xlsx';
    }else {
      fileName = 'Final_FIFO_Report.xlsx';
    }

    this.dashboardservice.downloadFinalBypassReport(status).subscribe((response => {
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
