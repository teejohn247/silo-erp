import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { FilterConfig } from '@models/general/table-data';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-expense-requests-info',
  templateUrl: './expense-requests-info.component.html',
  styleUrl: './expense-requests-info.component.scss'
})
export class ExpenseRequestsInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  employees:any[] = [];
  isLoading:boolean = false;
  buttonLoading:string = '';

  formButtons:any;

  constructor(
    private utils: UtilityService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    console.log(this.data);

    this.formButtons = this.data.forApproval ? [
      {
        key: 'decline',
        label: 'Decline',
        class: 'cta cta-warning lg'
      },
      {
        key: 'approve',
        label: 'Approve',
        class: 'cta cta-primary lg'
      }
    ] : [];

    this.formFields = [
      {
        controlName: 'expenseTypeId',
        controlType: 'select',
        controlLabel: 'Expense Type',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.isExisting ? this.data.data.expenseTypeId : null,
        selectOptions: this.utils.arrayToObject(this.data.expenseTypes, 'expenseType'),
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'expenseDate',
        controlType: 'date',
        controlLabel: 'Expense Date',
        controlWidth: '48%',
        readonly: this.data.forApproval,
        initialValue: this.data.isExisting ? this.data.data?.expenseDate : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'amount',
        controlType: 'number',
        controlLabel: 'Amount',
        controlWidth: '48%',
        readonly: this.data.forApproval,
        initialValue: this.data.isExisting ? this.data.data.amount : null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.isExisting ? this.data.data.description : null,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'attachment',
        controlType: 'file',
        controlLabel: 'Attachment',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.attachment : null,
        validators: [Validators.required],
        order: 5
      },
    ]

    if(this.data.forApproval) {
      this.formFields.push({
        controlName: 'decisionReason',
        controlType: 'textarea',
        controlLabel: 'Reason for decision',
        controlWidth: '100%',
        readonly: false,
        initialValue: this.data?.data?.decisionReason ?? null,
        validators: null,
        order: 6
      })
    }
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);

    if(this.data.forApproval) {
      this.isLoading = true;
      this.buttonLoading = event.buttonKey;
      let data = {
        requestId: this.data.data._id,
        approved: event.buttonKey === 'approve' ? true : false,
        comments: payload.decisionReason
      }
      console.log(this.data);
      this.hrService.actionExpenseRequest(payload).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            if(payload.approved) this.notify.showSuccess('This leave request has been approved');
            else this.notify.showInfo('This leave request has been declined');
            this.isLoading = false;
          }
          //this.getPageData();
        },
        error: err => {
          this.isLoading = false;
        } 
      })
    }
    else {
      this.data.isExisting ? 
      this.hrService.updateLeaveRequest(payload, this.data.data._id).subscribe({
        next: res => {
          //console.log('Update Response', res)
          if(res.success) this.notify.showSuccess('Your leave application has been updated successfully');
          this.isLoading = false;
          this.emitResponse();
        },
        error: err => {
          this.isLoading = false;
        }
      }) 
      :
      this.hrService.createLeaveRequest(payload).subscribe({
        next: res => {
          console.log('Create Response', res)
          if(res.success) this.notify.showSuccess('Your leave application has been sent successfully');
          this.isLoading = false;
          this.emitResponse();
        },
        error: err => {
          this.isLoading = false;
        }
      })
    }    
  }

  emitResponse() {
    this.submit.emit({
      action: 'submit',
      dirty: true
    });
  }
}
