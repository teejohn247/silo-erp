import { Component, OnInit } from '@angular/core';
import { HrService } from '@services/hr/hr.service';
import { ModalService } from '@services/utils/modal.service';
import { UtilityService } from '@services/utils/utility.service';
import { EmployeeInfoComponent } from '../employee-info/employee-info.component';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LeaveAssignmentComponent } from '@hr/leave-management/leave-assignment/leave-assignment.component';
import { DocumentUploadComponent } from '@sharedWeb/components/blocks/document-upload/document-upload.component';
import { PaymentInfoComponent } from '@hr/payroll/payment-info/payment-info.component';
import { AuthService } from '@services/utils/auth.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss'
})
export class EmployeeProfileComponent implements OnInit {

  loggedInUser:any;
  employeeDetails: any;
  totalLeaveDays!:number;
  leaveDaysUsed!:number;
  leaveChartTotalView: boolean = false;

  chartColorScheme = {
    domain: ['rgba(235, 87, 87, 0.7)', 'rgba(54, 171, 104, 0.7)', 'rgba(229, 166, 71, 0.7)', 'rgba(66, 133, 244, 0.7)', 'rgba(255, 150, 85, 0.7)']
  };
  chartData:any = [];
  totalChartData:any = [];

  documents: any[] = [
    {
      name: "Project_Proposal.pdf",
      type: "pdf",
      uploadDate: "2026-02-15T10:30:00Z"
    },
    {
      name: "Employee_Handbook.docx",
      type: "word",
      uploadDate: "2026-02-18T14:45:00Z"
    },
    {
      name: "Sales_Report_Q1.csv",
      type: "csv",
      uploadDate: "2026-02-20T09:15:00Z"
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private utils: UtilityService,
    private modalService: ModalService,
    private hrService: HrService,
  ) {

  }

  goBack() {
    this.utils.goBack();
  }

  ngOnInit(): void {
    this.getEmployeeDetails();
  }

  getEmployeeDetails() {
    this.loggedInUser = this.authService.loggedInUser;
    if(!this.loggedInUser.isSuperAdmin) {
      this.employeeDetails = this.loggedInUser;
      this.generateLeaveCharts(this.employeeDetails.leaveAssignment);
      return
    }
    const employeeId = this.route.snapshot.params["id"];
    this.hrService.getEmployeeDetails(employeeId).subscribe({
      next: res => {
        this.employeeDetails = res.data;
        console.log('Employee', this.employeeDetails);
        this.generateLeaveCharts(this.employeeDetails.leaveAssignment);
      }
    })
  }

  generateLeaveCharts(leaveArray: any[]) {
    // Filter only leaves with >0 days
    const validLeaves = leaveArray.filter(item => item.noOfLeaveDays > 0);

    // --- 1️⃣ Generate individual leave chart data ---
    this.chartData = validLeaves.map(item => {
      const percent = (item.daysUsed / item.noOfLeaveDays) * 100;

      const status =
        item.daysUsed === 0 ? 'awaiting' :
        percent < 40 ? 'pending' :
        percent < 100 ? 'warning' :
        'complete';

      return {
        name: item.leaveName,
        value: item.noOfLeaveDays,
        status
      };
    });

    // --- 2️⃣ Calculate totals ---
    this.totalLeaveDays = validLeaves.reduce((sum, item) => sum + item.noOfLeaveDays, 0);
    this.leaveDaysUsed = validLeaves.reduce((sum, item) => sum + item.daysUsed, 0);
    const leaveDaysLeft = this.totalLeaveDays - this.leaveDaysUsed;

    // --- 3️⃣ Generate total chart data ---
    const percentUsed = (this.leaveDaysUsed / this.totalLeaveDays) * 100;
    const totalStatus =
      this.leaveDaysUsed === 0 ? 'awaiting' :
      percentUsed < 40 ? 'pending' :
      percentUsed < 100 ? 'warning' :
      'complete';

    this.totalChartData = [
      { name: 'Days Used', value: this.leaveDaysUsed, status: totalStatus },
      { name: 'Days Left', value: leaveDaysLeft, status: 'awaiting' }
    ];
  }

  openEmployeeModal(modalData?:any) {
    forkJoin({
      departments: this.hrService.getDepartments(),
      designations: this.hrService.getDesignations()
    }).subscribe(({ departments, designations }) => {
      this.triggerModal(modalData, departments.data, designations.data);
    });
  }

  triggerModal(modalData?:any, departments?:any, designations?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      departmentList: departments,
      designationList: designations
    }
    //if(this.form.value.department) modalConfig['name'] = this.form.value.department;
    this.modalService.open(
      EmployeeInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.getEmployeeDetails();
      }
    });
  }

  openLeaveApplicationModal() {
    
  }

  openLeaveAssignmentModal() {
    const modalConfig:any = {
      isExisting: true,
      width: '35%',
      data: this.employeeDetails.leaveAssignment,
    }
    this.modalService.open(
      LeaveAssignmentComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.getEmployeeDetails();
      }
    });
  }

  openDocUploadModal() {
    const modalConfig:any = {
      isExisting: false,
      width: '35%',
    }
    this.modalService.open(
      DocumentUploadComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.getEmployeeDetails();
      }
    });
  }

  openPaymentInfoModal() {
    const modalConfig:any = {
      isExisting: true,
      width: '38%',
      data: {
        ...this.employeeDetails.paymentInformation[0],
        profilePhoto: this.employeeDetails.profilePic
      },
    }
    this.modalService.open(
      PaymentInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.getEmployeeDetails();
      }
    });
  }
}
