import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { BehaviorSubject, forkJoin, Observable, switchMap, tap, timer } from 'rxjs';
import { AuthService } from '../utils/auth.service';
import { buildUrlWithParams } from '@helpers/query-params.helper';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

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

  public getPagedData$(
    endpoint: string,
    pageNo?: number,
    pageSize?: number,
    searchParam?: string,
    filters?: any
  ): Observable<any> {
    // Build query params
    const params: { [k: string]: any } = { page: pageNo ?? 1, limit: pageSize ?? 10 };
    if (searchParam) params['search'] = searchParam;
    Object.assign(params, filters || {});

    // Build full URL
    const url = buildUrlWithParams(`${endpoint}`, params);

    // Return Observable from HTTP GET
    return this.http.get<any>(url, this.requestOptions);
  }


  public sendComplaint(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/complaints`, payload, this.requestOptions);
  }


  /*************** NOTIFICATIONS RELATED ACTIONS ***************/

  //Get all notifications
  public getNotifications(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchNotifications`, this.requestOptions);
  }

  //Constantly poll notifications
  pollNotifications(intervalMs = 5000): Observable<any> { 
    return timer(0, intervalMs).pipe( 
      switchMap(() => this.getNotifications())
    ); 
  }

  //Read Notification
  public readNotification(notificationId:string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/notifications/markAsRead/${notificationId}`, undefined, this.requestOptions);
  }

  /*************** SUBSCRIPTION RELATED ACTIONS ***************/

  //Get subscription plans
  public getSubscriptionPlans(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription/plans`, this.requestOptions);
  }

  //Get User Subscription
  public getUserSubscription(email: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription/customer/${email}`, this.requestOptions);
  }

  //Initiate Subscription
  public initSubscription(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/subscription/initiate`, payload, this.requestOptions);
  }

  //Initiate Subscription
  public cancelSubscription(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/subscription/disable`, payload, this.requestOptions);
  }

  //Verify Subscription
  public verifySubscription(refNo: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription/verify?reference=${refNo}`, this.requestOptions);
  }

  //Manage User Subscription
  public manageUserSubscription(subscriptionCode:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription/${subscriptionCode}/manage/link`, this.requestOptions);
  }

  //Get subscription invoices
  public getInvoices(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/payment/invoices`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  /*************** ROLES & PERMISSIONS RELATED ACTIONS ***************/

  //Create Role
  public createRole(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createRole`, payload, this.requestOptions);
  }

  //Update Role
  public updateRole(payload: any, roleId:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/updateRole/${roleId}`, payload, this.requestOptions);
  }

  //Get company roles
  public getCompanyRoles(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/roles`, this.requestOptions);
  }

  /*************** COMPANY INFORMATION RELATED ACTIONS ***************/
  
  //Get company information
  public getCompanyInfo(companyId:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchCompany/${companyId}`, this.requestOptions);
  }

  //Update Company Info
  public updateCompanyInfo(payload: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateAccountInfo`, payload, this.requestOptions);
  }

  //Update Company Logo
  public updateCompanyLogo(payload: any, companyId:string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateCompanyLogo/${companyId}`, payload, this.requestOptions);
  }
}
