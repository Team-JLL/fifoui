import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiProviderService {

  constructor(private http : HttpClient) { }


  private static cleanObject(obj: any): any {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }

  public post(apiUrl: string, data: any,options:any): Observable<any> {
    data = ApiProviderService.cleanObject(data);
    //console.log('REQUEST BODY for API :', apiUrl, data);
    return this.http.post(apiUrl, data,options);
  }

  public get(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl);
  }

}
