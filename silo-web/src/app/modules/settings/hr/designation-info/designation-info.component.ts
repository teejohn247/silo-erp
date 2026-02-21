import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-designation-info',
  templateUrl: './designation-info.component.html',
  styleUrl: './designation-info.component.scss'
})
export class DesignationInfoComponent implements OnInit {
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
    this.leaveTypes = this.data.leaveTypes
    this.formFields = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.designationName : this.data.name,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'grade',
        controlType: 'number',
        controlLabel: 'Grade',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.grade : null,
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
        controlName: 'expenseCardDuration',
        controlType: 'date',
        controlLabel: 'Expense Card Expiry Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.expenseCard[0].cardExpiryDate : null,
        validators: null,
        order: 4
      },
      {
        controlName: 'expenseCardLimit',
        controlType: 'number',
        controlLabel: `Expense Card Limit (${this.utils.currency})`,
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.expenseCard[0].cardLimit : null,
        validators: null,
        order: 5
      }
    ]

    this.leaveTypes.forEach((leave: any, index: number) => {
      this.formFields.push({
        controlName: leave.leaveName,
        controlType: 'number',
        controlLabel: `${leave.leaveName} Leave (Days)`,
        controlWidth: '48%',
        initialValue: this.data.isExisting ? leave.noOfLeaveDays : 0,
        validators: null,
        order: index + 6
      });
    });
    console.log(this.formFields);
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const formValue = event.value;

    console.log(formValue)

    const payload = {
      designationName: formValue.name,
      description: formValue.description,
      grade: formValue.grade,
      leaveAssignment: this.leaveTypes.map(item => {
        let assignedVal = {
          leaveTypeId: item._id,
          noOfLeaveDays: formValue[item.leaveName].toString()
        }
        return assignedVal;
      }),
      expenseCard: [{
        cardCurrency: this.utils.currency,
        cardExpiryDate: formValue.expenseCardDuration,
        cardLimit: formValue.expenseCardLimit,
      }]
    }
    //console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.hrService.updateDesignation(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('This designation has been updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.createDesignation(payload).subscribe({
      next: res => {
        //console.log('Create Response', res)
        if(res.success) this.notify.showSuccess('Designation was created successfully');
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
