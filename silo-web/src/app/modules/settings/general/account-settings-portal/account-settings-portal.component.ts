import { Component } from '@angular/core';

@Component({
  selector: 'app-account-settings-portal',
  templateUrl: './account-settings-portal.component.html',
  styleUrl: './account-settings-portal.component.scss'
})
export class AccountSettingsPortalComponent {

  tabMenu = [
    {
      routeLink: 'account-info',
      label: 'Account Information',
    },
    {
      routeLink: 'roles-permissions',
      label: 'Modules, Roles & Permissions',
    },
    {
      routeLink: 'subscription/history',
      label: 'Subscriptions',
    },
    {
      routeLink: 'billing',
      label: 'Billing',
    },
    {
      routeLink: 'audit-trails',
      label: 'Audit Trail',
    },
    // {
    //   routeLink: 'expenses',
    //   label: 'Expenses',
    // },
    // {
    //   routeLink: 'appraisal',
    //   label: 'Appraisal',
    // }
  ]

}
