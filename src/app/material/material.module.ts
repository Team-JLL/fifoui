import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDividerModule} from "@angular/material/divider";
import {MatNativeDateModule} from "@angular/material/core";
import {MatTabsModule} from "@angular/material/tabs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatStepperModule} from "@angular/material/stepper";
import {AgGridModule} from "ag-grid-angular";
import {MatDialogModule} from "@angular/material/dialog";
import {MatMenuModule} from "@angular/material/menu";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDividerModule,
    MatNativeDateModule,
    MatTabsModule,
    FormsModule,
    MatInputModule,
    MatStepperModule,
    ReactiveFormsModule,
    AgGridModule,
    MatDialogModule,
    MatMenuModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTooltipModule

  ],
  exports: [
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDividerModule,
    MatNativeDateModule,
    MatTabsModule,
    FormsModule,
    MatInputModule,
    MatStepperModule,
    ReactiveFormsModule,
    AgGridModule,
    MatDialogModule,
    MatMenuModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatCheckboxModule
  ]
})
export class MaterialModule {
}
