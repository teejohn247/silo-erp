import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-leave-type-info',
  templateUrl: './leave-type-info.component.html',
  styleUrl: './leave-type-info.component.scss'
})
export class LeaveTypeInfoComponent implements OnInit {
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
    this.formFields = [
      {
        controlName: 'leaveName',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.leaveName : this.data.name,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.description : null,
        validators: null,
        order: 2
      }
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    //console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.hrService.updateLeaveType(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('This leave type has been updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.createLeaveType(payload).subscribe({
      next: res => {
        //console.log('Create Response', res)
        if(res.success) this.notify.showSuccess('Leave type was created successfully');
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
