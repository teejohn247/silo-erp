import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';


@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrl: './payment-info.component.scss'
})
export class PaymentInfoComponent implements OnInit {
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
        controlName: 'accountName',
        controlType: 'text',
        controlLabel: 'Account Name',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.data.data.accountName ?? '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'accountNumber',
        controlType: 'text',
        controlLabel: 'Account Number',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.data.data.accountNumber ?? '',
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'bankName',
        controlType: 'text',
        controlLabel: 'Bank Name',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.data.data.bankName ?? '',
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'sortCode',
        controlType: 'text',
        controlLabel: 'Sort Code',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.data.data.sortCode ?? '',
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'bankAddress',
        controlType: 'text',
        controlLabel: 'Bank Address',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.data.data.bankAddress ?? '',
        validators: [],
        order: 5
      },
      {
        controlName: 'taxIdentificationNumber',
        controlType: 'text',
        controlLabel: 'Tax Identification Number',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.data.data.taxIdentificationNumber ?? '',
        validators: [Validators.required],
        order: 6
      },
    ]
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    this.hrService.updatePaymentInfo(payload).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('Your payment information has been updated successfully');
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
