import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-employee-assignment',
  templateUrl: './employee-assignment.component.html',
  styleUrl: './employee-assignment.component.scss'
})
export class EmployeeAssignmentComponent implements OnInit {

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
    this.formFields = [
      {
        controlName: 'approvalType',
        controlType: this.data.assignmentType == 'manager' ? 'text' : 'select',
        controlLabel: this.data.assignmentType == 'manager' ? 'Assignment Type' : 'Approval Assignment Type',
        controlWidth: '100%',
        initialValue: this.data.assignmentType == 'manager' ? 'Manager' : null,
        selectOptions: this.data.assignmentType != 'manager' ? 
        {
          Appraisal: 'Appraisal',
          Leave: 'Leave',
          Expense: 'Expense'
        } : 
        {
          Manager: 'Manager'
        },
        readonly: this.data.assignmentType == 'manager' ? true : false,
        validators: null,
        order: 1
      },
      {
        controlName: 'manager',
        controlType: 'select',
        controlLabel: this.data.assignmentType == 'manager' ? 'Select Manager' : 'Select Approver',
        controlWidth: '100%',
        initialValue: '',
        selectOptions: this.utils.arrayToObject(this.data.data, 'fullName'),
        validators: null,
        order: 2
      },
    ]
    console.log(this.formFields);
  }

  handleFormAction(event: any) {
    const formVal = event.value;
    this.isLoading = true;
    const employees = this.data.selectedEmployees.map((item:any) => item._id)
    if(this.data.assignmentType == 'manager') {
      const paylaod = {
        employees,
        managerId: formVal.manager
      }
      this.hrService.assignManager(paylaod).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notify.showSuccess('This manager assignment was successfully updated');
          }
          //this.getPageData();
        },
        error: err => {
          console.log(err)
        } 
      })
    }
    else {
      const paylaod = {
        approvalType: formVal.approvalType.toLowerCase(),
        employees,
        managerId: formVal.manager
      }
      this.hrService.assignApprover(paylaod).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notify.showSuccess('This approver assignment was successfully updated');
          }
          //this.getPageData();
        },
        error: err => {
          console.log(err)
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
