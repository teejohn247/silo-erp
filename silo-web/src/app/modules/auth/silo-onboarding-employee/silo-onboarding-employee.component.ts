import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { authPageStagger } from '@animations/auth-page-animations';
import { AuthService } from '@sharedWeb/services/utils/auth.service';
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
    private authService: AuthService
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    
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


  goToStep(stepNo:number) {
    this.currentStep = stepNo;
  }

  goToNextStep() {
    if(this.currentStep == 4 || this.currentStep == 0) {
      //Go to dashboard
      return
    }
    if(this.stepValid(this.currentStep)) this.currentStep = this.currentStep + 1;
  }

  goToPrevStep() {
    this.currentStep = this.currentStep - 1;
  }

  stepValid(stepNo: number): boolean {
    let isValid = false;
    switch (stepNo) {
      case 1:
        this.formCtrls['dateOfBirth'].markAsTouched();
        isValid = this.formCtrls['dateOfBirth'].valid;
        break;
      case 2:
        isValid = true
        break;
      case 3:
        isValid = true;
        break;
      default:
        break;
    }
    return isValid
  } 

}
