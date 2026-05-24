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
export class HrService {

  private baseUrl = `${environment.apiBaseUrl}`;
  public readonly TOKEN_NAME = 'userToken';

  headerParams:any = {
    'Authorization': this.authService.token
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerParams)
  }

  private reportsFilterSubject = new BehaviorSubject<any>(null);
  reportsFilters$ = this.reportsFilterSubject.asObservable();

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

  //Get dashboard stats
  public getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboardStats`, this.requestOptions);
  }

  //Update Employee
  // public updateEmployee(data: any): Observable<any> {
  //   return this.http.patch<any>(`${this.baseUrl}/updateEmployee`, data, this.requestOptions);
  // }

  /*************** REPORTING RELATED ACTIONS ***************/
  getReportsFilters() {
    forkJoin({
      departments: this.getDepartments(),
      designations: this.getDesignations(),
    })
    .subscribe({
      next: (data) => {
        this.reportsFilterSubject.next(data);
      },
      error: () => {
        //this.loading = false;
      },
      complete: () => {
        //this.loading = false;
      }
    });
  }

  /*************** EMPLOYEE RELATED ACTIONS ***************/

  //Create a new employee
  public createEmployee(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addEmployee`, info, this.requestOptions);
  }

  //Bulk employee upload
  public bulkEmployeeUpload(file: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/uploadBulkEmployees`, file, this.requestOptions);
  }

  //Resend invite
  public resendEmployeeInvite(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/employee/resend-invite`, payload, this.requestOptions);
  }

  //Get the list of all employees
  public getEmployees(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchEmployees`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
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

  /*************** LEAVE APPLICATIONS RELATED ACTIONS ***************/

  //Create a new leave request
  public createLeaveRequest(leaveDetails: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/leaveApplication`, leaveDetails, this.requestOptions);
  }

  //Update Leave Request
  public updateLeaveRequest(data: any, leaveId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateLeaveApplication/${leaveId}`, data, this.requestOptions);
  }

  //Delete leave request
  public deleteLeaveRequest(leaveId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteLeaveApplication/${leaveId}`, this.requestOptions);
  }

  //Get the list of all leave applications
  public getLeaveRequests(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/getLeaveRecords`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Get the list of all requested leave applications
  public getRequestedLeaveApprovals(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchRequestedLeaves`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Get details of employee leave applications on a graph
  public getLeaveGraph(leaveYear?:number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/leaveGraphDetails?year=${leaveYear}`, this.requestOptions);
  }

  //Approve or Decline a leave request
  public actionLeaveRequest(leaveDetails: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/leaveAction`, leaveDetails, this.requestOptions);
  }

  //Assign Leave Days
  public assignLeaveDays(payload: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/assignLeaveDays`, payload, this.requestOptions);
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

  /*************** REIMBURSEMENT APPLICATIONS RELATED ACTIONS ***************/

  //Create a new expense request
  public createExpenseRequest(expenseDetails: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createExpenseRequests`, expenseDetails, this.requestOptions);
  }

  //Get the list of all expense applications
  public getExpenseRequests(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchExpenseRequests`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Get the list of all requested expense applications
  public getRequestedExpenseApprovals(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchApprovalExpenseRequest`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Update Expense Request
  public updateExpenseRequest(data: any, requestId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateExpenseRequest/${requestId}`, data, this.requestOptions);
  }

  //Delete expense request
  public deleteExpenseRequest(requestId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteExpenseRequest/${requestId}`, this.requestOptions);
  }

  //Approve or Decline a expense request
  public actionExpenseRequest(expenseDetails: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/expenseAction`, expenseDetails, this.requestOptions);
  }

  //Get details of employee expense applications on a graph
  public getExpenseGraph(year?:number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/expenseGraph/${year}`, this.requestOptions);
  }


  /*************** APPRAISAL PERIODS RELATED ACTIONS ***************/

  //Create a new appraisal period
  public createAppraisalPeriod(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createAppraisalPeriod`, info, this.requestOptions);
  }

  //Get the list of all appraisal periods
  public getAppraisalPeriods(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchPeriod`, this.requestOptions);
  }

  //Get appraisal period details for an employee
  public getEmployeeAppraisalDetails(employeeId: string, periodId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchGroupDetails/${employeeId}/${periodId}`, this.requestOptions);
  }

  //Get appraisal period details for all employees
  public getAppraisalDetails(periodId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchAppraisalPeriod/${periodId}`, this.requestOptions);
  }

  //Update Appraisal Period
  public updateAppraisalPeriod(data: any, periodId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updatePeriod/${periodId}`, data, this.requestOptions);
  }

  //Delete Appraisal period
  public deleteAppraisalPeriod(periodId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deletePeriod/${periodId}`, this.requestOptions);
  }

  /*************** APPRAISAL KPI GROUPS RELATED ACTIONS ***************/

  //Create a new kpi group
  public createKpiGroup(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createKpiGroups`, info, this.requestOptions);
  }

  //Get the list of all kpi groups
  public getKpiGroups(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchAppraisalGroups`, this.requestOptions);
  }

  //Update kpi group
  public updateKpiGroup(data: any, groupId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateGroup/${groupId}`, data, this.requestOptions);
  }

  //Delete kpi group
  public deleteKpiGroup(groupId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteGroup/${groupId}`, this.requestOptions);
  }

  /*************** APPRAISAL KPI RELATED ACTIONS ***************/

  //Create a new kpi
  public createKpi(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createKpis`, info, this.requestOptions);
  }

  //Get the list of all kpis
  // public getKpi(): Observable<any> {
  //   return this.http.get<any>(`${this.path}/fetchAppraisalGroups`, this.requestOptions);
  // }

  //Update kpi
  public updateKpi(data: any, kpiId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateKPIs/${kpiId}`, data, this.requestOptions);
  }

  //Delete kpi 
  public deleteKpi(kpiId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteKPI/${kpiId}`, this.requestOptions);
  }

  /*************** APPRAISAL KPI RATING RELATED ACTIONS ***************/

  //Create a new kpi rating
  public createKpiRating(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createRating`, info, this.requestOptions);
  }

  //Get the list of all kpi ratings
  public getKpiRatings(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchRatings`, this.requestOptions);
  }

  //Update kpi rating
  public updateKpiRating(data: any, ratingId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateRating/${ratingId}`, data, this.requestOptions);
  }

  //Delete kpi rating
  public deleteKpiRating(ratingId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteRating/${ratingId}`, this.requestOptions);
  }

  /*************** APPRAISAL SUBMISSION AND REVIEW RELATED ACTIONS ***************/

  //Submit Appraisal Entry
  public submitAppraisalEntry(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/employeeRequestAppraisal`, payload, this.requestOptions);
  }

  //Submit Appraisal Review
  public submitAppraisalReview(payload: any, employeeId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/managerRateKpi/${employeeId}`, payload, this.requestOptions);
  }

  //Get the list of all appraisal requests
  public getAppraisalRequests(periodId:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchAppraisalRequests/${periodId}`, this.requestOptions);
  }

  //Submit Appraisal Review
  public updateAppraisalPeriodStatus(payload:any, periodId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateAppraisalPeriodStatus/${periodId}`, payload, this.requestOptions);
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
  public getPayrollPeriods(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchPayrollPeriods`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
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

  //Get details of employee expense applications on a graph
  public getPayrollGraph(year?:number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/payrollGraph/${year}`, this.requestOptions);
  }

  /*************** SALARY SCALE RELATED ACTIONS ***************/

  //Create a new salary scale
  public createSalaryScale(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createSalaryScale`, payload, this.requestOptions);
  }

  //Get the payroll salary scales
  public getSalaryScales(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchSalaryScale`, this.requestOptions);
  }

  //Update Payroll salary scale
  public updateSalaryScale(salaryScaleId: any, payload:any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateSalaryScale/${salaryScaleId}`, payload, this.requestOptions);
  }

  //Delete payroll salary scale
  public deleteSalaryScale(salaryScaleId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteSalaryScale/${salaryScaleId}`, this.requestOptions);
  }


  /*************** ATTENDANCE RELATED ACTIONS ***************/

  //Get the attendance list
  public getAttendanceList(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchAttendance`;
    // if (filters.dateRange) {
    //   filters = filters.set('dateStart', filters.dateRange.start).set('dateEnd', filters.dateRange.end);
    // }
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Staff Check in or check out
  public staffCheckInOut(info: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/checkInOut`, info, this.requestOptions);
  }

  /*************** VISITOR MANAGEMENT RELATED ACTIONS ***************/

  //Book a new visitor
  public bookVisitor(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/bookVisitor`, info, this.requestOptions);
  }

  //Update booked visitor
  public updateVisitor(info: any, bookingId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateVisit/${bookingId}`, info, this.requestOptions);
  }

  //Get the list of all booked visitors
  public getVisitorsList(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchVisits`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Check in a visitor
  public checkInVisitor(info: any, bookingId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/checkIn/${bookingId}`, info, this.requestOptions);
  }

  //Check out a visitor
  public checkOutVisitor(info: any, bookingId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/checkOut/${bookingId}`, info, this.requestOptions);
  }

  /*************** CALENDAR RELATED ACTIONS ***************/

  //Book a new meeting
  public createMeeting(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createMeeting`, info, this.requestOptions);
  }

  //Update Meeting
  public updateMeeting(data: any, meetingId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateMeeting/${meetingId}`, data, this.requestOptions);
  }

  //Get the list of all calendar events
  public getCalendar(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchCalendar`, this.requestOptions);
  }

  //Delete meeting
  public deleteMeeting(meetingId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteMeeting/${meetingId}`, this.requestOptions);
  }

  /*************** NOTICE BOARD RELATED ACTIONS ***************/

  //Create a new notice
  public createNotice(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/announcements`, payload, this.requestOptions);
  }

  //Get the list of all notices
  public getNotices(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/announcements`, this.requestOptions);
  }

  //Update Notice
  public updateNotice(data: any, noticeId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/announcements/${noticeId}`, data, this.requestOptions);
  }

  //Delete Notice
  public deleteNotice(noticeId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/announcements/${noticeId}`, this.requestOptions);
  }

  /*************** RECRUITMENT RELATED ACTIONS ***************/

  //Create a new job role
  public createJobPost(info: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createJobListing`, info, this.requestOptions);
  }

  //Update Job Post
  public updateJobPost(data: any, jobId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/updateJobListing/${jobId}`, data, this.requestOptions);
  }

  //Delete Job Post
  public deleteJobPost(roleId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteJobListing/${roleId}`, this.requestOptions);
  }

  //Get the list of all Job Roles
  public getJobRoles(pageNo?:number, pageSize?:number, searchParam?:string, filters?:any): Observable<any> {
    const url = `${this.baseUrl}/fetchJobListings`;
    return this.getPagedData$(url, pageNo, pageSize, searchParam, filters);
  }

  //Get job post details
  public getJobPostdetails(jobId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchJobListing/${jobId}`, this.requestOptions);
  }

  //Get the list of all applicants
  public getMasterList(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/masterList`, this.requestOptions);
  }

  //Publish a job post
  public publishJobPost(info: any, jobId: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/publishJob/${jobId}`, info, this.requestOptions);
  }

}
