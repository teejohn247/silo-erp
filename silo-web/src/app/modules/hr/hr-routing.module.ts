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
    path: 'expense-management',
    component: ExpenseManagementOverviewComponent
  },
  {
    path: 'expense-requests',
    component: ExpenseRequestsOverviewComponent
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
