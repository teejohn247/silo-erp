import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { AdminService } from '@services/admin/admin.service';
import { HrService } from '@services/hr/hr.service';
import { SettingsService } from '@services/settings/settings.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-company-role-info',
  templateUrl: './company-role-info.component.html',
  styleUrl: './company-role-info.component.scss'
})
export class CompanyRoleInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  employees:any[] = [];
  isLoading:boolean = false;

  constructor(
    private utils: UtilityService,
    private adminService: AdminService,
    private notify: NotificationService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.formFields = [
      {
        controlName: 'roleName',
        controlType: 'text',
        controlLabel: 'Role Name',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.roleName : null,
        validators: null,
        order: 1
      },     
      {
        controlName: 'roleKey',
        controlType: 'text',
        controlLabel: 'Role Key',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.roleKey : null,
        validators: null,
        order: 2
      }, 
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.description : null,
        validators: null,
        order: 3
      },
      {
        controlName: 'moduleIds',
        controlType: 'mutipleSelect',
        controlLabel: 'Modules',
        controlWidth: '100%',
        initialValue: '',
        selectOptions: this.utils.arrayToObject(this.data.modules, 'moduleName'),
        validators: [],
        order: 4
      },
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.settingsService.updateRole(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('Role was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.settingsService.createRole(payload).subscribe({
      next: res => {
        console.log('Create Response', res)
        if(res.success) this.notify.showSuccess('Role was created successfully');
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
