import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrl: './employee-info.component.scss'
})
export class EmployeeInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  loggedInUser: any;
  officialInfoFormFields!: DynamicField[];
  personalInfoFormFields!: DynamicField[];
  isLoading:boolean = false;
  officialTabActive:boolean = true;

  departmentList: any[] = [];
  designationList: any[] = [];
  countriesOptions:any;

  form!: FormGroup;

  constructor(
    private utils: UtilityService,
    private hrService: HrService,
    private authService: AuthService,
    private notify: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    //console.log(this.data);
    this.loggedInUser = this.authService.loggedInUser;
    this.departmentList = this.data.departmentList;
    this.designationList = this.data.designationList;
    this.countriesOptions = this.utils.createCountryOptions();

    this.form = this.fb.group({
      official: this.fb.group({}),
      personal: this.fb.group({}),
      profilePhoto: [null]
    });

    this.officialInfoFormFields = [
      {
        controlName: 'firstName',
        controlType: 'text',
        controlLabel: 'First Name',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.data.isExisting ? this.data.data?.firstName : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'lastName',
        controlType: 'text',
        controlLabel: 'Last Name',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.data.isExisting ? this.data.data?.lastName : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'email',
        controlType: 'text',
        controlLabel: 'Company Email Address',
        controlWidth: '48%',
        readonly: true,
        initialValue: this.data.isExisting ? this.data.data?.email : null,
        validators: [Validators.required, Validators.email],
        order: 3
      },
      {
        controlName: 'phoneNumber',
        controlType: 'text',
        controlLabel: 'Phone Number',
        controlWidth: '48%',
        //readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.data.isExisting ? this.data.data?.phoneNumber : null,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'dateOfBirth',
        controlType: 'date',
        controlLabel: 'Date of Birth',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.data.isExisting ? new Date(this.data.data?.dateOfBirth) : null,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'gender',
        controlType: 'select',
        controlLabel: 'Gender',
        controlWidth: '48%',
        //readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.data.isExisting ? this.data.data?.gender[0].toUpperCase() + this.data.data?.gender.substring(1) : null,
        selectOptions: {
          Male: 'Male',
          Female: 'Female'
        },
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'employmentStartDate',
        controlType: 'date',
        controlLabel: 'Employment Start Date',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.data.isExisting ? new Date(this.data.data?.employmentStartDate) : null,
        validators: [Validators.required],
        order: 9
      },
      {
        controlName: 'employmentType',
        controlType: 'select',
        controlLabel: 'Employment Type',
        controlWidth: '48%',
        //readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.data.isExisting ? this.data.data?.employmentType : null,
        selectOptions: {
          Contract: 'Contract',
          Permanent: 'Permanent'
        },
        validators: [Validators.required],
        order: 10
      },
      {
        controlName: 'designationId',
        controlType: 'select',
        controlLabel: 'Designation',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.data.isExisting ? this.data.data?.designationId : null,
        selectOptions: this.utils.arrayToObject(this.designationList, 'designationName'),
        validators: [Validators.required],
        order: 11
      },
      {
        controlName: 'departmentId',
        controlType: 'select',
        controlLabel: 'Department',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.data.isExisting ? this.data.data?.departmentId : null,
        selectOptions: this.utils.arrayToObject(this.departmentList, 'departmentName'),
        validators: [Validators.required],
        order: 7
      },
      {
        controlName: 'companyRole',
        controlType: 'text',
        controlLabel: 'Role',
        controlWidth: '48%',
        //readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.data.isExisting ? this.data.data?.companyRole : null,
        validators: [Validators.required],
        order: 8
      },
    ]

    this.personalInfoFormFields = [
      {
        controlName: 'personalEmail',
        controlType: 'text',
        controlLabel: 'Personal Email Address',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.personalEmail : null,
        validators: [Validators.email],
        order: 1
      },
      {
        controlName: 'personalPhone',
        controlType: 'text',
        controlLabel: 'Personal Phone Number',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.personalPhone : null,
        validators: [],
        order: 2
      },
      {
        controlName: 'address',
        controlType: 'text',
        controlLabel: 'House Address',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data?.address : null,
        validators: [],
        order: 3
      },
      {
        controlName: 'city',
        controlType: 'text',
        controlLabel: 'City',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.city : null,
        validators: [],
        order: 4
      },
      {
        controlName: 'country',
        controlType: 'select',
        controlLabel: 'Country',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.country : null,
        selectOptions: this.countriesOptions,
        validators: [],
        order: 5
      },
      {
        controlName: 'maritalStatus',
        controlType: 'select',
        controlLabel: 'Marital Status',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.maritalStatus : null,
        selectOptions: {
          Single: 'Single',
          Married: 'Married',
          Divorced: 'Divorced',
          Widow: 'Widow',
          Widower: 'Widower'
        },
        validators: [],
        order: 6
      },
      {
        controlName: 'nationality',
        controlType: 'select',
        controlLabel: 'Nationality',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.nationality : null,
        selectOptions: this.countriesOptions,
        validators: [],
        order: 7
      },
      {
        controlName: 'nextOfKinFullName',
        controlType: 'text',
        controlLabel: 'Next of Kin Name',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.nextOfKinFullName : null,
        validators: [],
        order: 8
      },
      {
        controlName: 'nextOfKinRelationship',
        controlType: 'text',
        controlLabel: 'Next of Kin Relationship',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.nextOfKinRelationship : null,
        validators: [],
        order: 9
      },
      {
        controlName: 'nextOfKinPhoneNumber',
        controlType: 'text',
        controlLabel: 'Next of Kin Phone No',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.nextOfKinPhoneNumber : null,
        validators: [],
        order: 10
      },
      {
        controlName: 'nextOfKinAddress',
        controlType: 'text',
        controlLabel: 'Next of Kin Address',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.nextOfKinAddress : null,
        validators: [],
        order: 11
      },
    ]
  }

  // In your component
  get officialFormGroup(): FormGroup {
    return this.form.get('official') as FormGroup;
  }
  get personalFormGroup(): FormGroup {
    return this.form.get('personal') as FormGroup;
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const official = this.officialFormGroup.value;
    const personal = this.personalFormGroup.value;
    const profilePhoto = this.form.value.profilePhoto; // Or get from formControl

    // console.log('Event', event.value);
    // console.log('Official', official);
    // console.log('Personal', personal);

    if(this.data.isExisting) {
      const formData = new FormData();
      if (profilePhoto) formData.append('profilePhoto', profilePhoto);

      Object.keys(official).forEach(k => formData.append(k, official[k] ?? ''));

      if (this.data.isExisting) {
        Object.keys(personal).forEach(k => formData.append(k, personal[k] ?? ''));
      }
      this.updateEmployee(formData)
    }

    else {
      this.createEmployee(official);
    }
  }

  updateEmployee(payload:any) {
    this.hrService.updateEmployeeByAdmin(payload, this.data.data._id).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('Employee was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
  }

  createEmployee(payload:any) {
    this.hrService.createEmployee(payload).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('This employee has been created successfully');
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
