import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {jqxGridComponent} from "jqwidgets-ng/jqxgrid";
import {ColDef, GridApi, RowClassParams, RowNode, RowStyle} from "ag-grid-community";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DashboardService} from "../../services/dashboard.service";
import {SnackBarService} from "../../services/snack-bar.service";
import {AppConstants} from "../../utilities/AppConstants";
import {CryptoService} from "../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-all-request',
  templateUrl: './all-request.component.html',
  styleUrls: ['./all-request.component.css']
})
export class AllRequestComponent {
  @ViewChild('dstGrid', {static: false}) dstGrid !: jqxGridComponent;

  selectedRequests: any = [];
  enable: boolean = true
  legendLayout: any = {left: 350, top: 50, width: 50, height: 70, flow: 'vertical'};
  padding: any = {left: 5, top: 5, right: 5, bottom: 5};
  titlePadding: any = {left: 0, top: 0, right: 0, bottom: 10};
  rowData?: any
  datafifo: any = []
  gridApi !: GridApi;
  search = '';
  role: string;
  hideBtn !: boolean ;
  slctdFifoCount : number = 0;

  colDef = function () {
    return '<img src="assets/clinic.png" height="20" width="20" style=" margin-top: -5px"/>';
  };

  public defaultColDef: ColDef = {
    filter: true,
    floatingFilter: true,
    cellStyle: {textAlign: 'left'},
  };

  public columnDefs: ColDef[] = [
    // {field: '', checkboxSelection: true, width: 30, floatingFilter:false},
    // {field: 'index', headerName: 'No', width: 80, valueGetter: (node: any) => String(node.node.rowIndex + 1)},
    //{field: 'fifoReportId', headerName: 'FIFO Id', width: 100, checkboxSelection: true},
    {field: 'fifoReportId', headerName: 'FIFO Id', width: 100, floatingFilter: false ,cellClass: 'cellCenter',
      checkboxSelection : function(params) {
        if (params.data.fifoRequestFlag.match('B')) {
          return false;
        }
        return true;
      },
    },
    {field: 'validFrom', headerName: 'Valid From', width: 150, },
    {field: 'validTo', headerName: 'Valid To', width: 150, },
    {field: 'depotCd', headerName: 'Depot', width: 100, },
    {field: 'depotDesc', headerName: 'Depot Desc', width: 220, },
    {field: 'salesDocType', headerName: 'Sales doc type',width: 150, },
    {field: 'mainMaterialCd', headerName: 'Main item', width: 150, },
    {field: 'mainMaterialDesc', headerName: 'Main item desc.', width: 300, },
    {field: 'childMtrlCd', headerName: 'Obstacle item', width: 150, },
    {field: 'childMaterialDesc', headerName: 'Obstacle item desc.', width: 300, },
    {field: 'uomName', headerName: 'UOM',  width: 100, },
    {field: 'genStoreStock', headerName: 'General',width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'gen1StoreStock', headerName: 'General1',width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'slobStoreStock', headerName: 'SLOB',width: 170,cellStyle: {textAlign: 'right'}},
    {field: 'fifoRequestFlag', headerName: 'SLOB',width: 170,cellStyle: {textAlign: 'right'}, hide:true},
    {field: 'creationBy', headerName: 'Requested By',width: 170,cellStyle: {textAlign: 'left'}},
  ];



  constructor(private dialog: MatDialog,
              private router: Router,
              private dashboardservice: DashboardService,
              private toaster: SnackBarService,
              private Cryptoservice: CryptoService,
              private cookie: CookieService) {

    this.role = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.role));
  }

  ngOnInit(): void {
    this.getFifoMasterData();

    if(this.role.match('FIFOADM')){
      this.hideBtn = true
    }else {
      this.hideBtn = false
    }

  }

  activitySelected(event: any): void {
    if (event.node.selected === true) {
      this.selectedRequests.push(event.data.fifoReportId);
      this.datafifo.push(event.data)
    } else if (event.node.selected === false) {
      const updateSelect = [];
      const updatefifo = [];
      for (const el of this.selectedRequests) {
        if (el !== event.data.fifoReportId) {
          updateSelect.push(el);
        }
      }
      for (const el of this.datafifo) {
        if (el.fifoReportId !== event.data.fifoReportId) {
          updatefifo.push(el);
        }
      }
      this.selectedRequests = updateSelect;
      this.datafifo = updatefifo;
    }
  }

  public getRowNodeId(data: any): string {
    return data.fifoReportId; // Assuming fifoReportId is a unique identifier for each row
  }

  public getRowStyle(params: RowClassParams<any>): RowStyle | undefined {
    if (params.data.fifoRequestFlag.match('B')) {
      return {
        background: '#8080802e',
        pointerEvents: 'none' // Disable pointer events for gray rows
      };
    }
    return undefined;
  }

  getFifoMasterData() {
    this.dashboardservice.getFifoMasterData().subscribe(response => {
      this.rowData = response.data
      this.slctdFifoCount = response.slctdFifoCount
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

  goToSummaryScreen(){
    this.router.navigateByUrl('/selectedRequests')
  }

  submitSelectedRequests() {
    if (this.selectedRequests.length == 0) {
      this.toaster.showError("Please select item for bypass")
    } else {
      this.dashboardservice.setBypassFlagForSelectedRequests(this.selectedRequests).subscribe({
        next: (response) => {
          //console.log(response)
          this.router.navigate(['selectedRequests'])
        }
      })
    }
  }

  downloadFifoMaster(){

    let fileName = 'FIFO_Master_Report.xlsx';

    this.dashboardservice.downloadFIFOMaster().subscribe((response => {
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
