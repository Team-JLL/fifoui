import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AppConstants} from "../../utilities/AppConstants";
import {CryptoService} from "../../services/crypto.service";
import {CookieService} from "ngx-cookie-service";
import {SnackBarService} from "../../services/snack-bar.service";

@Component({
  selector: 'app-rejection-popup',
  templateUrl: './rejection-popup.component.html',
  styleUrls: ['./rejection-popup.component.css']
})
export class RejectionPopupComponent implements OnInit {

  remarks: string = '';
  hideBtn : boolean = true;
  role: string;
  message:string = "Are you sure to reject the request(s)?"
  bypassData: any[] = []



  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _dialogRef: MatDialogRef<RejectionPopupComponent>,
              private Cryptoservice: CryptoService,
              private cookie: CookieService,
              private toaster: SnackBarService,) {

    this.role = this.Cryptoservice.decryptData(this.cookie.get(AppConstants.role));
    if (data && data.bypassData && Array.isArray(data.bypassData)) {
      this.bypassData = data.bypassData
    }
  }

  ngOnInit(): void {
    if(this.data == 'cancel'){
      this.message = "Are you sure to cancel the request(s)?"
      this.hideBtn = true;
    }else{
      this.hideBtn = false
    }
  }

  close(): void {
    this._dialogRef.close();
  }

  RejectOrCancelRequest() {
    if(this.remarks.length !=0){
      this._dialogRef.close(this.remarks)}
    else{
      this.toaster.showError('Please enter remark!')
    }
  }

  validateRemarks(event: any) {
    const regex = /^[A-Za-z0-9\-&(),.% ]*$/;
    if (!regex.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^A-Za-z0-9\-&(),.% ]/g, '');
    }
    const input = event.target.value || ''
    if (input.length > 500) {
      this.remarks = input.substring(0, 500); // Trim excess if pasted
    }else {
      this.remarks = input;
    }
  }

  get hasBypassData(): boolean {
    return this.data?.bypassData?.filter((item: any) => item.bypassCount > 0).length > 0;
  }

  get filteredBypassData(): any[] {
    return this.data?.bypassData?.filter((item: any) => item.bypassCount > 0) || [];
  }
}

