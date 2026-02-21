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
  selector: 'app-silo-onboarding-employee',
  standalone: false,
  templateUrl: './silo-onboarding-employee.component.html',
  styleUrl: './silo-onboarding-employee.component.scss',
  animations: [authPageStagger]
})
export class SiloOnboardingEmployeeComponent implements OnInit {

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

  genderOptions = {
    Male: 'Male',
    Female: 'Female',
    Other: 'Other'
  }

  branchOptions = {
    Lagos: 'Lagos',
    Abuja: 'Abuja'
  }

  departmentOptions = {
    Marketing: 'Marketing',
    Sales: 'Sales',
    Technology: 'Technology'
  }

  contractTypeOptions = {
    Permanent: 'Permanent',
    Contract: 'Contract',
    PartTime: 'PartTime'
  }

  companyModules = [
    {
      moduleName: 'HR Module',
      icon: 'bi-people-fill',
      isSelected: true,
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
      moduleName: 'CRM Module',
      icon: 'bi-headset',
      isSelected: false,
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
    private router: Router
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.getCompanyDepartments();
    this.getCompanyModules();
  }

  private initFormGroup(): void {
    this.loggedInUser = this.authService.loggedInUser;
    console.log(this.loggedInUser)
    this.form = new FormGroup(
      {
        firstName: new FormControl(this.loggedInUser.firstName, Validators.required),
        lastName: new FormControl(this.loggedInUser.lastName, Validators.required),
        email: new FormControl(this.loggedInUser.email, [Validators.required, Validators.email]),
        phone: new FormControl(''),
        companyName: new FormControl(this.loggedInUser ? this.loggedInUser.companyName : 'SILO', Validators.required),
        dateOfBirth: new FormControl('', Validators.required),
        gender: new FormControl(''),
        branch: new FormControl(''),
        department: new FormControl(''),
        jobTitle: new FormControl(''),
        contractType: new FormControl(''),
        // modules: new FormControl([], Validators.required),
        // employees: new FormArray([]) 
      }
    );
  }

  get formCtrls() {
    return this.form.controls;
  }

  getCompanyDepartments() {
    this.hrService.getCompanyDepartments(this.loggedInUser.companyId).subscribe(
      res => {
        console.log('Departments', res)
      }
    )
  }

  getCompanyModules() {
    this.hrService.getCompanyModules(this.loggedInUser.companyId).subscribe(
      res => {
        console.log('Modules', res)
      }
    )
  }


  goToStep(stepNo:number) {
    this.currentStep = stepNo;
  }

  goToNextStep() {
    if(this.currentStep == 4 || this.currentStep == 0) {
      //Go to dashboard
      this.goToDashboard();
    }
    this.checkStep(this.currentStep)
  }

  goToPrevStep() {
    this.currentStep = this.currentStep - 1;
  }

  goToDashboard() {
    this.router.navigate(['/app']);
  }

  checkStep(stepNo: number): boolean {
    let isValid = false;
    switch (stepNo) {
      case 1:
        this.formCtrls['dateOfBirth'].markAsTouched();
        isValid = this.formCtrls['dateOfBirth'].valid;
        if(isValid) {
          const formData = new FormData();
          formData.append('phoneNumber', this.form.value.phone);
          formData.append('dateOfBirth', this.form.value.dateOfBirth);
          formData.append('gender', this.form.value.gender);
          this.updateEmployeeInfo(formData);
        }
        break;
      case 2:
        isValid = true
        this.updateOfficialInfo();
        break;
      case 3:
        isValid = true;
        this.goToStep(this.currentStep + 1);
        break;
      default:
        break;
    }
    return isValid
  } 

  updateOfficialInfo() {
    const formData = new FormData();
    let dataToSend = false;
    if(this.form.value.branch) {
      formData.append('branch', this.form.value.branch); 
      dataToSend = true;
    }
    if(this.form.value.department) {
      formData.append('department', this.form.value.department); 
      dataToSend = true;
    }
    if(this.form.value.jobTitle) {
      formData.append('companyRole', this.form.value.jobTitle); 
      dataToSend = true;
    }
    if(this.form.value.contractType) {
      formData.append('employmentType', this.form.value.contractType); 
      dataToSend = true;
    }

    if(dataToSend) this.updateEmployeeInfo(formData);
    this.currentStep = this.currentStep + 1;
  }

  updateEmployeeInfo(payload: FormData) {
    this.isLoading = true;
    this.hrService.updateEmployee(payload).subscribe({
      next: res => {
        // console.log(res);
        if(res.status == 200) {
          this.notifyService.showSuccess(res.message);
          this.isLoading = false;
          this.currentStep = this.currentStep + 1;
        }
      },
      error: err => {
        //console.log(err)
        this.isLoading = false;
      } 
    })
  }

}
