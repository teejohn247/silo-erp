import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { CrmService } from '@services/crm/crm.service';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-status-info',
  templateUrl: './status-info.component.html',
  styleUrl: './status-info.component.scss'
})
export class StatusInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  employees:any[] = [];
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
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Status Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.name : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'order',
        controlType: 'number',
        controlLabel: 'Status Hierarchy',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.order : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'theme',
        controlType: 'select',
        controlLabel: 'Color theme',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.colorTheme : null,
        selectOptions: {
          blue: 'blue',
          green: 'green',
          orange: 'orange',
          purple: 'purple',
          red: 'red',
          yellow: 'yellow',
        },
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data.description : null,
        validators: null,
        order: 4
      }
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    const statusConfig:any = {
      lead: {
        create: this.crmService.createLeadStatus.bind(this.crmService),
        update: this.crmService.updateLeadStatus.bind(this.crmService),
        label: 'Lead status'
      },
      deal: {
        create: this.crmService.createDealStatus.bind(this.crmService),
        update: this.crmService.updateDealStatus.bind(this.crmService),
        label: 'Deal status'
      },
      ticket: {
        create: this.crmService.createTicketStatus.bind(this.crmService),
        update: this.crmService.updateTicketStatus.bind(this.crmService),
        label: 'Ticket status'
      },
    };

    const config = statusConfig[this.data.statusType];

    const request$ = this.data.isExisting ? config.update(payload, this.data.data._id) : config.create(payload);
    request$.subscribe({
      next: (res:any) => {
        if (res.success) {
          const action = this.data.isExisting ? 'updated' : 'created';
          this.notify.showSuccess(`${config.label} was ${action} successfully`);
        }
        this.isLoading = false;
        this.emitResponse(payload, !this.data.isExisting);
      },
      error: (err:any) => {
        this.isLoading = false;
      }
    });
  }

  emitResponse(formValue:any, newEntry:boolean) {
    this.submit.emit({
      action: 'submit',
      value: formValue,
      existing: !newEntry,
      dirty: true
    });
  }
}
