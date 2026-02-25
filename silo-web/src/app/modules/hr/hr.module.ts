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


@NgModule({
  declarations: [
    DashboardComponent,
    EmployeeListComponent,
    EmployeeInfoComponent,
    EmployeeProfileComponent,
    LeaveAssignmentComponent,
    PaymentInfoComponent,
    WorkLocationComponent
  ],
  imports: [
    CommonModule,
    HrRoutingModule,
    GoogleMapsModule,
    SharedModule,
    DatePipe
  ]
})
export class HrModule { }
