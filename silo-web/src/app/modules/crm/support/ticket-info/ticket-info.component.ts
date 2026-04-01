import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { FilterConfig } from '@models/general/table-data';
import { CrmService } from '@services/crm/crm.service';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-ticket-info',
  templateUrl: './ticket-info.component.html',
  styleUrl: './ticket-info.component.scss'
})
export class TicketInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  contactsList:any[] = [];
  isLoading:boolean = false;

  constructor(
    private utils: UtilityService,
    private crmService: CrmService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    console.log(this.data);

    this.formFields = [
      {
        controlName: 'title',
        controlType: 'text',
        controlLabel: 'Ticket Title',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.title : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'contactId',
        controlType: 'select',
        controlLabel: 'Contact',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.contactId : null,
        selectOptions: this.utils.arrayToObject(this.data.contacts, 'name'),
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'priority',
        controlType: 'select',
        controlLabel: 'Priority',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.priority : null,
        selectOptions: {
          High: 'High',
          Medium: 'Medium',
          Low: 'Low'
        },
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'stage',
        controlType: 'select',
        controlLabel: 'Stage',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.stage : null,
        selectOptions: this.utils.arrayToObject(this.data.ticketStatuses, 'name'),
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'closureTime',
        controlType: 'select',
        controlLabel: 'Closure Time',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.closureTime : null,
        selectOptions: {
          '6hrs': '6 Hrs',
          '12hrs': '12 Hrs',
          '24hrs': '24 Hrs',
          '48hrs': '48 Hrs'
        },
        validators: [],
        order: 5
      },
      {
        controlName: 'source',
        controlType: 'select',
        controlLabel: 'Source',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data.source : null,
        selectOptions: {
          Facebook: 'Facebook',
          Instagram: 'Instagram',
          LinkedIn: 'LinkedIn',
          Email: 'Email',
          Sales: 'Sales Team'
        },
        validators: [],
        order: 6
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.isExisting ? this.data.data.description : null,
        validators: [Validators.required],
        order: 7
      },
      {
        controlName: 'attachment',
        controlType: 'file',
        controlLabel: 'Attachment',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.attachment : null,
        validators: [],
        order: 8
      },
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.crmService.updateTicket(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('Support ticket was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.crmService.createTicket(payload).subscribe({
      next: res => {
        console.log('Create Response', res)
        if(res.success) this.notify.showSuccess('Support ticket was created successfully');
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
