import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.scss'
})
export class DocumentUploadComponent implements OnInit {

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
    console.log(this.data);

    this.formFields = [
      {
        controlName: 'docType',
        controlType: 'select',
        controlLabel: 'Document Type',
        controlWidth: '100%',
        initialValue: null,
        selectOptions: {
          certificate: 'Birth Certificate',
          invoice: 'Invoice',
          quotation: 'Quotation'
        },
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'document',
        controlType: 'file',
        controlLabel: 'Document',
        controlWidth: '100%',
        initialValue: null,
        validators: [ Validators.required],
        order: 2
      }
    ]
  }


  handleFormAction(event: any) {
    this.isLoading = true;
    // const payload = event.value;
    // console.log("Default submit:", payload);
    // this.data.isExisting ? 
    // this.hrService.updateDepartment(payload, this.data.data._id).subscribe({
    //   next: res => {
    //     //console.log('Update Response', res)
    //     if(res.success) this.notify.showSuccess('Department was updated successfully');
    //     this.isLoading = false;
    //     this.emitResponse();
    //   },
    //   error: err => {
    //     this.isLoading = false;
    //   }
    // }) 
    // :
    // this.hrService.createDepartment(payload).subscribe({
    //   next: res => {
    //     console.log('Create Response', res)
    //     if(res.success) this.notify.showSuccess('Department was created successfully');
    //     this.isLoading = false;
    //     this.emitResponse();
    //   },
    //   error: err => {
    //     this.isLoading = false;
    //   }
    // })
    
  }

  emitResponse() {
    this.submit.emit({
      action: 'submit',
      dirty: true
    });
  }

}
