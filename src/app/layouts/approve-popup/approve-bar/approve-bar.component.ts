import {Component, OnInit, Input, Output, EventEmitter, Inject} from '@angular/core';
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SnackBarService} from "../../../services/snack-bar.service";

@Component({
  selector: 'app-approve-bar',
  templateUrl: './approve-bar.component.html',
  styleUrls: ['./approve-bar.component.css']
})
export class ApproveBarComponent implements OnInit {
  remarks: string = '';
  constructor(private router:Router,
              private dialog: MatDialog,
              private toaster: SnackBarService,
              private dialogRef: MatDialogRef<ApproveBarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

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
}
