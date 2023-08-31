import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from './sidebar/sidebar.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {MaterialModule} from '../material/material.module';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { CloseButtonDirective } from './close-button.directive';
import {NgxSpinnerModule} from "ngx-spinner";
import { ApproveBarComponent } from './approve-popup/approve-bar/approve-bar.component';
import { RejectionPopupComponent } from './rejection-popup/rejection-popup.component';
import {MatTabsModule} from "@angular/material/tabs";



@NgModule({
  declarations: [
    SidebarComponent,
    ToolbarComponent,
    LoadingSpinnerComponent,
    CloseButtonDirective,
    ApproveBarComponent,
    RejectionPopupComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    NgxSpinnerModule,
    MatTabsModule
  ],
    exports: [
        SidebarComponent,
        ToolbarComponent,
        LoadingSpinnerComponent,
        CloseButtonDirective
    ]
})
export class LayoutsModule {
}
