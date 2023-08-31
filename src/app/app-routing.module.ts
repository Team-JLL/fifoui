import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './ui/dashboard/dashboard.component';
import {LiquidationComponent} from "./ui/liquidation/liquidation.component";
import {ApprovalFeasibilityComponent} from "./ui/approval-feasibility/approval-feasibility.component";
import {FinalBypassComponent} from "./ui/final-bypass/final-bypass.component";
import {HomeScreenComponent} from "./ui/home-screen/home-screen.component";
import {BypassRequestsSummaryComponent} from "./ui/dashboard/selected-requests/bypass-requests-summary.component";
import {RepositoryComponent} from "./ui/repository/repository/repository.component";
import {UserMasterComponent} from "./ui/user-master/user-master.component";


const routes: Routes = [
  {path: '', component:HomeScreenComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'selectedRequests', component:BypassRequestsSummaryComponent},
  {path: 'liquidation', component: LiquidationComponent},
  {path: 'approvalFeasibility', component: ApprovalFeasibilityComponent},
  {path: 'fifoFinalBypass' , component:FinalBypassComponent},
  {path: 'repository', component:RepositoryComponent},
  {path: 'userMaster', component:UserMasterComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
