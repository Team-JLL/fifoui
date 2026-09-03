import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiProviderService} from './api-provider.service';
import {UrlConstants} from '../utilities/UrlConstants';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(private apiProvider: ApiProviderService) {
  }

  public getMaintenanceStatus(): Observable<any> {
    return this.apiProvider.get(UrlConstants.getMaintenanceStatus);
  }
}
