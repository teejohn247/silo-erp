import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { HrRoutingModule } from './hr-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '@sharedWeb/shared.module';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    HrRoutingModule,
    SharedModule,
    DatePipe
  ]
})
export class HrModule { }
