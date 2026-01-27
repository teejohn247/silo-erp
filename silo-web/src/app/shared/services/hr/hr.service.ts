import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from '../utils/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HrService {

  private baseUrl = `${environment.apiBaseUrl}`;
  public readonly TOKEN_NAME = 'userToken';

  headerParams:any = {
    'Authorization': this.authService.token
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerParams)
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  /*************** ONBOARDING RELATED ACTIONS ***************/

  //Save company details
  public saveCompanyDetails(payload: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/onboarding/company-details`, payload, this.requestOptions);
  }

  //Save company modules
  public saveCompanyModules(payload: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/onboarding/company-modules`, payload, this.requestOptions);
  }

  //Send Employee Invite
  public sendEmployeeInvites(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/onboarding/invite-employees`, payload, this.requestOptions);
  }

}
