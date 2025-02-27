import {Component, ElementRef, ViewChild} from '@angular/core';
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
import { MatTooltipModule} from "@angular/material/tooltip";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ReplaySubject, Subject, takeUntil} from "rxjs";
import {User} from "../../../model/User"
import {Depot} from "../../../model/Depot"
import {Channel} from "../../../model/Channel"
import {Products} from "../../../model/Products"
import * as moment from 'moment';

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
  history: any;

  @ViewChild('toInput', {static: true}) toInput: ElementRef | any;
  @ViewChild('fromInput', {static: true}) fromInput: ElementRef | any;

  repoForm!: FormGroup;
  hideToggle: boolean = true
  toggleMatIcon = 'keyboard_double_arrow_down'
  searchText: string = '';

  repositoryList = []
  filteredList = []

  dateFrom: string | null = null;
  dateTo: string | null = null;
  minDate = moment().toDate();

  protected _onDestroy = new Subject<void>();

  users!: User[];
  public userFIlter: FormControl = new FormControl();
  public filteredUsers: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  private onUDestroy = new Subject<void>();

  depots!: Depot[];
  public depotFIlter: FormControl = new FormControl();
  public filteredDepots: ReplaySubject<Depot[]> = new ReplaySubject<Depot[]>(1);
  private onDDestroy = new Subject<void>();

  channels!: Channel[];
  public channelFIlter: FormControl = new FormControl();
  public filteredChannels: ReplaySubject<Channel[]> = new ReplaySubject<Channel[]>(1);
  private onCDestroy = new Subject<void>();

  products!: Products[];
  public itemFilter: FormControl = new FormControl();
  public filteredItems: ReplaySubject<Products[]> = new ReplaySubject<Products[]>(1);
  private onPDestroy = new Subject<void>();

  public defaultColDef: ColDef = {
    filter: true,
    floatingFilter: true,
    cellStyle: {textAlign: 'left'}
  };

  colDef1 = function () {
    return '<i class="fa fa-history" aria-hidden="true" style="color: #366389; font-size: 16px"></i>';
  };


  public columnDefs: ColDef[] = [
    {field: 'index', headerName: 'Sl. No.', width: 100, valueGetter: (node: any) => String(node.node.rowIndex + 1), floatingFilter: false,},
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
              private toaster: SnackBarService, private Cryptoservice: CryptoService,private fb: FormBuilder,
              private cookie: CookieService, private spinner : SpinnerService) {
              this.repoForm = this.fb.group({
                requestCode: null,
                status: null,
                tag: null,
                liquidationDate: null,
                validFrom: null,
                validTo: null,
                createdFrom: null,
                createdTo: null,
                depot: null,
                channel: null,
                mainItem: null,
                obstacleItem: null,
              })
  }

  ngOnInit(): void {
    this.getDetailsForAddNewMapping()
    this.getRepositoryData();
  }


  getRepositoryData() {

    const spine = this.spinner.start();

    this.dashboardservice.getRepositoryData(this.repoForm.value).subscribe(response => {
      this.rowData = response.data;
      this.spinner.stop(spine);
      if (response['retVal'] == 0) {
        this.repositoryList = response['data']
        this.filteredList = response['data']
        this.toaster.showSuccess(this.repositoryList.length + ' record found');
      } else {
        if (response['retVal'] === -1) {
          this.toaster.showWarning(response['retMsg']);
        } else {
          this.toaster.showError('Something went Wrong',);
        }
      }
    });
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

  downloadRepositoryReport() {
    const spine = this.spinner.start();
    let fileName = 'FIFO_Completion_Report.xlsx';

    // Get filter values from the form
    const filterParams = this.repoForm.value;

    this.dashboardservice.downloadRepositoryReport(filterParams).subscribe(response => {
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

  toggleSearchCriteria() {
    this.hideToggle = !this.hideToggle; // Toggle the criteria variable
    this.toggleMatIcon = this.hideToggle ? 'keyboard_double_arrow_up' : 'keyboard_double_arrow_down'
  }

  getDetailsForAddNewMapping(){

    this.dashboardservice.getDetailsForAddNewMapping().subscribe(response => {

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

      this.products = response['productList'];
      this.filteredItems.next(this.products.slice());
      this.itemFilter.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filteredItemList();
        });

    });

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

  private filteredItemList() {
    let search = this.itemFilter.value;
    if (!search) {
      this.filteredItems.next(this.products.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredItems.next(
      this.products.filter(products => products.mtrlName.toLowerCase().indexOf(search) > -1)
    );
  }

  // setFromDate(event: any) {
  //   if (event.value === null) {
  //     // Handle the case when the user removes the date (event.value is null).
  //     this.dateFrom = ''; // Set datePkd to an empty string or any other default value if needed.
  //     this.fromInput.nativeElement.value = ''; // Clear the value of the other input field.
  //     this.repoForm.get('dateFrom')?.setValue(null); // Set the form control value to null.
  //   } else {
  //     this.dateFrom = moment(event.value).format('YYYY-MM-DD')
  //     this.fromInput.nativeElement.value = moment(event.value).format('DD-MM-YYYY');
  //     this.repoForm.get('dateFrom')?.setValue(this.dateFrom);
  //   }
  // }
  //
  // setToDate(event: any) {
  //   if (event.value === null) {
  //     // Handle the case when the user removes the date (event.value is null).
  //     this.dateTo = ''; // Set datePkd to an empty string or any other default value if needed.
  //     this.toInput.nativeElement.value = ''; // Clear the value of the other input field.
  //     this.repoForm.get('dateTo')?.setValue(null); // Set the form control value to null.
  //   } else {
  //     this.dateTo = moment(event.value).format('YYYY-MM-DD')
  //     this.toInput.nativeElement.value = moment(event.value).format('DD-MM-YYYY');
  //     this.repoForm.get('dateTo')?.setValue(this.dateTo);
  //   }
  // }

  onDateUp(event: KeyboardEvent) {
    const allowedCharacters = /^[0-9-]+$/;
    const inputChar = event.key;

    if (!allowedCharacters.test(inputChar)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  clearFilteredData(){
      this.repoForm.reset();
      this.searchText = '';
      this.getRepositoryData();
  }


}
