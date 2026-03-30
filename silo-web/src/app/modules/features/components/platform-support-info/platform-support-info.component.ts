import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { FilterConfig } from '@models/general/table-data';
import { HrService } from '@services/hr/hr.service';
import { SettingsService } from '@services/settings/settings.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-platform-support-info',
  templateUrl: './platform-support-info.component.html',
  styleUrl: './platform-support-info.component.scss'
})
export class PlatformSupportInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  isLoading:boolean = false;

  categoryOptions = {
    Login: "Login",
    Access: "Access",
    "Absence Management": "Absence Mnaagement",
    "Expense Management": "Expense Mnaagement",
    Payroll: "Payroll",
    Appraisal: "Appraisal",
    LMS: "LMS",
    Calendar: "Calendar",
    General: "General",
    Settings: "Settings",
    Other: "Other"
  }

  constructor(
    private utils: UtilityService,
    private hrService: HrService,
    private notify: NotificationService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {

    this.formFields = [
      {
        controlName: 'issueCategory',
        controlType: 'select',
        controlLabel: 'Category',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.issueCategory : null,
        selectOptions: this.categoryOptions,
        validators: null,
        order: 1
      },
      {
        controlName: 'description',
        controlType: 'quillEditor',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.branchName : this.data.name,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'screenshots',
        controlType: 'file',
        controlLabel: 'Attachment',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.screenshots : null,
        validators: [],
        order: 5
      },
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const formValue = event.value;
    console.log("Default submit:", formValue);
    const formData = new FormData();
    Object.keys(formValue).forEach(k => formData.append(k, formValue[k] ?? ''));

    // this.data.isExisting ? 
    // this.hrService.updateExpenseRequest(formData, this.data.data._id).subscribe({
    //   next: res => {
    //     //console.log('Update Response', res)
    //     if(res.success) this.notify.showSuccess('Your leave application has been updated successfully');
    //     this.isLoading = false;
    //     this.emitResponse();
    //   },
    //   error: err => {
    //     this.isLoading = false;
    //   }
    // }) 
    // :
    this.settingsService.sendComplaint(formData).subscribe({
      next: (res:any) => {
        console.log('Create Response', res)
        if(res.success) this.notify.showSuccess('Your message was sent successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    })
     
  }

  emitResponse() {
    this.submit.emit({
      action: 'submit',
      dirty: true
    });
  }
}
