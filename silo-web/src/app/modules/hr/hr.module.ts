import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HrRoutingModule } from './hr-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '@sharedWeb/shared.module';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { EmployeeInfoComponent } from './employees/employee-info/employee-info.component';
import { EmployeeProfileComponent } from './employees/employee-profile/employee-profile.component';
import { LeaveAssignmentComponent } from './leave-management/leave-assignment/leave-assignment.component';
import { PaymentInfoComponent } from './payroll/payment-info/payment-info.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { WorkLocationComponent } from './attendance/work-location/work-location.component';
import { LeaveManagementOverviewComponent } from './leave-management/leave-management-overview/leave-management-overview.component';
import { LeaveRequestsOverviewComponent } from './leave-management/leave-requests-overview/leave-requests-overview.component';
import { LeaveRequestInfoComponent } from './leave-management/leave-request-info/leave-request-info.component';
import { ExpenseManagementOverviewComponent } from './expense-management/expense-management-overview/expense-management-overview.component';
import { ExpenseRequestsInfoComponent } from './expense-management/expense-requests-info/expense-requests-info.component';
import { ExpenseRequestsOverviewComponent } from './expense-management/expense-requests-overview/expense-requests-overview.component';
import { EmployeeAssignmentComponent } from './employees/employee-assignment/employee-assignment.component';
import { EmployeeSalaryScaleComponent } from './employees/employee-salary-scale/employee-salary-scale.component';
import { AttendancePortalComponent } from './attendance/attendance-portal/attendance-portal.component';
import { AttendanceLogComponent } from './attendance/attendance-log/attendance-log.component';
import { VisitorInfoComponent } from './attendance/visitor-info/visitor-info.component';
import { VisitorsLogComponent } from './attendance/visitors-log/visitors-log.component';
import { PayrollOverviewComponent } from './payroll/payroll-overview/payroll-overview.component';
import { PayrollSummaryComponent } from './payroll/payroll-summary/payroll-summary.component';
import { PayrollCalculatorComponent } from './payroll/payroll-calculator/payroll-calculator.component';
import { PayrollDetailsComponent } from './payroll/payroll-details/payroll-details.component';
import { PayrollPeriodInfoComponent } from './payroll/payroll-period-info/payroll-period-info.component';
import { PayslipComponent } from './payroll/payslip/payslip.component';
import { ReportsPortalComponent } from './reports/reports-portal/reports-portal.component';
import { EmployeesReportComponent } from './reports/employees-report/employees-report.component';
import { LeaveReportsComponent } from './reports/leave-reports/leave-reports.component';
import { ExpenseReportsComponent } from './reports/expense-reports/expense-reports.component';
import { NoticeBoardOverviewComponent } from './notice-board/notice-board-overview/notice-board-overview.component';
import { NoticeBoardPreviewComponent } from './notice-board/notice-board-preview/notice-board-preview.component';
import { CalendarEventsComponent } from './calendar/calendar-events/calendar-events.component';
import { CalendarComponent } from '@sharedWeb/components/blocks/calendar/calendar/calendar.component';
import { MeetingInfoComponent } from './calendar/meeting-info/meeting-info.component';
import { AppraisalPortalComponent } from './appraisal/appraisal-portal/appraisal-portal.component';
import { AppraisalOverviewComponent } from './appraisal/appraisal-overview/appraisal-overview.component';
import { AppraisalPeriodInfoComponent } from './appraisal/appraisal-period-info/appraisal-period-info.component';
import { AppraisalKpisComponent } from './appraisal/appraisal-kpis/appraisal-kpis.component';
import { AppraisalKpiGroupInfoComponent } from './appraisal/appraisal-kpi-group-info/appraisal-kpi-group-info.component';
import { AppraisalKpiInfoComponent } from './appraisal/appraisal-kpi-info/appraisal-kpi-info.component';
import { AppraisalFormComponent } from './appraisal/appraisal-form/appraisal-form.component';
import { RecruitmentPortalComponent } from './recruitment/recruitment-portal/recruitment-portal.component';
import { RecruitmentOverviewComponent } from './recruitment/recruitment-overview/recruitment-overview.component';
import { RecruitmentJobBoardComponent } from './recruitment/recruitment-job-board/recruitment-job-board.component';
import { RecruitmentJobInfoComponent } from './recruitment/recruitment-job-info/recruitment-job-info.component';


@NgModule({
  declarations: [
    AppraisalFormComponent,
    AppraisalKpiInfoComponent,
    AppraisalKpiGroupInfoComponent,
    AppraisalKpisComponent,
    AppraisalOverviewComponent,
    AppraisalPeriodInfoComponent,
    AppraisalPortalComponent,
    AttendancePortalComponent,
    AttendanceLogComponent,
    CalendarEventsComponent,
    DashboardComponent,
    EmployeeAssignmentComponent,
    EmployeeSalaryScaleComponent,
    EmployeeListComponent,
    EmployeeInfoComponent,
    EmployeeProfileComponent,
    ExpenseManagementOverviewComponent,
    EmployeesReportComponent,
    ExpenseReportsComponent,
    ExpenseRequestsInfoComponent,
    ExpenseRequestsOverviewComponent,
    LeaveAssignmentComponent,
    LeaveManagementOverviewComponent,
    LeaveReportsComponent,
    LeaveRequestInfoComponent,
    LeaveRequestsOverviewComponent,
    MeetingInfoComponent,
    NoticeBoardOverviewComponent,
    NoticeBoardPreviewComponent,
    PaymentInfoComponent,
    PayrollCalculatorComponent,
    PayrollDetailsComponent,
    PayrollOverviewComponent,
    PayrollPeriodInfoComponent,
    PayslipComponent,
    PayrollSummaryComponent,
    RecruitmentJobBoardComponent,
    RecruitmentJobInfoComponent,
    RecruitmentOverviewComponent,
    RecruitmentPortalComponent,
    ReportsPortalComponent,
    VisitorInfoComponent,
    VisitorsLogComponent,
    WorkLocationComponent
  ],
  imports: [
    CommonModule,
    CalendarComponent,
    HrRoutingModule,
    GoogleMapsModule,
    SharedModule,
    DatePipe
  ]
})
export class HrModule { }
