import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiCallFailure = new BehaviorSubject<any>(null);
  apiCallFailureObservable = this.apiCallFailure.asObservable();

  private configService = inject(AppConfigService);
  private baseURL = this.configService.apiUrl;
  private http = inject(HttpClient);
  constructor() { }

  put(route: string, data: any):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(this.baseURL+'/'+route, data, {headers});
  }

  putWithHeaders(route: string, data: any, headers: any):Observable<any> {
    return this.http.put(this.baseURL+'/'+route, data, headers);
  }

  post(route: string, data: any):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.baseURL+'/'+route, data, {headers});
  }

  get(route: string):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(this.baseURL+'/'+route, {headers});
  }

  delete(route: string):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete(this.baseURL+'/'+route, {headers});
  }

  retryDelay(error: HttpErrorResponse) {
    if (401 === error.status) {
      throw error;
    }
    return timer(10);
  }

  reportAPICallFailure(error: any) {
    this.apiCallFailure.next(error);
  }
}
