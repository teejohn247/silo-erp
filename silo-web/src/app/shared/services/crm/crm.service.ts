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
export class CrmService {

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

  /*************** LEAD RELATED ACTIONS ***************/

  //Create a new lead
  public createLead(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createLead`, info, this.requestOptions);
  }

  //Get the list of all Leads
  public getLeads(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchLeads`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Update Lead
  public updateLead(payload: any, leadId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateLead/${leadId}`, payload, this.requestOptions);
  }

  //Delete lead
  public deleteLead(leadId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteLead/${leadId}`, this.requestOptions);
  }

  //Create a new lead status
  public createLeadStatus(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createLeadStage`, info, this.requestOptions);
  }

  //Get Lead Statuses
  public getLeadStatuses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchLeadStages`, this.requestOptions);
  }

  //Update Lead Status
  public updateLeadStatus(payload: any, statusId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateLeadStage/${statusId}`, payload, this.requestOptions);
  }

  //Delete Lead Status
  public deleteLeadStatus(statusId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteLeadStage/${statusId}`, this.requestOptions);
  }

  //Convert to Contact
  public convertToContact(leadId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/convertLeadToContact/${leadId}`, undefined, this.requestOptions);
  }

  //Convert to Deal
  public convertToDeal(leadId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/convertLeadToDeal/${leadId}`, undefined, this.requestOptions);
  }

  /*************** CONTACT RELATED ACTIONS ***************/

  //Create a new contact
  public createContact(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createContact`, info, this.requestOptions);
  }

  //Get the list of all Contacts
  public getContacts(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchContacts`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Update Contact
  public updateContact(payload: any, contactId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateContact/${contactId}`, payload, this.requestOptions);
  }

  //Delete Contact
  public deleteContact(contactId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteContact/${contactId}`, this.requestOptions);
  }

  /*************** DEAL RELATED ACTIONS ***************/

  //Create a new deal
  public createDeal(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createDeal`, info, this.requestOptions);
  }

  //Get the list of all Deals
  public getDeals(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchDeals`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Update Deal
  public updateDeal(payload: any, dealId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateContact/${dealId}`, payload, this.requestOptions);
  }

  //Delete Deal
  public deleteDeal(dealId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteContact/${dealId}`, this.requestOptions);
  }

  //Create a new deal status
  public createDealStatus(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createDealStage`, info, this.requestOptions);
  }

  //Get Deal Statuses
  public getDealStatuses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchDealStages`, this.requestOptions);
  }

  //Update Deal Status
  public updateDealStatus(payload: any, statusId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateDealStage/${statusId}`, payload, this.requestOptions);
  }

  //Delete Deal Status
  public deleteDealStatus(statusId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteDealStage/${statusId}`, this.requestOptions);
  }

  /*************** AGENT RELATED ACTIONS ***************/

  //Create a new agent
  public createAgent(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addEmployee`, info, this.requestOptions);
  }

  //Get the list of all Agents
  public getAgents(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchAgents`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  /*************** TICKET RELATED ACTIONS ***************/

  //Create a new ticket
  public createTicket(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createTicket`, info, this.requestOptions);
  }

  //Get the list of all tickets
  public getTickets(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchTickets`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Update Ticket
  public updateTicket(payload: any, dealId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateTicket/${dealId}`, payload, this.requestOptions);
  }

  //Delete Ticket
  public deleteTicket(dealId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteTicket/${dealId}`, this.requestOptions);
  }

  //Create a new ticket status
  public createTicketStatus(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createTicketStage`, info, this.requestOptions);
  }

  //Get Ticket Statuses
  public getTicketStatuses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchTicketStages`, this.requestOptions);
  }

  //Update Ticket Status
  public updateTicketStatus(payload: any, statusId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateTicketStage/${statusId}`, payload, this.requestOptions);
  }

  //Delete Ticket Status
  public deleteTicketStatus(statusId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteTicketStage/${statusId}`, this.requestOptions);
  }

}
