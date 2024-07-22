import {Component} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DashboardService} from "../../services/dashboard.service";
import {SnackBarService} from "../../services/snack-bar.service";
import {CryptoService} from "../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {SpinnerService} from "../../services/spinner.service";
import {ColDef, GridApi} from 'ag-grid-community';
import {AddNewUserComponent} from "./add-new-user/add-new-user.component";

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent {

  search = '';
  gridApi !: GridApi;
  selectedRequests: any = [];
  enable: boolean = true
  legendLayout: any = {left: 350, top: 50, width: 50, height: 70, flow: 'vertical'};
  padding: any = {left: 5, top: 5, right: 5, bottom: 5};
  titlePadding: any = {left: 0, top: 0, right: 0, bottom: 10};
  rowData?: any
  datafifo: any = []


  public defaultColDef: ColDef = {
    filter: true,
    floatingFilter: true,
    cellStyle: {textAlign: 'left'}
  };

  public columnDefs: ColDef[] = [
    {field: 'index', headerName: 'No', width: 80, valueGetter: (node: any) => String(node.node.rowIndex + 1)},
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
    {field: 'edit', headerName: 'edit',width: 80,
      cellRenderer: function () {
        return '<img src="assets/pencil.png" alt="" aria-hidden="true" width="12px" height="12px" style="margin-left: 25%" />';
      }
    },
    {field: 'delete', headerName: 'delete',width: 80,
      cellRenderer: function () {
        return '<img src="assets/delete.png" alt="" aria-hidden="true" width="12px" height="12px" style="margin-left: 25%" />';
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
        this.getBypassUserMapping();
      });
    }

    if (event.colDef.field === 'delete') {
      this.dashboardservice.deleteBypassUserMapping(event.data.mappingId).subscribe(()=>{
        this.toaster.showSuccess("Successfully deleted ")
        this.getBypassUserMapping()
      });
    }
  }

  getBypassUserMapping(){
    this.dashboardservice.getBypassUserMapping().subscribe(response =>{
      this.rowData = response.data
    })
  }

  addNewUserMapping(){
    const addNewMappingDialogue = this.dialog.open(AddNewUserComponent, {
      width: '500px',
      height: '550px',
      data: {}
    });
    addNewMappingDialogue.afterClosed().subscribe(result => {
      this.getBypassUserMapping();
    });
  }


}
