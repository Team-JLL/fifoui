import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DashboardService} from "../../../services/dashboard.service";
import {FormControl} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import {SnackBarService} from "../../../services/snack-bar.service";
import {ColDef, GridApi} from "ag-grid-community";
import {ApproveBarComponent} from "../../../layouts/approve-popup/approve-bar/approve-bar.component";
import {AppConstants} from "../../../utilities/AppConstants";
import {CryptoService} from "../../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {DatePickerComponent} from "../../liquidation/liqdtn_date-picker/date-picker.component";
import {LiqdtnRemarksComponent} from "../../liquidation/liqdtn-remarks/liqdtn-remarks.component";
import {AgGridAngular} from "ag-grid-angular";

@Component({
  selector: 'app-bypass-requests-summary',
  templateUrl: './bypass-requests-summary.component.html',
  styleUrls: ['./bypass-requests-summary.component.css']
})
export class BypassRequestsSummaryComponent {

  @ViewChild('manager') manager?: ElementRef;
  @ViewChild('agGrid', {static: true}) ahGrid!: AgGridAngular;
  @Output() newItemEvent = new EventEmitter<string>();
  enable: boolean = true
  legendLayout: any = {left: 350, top: 50, width: 50, height: 70, flow: 'vertical'};
  padding: any = {left: 5, top: 5, right: 5, bottom: 5};
  titlePadding: any = {left: 0, top: 0, right: 0, bottom: 10};
  rowData?: any
  datafifo: any = []
  isChecked: any;
  isCheckedName: any;
  liqdtnUser = new FormControl(['all']);
  liquidationUserList : any;
  asmOrZonalManagers: any = [];
  selected: string[] = ['']
  selectedRequests: any = [];
  gridApi !: GridApi;
  search = '';
  role = '';
  hideBtn !: boolean ;
  availStore : any;
  sbmtBtn !: boolean ;




  colDef = function () {
    return '<img src="assets/clinic.png" height="20" width="20" style=" margin-top: -5px"/>';
  };
  colDef1 = function () {
    return '<i class="fa fa-trash-o fa-xl" aria-hidden="true" style="color: red"></i>';
  };


  public defaultColDef: ColDef = {
    filter: true,
    floatingFilter: true,
    cellStyle: {textAlign: 'left'}
  };

  public columnDefs: ColDef[] = [
    //{field: '', checkboxSelection: true, width: 30, headerCheckboxSelection: true,floatingFilter:false},
    //{field: 'index', headerName: 'No', width: 80, valueGetter: (node: any) => String(node.node.rowIndex + 1)},
    {field: 'fifoReportId', headerName: 'FIFO Id', width: 100, checkboxSelection: true, floatingFilter:true},
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
    {field: 'availableStore', headerName: 'availableStore', filter: true, width: 200,hide: true },
    {field: 'liquidationDate', headerName: 'Liquidation Date', filter: true, width: 200,
      cellRenderer: DatePickerComponent,
      cellRendererParams: {
        callbackDate: this.getSelectedDate.bind(this)
      }
    },
    {field: 'liqdtnRemark', headerName: 'Remarks', filter: true,width: 300,wrapText: true, autoHeight: true,
      cellRenderer: LiqdtnRemarksComponent,
      cellRendererParams: {
        callbackRemarks: this.getRemarks.bind(this),
      },
    },
    {field: 'creationBy', headerName: 'Requested By', filter: false, width: 200, cellStyle: {textAlign: 'left'}},
    {field: 'delete', headerName: 'Action', filter: false, width: 100, cellStyle: {textAlign: 'center'}, cellRenderer: this.colDef1},
  ];


  constructor(private dialog: MatDialog,
              private router: Router,
              private dashboardservice: DashboardService,
              private spinner : SpinnerService,
              private toaster: SnackBarService,
              private Cryptoservice: CryptoService,
              private cookie: CookieService) {

    this.role = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.role));
  }


  ngOnInit(): void {
    this.getDepotWiseAsmOrZonalManagers();
    this.getSelectedRequestsForDetailSummary();

    if(this.role.match('FIFOADM')){
      this.sbmtBtn = true
      this.columnDefs[17].hide = false;//Requested by
    }else {
      this.sbmtBtn = false
      this.columnDefs[17].hide = true;
    }

    if(this.role.match('FIFOUSR')){
      this.hideBtn = true
      this.columnDefs[15].hide = true;//Date
      this.columnDefs[16].hide = true;//Remark
    } else if (this.role.match('FIFOLQDUSR')){
      this.hideBtn = false
      this.columnDefs[15].hide = false;
      this.columnDefs[16].hide = false;
    } else {
      this.hideBtn = false
      this.columnDefs[15].hide = true;
      this.columnDefs[16].hide = true;
    }
  }


  onChange(e:any){
    this.isChecked = !this.isChecked;
    this.isCheckedName = e.target.name;
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

  goToDashboard(){
    this.router.navigate(['/'])
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


  cellClickEvent(event: any) {
    if (event.colDef.field === 'delete') {
      this.dashboardservice.deleteRequestFromSelectedRequests(event.data.fifoReportId).subscribe(()=>{
        this.toaster.showSuccess("Successfully deleted ")
        this.selectedRequests = [];
        this.getSelectedRequestsForDetailSummary();
        this.getDepotWiseAsmOrZonalManagers()
      });
    }
    if (event.colDef.field == 'liquidationDate' || event.colDef.field == 'liqdtnRemark') { // cell is from non-select column
       event.node.setSelected(false)
    }
  }


  getSelectedRequestsForDetailSummary() {
    this.dashboardservice.getSelectedRequestsForDetailSummary().subscribe(response => {
      this.rowData = response.data
    })
  }


  getDepotWiseAsmOrZonalManagers() {
    this.dashboardservice.getDepotWiseAsmOrZonalManagers().subscribe((resp => {
      this.liquidationUserList = resp['data'];
      this.selectAllManagers({_selected: true});
    }));
  }


  selectAllManagers(manager:any){
    if(manager._selected){
      this.liqdtnUser.setValue([...this.liquidationUserList]);
      this.liquidationUserList.forEach((elemt:any,indx:any,_:any)=>{
        this.asmOrZonalManagers.push(elemt.liqdtnUsrId)
      })
      manager._selected=true;
    }
    if(manager._selected==false){
      this.liqdtnUser.reset();
      this.asmOrZonalManagers=[];
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


  submit() {
    let emptyLiquidDate = false
    let emptyLiquidRemark= false
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
    } else if (this.liqdtnUser.value?.length == 0 && this.role.match('FIFOUSR') ) {
      this.toaster.showError("Please choose ASM/ZSM/KAM")
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
            this.submitRequestsForBypass(data)
          }
        })
    }
  }


  submitRequestsForBypass(remarks:any) {
      const spine = this.spinner.start()
      this.dashboardservice.submitBypassRequest(this.liqdtnUser.value, this.selectedRequests, remarks).subscribe({
        next: (response) => {
          //console.log("------------" + JSON.stringify(response))
          if (response.retVal == 0) {
            this.spinner.stop(spine)
            this.getSelectedRequestsForDetailSummary();
            this.selectedRequests = [];
            this.newItemEvent.emit();
            this.liqdtnUser.reset()
            this.toaster.showSuccess('Bypass request sent')
          }else if (response.retVal == -999){
            this.spinner.stop(spine)
            this.getSelectedRequestsForDetailSummary();
            this.selectedRequests = [];
            this.newItemEvent.emit();
            this.liqdtnUser.reset()
            this.toaster.showSuccess('The FIFO is already requested for Bypass..!')
          }
        },
        error: () => {
          spine.close();
          this.toaster.showError('Something went wrong')
        },
      })
  }










}

