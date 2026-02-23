import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { HrRoutingModule } from './hr-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '@sharedWeb/shared.module';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { EmployeeInfoComponent } from './employees/employee-info/employee-info.component';
import { EmployeeProfileComponent } from './employees/employee-profile/employee-profile.component';
import { LeaveAssignmentComponent } from './leave-management/leave-assignment/leave-assignment.component';


@NgModule({
  declarations: [
    DashboardComponent,
    EmployeeListComponent,
    EmployeeInfoComponent,
    EmployeeProfileComponent,
    LeaveAssignmentComponent,
  ],
  imports: [
    CommonModule,
    HrRoutingModule,
    SharedModule,
    DatePipe
  ]
})
export class HrModule { }
