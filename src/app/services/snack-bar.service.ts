import {Injectable, NgZone} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private _snackBar: MatSnackBar,
              private zone: NgZone) {}

  showSuccess(message:string) {
    let config = new MatSnackBarConfig();
    config.duration = 2000 ;
    config.panelClass= ['success-snackbar'];
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'left';
    this._snackBar.open(message,'', {
      duration: 2000,
    });
    this.zone.run(() => {
      this._snackBar.open(message, 'x', config);
    });
  }

  showError(message:string) {
    let config = new MatSnackBarConfig();
    config.duration = 2000 ;
    config.panelClass= ['error-snackbar'];
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'left';
    this._snackBar.open(message,'', {
      duration: 2000,
    });
    this.zone.run(() => {
      this._snackBar.open(message, 'x', config);
    });
  }

  showWarning(message:string) {
    let config = new MatSnackBarConfig();
    config.duration = 2000 ;
    config.panelClass= ['warning-snackbar'];
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'left';
    this._snackBar.open(message,'', {
      duration: 2000,
      panelClass: ['warning-snackbar'],
    });
    this.zone.run(() => {
      this._snackBar.open(message, 'x', config);
    });
  }



}
