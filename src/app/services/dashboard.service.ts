import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {ApiProviderService} from "./api-provider.service";
import {UrlConstants} from "../utilities/UrlConstants";
import {AppConstants} from "../utilities/AppConstants";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiProvider: ApiProviderService) {
  }

  public getFifoMasterData(): Observable<any> {
    return this.apiProvider.get(UrlConstants.getFifoMaster);
  }

  public getDepotWiseAsmOrZonalManagers(): Observable<any> {
    return this.apiProvider.get(UrlConstants.getDepotWiseAsmOrZonalManagers);
  }

  public getAllRequestedFifos(): Observable<any> {
    return this.apiProvider.get(UrlConstants.getAllRequestedFifos);
  }

  public getAllBypassedRequestsForMDM(): Observable<any> {
    return this.apiProvider.get(UrlConstants.getAllBypassedRequestsForMDM);
  }

  public submitBypassRequest(AsmOrZonalManagers: any, selectedRequests: any, remarks: String): Observable<any> {
    const data = {AsmOrZonalManagers, selectedRequests, remarks}
    return this.apiProvider.post(UrlConstants.submitBypassRequest, data, '');
  }

  public BypassFromLiquidation(selectedRequests: any, remarks: any): Observable<any> {
    const data = {selectedRequests, remarks}
    return this.apiProvider.post(UrlConstants.BypassFromLiquidation, data, '');
  }

  public BypassFromMDM(selectedRequests: any, remarks: any): Observable<any> {
    const data = {selectedRequests, remarks}
    return this.apiProvider.post(UrlConstants.BypassFromMDM, data, '');
  }

  public BypassFromApprovalFeasibility(selectedRequests: any,remarks:any): Observable<any> {
    const data = {selectedRequests,remarks}
    return this.apiProvider.post(UrlConstants.BypassFromApprovalFeasibility, data, '');
  }

  public getCountData(): Observable<any> {
    return this.apiProvider.get(UrlConstants.getCountData);
  }

  public setBypassFlagForSelectedRequests(selectedRequests: any): Observable<any> {
    const data = {selectedRequests}
    return this.apiProvider.post(UrlConstants.setBypassFlagForSelectedRequests, data, '');
  }

  public getSelectedRequestsForDetailSummary(): Observable<any> {
    return this.apiProvider.get(UrlConstants.getSelectedRequestsForDetailSummary);
  }

  public deleteRequestFromSelectedRequests(selectedRequest: any): Observable<any> {
    const data = {selectedRequest}
    return this.apiProvider.post(UrlConstants.deleteRequestFromSelectedRequests, data, '');
  }

  public getRequestHistory(): Observable<any> {
    return this.apiProvider.get(UrlConstants.getRequestHistory);
  }

  public getRepositoryData(): Observable<any> {
    return this.apiProvider.get(UrlConstants.getRepositoryData);
  }

  public RejectionFromAllStage(selectedRequests: any, rejectReson: any): Observable<any> {
    const data = {selectedRequests, rejectReson}
    return this.apiProvider.post(UrlConstants.RejectionFromAllStage, data, '');
  }

  public BypassEventHistory(bypassRequestId: any): Observable<any> {
    const data = {bypassRequestId}
    return this.apiProvider.post(UrlConstants.BypassEventHistory, data, '');
  }

  public getDataForCards(status: any): Observable<any> {
    const data = {status}
    return this.apiProvider.post(UrlConstants.getDataForCards, data, '');
  }

  public cancelRequest(selectedRequests: any, rejectReson: any): Observable<any> {
    const data = {selectedRequests, rejectReson}
    return this.apiProvider.post(UrlConstants.cancelRequest, data, '');
  }

  public getBypassUserMapping() : Observable<any>{
    return this.apiProvider.get(UrlConstants.getBypassUserMapping)
  }

  public deleteBypassUserMapping(mappingId: any): Observable<any> {
    const data = {mappingId}
    return this.apiProvider.post(UrlConstants.deleteBypassUserMapping, data, '');
  }

  public getDetailsForAddNewMapping() : Observable<any>{
    return this.apiProvider.get(UrlConstants.getDetailsForAddNewMapping)
  }

  public addNewBypassMapping(requesterIds: any, channel: any, depot: any, liquidUsrIds: any,dmndPlnrUsrIds:any,requesterType:any,zsmUsr:any): Observable<any> {
    const data = {requesterIds, channel, depot, liquidUsrIds,dmndPlnrUsrIds,requesterType,zsmUsr}
    return this.apiProvider.post(UrlConstants.addNewBypassMapping, data, '');
  }

  public editBypassMapping(mappingId:any,requesterIds: any, channel: any, depot: any, liquidUsrIds: any,dmndPlnrUsrIds:any,requesterType:any,zsmUsr:any): Observable<any> {
    const data = {mappingId,requesterIds, channel, depot, liquidUsrIds,dmndPlnrUsrIds,requesterType,zsmUsr}
    return this.apiProvider.post(UrlConstants.editBypassMapping, data, '');
  }



  /*----------------------Reports------------------------------------------------------------------------*/

  public downloadFinalBypassReport(status:any): Observable<any> {
    const data = {status}
    return this.apiProvider.post(UrlConstants.downloadFinalBypassReport, data, {responseType: 'blob'});
  }

  public downloadBypassHistoryReport(_cardStatus:any): Observable<any> {
    const data = {_cardStatus}
    return this.apiProvider.post(UrlConstants.downloadBypassHistoryReport, data, {responseType: 'blob'});
  }

  public downloadFIFOMaster(): Observable<any> {
    const data = {}
    return this.apiProvider.post(UrlConstants.downloadFIFOMaster, data, {responseType: 'blob'});
  }



}
