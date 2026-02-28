import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-payroll-calculator',
  templateUrl: './payroll-calculator.component.html',
  styleUrl: './payroll-calculator.component.scss'
})
export class PayrollCalculatorComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  formFields!: DynamicField[];
  employees:any[] = [];
  isLoading:boolean = false;

  fieldsCount: number = 0;
  totalEarnings: number = 0;
  deductions: number = 0;
  netEarnings: number = 0;

  constructor(
    private utils: UtilityService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.setUpFormFields();
  }

  setUpFormFields() {
    this.formFields = [];
    this.data.payrollCredits.map((item:any) => {
      this.fieldsCount = this.fieldsCount + 1;
      const ctrlName = this.utils.toCamelCase(item.name);
      this.totalEarnings = this.totalEarnings + this.data.data.dynamicFields[ctrlName];
      let fieldObject = {
        controlName: ctrlName,
        controlType: 'number' as any,
        controlLabel: item.name,
        controlWidth: '48%',
        readonly: this.data.data.status == 'Completed',
        initialValue: this.data.data.dynamicFields[ctrlName],
        validators: [Validators.required],
        order: this.fieldsCount,
        onBlur: (formValue:any, field:any) => {
          this.payCalculation('credit', field.controlName, formValue);
        }
      }
      this.formFields.push(fieldObject);
    });

    this.data.payrollDebits.map((item:any) => {
      this.fieldsCount = this.fieldsCount + 1;
      const ctrlName = this.utils.toCamelCase(item.name);
      this.deductions = this.deductions + this.data.data.dynamicFields[ctrlName];
      let fieldObject = {
        controlName: ctrlName,
        controlType: 'number' as any,
        controlLabel: item.name,
        controlWidth: '48%',
        readonly: this.data.data.status == 'Completed',
        initialValue: this.data.data.dynamicFields[ctrlName],
        validators: [Validators.required],
        order: this.fieldsCount,
        onBlur: (formValue:any, field:any) => {
          this.payCalculation('debit', field.controlName, formValue);
        }
      }
      this.formFields.push(fieldObject);
    });
    
    this.netEarnings = this.totalEarnings - this.deductions;
  }

  payCalculation(earningType: string, controlName: string, formValue:any) {
    // console.log( earningType + ':' + this.payrollCalculatorForm.value[controlName])
    if(earningType == 'credit') {
      let creditSum = 0;
      this.data.payrollCredits.map((val:any) => {
        console.log(val);
        const ctrlName = this.utils.toCamelCase(val.name);
        creditSum = creditSum + formValue[ctrlName];
      })
      this.totalEarnings = creditSum;
      this.netEarnings = this.totalEarnings - this.deductions;
    }
    else {
      let debitSum = 0;
      this.data.payrollDebits.map((val:any) => {
        const ctrlName = this.utils.toCamelCase(val.name);
        debitSum = debitSum + formValue[ctrlName];
      })
      this.deductions = debitSum;
      this.netEarnings = this.totalEarnings - this.deductions;
    }
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    let dynamicFields:any = {};
    const formValue = event.value;
    Object.keys(formValue).forEach((key: string) => {
      dynamicFields[key] = formValue[key];
    });
    const payload = {
      dynamicFields: dynamicFields,
      totalEarnings: this.totalEarnings,
      deductions: this.deductions,
      netEarnings: this.netEarnings,
    }
    this.hrService.updatePayrollEntry(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('This employee payroll entry has been updated successfully');
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
