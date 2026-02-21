import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalService } from '@sharedWeb/services/utils/modal.service';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { EmployeeInfoComponent } from '../employee-info/employee-info.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {

  departmentList: any[] = [];
  designationList: any[] = [];

  constructor(
    private modalService: ModalService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.hrService.getDepartments().subscribe(res => this.departmentList = res.data);
    this.hrService.getDesignations().subscribe(res => this.designationList = res.data)
  }

  getEmployees() {

  }

  openEmployeeModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      departmentList: this.departmentList,
      designationList: this.designationList
    }
    //if(this.form.value.department) modalConfig['name'] = this.form.value.department;
    this.modalService.open(
      EmployeeInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.updateAccordionList('departments');
      }
    });
  }
}
