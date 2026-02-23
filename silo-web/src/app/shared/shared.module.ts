// Angular modules
import { CommonModule }               from '@angular/common';
import { NgModule }                   from '@angular/core';
import { FormsModule }                from '@angular/forms';
import { ReactiveFormsModule }        from '@angular/forms';
import { RouterModule }               from '@angular/router';

// External modules
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips'; 
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Components
import { ToastComponent }             from './components/blocks/toast/toast.component';

// Forms
import { FormConfirmComponent }      from './components/forms/form-confirm/form-confirm.component';

// Modals
import { ModalWrapperComponent }     from './components/modals/modal-wrapper/modal-wrapper.component';

// Layouts
import { LayoutHeaderComponent }     from './components/layouts/layout-header/layout-header.component';
import { PageLayoutComponent }       from './components/layouts/page-layout/page-layout.component';

// Pipes

// Directives
import { ModalWrapperDirective }     from './directives/modal-wrapper.directive';
import { LayoutFooterComponent } from './components/layouts/layout-footer/layout-footer.component';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { HasRoleDirective } from './directives/has-role.directive';
import { LottieAnimationComponent } from './animations/lottie-animation.component';
import { TruncateWordsPipe } from './pipes/truncate-words.pipe';
import { IconComponent } from './components/blocks/icon/icon.component';
import { LocaleStringPipe } from './pipes/locale-string.pipe';
import { AreaChartComponent } from './components/charts/area-chart/area-chart.component';
import { TimeDurationPipe } from './pipes/time-duration.pipe';
import { PieChartComponent } from './components/charts/pie-chart/pie-chart.component';
import { ProgressBarComponent } from './components/charts/progress-bar/progress-bar.component';
import { DynamicFormComponent } from './components/forms/dynamic-form/dynamic-form.component';
import { NoDataComponent } from './components/blocks/no-data/no-data.component';
import { ConfirmationModalComponent } from './components/modals/confirmation-modal/confirmation-modal.component';
import { FileUploadComponent } from './components/forms/file-upload/file-upload.component';
import { PaginationComponent } from './components/blocks/pagination/pagination.component';
import { TableFilterComponent } from './components/blocks/table-filter/table-filter.component';
import { DynamicTableComponent } from './components/blocks/dynamic-table/dynamic-table.component';
import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { DocumentUploadComponent } from './components/blocks/document-upload/document-upload.component';

const SHARED_COMP = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatMenuModule,
  MatNativeDateModule,
  MatButtonModule,
  MatDialogModule,
  MatCheckboxModule,
  MatChipsModule,
  NgxMaterialTimepickerModule,
  IconComponent
];


@NgModule({
  imports: [
    // Angular modules
    ...SHARED_COMP,
    LottieComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    NgxChartsModule,
    // External modules
    TranslateModule,
    AngularSvgIconModule,
    NgbModule,
    CdkOverlayOrigin
],
  declarations: [
    // Components
    ToastComponent,
    LottieAnimationComponent,
    AreaChartComponent,
    PieChartComponent,
    ProgressBarComponent,
    ConfirmationModalComponent,
    PaginationComponent,
    TableFilterComponent,
    DynamicTableComponent,
    DocumentUploadComponent,
    NoDataComponent,

    // Forms
    FormConfirmComponent,
    DynamicFormComponent,
    FileUploadComponent,

    // Modals
    ModalWrapperComponent,

    // Layouts
    LayoutHeaderComponent,
    PageLayoutComponent,

    // Pipes
    TruncateWordsPipe,
    LocaleStringPipe,
    TimeDurationPipe,

    // Directives
    ModalWrapperDirective,
    HasPermissionDirective,
    HasRoleDirective,

    LayoutFooterComponent
  ],
  exports: [
    // Angular modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ...SHARED_COMP,
    LottieAnimationComponent,
    ConfirmationModalComponent,
    DocumentUploadComponent,
    FileUploadComponent,
    NoDataComponent,

    // External modules
    TranslateModule,
    AngularSvgIconModule,
    NgbModule,

    // Components
    ToastComponent,
    ProgressBarComponent,
    AreaChartComponent,
    PieChartComponent,
    ProgressBarComponent,
    PaginationComponent,
    TableFilterComponent,
    DynamicTableComponent,
    IconComponent,

    // Forms
    FormConfirmComponent,
    DynamicFormComponent,

    // Modals
    ModalWrapperComponent,

    // Layouts
    LayoutHeaderComponent,
    PageLayoutComponent,

    // Pipes
    TruncateWordsPipe,
    LocaleStringPipe,
    TimeDurationPipe,

    // Directives
    ModalWrapperDirective,
    HasPermissionDirective,
    HasRoleDirective
  ],
  providers:[
    provideLottieOptions({
      player: () => player
    }),
  ]
})
export class SharedModule {}
