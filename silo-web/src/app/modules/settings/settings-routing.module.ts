import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralSettingsComponent } from './general/general-settings/general-settings.component';
import { HrSettingsComponent } from './hr/hr-settings/hr-settings.component';
import { SubscriptionHistoryComponent } from './general/subscription-history/subscription-history.component';
import { RolesPermissionManagementComponent } from './general/roles-permission-management/roles-permission-management.component';
import { SubscriptionOverviewComponent } from './general/subscription-overview/subscription-overview.component';
import { AuditTrailComponent } from './general/audit-trail/audit-trail.component';
import { BillingOverviewComponent } from './general/billing-overview/billing-overview.component';
import { AccountSettingsPortalComponent } from './general/account-settings-portal/account-settings-portal.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'general-settings',
    pathMatch: 'full'
    //component: EmployeesListComponent
  },
  {
    path: 'general-settings',
    component: AccountSettingsPortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'account-info',
        pathMatch: 'full'
      },
      {
        path : 'account-info',
        component: GeneralSettingsComponent
      },
      {
        path : 'roles-permissions',
        component: RolesPermissionManagementComponent
      },
      {
        path : 'subscription/history',
        component: SubscriptionHistoryComponent
      },
      {
        path : 'subscription/plans',
        component: SubscriptionOverviewComponent
      },
      {
        path : 'audit-trails',
        component: AuditTrailComponent
      },
      {
        path : 'billing',
        component: BillingOverviewComponent
      },
    ]
  },
  {
    path: 'hr-settings',
    component: HrSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
