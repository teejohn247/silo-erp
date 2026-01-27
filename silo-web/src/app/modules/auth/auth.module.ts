// Angular modules
import { CommonModule }             from '@angular/common';
import { NgModule }                 from '@angular/core';

// Internal modules
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SiloOnboardingAdminComponent } from './silo-onboarding-admin/silo-onboarding-admin.component';
import { SiloOnboardingEmployeeComponent } from './silo-onboarding-employee/silo-onboarding-employee.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from '@helpers/auth.interceptor';

// Components
@NgModule({
  declarations: [
    SiloOnboardingAdminComponent,
    SiloOnboardingEmployeeComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ],
  exports: [
    SiloOnboardingAdminComponent,
    SiloOnboardingEmployeeComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: Interceptor, 
      multi: true
    },
  ]
})
export class AuthModule { }
