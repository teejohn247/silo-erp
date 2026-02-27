import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-department-info',
  templateUrl: './department-info.component.html',
  styleUrl: './department-info.component.scss'
})
export class DepartmentInfoComponent implements OnInit {

  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  employees:any[] = [];
  isLoading:boolean = false;

  constructor(
    private utils: UtilityService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.employees = this.data.employees;
    this.formFields = [
      {
        controlName: 'departmentName',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.departmentName : this.data.name,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'managerId',
        controlType: 'select',
        controlLabel: 'Manager',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data?.managerId : null,
        selectOptions: this.utils.arrayToObject(this.employees, 'fullName'),
        validators: null,
        order: 2
      },
      // {
      //   controlName: 'description',
      //   controlType: 'textarea',
      //   controlLabel: 'Description',
      //   controlWidth: '100%',
      //   initialValue: this.data.isExisting ? this.data.modalInfo.description : null,
      //   validators: null,
      //   order: 2
      // }
    ]
  }

  // formButtons = [
  //   {
  //     key: 'save',
  //     label: 'Save Ticket',
  //     class: 'cta cta-primary lg'
  //   },
  //   {
  //     key: 'cancel',
  //     label: 'Cancel',
  //     class: 'cta cta-outline lg'
  //   }
  // ];

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.hrService.updateDepartment(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('Department was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.createDepartment(payload).subscribe({
      next: res => {
        console.log('Create Response', res)
        if(res.success) this.notify.showSuccess('Department was created successfully');
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
