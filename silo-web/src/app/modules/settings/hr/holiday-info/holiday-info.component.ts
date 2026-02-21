import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-holiday-info',
  templateUrl: './holiday-info.component.html',
  styleUrl: './holiday-info.component.scss'
})
export class HolidayInfoComponent implements OnInit {
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
    this.formFields = [
      {
        controlName: 'holidayName',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.holidayName : this.data.name,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'date',
        controlType: 'date',
        controlLabel: 'Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.date : null,
        validators: [Validators.required],
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
      }
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    //console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.hrService.updatePublicHoliday(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('This public holiday has been updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.hrService.createPublicHoliday(payload).subscribe({
      next: res => {
        //console.log('Create Response', res)
        if(res.success) this.notify.showSuccess('This public holiday has been created successfully');
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
