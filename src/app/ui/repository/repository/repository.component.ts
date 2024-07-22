import { Component } from '@angular/core';
import {ColDef, GridApi} from 'ag-grid-community';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DashboardService} from "../../../services/dashboard.service";
import {SnackBarService} from "../../../services/snack-bar.service";
import {CryptoService} from "../../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {SpinnerService} from "../../../services/spinner.service";
import {BypassTagsComponent} from "../../final-bypass/bypass-tags/bypass-tags.component";
import {EventPopupComponent} from "../../event-popup/event-popup.component";

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent {
  search = '';
  gridApi !: GridApi;
  selectedRequests: any = [];
  enable: boolean = true
  legendLayout: any = {left: 350, top: 50, width: 50, height: 70, flow: 'vertical'};
  padding: any = {left: 5, top: 5, right: 5, bottom: 5};
  titlePadding: any = {left: 0, top: 0, right: 0, bottom: 10};
  rowData?: any
  datafifo: any = []
  history: any;


  public defaultColDef: ColDef = {
    filter: true,
    floatingFilter: true,
    cellStyle: {textAlign: 'left'}
  };

  colDef1 = function () {
    return '<i class="fa fa-history" aria-hidden="true" style="color: #366389; font-size: 16px"></i>';
  };


  public columnDefs: ColDef[] = [
    {field: 'index', headerName: 'Sl. No.', width: 80, valueGetter: (node: any) => String(node.node.rowIndex + 1), floatingFilter: false,},
    {field: 'bypassRqstId', headerName: 'ReqId', width: 100, hide:true},
    {field: 'bypassRequestCd', headerName: 'Request Code', filter: true, width: 170,sortable: true,},
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
    {field: 'tag', headerName: 'Tag', filter: false, width: 110,
      cellRenderer:BypassTagsComponent,
    },
    {field: 'liquidationDate', headerName: 'Liquidation Date', filter: true, width: 150,},
    {field: 'fifoReportId', headerName: 'FIFO Id', width: 100, hide:true},
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

  constructor(private dialog: MatDialog, private router: Router, private dashboardservice: DashboardService,
              private toaster: SnackBarService, private Cryptoservice: CryptoService,
              private cookie: CookieService, private spinner : SpinnerService) {
  }

  ngOnInit(): void {
    this.getRepositoryData();
  }

  getRepositoryData() {
    this.dashboardservice.getRepositoryData().subscribe(response => {
      this.rowData = response.data
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

  cellClickEvent(e: any) {
    const bypassReqId = e.data.bypassRqstId
    if (e.colDef.field == 'historyEvent') {
      e.node.setSelected(false);
      this.getEventHistory(bypassReqId);
    }
  }

  getEventHistory(bypassReqId: any) {
    this.dashboardservice.BypassEventHistory(bypassReqId).subscribe((response) => {
      this.history = response.data
      this.dialog.open(EventPopupComponent, {data: this.history, width: '600px', height: '500px'})
    })
  }




}
