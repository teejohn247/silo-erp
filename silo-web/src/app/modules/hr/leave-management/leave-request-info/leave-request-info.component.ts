import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-leave-request-info',
  templateUrl: './leave-request-info.component.html',
  styleUrl: './leave-request-info.component.scss'
})
export class LeaveRequestInfoComponent implements OnInit {

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
        controlName: 'leaveTypeId',
        controlType: 'select',
        controlLabel: 'Absence Type',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.isExisting ? this.data.data.leaveTypeId : null,
        selectOptions: this.utils.arrayToObject(this.data.leaveTypes, 'leaveName'),
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'leaveStartDate',
        controlType: 'date',
        controlLabel: 'Start Date',
        controlWidth: '48%',
        readonly: this.data.forApproval,
        initialValue: this.data.isExisting ? this.data.data?.leaveStartDate : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'leaveEndDate',
        controlType: 'date',
        controlLabel: 'End Date',
        controlWidth: '48%',
        readonly: this.data.forApproval,
        initialValue: this.data.isExisting ? this.data.data?.leaveEndDate : null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'requestMessage',
        controlType: 'textarea',
        controlLabel: 'Message',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.isExisting ? this.data.data.requestMessage : null,
        validators: [Validators.required],
        order: 4
      },
    ]

    if(this.data.forApproval) {
      this.formFields.push({
        controlName: 'decisionMessage',
        controlType: 'textarea',
        controlLabel: 'Reason for decision',
        controlWidth: '100%',
        readonly: false,
        initialValue: this.data?.data?.decisionMessage ?? null,
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
      let payload = {
        leaveId: this.data.data._id,
        approved: event.buttonKey === 'approve' ? true : false,
      }
      console.log(this.data);
      this.hrService.actionLeaveRequest(payload).subscribe({
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
