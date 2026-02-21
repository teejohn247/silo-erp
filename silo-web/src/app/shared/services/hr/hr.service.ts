import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from '../utils/auth.service';
import { buildUrlWithParams } from '@helpers/query-params.helper';

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


  //Get departments by companyId
  public getCompanyDepartments(companyId:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/company/${companyId}/departments`, this.requestOptions);
  }

  //Get modules by companyId
  public getCompanyModules(companyId:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/company/${companyId}/modules`, this.requestOptions);
  }

  //Update Employee
  // public updateEmployee(data: any): Observable<any> {
  //   return this.http.patch<any>(`${this.baseUrl}/updateEmployee`, data, this.requestOptions);
  // }

  /*************** EMPLOYEE RELATED ACTIONS ***************/

  //Create a new employee
  public createEmployee(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addEmployee`, info, this.requestOptions);
  }

  //Bulk employee upload
  public bulkEmployeeUpload(file: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/uploadBulkEmployees`, file, this.requestOptions);
  }

  //Get the list of all employees
  public getEmployees(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const params: { [k: string]: any } = { page: pageNo ?? 1, limit: pageSize ?? 10 }; 
    if (searchParam) params['search'] = searchParam; 
    Object.assign(params, filters || {});
    const url = buildUrlWithParams(`${this.baseUrl}/fetchEmployees`, params);
    return this.http.get<any>(url, this.requestOptions);
  }

  //Get an employee details
  public getEmployeeDetails(employeeId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchEmployee/${employeeId}`, this.requestOptions);
  }

  //Delete employee
  public deleteEmployee(employeeId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteEmployee/${employeeId}`, this.requestOptions);
  }

  //Update Employee
  public updateEmployee(data: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateEmployee`, data, this.requestOptions);
  }

  //Update Employee by Admin
  public updateEmployeeByAdmin(data: any, employeeId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/adminUpdateEmployee/${employeeId}`, data, this.requestOptions);
  }

  //Edit employee payment info
  public updatePaymentInfo(info: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/addPayment`, info, this.requestOptions);
  }

  //Assign Manager
  public assignManager(data: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/assignManager`, data, this.requestOptions);
  }

  //Assign Manager
  public assignApprover(data: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/assignApprover`, data, this.requestOptions);
  }


  /*************** DEPARTMENT RELATED ACTIONS ***************/

  //Create a new department
  public createDepartment(departmentName: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addDepartment`, departmentName, this.requestOptions);
  }

  //Get the list of all Departments
  public getDepartments(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchDepartments`, this.requestOptions);
  }

  //Update Department
  public updateDepartment(data: any, departmentId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateDepartment/${departmentId}`, data, this.requestOptions);
  }

  //Delete department
  public deleteDepartment(deptId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteDepartment/${deptId}`, this.requestOptions);
  }

  /*************** DESIGNATIONS RELATED ACTIONS ***************/

  //Create a new designation
  public createDesignation(designationName: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createDesignation`, designationName, this.requestOptions);
  }

  //Get the list of all Designations
  public getDesignations(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchDesignations`, this.requestOptions);
  }

  //Update designation
  public updateDesignation(data: any, designationId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateDesignation/${designationId}`, data, this.requestOptions);
  }

  //Delete designation
  public deleteDesignation(designationId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteDesignation/${designationId}`, this.requestOptions);
  }

  /*************** LEAVE TYPES RELATED ACTIONS ***************/

  //Create a new leave type
  public createLeaveType(leaveTypeName: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createLeave`, leaveTypeName, this.requestOptions);
  }

  //Get the list of all Leave Types
  public getLeaveTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchLeave`, this.requestOptions);
  }

  //Update Leave Type
  public updateLeaveType(data: any, leaveTypeId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateLeave/${leaveTypeId}`, data, this.requestOptions);
  }

  //Delete Leave Type
  public deleteLeaveType(leaveId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteLeave/${leaveId}`, this.requestOptions);
  }

  /*************** PUBLIC HOLIDAYS RELATED ACTIONS ***************/

  //Create a new public holiday
  public createPublicHoliday(holidayName: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createHoliday`, holidayName, this.requestOptions);
  }

  //Get the list of all public holidays
  public getPublicHolidays(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchHolidays`, this.requestOptions);
  }

  //Update public holiday
  public updatePublicHoliday(data: any, holidayId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateHoliday/${holidayId}`, data, this.requestOptions);
  }

  //Delete public holiday
  public deletePublicHoliday(holidayId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteHoliday/${holidayId}`, this.requestOptions);
  }

  /*************** EXPENSE TYPES RELATED ACTIONS ***************/

  //Create a new expense type
  public createExpenseType(expenseTypeName: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createExpenseType`, expenseTypeName, this.requestOptions);
  }

  //Get the list of all Expense Types
  public getExpenseTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getExpenseTypes`, this.requestOptions);
  }

  //Update Expense Type
  public updateExpenseType(data: any, expenseTypeId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateExpense/${expenseTypeId}`, data, this.requestOptions);
  }

  //Delete Expense Type
  public deleteExpenseType(expenseTypeId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteExpenseType/${expenseTypeId}`, this.requestOptions);
  }


  /*************** PAYROLL RELATED ACTIONS ***************/

  //Payroll details upload
  public payrollFileUpload(file: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/uploadPayroll`, file, this.requestOptions);
  }

  //Create a new payroll credit
  public createPayrollCredit(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createCredits`, info, this.requestOptions);
  }

  //Get the list of all payroll credits
  public getPayrollCredits(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchCredits`, this.requestOptions);
  }

  //Update Payroll Credit Info
  public updatePayrollCredit(data: any, payrollCreditId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateCredits/${payrollCreditId}`, data, this.requestOptions);
  }

  //Delete payroll credit
  public deletePayrollCredit(payrollCreditId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteCredit/${payrollCreditId}`, this.requestOptions);
  }

  //Create a new payroll debit
  public createPayrollDebit(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createDebits`, info, this.requestOptions);
  }

  //Get the list of all payroll debits
  public getPayrollDebits(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchDebits`, this.requestOptions);
  }

  //Update Payroll Debit Info
  public updatePayrollDebit(data: any, payrollDebitId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateDebits/${payrollDebitId}`, data, this.requestOptions);
  }

  //Delete payroll debit
  public deletePayrollDebit(payrollDebitId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteDebit/${payrollDebitId}`, this.requestOptions);
  }

  //Create a new payroll period
  public createPayrollPeriod(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createPayrollPeriod`, info, this.requestOptions);
  }

  //Get the list of all payroll periods
  public getPayrollPeriods(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchPayrollPeriods`, this.requestOptions);
  }

  //Get a payroll period details
  public getPayrollDetails(perioId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchPayrollPeriodDetails/${perioId}`, this.requestOptions);
  }

  //Update Payroll Period
  public updatePayrollPeriod(data: any, payrollPeriodId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updatePayrollPeriod/${payrollPeriodId}`, data, this.requestOptions);
  }

  //Delete payroll period
  public deletePayrollPeriod(payrollPeriodId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deletePayrollPeriod/${payrollPeriodId}`, this.requestOptions);
  }

  //Update Payroll Entry
  public updatePayrollEntry(data: any, entryId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updatePayrollEntry/${entryId}`, data, this.requestOptions);
  }


}
