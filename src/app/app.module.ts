import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutsModule} from './layouts/layouts.module';
import { DashboardComponent } from './ui/dashboard/dashboard.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CookieService} from 'ngx-cookie-service';
import {AgGridModule} from 'ag-grid-angular';
import {MaterialModule} from "./material/material.module";
import { LiquidationComponent } from './ui/liquidation/liquidation.component';
import { DatePickerComponent } from './ui/liquidation/liqdtn_date-picker/date-picker.component';
import { ApprovalFeasibilityComponent } from './ui/approval-feasibility/approval-feasibility.component';
import { FinalBypassComponent } from './ui/final-bypass/final-bypass.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./utilities/auth.interceptor";
import {ErrorInterceptor} from "./utilities/error.interceptor";
import {DatePipe, HashLocationStrategy, LocationStrategy} from "@angular/common";
import { HomeScreenComponent } from './ui/home-screen/home-screen.component';
import { BypassRequestsSummaryComponent } from './ui/dashboard/selected-requests/bypass-requests-summary.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { BypassTagsComponent } from './ui/final-bypass/bypass-tags/bypass-tags.component';
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import { NgxSpinnerModule } from "ngx-spinner";
import { LiqdtnRemarksComponent } from './ui/liquidation/liqdtn-remarks/liqdtn-remarks.component';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import { RepositoryComponent } from './ui/repository/repository/repository.component';
import { EventPopupComponent } from './ui/event-popup/event-popup.component';
import { AllRequestComponent } from './ui/all-request/all-request.component';
import {MatTabsModule} from "@angular/material/tabs";
import { UserMasterComponent } from './ui/user-master/user-master.component';
import { AddNewUserComponent } from './ui/user-master/add-new-user/add-new-user.component';
import { MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LiquidationComponent,
    DatePickerComponent,
    ApprovalFeasibilityComponent,
    FinalBypassComponent,
    HomeScreenComponent,
    BypassRequestsSummaryComponent,
    BypassTagsComponent,
    LiqdtnRemarksComponent,
    RepositoryComponent,
    EventPopupComponent,
    AllRequestComponent,
    UserMasterComponent,
    AddNewUserComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutsModule,
    AgGridModule,
    MaterialModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbModule,
    MatDatepickerModule,
    MatNativeDateModule,
    jqxGridModule,
    NgxMatSelectSearchModule,
    MatTabsModule,
    MatTooltipModule
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    { provide: LocationStrategy, useClass: HashLocationStrategy},

    /*----changing mat-datepicker default date format into dd/mm/yyyy-----*/
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },

    MatDatepickerModule,DatePipe
  ],
  exports: [
    DashboardComponent,
    LiquidationComponent,
    ApprovalFeasibilityComponent,
    AllRequestComponent,
    MatTabsModule
  ],
  entryComponents:[EventPopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],

})
export class AppModule {
}
