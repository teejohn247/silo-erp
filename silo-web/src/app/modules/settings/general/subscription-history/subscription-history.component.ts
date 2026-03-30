import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '@services/settings/settings.service';
import { AuthService } from '@services/utils/auth.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { Regions } from '@sharedWeb/constants/regions';

@Component({
  selector: 'app-subscription-history',
  templateUrl: './subscription-history.component.html',
  styleUrl: './subscription-history.component.scss'
})
export class SubscriptionHistoryComponent implements OnInit {
  loggedInUser:any;
  autoRenew: boolean = true;
  noOfUsers:number = 10;
  selectedPlan:any;
  currentPlan:any;
  Math = Math;
  form!: FormGroup;
  pageUrl:string = '';
  billingCycleMonthly:boolean = true;
  //subscriptionPlans:any = [];
  regions = Regions;

  selectedRegion!:string;
  regionOptions: any;
  keepOrder = () => 0;
  subscriptionPlans:any;
  subscriptionDetails:any;
  cancelingSubscription:boolean = false;

  // subscriptionPlans: any = [
  //   {
  //     id: "standard",
  //     name: "Standard",
  //     popular: false,
  //     usersLimit: 25,
  //     crmAgents: 5,
  //     regions: [
  //       { regionId: "nigeria", pricePerMonth: 50000, pricePerYear: 540000 },
  //       { regionId: "us", pricePerMonth: 36, pricePerYear: 389 },
  //       { regionId: "canada", pricePerMonth: 50, pricePerYear: 540 },
  //       { regionId: "uk", pricePerMonth: 27, pricePerYear: 292 },
  //       { regionId: "other", pricePerMonth: 36, pricePerYear: 389 }
  //     ],
  //     featuresOverview: "Everything a growing team needs to manage people and stay organised",
  //     featuresPreamble: "What's included",
  //     features: [
  //       "Employee management",
  //       "Document storage (10GB)",
  //       "Attendance Check In",
  //       "Leave requests & approvals",
  //       "Basic payroll processing",
  //       "Shared team calendar",
  //       "Meeting scheduler",
  //       "Basic attendance & leave reports",
  //       "Lead capture & management",
  //       "Contact profiles & history",
  //       "Basic lead scoring",
  //       "Deals pipeline (up to 2)",
  //       "Deal stages & status tracking",
  //       "Ticket creation & assignment",
  //       "Basic crm report"
  //     ]
  //   },
  //   {
  //     id: "premium",
  //     name: "Premium",
  //     popular: true,
  //     usersLimit: 100,
  //     crmAgents: 20,
  //     regions: [
  //       { regionId: "nigeria", pricePerMonth: 120000, pricePerYear: 1296000 },
  //       { regionId: "us", pricePerMonth: 87, pricePerYear: 940 },
  //       { regionId: "canada", pricePerMonth: 119, pricePerYear: 1285 },
  //       { regionId: "uk", pricePerMonth: 65, pricePerYear: 702 },
  //       { regionId: "other", pricePerMonth: 87, pricePerYear: 940 }
  //     ],
  //     featuresOverview: "Full HR Operations for scaling businesses that demand more control",
  //     featuresPreamble: "Includes everything in Standard +",
  //     features: [
  //       "Document storage (100GB)",
  //       "Payroll history",
  //       "Payslip generation",
  //       "Company announcements",
  //       "Analytics dashboard",
  //       "Expense submissions & approvals",
  //       "Meeting scheduler & agendas",
  //       "Google & Outlook integration",
  //       "Export to Excel & PDF",
  //       "Lead source attribution",
  //       "Lead import (CSV / Excel)",
  //       "Company / account management",
  //       "Unlimited pipelines",
  //       "Custom pipeline stages",
  //       "Ticket escalations",
  //       "Email integration (Gmail)",
  //       "Internal notes & comments",
  //       "SMS integration",
  //       "Agents management"
  //     ]
  //   },
  //   {
  //     id: "enterprise",
  //     name: "Enterprise",
  //     popular: false,
  //     usersLimit: "unlimited",
  //     crmAgents: "unlimited",
  //     regions: [
  //       { regionId: "nigeria", pricePerMonth: 280000, pricePerYear: 3024000 },
  //       { regionId: "us", pricePerMonth: 202, pricePerYear: 2182 },
  //       { regionId: "canada", pricePerMonth: 278, pricePerYear: 3002 },
  //       { regionId: "uk", pricePerMonth: 152, pricePerYear: 1642 },
  //       { regionId: "other", pricePerMonth: 202, pricePerYear: 2182 }
  //     ],
  //     featuresOverview: "A platform engineered for operational scale and deep customization",
  //     featuresPreamble: "Everything in premium +",
  //     features: [
  //       "Unlimited document storage",
  //       "Multi-branch support",
  //       "Role-based access control (RBAC)",
  //       "Appraisal Management",
  //       "Payroll approval workflows",
  //       "Recruitment pipeline analytics",
  //       "GPS Check In",
  //       "Scheduled automated reports",
  //       "AI lead scoring & prioritisation",
  //       "AI deal outcome prediction",
  //       "AI generated email drafts",
  //       "Smart follow-up reminders",
  //       "AI chatbot for support",
  //       "Deal forecasting & probability",
  //       "Multi-currency deal tracking",
  //       "Contract & proposal management",
  //       "Omnichannel inbox (email, chat)",
  //       "Social media integration",
  //       "Adavanced analytics dashboards",
  //       "Custom integrations support",
  //       "Custom onboarding & training",
  //       "Audit Trails"
  //     ]
  //   }
  // ];


  // subscriptionPlans = [
  //   {
  //     id: 1,
  //     name: "Free Trial",
  //     price: 0,
  //     storage: "5GB",
  //     users: 5,
  //     popular: false
  //   },
  //   {
  //     id: 2,
  //     name: "Starter",
  //     price: 1667,
  //     storage: "20GB",
  //     users: 10,
  //     popular: false
  //   },
  //   {
  //     id: 3,
  //     name: "Team",
  //     price: 3667,
  //     storage: "40GB",
  //     users: 25,
  //     popular: false
  //   },
  //   {
  //     id: 4,
  //     name: "Growth",
  //     price: 5667,
  //     storage: "75GB",
  //     users: 50,
  //     popular: true
  //   },
  //   {
  //     id: 5,
  //     name: "Business",
  //     price: 8000,
  //     storage: "120GB",
  //     users: 70,
  //     popular: false
  //   },
  //   {
  //     id: 6,
  //     name: "Professional",
  //     price: 9667,
  //     storage: "160GB",
  //     users: 100,
  //     popular: false
  //   },
  //   {
  //     id: 7,
  //     name: "Advanced",
  //     price: 11667,
  //     storage: "220GB",
  //     users: 150,
  //     popular: false
  //   },
  //   {
  //     id: 8,
  //     name: "Scale",
  //     price: 19000,
  //     storage: "350GB",
  //     users: 250,
  //     popular: false
  //   },
  //   {
  //     id: 9,
  //     name: "Enterprise",
  //     price: 26667,
  //     storage: "600GB",
  //     users: 499,
  //     popular: false
  //   },
  //   {
  //     id: 10,
  //     name: "Enterprise Plus",
  //     price: 33333,
  //     storage: "1TB",
  //     users: 1000,
  //     popular: false
  //   }
  // ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utils: UtilityService,
    private authService: AuthService,
    private settingsService: SettingsService,
    private notifyService: NotificationService
  ) {
    this.form = new FormGroup({
      noOfUsers: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.regionOptions = this.utils.createRegionOptions();
    this.selectedRegion = <string>Regions.find(region => region.label === this.loggedInUser.country)?._id ?? 'nigeria';
    
    this.getSubscriptionPlans();
    this.getUserSubscription();
    const params = this.route.snapshot.queryParamMap;

    if (params.keys.length > 0) {
      const reference = params.get('reference');
      if (reference) {
        //console.log('Payment reference:', reference);
        this.verifySubscription(reference)
      }
    }
  }

  getUserSubscription() {
    this.settingsService.getUserSubscription(this.loggedInUser.email).subscribe(res => {
      console.log('Response', res);
      this.subscriptionDetails = res.data;
      this.currentPlan = this.subscriptionDetails.currentPlan;
      this.autoRenew = this.subscriptionDetails.subscriptionStatus.recurringPayment;
    })
  }

  getSubscriptionPlans() {
    this.settingsService.getSubscriptionPlans().subscribe(res => {
      console.log('Plans', res.data);
      this.subscriptionPlans = res.data;
      // this.subscriptionPlans.map((x:any) => {
      //   x['price'] = x.amount
      // });
      // this.currentPlan = res.data.subscriptions[0]
      // //this.currentPlan = this.subscriptionPlans.find((x:any) => x.name === 'Growth');
      // //this.selectedPlan = this.currentPlan;

      // this.form.controls['noOfUsers'].setValue(this.currentPlan.users)

      // this.form.get('noOfUsers')?.valueChanges.subscribe(value => {
      //   if (value != null) {
      //     this.updateSelectedPlanFromUsers(value);
      //   }
      // });
    })
  }
  get planDifference() {
    return this.selectedPlan?.price - this.currentPlan?.price;
  }

  getSubscriptionCurrency(): string {
    const region = this.regions.find(x => x._id === this.selectedRegion);
    return region?.currencySymbol || '$';
  }

  getSubscriptionPrice(plan: any): number {
    const regionPricing = plan?.regions?.find((x: any) => x.regionId === this.selectedRegion);

    if (!regionPricing) return 0;

    return this.billingCycleMonthly ? regionPricing.pricePerMonth : regionPricing.pricePerYear;
  }

  updateSelectedPlanFromUsers(value: number) {
    const plan = this.subscriptionPlans.find((p:any) => value <= p.users);
    if (plan) {
      this.selectedPlan = plan;
    }
  }

  selectPlan(plan: any) {
    this.selectedPlan = plan;
    this.form.get('noOfUsers')?.setValue(plan.users, { emitEvent: false });
  }

  initSubscription(plan:any) {
    if(!this.subscriptionDetails?.activeSubscription?.isNonRenewing) {
      this.notifyService.showInfo('Please cancel current subscription before initiating a new plan.');
      return;
    }
    this.pageUrl = this.router.url;
    console.log('Plan', this.selectedPlan)
    const payload = {
      name: this.loggedInUser.companyName,
      email: this.loggedInUser.email,
      // "company": "Acme Ltd",
      plan_code: this.getPlanCode(plan.regions),
      recurring_payment: this.autoRenew,
      redirect_url: `${window.location.origin}${this.pageUrl}`,
      redirect_url_fail: `${window.location.origin}${this.pageUrl}`
    }

    this.settingsService.initSubscription(payload).subscribe({
      next: res => {
        window.location.href = res.data.authorization_url;
      },
      error: err => {}
    })
  }

  cancelSubscription() {
    this.cancelingSubscription = true;
    const payload = {
      code: this.subscriptionDetails.activeSubscription.subscriptionCode,
      token: this.subscriptionDetails.activeSubscription.emailToken
    }
    this.settingsService.cancelSubscription(payload).subscribe({
      next: res => {
        this.getUserSubscription();
        this.cancelingSubscription = false; 
        this.notifyService.showSuccess('Your subscription has been cancelled succesfully');
      },
      error: err => {
        this.cancelingSubscription = false; 
        this.notifyService.showError('Your subscription cacellation has failed. please try again.');
      }
    })
  }

  getPlanCode(planRegions:any[]) {
    console.log('Region', this.selectedRegion)
    const selectedRegion:any = planRegions.find(p => p.regionId === this.selectedRegion);

    if (!selectedRegion) return null;

    return this.billingCycleMonthly ? selectedRegion.monthly?.plan_code : selectedRegion.annually?.plan_code;
  }

  verifySubscription(refNo:string) {
    this.settingsService.verifySubscription(refNo).subscribe({
      next: res => {
        if(res.success) this.notifyService.showSuccess('Your payment has been verified and your subscription wass successful')
      },
      error: err => {}
    })
  }
}
