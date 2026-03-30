import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicField } from '@models/general/dynamic-field';
import { CrmService } from '@services/crm/crm.service';
import { AuthService } from '@services/utils/auth.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { Industries } from '@sharedWeb/constants/industries';

@Component({
  selector: 'app-deal-info',
  templateUrl: './deal-info.component.html',
  styleUrl: './deal-info.component.scss'
})
export class DealInfoComponent implements OnInit {
  @Input() data!: any; // <-- receives modal data
  @Output() submit = new EventEmitter<any>();

  loggedInUser: any;
  officialInfoFormFields!: DynamicField[];
  personalInfoFormFields!: DynamicField[];

  agentsList:any[] = [];
  leadsList:any[] = [];
  contactsList:any[] = [];
  industriesList = Industries;
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
  isLoading:boolean = false;

  form!: FormGroup;
  formFields!: DynamicField[];

  constructor(
    private utils: UtilityService,
    private crmService: CrmService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.agentsList = this.data.agents;
    this.leadsList = this.data.leads;
    this.contactsList = this.data.contacts;

    this.formFields = [
      {
        controlName: 'dealClientType',
        controlType: 'select',
        controlLabel: 'Deal Client Type',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data?.dealClientType : null,
        selectOptions: {
          lead: 'Lead',
          contact: 'Contact'
        },
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'leadId',
        controlType: 'select',
        controlLabel: 'Lead',
        controlWidth: '48%',
        hidden: true,
        selectOptions: this.utils.arrayToObject(this.leadsList, 'name'),
        initialValue: this.data.isExisting ? this.data.data?.name : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'contactId',
        controlType: 'select',
        controlLabel: 'Contact',
        controlWidth: '48%',
        hidden: true,
        selectOptions: this.utils.arrayToObject(this.contactsList, 'name'),
        initialValue: this.data.isExisting ? this.data.data?.contactName : null,
        validators: [Validators.required],
        order: 3
      },
      // {
      //   controlName: 'companyName',
      //   controlType: 'text',
      //   controlLabel: 'Company Name',
      //   controlWidth: '48%',
      //   initialValue: this.data.isExisting ? this.data.data?.companyName : null,
      //   validators: [],
      //   hidden: true,
      //   order: 3.5
      // },
      {
        controlName: 'industry',
        controlType: 'select',
        controlLabel: 'Industry',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.industry : null,
        readonly: true,
        selectOptions: this.industrySelectOptions,
        validators: [Validators.required],
        order: 4
      },
      // {
      //   controlName: 'jobTitle',
      //   controlType: 'text',
      //   controlLabel: 'Job Title',
      //   controlWidth: '48%',
      //   initialValue: this.data.isExisting ? this.data.data?.jobTitle : null,
      //   readonly: true,
      //   validators: [],
      //   order: 4
      // },
      {
        controlName: 'dealPriority',
        controlType: 'select',
        controlLabel: 'Deal Priority',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.dealPriority : null,
        selectOptions: {
          Hot: 'Hot',
          Warm: 'Warm',
          Cold: 'Cold'
        },
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'expectedRevenue',
        controlType: 'number',
        controlLabel: 'Expected Revenue',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.expectedRevenue : null,
        readonly: true,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'conversionProbability',
        controlType: 'number',
        controlLabel: 'Conversion Probability(%)',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.conversionProbability : null,
        validators: [Validators.required],
        order: 7
      },
      // {
      //   controlName: 'leadScore',
      //   controlType: 'number',
      //   controlLabel: 'Lead Score(%)',
      //   controlWidth: '48%',
      //   initialValue: this.data.isExisting ? this.data.data?.leadScore : null,
      //   validators: [Validators.required],
      //   order: 7
      // },
      {
        controlName: 'source',
        controlType: 'select',
        controlLabel: 'Deal Source',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.source : null,
        selectOptions: {
          Website: 'Website',
          OrganicSearch: 'Organic Search',
          PaidAds: 'Paid Ads',
          SocialMedia: 'Social Media',
          EmailCampaign: 'Email Campaign',
          ColdOutreach: 'Cold Outreach',
          CustomerReferral: 'Customer Referral',
          PartnerReferral: 'Partner Referral',
          Event: 'Event / Conference',
          Marketplace: 'Marketplace / External Platform',
          Other: 'Other'
        },
        validators: [Validators.required],
        order: 8
      },
      {
        controlName: 'dealOwnerId',
        controlType: 'select',
        controlLabel: 'Deal Owner',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.dealOwnerId : null,
        selectOptions: this.utils.arrayToObject(this.agentsList, 'fullName'),
        validators: [Validators.required],
        order: 9
      },
      {
        controlName: 'assignedAgentId',
        controlType: 'select',
        controlLabel: 'Assigned Agent',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.data?.assignedAgentId : null,
        selectOptions: this.utils.arrayToObject(this.agentsList, 'fullName'),
        validators: [Validators.required],
        order: 10
      },
      {
        controlName: 'description',
        controlType: 'text',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.data?.description : null,
        validators: [],
        order: 11
      },
    ]
  }

  onFormChanges(value: any) {
    this.toggleDealClientTypeFields(value.dealClientType);
  }

  toggleDealClientTypeFields(type: string) {
    const contact = this.formFields.find(f => f.controlName === 'contactId');
    const lead = this.formFields.find(f => f.controlName === 'leadId');
    //const companyName = this.formFields.find(f => f.controlName === 'companyName');

    if (!contact || !lead) return;

    if (type === 'lead') {
      contact.hidden = true;
      lead.hidden = false;
    } 
    else {
      contact.hidden = false;
      lead.hidden = true;
    }

    // 🔥 IMPORTANT: trigger change detection
    this.formFields = [...this.formFields];
  }

  handleFormAction(event: any) {
    this.isLoading = true;
    const payload = event.value;
    console.log("Default submit:", payload);
    this.data.isExisting ? 
    this.crmService.updateLead(payload, this.data.data._id).subscribe({
      next: res => {
        //console.log('Update Response', res)
        if(res.success) this.notify.showSuccess('Deal was updated successfully');
        this.isLoading = false;
        this.emitResponse();
      },
      error: err => {
        this.isLoading = false;
      }
    }) 
    :
    this.crmService.createLead(payload).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('Deal was created successfully');
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
