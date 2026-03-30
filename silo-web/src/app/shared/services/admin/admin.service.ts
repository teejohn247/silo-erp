import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';
import { AuthService } from '../utils/auth.service';
import { buildUrlWithParams } from '@helpers/query-params.helper';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

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

  //Get the list of all companies
  public getAllCompanies(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchAllCompanies`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Get the list of all companies
  public getCompanyDetails(companyId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/companyId/${companyId}`, this.requestOptions);
  }

  //Get the list of all system modules
  public getSystemModules(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchModules`, this.requestOptions);
  }

  //Create a new permission
  public createPermission(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createPermission`, info, this.requestOptions);
  }

  //Update Permission
  public updatePermission(payload: any, permissionId:string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updatePermission/${permissionId}`, payload, this.requestOptions);
  }

  //Delete a permission
  public deletePermission(permissionId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deletePermission/${permissionId}`, this.requestOptions);
  }

  //Activate a company's subscription
  public activateSubscription(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/subscribe`, info, this.requestOptions);
  }

  //Get the subscription plans
  public getAllSubscriptionPlans(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscriptionPlans`, this.requestOptions);
  }

  //Get the subscription history by company id
  public getCompanySubscriptionHistory(companyId:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscriptions/company/${companyId}`, this.requestOptions);
  }

  //Create a new role
  public createRole(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createRole`, info, this.requestOptions);
  }

  //Update Company Permissions
  public updatePermissions(payload: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updatePermissions`, payload, this.requestOptions);
  }
}
