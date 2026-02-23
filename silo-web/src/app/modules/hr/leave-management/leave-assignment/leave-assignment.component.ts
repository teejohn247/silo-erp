import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-leave-assignment',
  templateUrl: './leave-assignment.component.html',
  styleUrl: './leave-assignment.component.scss'
})
export class LeaveAssignmentComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  leaveTypes:any[] = [];
  isLoading:boolean = false;

  constructor(
    private utils: UtilityService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.leaveTypes = this.data.data
    this.formFields = []

    this.leaveTypes.forEach((leave: any, index: number) => {
      this.formFields.push({
        controlName: leave.leaveName,
        controlType: 'number',
        controlLabel: `${leave.leaveName} Leave (Days)`,
        controlWidth: '48%',
        initialValue: this.data.isExisting ? leave.noOfLeaveDays : 0,
        validators: null,
        order: index + 1
      });
    });
    console.log(this.formFields);
  }

  handleFormAction(event: any) {
    // this.isLoading = true;
    // const formValue = event.value;
    // const payload = {
    //   designationName: formValue.name,
    //   description: formValue.description,
    //   grade: formValue.grade,
    //   leaveAssignment: this.leaveTypes.map(item => {
    //     let assignedVal = {
    //       leaveTypeId: item._id,
    //       noOfLeaveDays: formValue[item.leaveName].toString()
    //     }
    //     return assignedVal;
    //   }),
    //   expenseCard: [{
    //     cardCurrency: this.utils.currency,
    //     cardExpiryDate: formValue.expenseCardDuration,
    //     cardLimit: formValue.expenseCardLimit,
    //   }]
    // }
    // this.data.isExisting ? 
    // this.hrService.updateDesignation(payload, this.data.data._id).subscribe({
    //   next: res => {
    //     //console.log('Update Response', res)
    //     if(res.success) this.notify.showSuccess('This designation has been updated successfully');
    //     this.isLoading = false;
    //     this.emitResponse();
    //   },
    //   error: err => {
    //     this.isLoading = false;
    //   }
    // }) 
    // :
    // this.hrService.createDesignation(payload).subscribe({
    //   next: res => {
    //     //console.log('Create Response', res)
    //     if(res.success) this.notify.showSuccess('Designation was created successfully');
    //     this.isLoading = false;
    //     this.emitResponse();
    //   },
    //   error: err => {
    //     this.isLoading = false;
    //   }
    // })
    
  }

  emitResponse() {
    this.submit.emit({
      action: 'submit',
      dirty: true
    });
  }

}
