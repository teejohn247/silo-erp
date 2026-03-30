import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { authPageStagger } from '@animations/auth-page-animations';
import { HrService } from '@sharedWeb/services/hr/hr.service';
import { AuthService } from '@sharedWeb/services/utils/auth.service';
import { NotificationService } from '@sharedWeb/services/utils/notification.service';
import { UtilityService } from '@sharedWeb/services/utils/utility.service';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-silo-onboarding-admin',
  standalone: false,
  templateUrl: './silo-onboarding-admin.component.html',
  styleUrl: './silo-onboarding-admin.component.scss',
  animations: [authPageStagger]
})
export class SiloOnboardingAdminComponent implements OnInit {

  public form !: FormGroup<any>;
  isLoading:boolean = false;
  currentStep:number = 1;
  keepOrder = () => 0;
  loggedInUser:any;

  lottiePath:string = 'assets/img/project/illustrations/success.json'

  lottieOptions: AnimationOptions = {
    loop: true,
    autoplay: true
  };

  industryOptions =  {
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

  companySizeOptions = {
    1: '1 - 10 Employees',
    2: '11 - 50 Employees',
    3: '51 - 100 Employees',
    4: '101 - 200 Employees',
    5: '200+ Employees'
  }

  siloModules = [
    {
      moduleKey: 'hr',
      moduleName: 'HR Module',
      icon: 'bi-people-fill',
      moduleFeatures: [
        'Employee Management',
        'Leave Management',
        'Expense Management',
        'Payroll',
        'Appraisal Reviews',
        'Recruitment',
        'Attendance',
        'Meetings & Calendar',
        'Visitor Management',
        'Reports & Analytics'
      ]
    },
    {
      moduleKey: 'crm',
      moduleName: 'CRM Module',
      icon: 'bi-headset',
      moduleFeatures: [
        'Dashboard Analytics',
        'Leads Management',
        'Contacts Management',
        'Sales Pipeline',
        'Deals Tracking',
        'Purchase Orders Management',
        'Invoice Management',
        'Agents Management',
        'Reports & Analytics'
      ]
    }
  ]

  constructor(
    private authService: AuthService,
    private hrService: HrService,
    private notifyService: NotificationService,
    private utilityService: UtilityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.initFormGroup();
    this.utilityService.hasActiveModule() ? this.currentStep = 4 : this.currentStep = 1;
    this.addEmployee();
  }

  private initFormGroup(): void {
    this.form = new FormGroup(
      {
        companyName: new FormControl(this.loggedInUser?.companyName ?? '', Validators.required),
        industry: new FormControl('', Validators.required),
        companySize: new FormControl('', Validators.required),
        modules: new FormControl([], Validators.required),
        employees: new FormArray([]) 
      }
    );
  }

  get formCtrls() {
    return this.form.controls;
  }

  get modulesCtrl(): FormControl<string[]> {
    return this.formCtrls['modules'] as FormControl<string[]>;
  }

  get employeesCtrl(): FormArray<FormControl<string | null>> {
    return this.formCtrls['employees'] as FormArray<FormControl<string | null>>;
  }

  goToStep(stepNo:number) {
    this.currentStep = stepNo;
  }

  goToNextStep() {
    if(this.currentStep == 4 || this.currentStep == 0) {
      //Go to dashboard
      this.goToDashboard()
    }
    this.checkStep(this.currentStep);
  }

  goToPrevStep() {
    this.currentStep = this.currentStep - 1;
  }

  checkStep(stepNo: number): boolean {
    let isValid = false;
    switch (stepNo) {
      case 1:
        this.formCtrls['industry'].markAsTouched();
        this.formCtrls['companySize'].markAsTouched();
        isValid = this.formCtrls['industry'].valid && this.formCtrls['companySize'].valid;
        if(isValid) this.saveCompanyInfo();
        break;
      case 2:
        isValid = this.formCtrls['modules'].valid
        if(isValid) this.saveCompanyModules();
        break;
      case 3:
        isValid = true;
        this.form.value.employees.length > 0 ? this.sendEmployeeInvites() : this.goToStep(this.currentStep + 1); 
        break;
      default:
        break;
    }
    return isValid
  } 

  goToDashboard() {
    this.router.navigate(['/app']);
  }

  isModuleSelected(moduleName: string): boolean {
    return this.modulesCtrl.value.includes(moduleName);
  }

  toggleModule(moduleName: string): void {
    const modules = this.modulesCtrl.value;

    const updatedModules = modules.includes(moduleName)
      ? modules.filter(m => m !== moduleName)
      : [...modules, moduleName];

    this.modulesCtrl.setValue(updatedModules);
    this.modulesCtrl.markAsTouched();
  }

  addEmployee(): void {
    this.employeesCtrl.push(
      new FormControl('', Validators.email)
    );
  }

  removeEmployee(index: number): void {
    this.employeesCtrl.removeAt(index);
  }

  saveCompanyInfo() {
    this.isLoading = true;
    const payload = {
      companyName: this.form.value.companyName,
      industry: this.form.value.industry,
      companySize: this.form.value.companySize,
      //"companyAddress": "123 Main St, City, Country"
    }
    this.hrService.saveCompanyDetails(payload).subscribe({
      next: (res:any) => {
        //console.log(res);
        if (res.status == 200) {
          this.isLoading = false;
          this.notifyService.showSuccess(res.message);
          this.currentStep = this.currentStep + 1
        }
      },
      error: (err: any) => {
        this.isLoading = false; 
      }
    })
  }

  saveCompanyModules() {
    this.isLoading = true;
    const payload = {
      modules: {
        hr: {
          active: this.isModuleSelected('HR Module')
        },
        crm: {
          active: this.isModuleSelected('CRM Module')
        }
      }
    }
    this.hrService.saveCompanyModules(payload).subscribe({
      next: (res:any) => {
        //console.log(res);
        if (res.status == 200) {
          this.isLoading = false;
          this.notifyService.showSuccess(res.message);
          this.currentStep = this.currentStep + 1
        }
      },
      error: (err: any) => {
        this.isLoading = false; 
      }
    })
  }

  sendEmployeeInvites() {
    this.isLoading = true;
    if(!this.form.value.employees.length) {
      this.notifyService.showError('Please add at least one employee');
      this.isLoading = false;
      return;
    }
    const payload = {
      employees: this.form.value.employees
    }
    this.hrService.sendEmployeeInvites(payload).subscribe({
      next: (res:any) => {
        //console.log(res);
        if (res.status == 200) {
          this.isLoading = false;
          this.notifyService.showSuccess(res.message);
          this.currentStep = this.currentStep + 1
        }
      },
      error: (err: any) => {
        this.isLoading = false; 
      }
    })
  }

}
