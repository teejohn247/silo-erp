import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '@hr/dashboard/dashboard.component';
import { EmployeeListComponent } from '@hr/employees/employee-list/employee-list.component';
import { EmployeeProfileComponent } from './employees/employee-profile/employee-profile.component';
import { LeaveManagementOverviewComponent } from './leave-management/leave-management-overview/leave-management-overview.component';
import { LeaveRequestInfoComponent } from './leave-management/leave-request-info/leave-request-info.component';
import { LeaveRequestsOverviewComponent } from './leave-management/leave-requests-overview/leave-requests-overview.component';
import { ExpenseManagementOverviewComponent } from './expense-management/expense-management-overview/expense-management-overview.component';
import { ExpenseRequestsOverviewComponent } from './expense-management/expense-requests-overview/expense-requests-overview.component';
import { AttendancePortalComponent } from './attendance/attendance-portal/attendance-portal.component';
import { AttendanceLogComponent } from './attendance/attendance-log/attendance-log.component';
import { VisitorsLogComponent } from './attendance/visitors-log/visitors-log.component';
import { PayrollOverviewComponent } from './payroll/payroll-overview/payroll-overview.component';
import { PayrollSummaryComponent } from './payroll/payroll-summary/payroll-summary.component';
import { PayrollDetailsComponent } from './payroll/payroll-details/payroll-details.component';
import { ReportsPortalComponent } from './reports/reports-portal/reports-portal.component';
import { EmployeesReportComponent } from './reports/employees-report/employees-report.component';
import { LeaveReportsComponent } from './reports/leave-reports/leave-reports.component';
import { ExpenseReportsComponent } from './reports/expense-reports/expense-reports.component';
import { PayrollReportsComponent } from './reports/payroll-reports/payroll-reports.component';
import { AttendanceReportsComponent } from './reports/attendance-reports/attendance-reports.component';
import { NoticeBoardOverviewComponent } from './notice-board/notice-board-overview/notice-board-overview.component';
import { CalendarEventsComponent } from './calendar/calendar-events/calendar-events.component';
import { AppraisalFormComponent } from './appraisal/appraisal-form/appraisal-form.component';
import { AppraisalPortalComponent } from './appraisal/appraisal-portal/appraisal-portal.component';
import { AppraisalOverviewComponent } from './appraisal/appraisal-overview/appraisal-overview.component';
import { AppraisalKpisComponent } from './appraisal/appraisal-kpis/appraisal-kpis.component';
import { RecruitmentPortalComponent } from './recruitment/recruitment-portal/recruitment-portal.component';
import { RecruitmentOverviewComponent } from './recruitment/recruitment-overview/recruitment-overview.component';
import { RecruitmentJobBoardComponent } from './recruitment/recruitment-job-board/recruitment-job-board.component';
import { RecruitmentMasterListComponent } from './recruitment/recruitment-master-list/recruitment-master-list.component';
import { RecruitmentJobInfoComponent } from './recruitment/recruitment-job-info/recruitment-job-info.component';
import { RecruitmentFormsComponent } from './recruitment/recruitment-forms/recruitment-forms.component';
import { RecruitmentFormInfoComponent } from './recruitment/recruitment-form-info/recruitment-form-info.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'employees',
    component: EmployeeListComponent
  },
  {
    path: 'employees/:id',
    component: EmployeeProfileComponent
  },
  {
    path: 'profile',
    component: EmployeeProfileComponent
  },
  {
    path: 'leave-management',
    component: LeaveManagementOverviewComponent
  },
  {
    path: 'leave-requests',
    component: LeaveRequestsOverviewComponent
  },
  {
    path: 'payroll',
    component: PayrollOverviewComponent
  },
  {
    path: 'payroll-summary',
    component: PayrollSummaryComponent
  },
  {
    path: 'payroll/:id',
    component: PayrollDetailsComponent
  },
  {
    path: 'expense-management',
    component: ExpenseManagementOverviewComponent
  },
  {
    path: 'expense-requests',
    component: ExpenseRequestsOverviewComponent
  },
  {
    path: 'appraisals',
    component: AppraisalPortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path : 'overview',
        component: AppraisalOverviewComponent
      },
      {
        path : 'appraisal-kpis',
        component: AppraisalKpisComponent
      }
    ]
  },
  {
    path: 'appraisal-requests',
    component: AppraisalFormComponent
  },
  {
    path: 'appraisals/:id',
    component: AppraisalFormComponent
  },
  {
    path: 'recruitment',
    component: RecruitmentPortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path : 'overview',
        component: RecruitmentOverviewComponent
      },
      {
        path : 'jobs',
        component: RecruitmentJobBoardComponent
      },
      {
        path : 'jobs/new',
        component: RecruitmentJobInfoComponent
      },
      {
        path : 'jobs/:id',
        component: RecruitmentJobInfoComponent
      },
      {
        path : 'master-list',
        component: RecruitmentMasterListComponent
      },
      {
        path : 'forms',
        component: RecruitmentFormsComponent
      },
      {
        path : 'forms/new',
        component: RecruitmentFormInfoComponent
      },
      {
        path : 'forms/:id',
        component: RecruitmentFormInfoComponent
      }
    ]
  },
  {
    path: 'notice-board',
    component: NoticeBoardOverviewComponent
  },
  {
    path: 'calendar',
    component: CalendarEventsComponent
  },
  {
    path: 'access-logs',
    component: AttendancePortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'attendance',
        pathMatch: 'full'
      },
      {
        path : 'attendance',
        component: AttendanceLogComponent
      },
      {
        path : 'visitors',
        component: VisitorsLogComponent
      }
    ]
  },
  {
    path: 'reports',
    component: ReportsPortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
      },
      {
        path : 'employees',
        component: EmployeesReportComponent
      },
      {
        path : 'leave',
        component: LeaveReportsComponent
      },
      {
        path : 'expense',
        component: ExpenseReportsComponent
      },
      {
        path : 'payroll',
        component: PayrollReportsComponent
      },
      {
        path : 'attendance',
        component: AttendanceReportsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
