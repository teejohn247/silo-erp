import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-payroll-period-info',
  templateUrl: './payroll-period-info.component.html',
  styleUrl: './payroll-period-info.component.scss'
})
export class PayrollPeriodInfoComponent implements OnInit {

  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  isLoading:boolean = false;

  constructor(
    private utils: UtilityService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.formFields = [
      {
        controlName: 'payrollPeriodName',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.payrollPeriodName : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'description',
        controlType: 'text',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.description : null,
        validators: null,
        order: 4
      },
      {
        controlName: 'startDate',
        controlType: 'date',
        controlLabel: 'Start Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? new Date(this.data.data.startDate) : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'endDate',
        controlType: 'date',
        controlLabel: 'End Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? new Date(this.data.data.endDate) : null,
        validators: [Validators.required],
        order: 3
      }
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.hrService.updatePayrollPeriod(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('Payroll period was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.createPayrollPeriod(payload).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('Payroll period was created successfully');
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
