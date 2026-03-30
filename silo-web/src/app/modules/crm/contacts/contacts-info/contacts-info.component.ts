import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { CrmService } from '@services/crm/crm.service';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-contacts-info',
  templateUrl: './contacts-info.component.html',
  styleUrl: './contacts-info.component.scss'
})
export class ContactsInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  loggedInUser: any;
  contactInfoFormFields!: DynamicField[];
  personalInfoFormFields!: DynamicField[];
  isLoading:boolean = false;
  firstTabActive:boolean = true;

  agentsList: any[] = [];
  industriesList: any[] = [];
  industrySelectOptions =  {
    Technology: 'Technology',
    Software: 'Software & SaaS',
    Finance: 'Finance & Banking',
    Insurance: 'Insurance',
    FinTech: 'FinTech',
    Healthcare: 'Healthcare',
    Pharmaceuticals: 'Pharmaceuticals',
    Biotechnology: 'Biotechnology',
    Education: 'Education',
    ECommerce: 'E-Commerce',
    Retail: 'Retail',
    Manufacturing: 'Manufacturing',
    Construction: 'Construction',
    RealEstate: 'Real Estate',
    Transportation: 'Transportation & Logistics',
    Automotive: 'Automotive',
    Energy: 'Energy & Utilities',
    OilAndGas: 'Oil & Gas',
    Telecommunications: 'Telecommunications',
    Media: 'Media & Entertainment',
    Hospitality: 'Hospitality & Tourism',
    Agriculture: 'Agriculture',
    Government: 'Government & Public Sector',
    NonProfit: 'Non-Profit / NGO',
    ProfessionalServices: 'Professional Services'
  }
  countriesOptions:any;

  form!: FormGroup;

  constructor(
    private utils: UtilityService,
    private crmService: CrmService,
    private authService: AuthService,
    private notify: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    //console.log(this.data);
    this.loggedInUser = this.authService.loggedInUser;
    this.agentsList = this.data.agents;
    //this.designationList = this.data.designationList;
    this.countriesOptions = this.utils.createCountryOptions();

    this.form = this.fb.group({
      personal: this.fb.group({}),
      contact: this.fb.group({}),
      profilePhoto: [null]
    });

    this.personalInfoFormFields = [
      {
        controlName: 'contactType',
        controlType: 'select',
        controlLabel: 'Contact Type',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data?.contactType : null,
        selectOptions: {
          Individual: 'Individual',
          Company: 'Company'
        },
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'firstName',
        controlType: 'text',
        controlLabel: 'First Name',
        controlWidth: '48%',
        hidden: true,
        initialValue: this.data.isExisting ? this.data.data?.firstName : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'lastName',
        controlType: 'text',
        controlLabel: 'Last Name',
        controlWidth: '48%',
        hidden: true,
        initialValue: this.data.isExisting ? this.data.data?.lastName : null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'companyName',
        controlType: 'text',
        controlLabel: 'Company Name',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.companyName : null,
        validators: [],
        hidden: true,
        order: 3
      },
      {
        controlName: 'onboardingDate',
        controlType: 'date',
        controlLabel: 'Onboarding Date',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.data.isExisting ? new Date(this.data.data?.onboardingDate) : new Date(),
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'organization',
        controlType: 'text',
        controlLabel: 'Organization',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data?.data.organization : null,
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'industry',
        controlType: 'select',
        controlLabel: 'Industry',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.industry : null,
        readonly: true,
        selectOptions: this.industrySelectOptions,
        validators: [Validators.required],
        order: 7
      },
      {
        controlName: 'jobRole',
        controlType: 'text',
        controlLabel: 'Job Role',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.jobRole : null,
        validators: [],
        order: 4
      },
      {
        controlName: 'contactOwner',
        controlType: 'select',
        controlLabel: 'Contact Owner',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.utils.arrayToObject(this.agentsList, 'fullName'),
        validators: [Validators.required],
        order: 10
      },
      {
        controlName: 'assignedAgent',
        controlType: 'select',
        controlLabel: 'Assigned Agent',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.utils.arrayToObject(this.agentsList, 'fullName'),
        validators: [Validators.required],
        order: 11
      },
    ]

    this.contactInfoFormFields = [
      {
        controlName: 'email',
        controlType: 'text',
        controlLabel: 'Email Address',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.email : null,
        validators: [Validators.email],
        order: 1
      },
      {
        controlName: 'phoneNumber',
        controlType: 'text',
        controlLabel: 'Phone Number',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.phoneNumber : null,
        validators: [],
        order: 2
      },
      {
        controlName: 'address',
        controlType: 'text',
        controlLabel: 'Address',
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
        controlName: 'state',
        controlType: 'text',
        controlLabel: 'State',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.state : null,
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
        controlName: 'zipCode',
        controlType: 'text',
        controlLabel: 'Postal Code',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.zipCode : null,
        validators: [],
        order: 7
      },
      {
        controlName: 'officeLocation',
        controlType: 'text',
        controlLabel: 'Office Location',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data?.officeLocation : null,
        validators: [],
        order: 9
      }
    ]

    setTimeout(() => {
      const initialType = this.personalFormGroup.get('contactType')?.value;
      if (initialType) {
        console.log(initialType);
        this.toggleContactTypeFields(initialType);
      }
    })
  }

  // In your component
  get personalFormGroup(): FormGroup {
    return this.form.get('personal') as FormGroup;
  }
  get contactFormGroup(): FormGroup {
    return this.form.get('contact') as FormGroup;
  }

  onPersonalFormChanges(value: any) {
    this.toggleContactTypeFields(value.contactType);
  }

  toggleContactTypeFields(type: string) {
    if (!type) return;

    // Find fields in personalInfoFormFields
    const firstNameField = this.personalInfoFormFields.find(f => f.controlName === 'firstName');
    const lastNameField = this.personalInfoFormFields.find(f => f.controlName === 'lastName');
    const companyNameField = this.personalInfoFormFields.find(f => f.controlName === 'companyName');

    if (!firstNameField || !lastNameField || !companyNameField) return;

    // Toggle hidden & validators
    if (type === 'Company') {
      firstNameField.hidden = true;
      lastNameField.hidden = true;
      firstNameField.validators = [];
      lastNameField.validators = [];

      companyNameField.hidden = false;
      companyNameField.validators = [Validators.required];
    } else {
      firstNameField.hidden = false;
      lastNameField.hidden = false;
      firstNameField.validators = [Validators.required];
      lastNameField.validators = [Validators.required];

      companyNameField.hidden = true;
      companyNameField.validators = [];
    }

    // Force UI to refresh
    this.personalInfoFormFields = [...this.personalInfoFormFields];
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const personal = this.personalFormGroup.value;
    const contact = this.contactFormGroup.value;
    const profilePhoto = this.form.value.profilePhoto; // Or get from formControl

    // console.log('Event', event.value);
    // console.log('Official', official);
    // console.log('Personal', personal);

    const formData = new FormData();
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);

    Object.keys(personal).forEach(k => formData.append(k, personal[k] ?? ''));
    Object.keys(contact).forEach(k => formData.append(k, contact[k] ?? ''));
    this.data.isExisting ? this.updateContact(formData) : this.createContact(formData);
  }

  updateContact(payload:any) {
    this.crmService.updateContact(payload, this.data.data._id).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('Contact was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
  }

  createContact(payload:any) {
    this.crmService.createContact(payload).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('This contact has been created successfully');
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
