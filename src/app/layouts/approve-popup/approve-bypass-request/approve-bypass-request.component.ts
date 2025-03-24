import {Component, Inject} from '@angular/core';
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SnackBarService} from "../../../services/snack-bar.service";

@Component({
  selector: 'app-approve-bypass-request',
  templateUrl: './approve-bypass-request.component.html',
  styleUrls: ['./approve-bypass-request.component.css']
})
export class ApproveBypassRequestComponent {

  remarks: string = '';
  bypassData: any[] = []

  constructor(private router:Router,
              private dialog: MatDialog,
              private toaster: SnackBarService,
              private dialogRef: MatDialogRef<ApproveBypassRequestComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any)
  {
    if (data && data.bypassData && Array.isArray(data.bypassData)) {
      this.bypassData = data.bypassData
    }

  }

  ngOnInit(): void {
  }

  close() {
    this.dialog.closeAll()
  }

  ApproveRequest() {
    if(this.remarks.length !=0){
      this.dialogRef.close(this.remarks)}
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
