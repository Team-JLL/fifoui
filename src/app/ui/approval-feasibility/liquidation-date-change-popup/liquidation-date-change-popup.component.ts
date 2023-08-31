// import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
// import {FormBuilder, FormGroup, FormControl} from "@angular/forms";
// import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
// import {DatePipe} from "@angular/common";
// import {SpinnerService} from "../../../services/spinner.service";
// import {Router} from "@angular/router";
// import {DashboardService} from "../../../services/dashboard.service";
// import {SnackBarService} from "../../../services/snack-bar.service";
// import * as moment from 'moment';
//
// @Component({
//   selector: 'app-liquidation-date-change-popup',
//   templateUrl: './liquidation-date-change-popup.component.html',
//   styleUrls: ['./liquidation-date-change-popup.component.css']
// })
// export class LiquidationDateChangePopupComponent implements OnInit {
//   @ViewChild('dateInput') dateInput!: ElementRef;
//   liquidationDate: any;
//   bypassRequestId: any;
//   currentDate: any = new Date()
//   selectedDate: any;
//   now: any;
//   fifoPlan: any;
//   fifoPlanList ?: fifoPlan [];
//   plan: any;
//   bypassPlan: any;
//   requestData: any;
//   remarks:any;
//
//
//
//
//
//   constructor(@Inject(MAT_DIALOG_DATA) public data: any, private spinner: SpinnerService,
//               private dialogRef: MatDialogRef<LiquidationDateChangePopupComponent>,
//               private router: Router,
//               private dashboardservice: DashboardService,
//               private toaster: SnackBarService,
//               private dialog: MatDialog) {
//     // this.selectedDate = data.liquidationDate
//     this.bypassRequestId = data.bypassRequestId
//     this.fifoPlan = data.fifoplan
//     console.log("111111111111.liquidationDate" + data.liquidationDate)
//   }
//
//   ngOnInit(): void {
//     const datePipe = new DatePipe('en-Us');
//     this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
//     setTimeout(() => {
//       this.dateInput.nativeElement.value = this.data.liquidationDate;
//     }, 5);
//   }
//
//   get disableDatepicker() {
//     return this.fifoPlan === "Bypass";
//   };
//
//
//   changeDate(event: any) {
//     this.selectedDate = moment(event.value).format('DD-MM-YYYY')
//     this.dateInput.nativeElement.value = moment(event.value).format('DD-MM-YYYY');
//   }
//
//   valchange(event: any) {
//     this.bypassPlan = event.value
//   }
//
//   saveNewLiquidation() {
//     if (this.selectedDate === undefined) {
//       this.dateInput.nativeElement.value = '';
//     }
//     this.dashboardservice.saveNewLiquidation(this.bypassRequestId, this.selectedDate ?? '', this.fifoPlan,this.remarks).subscribe({
//       next: (response) => {
//         if (response.retVal === 0) {
//           this.dialogRef.close();
//           this.toaster.showSuccess("Successfully Updated")
//         }
//       },
//     })
//   }
// }
//
//
// interface fifoPlan {
//   planId: number;
//   planName: string;
// }
