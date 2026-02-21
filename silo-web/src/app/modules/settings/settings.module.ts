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


@NgModule({
  declarations: [
    GeneralSettingsComponent,
    HrSettingsComponent,
    DepartmentInfoComponent,
    LeaveTypeInfoComponent,
    DesignationInfoComponent,
    HolidayInfoComponent,
    ExpenseTypeInfoComponent
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
