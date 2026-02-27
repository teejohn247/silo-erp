import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalService } from '@sharedWeb/services/utils/modal.service';
import { DepartmentInfoComponent } from '../department-info/department-info.component';
import { HrService } from '@services/hr/hr.service';
import { LeaveTypeInfoComponent } from '../leave-type-info/leave-type-info.component';
import { HolidayInfoComponent } from '../holiday-info/holiday-info.component';
import { ExpenseTypeInfoComponent } from '../expense-type-info/expense-type-info.component';
import { DesignationInfoComponent } from '../designation-info/designation-info.component';
import { NotificationService } from '@services/utils/notification.service';
import { PayrollCreditInfoComponent } from '../payroll-credit-info/payroll-credit-info.component';
import { PayrollDebitInfoComponent } from '../payroll-debit-info/payroll-debit-info.component';

@Component({
  selector: 'app-hr-settings',
  templateUrl: './hr-settings.component.html',
  styleUrl: './hr-settings.component.scss'
})
export class HrSettingsComponent implements OnInit {
  form!: FormGroup;
  accordionItems: any[] = [];
  activeTab:number = -1;
  employees:any[] = [];

  constructor(
    private modalService: ModalService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {

    this.hrService.getEmployees(1, 100).subscribe(res => this.employees = res.data);

    this.accordionItems = [
      {
        label: "Departments",
        key: "departments",
        list: [],
        loading: false,
        api: () => this.hrService.getDepartments(),
        deleteApi: (entity:any) => this.hrService.deleteDepartment(entity._id),
        display: (x: any) => x.departmentName,
        emptyText: "No departments available",
        emptyImage: "assets/img/project/illustrations/puzzle.webp"
      },
      {
        label: "Leave Types",
        key: "leaveTypes",
        list: [],
        loading: false,
        api: () => this.hrService.getLeaveTypes(),
        deleteApi: (entity:any) => this.hrService.deleteLeaveType(entity._id),
        display: (x: any) => x.leaveName,
        emptyText: "No leave types available",
        emptyImage: "assets/img/project/illustrations/stopwatch.webp"
      },
      {
        label: "Designations",
        key: "designations",
        list: [],
        loading: false,
        api: () => this.hrService.getDesignations(),
        deleteApi: (entity:any) => this.hrService.deleteDesignation(entity._id),
        display: (x: any) => x.designationName,
        emptyText: "No designations found",
        emptyImage: "assets/img/project/illustrations/user.webp"
      },
      {
        label: "Holidays",
        key: "holidayTypes",
        list: [],
        loading: false,
        api: () => this.hrService.getPublicHolidays(),
        deleteApi: (entity:any) => this.hrService.deletePublicHoliday(entity._id),
        display: (x: any) => x.holidayName,
        emptyText: "No holidays available",
        emptyImage: "assets/img/project/illustrations/calendar.webp"
      },
      {
        label: "Expense Types",
        key: "expenseTypes",
        list: [],
        loading: false,
        api: () => this.hrService.getExpenseTypes(),
        deleteApi: (entity:any) => this.hrService.deleteExpenseType(entity._id),
        display: (x: any) => x.expenseType,
        emptyText: "No expense types added",
        emptyImage: "assets/img/project/illustrations/wallet.webp"
      },
      {
        label: "Payroll Credits",
        key: "payrollCredits",
        list: [],
        loading: false,
        api: () => this.hrService.getPayrollCredits(),
        deleteApi: (entity:any) => this.hrService.deletePayrollCredit(entity._id),
        display: (x: any) => x.name,
        emptyText: "No payroll credits added",
        emptyImage: "assets/img/project/illustrations/wallet.webp"
      },
      {
        label: "Payroll Debits",
        key: "payrollDebits",
        list: [],
        loading: false,
        api: () => this.hrService.getPayrollDebits(),
        deleteApi: (entity:any) => this.hrService.deletePayrollDebit(entity._id),
        display: (x: any) => x.name,
        emptyText: "No payroll debits added",
        emptyImage: "assets/img/project/illustrations/wallet.webp"
      }
    ];

    this.form = new FormGroup({
      department: new FormControl(''),
      designation: new FormControl(''),
      leaveType: new FormControl(''),
      holidayName: new FormControl(''),
      expenseType: new FormControl(''),
      payrollCredit: new FormControl(''),
      payrollDebit: new FormControl('')
    });

    this.loadAccordionData();
  }

  toggleAccordionInfo(index: number) {
    this.activeTab = this.activeTab === index ? -1 : index;
    //const item = this.accordionItems[index];
  }

  loadAccordionData() {
    this.accordionItems.forEach(item => {
      // Only load once
      if (item.list.length === 0) {
        item.loading = true; // start loading
        item.api().subscribe({
          next: (res: any) => {
            item.list = res.data;
            item.loading = false; // stop loading
          },
          error: () => {
            item.loading = false; // stop loading on error too
          }
        });
      }
    })    
  }

  openDepartmentModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
      employees: this.employees
    }
    if(this.form.value.department) modalConfig['name'] = this.form.value.department;
    this.modalService.open(
      DepartmentInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.updateAccordionList('departments');
        this.form.controls['department'].reset();
      }
    });
  }

  openLeaveTypeModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
    }
    if(this.form.value.leaveType) modalConfig['name'] = this.form.value.leaveType;
    this.modalService.open(
      LeaveTypeInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.updateAccordionList('leaveTypes');
        this.form.controls['leaveType'].reset();
      }
    });
  }

  openHolidayModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
    }
    if(this.form.value.holidayName) modalConfig['name'] = this.form.value.holidayName;
    this.modalService.open(
      HolidayInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.updateAccordionList('holidayTypes');
        this.form.controls['holidayName'].reset();
      }
    });
  }

  openExpenseTypeModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
    }
    if(this.form.value.expenseType) modalConfig['name'] = this.form.value.expenseType;
    this.modalService.open(
      ExpenseTypeInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.updateAccordionList('expenseTypes');
        this.form.controls['holidayName'].reset();
      }
    });
  }

  openDesignationModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      leaveTypes: this.accordionItems.find(x => x.key === 'leaveTypes').list
    }
    if(this.form.value.designation) modalConfig['name'] = this.form.value.designation;
    this.modalService.open(
      DesignationInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.updateAccordionList('designations');
        this.form.controls['designation'].reset();
      }
    });
  }

  openPayrollCreditModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
    }
    if(this.form.value.payrollCredit) modalConfig['name'] = this.form.value.payrollCredit;
    this.modalService.open(
      PayrollCreditInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.updateAccordionList('payrollCredits');
        this.form.controls['payrollCredit'].reset();
      }
    });
  }

  openPayrollDebitModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
    }
    if(this.form.value.payrollDebit) modalConfig['name'] = this.form.value.payrollDebit;
    this.modalService.open(
      PayrollDebitInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.updateAccordionList('payrollDebits');
        this.form.controls['payrollDebit'].reset();
      }
    });
  }

  editEntity(type: string, entity: any) {
    switch(type) {

      case "departments":
        this.openDepartmentModal(entity);
        break;

      case "leaveTypes":
        this.openLeaveTypeModal(entity);
        break;

      case "holidayTypes":
        this.openHolidayModal(entity);
        break;

      case "expenseTypes":
        this.openExpenseTypeModal(entity);
        break;

      case "designations":
        this.openDesignationModal(entity);
        break;
    }
  }

  deleteEntity(type: string, entity: any) {
    const item = this.accordionItems.find(x => x.key === type);
    if (!item) return;

    const title = `Remove ${item.display(entity)}`;
    const message = `Are you sure you want to remove this ${item.label.toLowerCase().slice(0, -1)}?`;

    this.notify.confirmAction({
      title: title,
      message: message,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (!confirmed) return;

      item.deleteApi(entity).subscribe({
        next: (res:any) => {
          if (res.status === 200) {
            this.notify.showInfo(`${item.label.slice(0, -1)} has been deleted successfully`);
            // Remove the entity from the list locally
            item.list = item.list.filter((x:any) => x._id !== entity._id);
          }
        },
        error: (err:any) => {}
      });
    });
  }

  updateAccordionList(accordionKey:string) {
    let reqObj = this.accordionItems.find(x => x.key === accordionKey);
    reqObj.loading = true; // start loading
    reqObj.api().subscribe({
      next: (res: any) => {
        reqObj.list = res.data;
        reqObj.loading = false; // stop loading
      },
      error: () => {
        reqObj.loading = false; // stop loading on error too
      }
    });
  }
  
}
