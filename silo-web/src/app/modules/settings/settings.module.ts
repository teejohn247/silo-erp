import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralSettingsComponent } from './general/general-settings/general-settings.component';
import { HrSettingsComponent } from './hr/hr-settings/hr-settings.component';
import { SharedModule } from '@sharedWeb/shared.module';
import { DepartmentInfoComponent } from './hr/department-info/department-info.component';
import { LeaveTypeInfoComponent } from './hr/leave-type-info/leave-type-info.component';
import { DesignationInfoComponent } from './hr/designation-info/designation-info.component';
import { HolidayInfoComponent } from './hr/holiday-info/holiday-info.component';
import { ExpenseTypeInfoComponent } from './hr/expense-type-info/expense-type-info.component';
import { PayrollCreditInfoComponent } from './hr/payroll-credit-info/payroll-credit-info.component';
import { PayrollDebitInfoComponent } from './hr/payroll-debit-info/payroll-debit-info.component';
import { AccountSettingsPortalComponent } from './general/account-settings-portal/account-settings-portal.component';
import { AuditTrailComponent } from './general/audit-trail/audit-trail.component';
import { BillingOverviewComponent } from './general/billing-overview/billing-overview.component';
import { RolesPermissionManagementComponent } from './general/roles-permission-management/roles-permission-management.component';
import { SubscriptionHistoryComponent } from './general/subscription-history/subscription-history.component';
import { SubscriptionOverviewComponent } from './general/subscription-overview/subscription-overview.component';


@NgModule({
  declarations: [
    GeneralSettingsComponent,
    HrSettingsComponent,
    DepartmentInfoComponent,
    LeaveTypeInfoComponent,
    DesignationInfoComponent,
    HolidayInfoComponent,
    ExpenseTypeInfoComponent,
    PayrollCreditInfoComponent,
    PayrollDebitInfoComponent,
    AccountSettingsPortalComponent,
    AuditTrailComponent,
    BillingOverviewComponent,
    RolesPermissionManagementComponent,
    SubscriptionHistoryComponent,
    SubscriptionOverviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
