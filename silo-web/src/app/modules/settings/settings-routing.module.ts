import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralSettingsComponent } from './general/general-settings/general-settings.component';
import { HrSettingsComponent } from './hr/hr-settings/hr-settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'general-settings',
    pathMatch: 'full'
    //component: EmployeesListComponent
  },
  {
    path: 'general-settings',
    component: GeneralSettingsComponent
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
