import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community"
import {DatePipe} from "@angular/common";
import * as moment from "moment";
import {DashboardService} from "../../../services/dashboard.service";
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from "@angular/forms";
import {AppConstants} from "../../../utilities/AppConstants";
import {CryptoService} from "../../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements ICellRendererAngularComp {
  @ViewChild('dateInput') dateInput!: ElementRef;
  currentDate: any = new Date()
  endDate:any= new Date();
  selectedDate: any;
  params: any;
  isDisabled: boolean = false;
  now: any;
  availStore: any;
  cardAction: any;
  requestId: any;
  fifoId: any;
  role = '';


  constructor(private dashboard: DashboardService,
              private fb: FormBuilder,
              private datePipe: DatePipe,
              private Cryptoservice: CryptoService,
              private cookie: CookieService,) {
    this.role = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.role));
  }

  ngOnInit(): void {
   this.disableDatePicker();
  }

  agInit(params: any): void {
    this.params = params;
    this.fifoId = params.data.fifoReportId

    if(params.data.liquidationDate != null || params.data.liquidationDate != ''){
      this.selectedDate = params.data.liquidationDate
    }

    /*while LQDUSR requested any fifo , initially date will be undefined*/
    if(this.selectedDate != null && this.selectedDate != '') {
      if (this.selectedDate.length > 0) {
        setTimeout(() => {//setting date into datepicker
          this.dateInput.nativeElement.value = this.selectedDate
        }, 1)
      }
    }

    if(params.data.slobStoreStock != 0 ){
      this.availStore = 'Slob'
    }else{
      this.availStore = 'General'
    }
  }

  disableDatePicker(){
    if (this.availStore == 'Slob'){
      this.endDate.setMonth(this.endDate.getMonth() + 1);
    }else{
      this.endDate.setMonth(this.endDate.getMonth() + 3);
    }
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

  changeDate(event: any) {
    const date = moment(event.value).format('DD-MM-YYYY')
    this.dateInput.nativeElement.value = moment(event.value).format('DD-MM-YYYY');
    this.params.callbackDate(date , this.fifoId);
  }

}
