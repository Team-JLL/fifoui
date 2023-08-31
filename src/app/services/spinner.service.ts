import { Injectable } from '@angular/core';
import {MatDialog,MatDialogRef} from "@angular/material/dialog";
import {LoadingSpinnerComponent} from "../layouts/loading-spinner/loading-spinner.component";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private  dialog : MatDialog) { }

  start(){
    const dialogRef = this.dialog.open(LoadingSpinnerComponent);
    return dialogRef;
  }

  stop(ref: MatDialogRef<LoadingSpinnerComponent>): void {
    ref.close();
  }
}
