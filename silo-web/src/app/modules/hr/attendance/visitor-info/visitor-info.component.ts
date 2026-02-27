import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-visitor-info',
  templateUrl: './visitor-info.component.html',
  styleUrl: './visitor-info.component.scss'
})
export class VisitorInfoComponent implements OnInit {
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
        controlName: 'guestName',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.guestName : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'email',
        controlType: 'text',
        controlLabel: 'Email Address',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.email : null,
        validators: [Validators.required, Validators.email],
        order: 2
      },
      {
        controlName: 'phoneNumber',
        controlType: 'text',
        controlLabel: 'Phone Number',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.phoneNumber : null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'purpose',
        controlType: 'select',
        controlLabel: 'Purpose of visit',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.purpose : null,
        selectOptions: {
          Business: 'Business',
          Personal: 'Personal',
        },
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'visitDate',
        controlType: 'date',
        controlLabel: 'Visit Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? new Date(this.data.data.visitDate) : null,
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'startTime',
        controlType: 'time',
        controlLabel: 'Start Time',
        controlWidth: '48%',
        initialValue: null,
        validators: [],
        order: 7
      },
      {
        controlName: 'endTime',
        controlType: 'time',
        controlLabel: 'End Time',
        controlWidth: '48%',
        initialValue: null,
        validators: [],
        order: 8
      },
      {
        controlName: 'employeeId',
        controlType: 'select',
        controlLabel: 'Employee',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.utils.arrayToObject(this.employees, 'fullName'),
        validators: [Validators.required],
        order: 4
      },
    ]
  }
  
  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.hrService.updateVisitor(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('Visitor was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.bookVisitor(payload).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('Visitor was created successfully');
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
