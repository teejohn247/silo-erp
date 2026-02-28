import { Component, OnInit } from '@angular/core';
import { HrService } from '@services/hr/hr.service';
import { ModalService } from '@services/utils/modal.service';
import { UtilityService } from '@services/utils/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { PayrollPeriodInfoComponent } from '../payroll-period-info/payroll-period-info.component';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { NotificationService } from '@services/utils/notification.service';
import { PayrollCalculatorComponent } from '../payroll-calculator/payroll-calculator.component';

@Component({
  selector: 'app-payroll-details',
  templateUrl: './payroll-details.component.html',
  styleUrl: './payroll-details.component.scss'
})
export class PayrollDetailsComponent implements OnInit {
  periodInView!:any;
  payrollPeriodName: any;
  payrollPeriodOptions:any;

  payrollCredits:any;
  payrollDebits:any;

  keepOrder = () => 0;

  tableData!:any;
  tableColumns!: TableColumn[];
  tableFilters!: FilterConfig[];
  isLoading = false;
  selectedRows:any[] = [];
  columnsCount: number = 2;

  private search$ = new Subject<string>();
  private filters$ = new BehaviorSubject<any>({});
  private paging$ = new BehaviorSubject<{ page: number; pageSize: number }>({ page: 1, pageSize: 100 });
  private unsubscribe$ = new Subject<void>();

  // Paging object sent to dynamic-table
  paging = {
    page: 1,
    pageSize: 10,
    total: 0
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utils: UtilityService,
    private modalService: ModalService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    const periodId = this.route.snapshot.params["id"];

    forkJoin({
      credits: this.hrService.getPayrollCredits(),
      debits: this.hrService.getPayrollDebits()
    }).subscribe(({ credits, debits }) => {

      this.payrollCredits = credits.data;
      this.payrollDebits = debits.data;
      this.generateTableColumns(this.payrollCredits, this.payrollDebits);
    });

    this.getPayrollPeriodDetails(periodId);
  }

  getPayrollPeriodDetails(periodId:string) {
    this.hrService.getPayrollDetails(periodId).subscribe({
      next: res => {
        this.periodInView = res.data[0];
        console.log('Details', this.periodInView);
        this.payrollPeriodName = this.periodInView.payrollPeriodName;
        this.tableData = this.periodInView['payrollPeriodData'];
      }
    })
  }

  goBack() {
    this.utils.goBack();
  }

  generateTableColumns(credits:any, debits:any) {
    this.tableColumns = [
      {
        key: "profilePic",
        label: "",
        order: 2,
        columnWidth: "5%",
        cellStyle: "width: 100%",
        type: 'profile',
        sortable: false
      },
      {
        key: "fullName",
        label: "Name",
        order: 3,
        columnWidth: "12%",
        cellStyle: "width: 100%",
        sortable: false
      },
    ];

    // const dynamicKeys = this.periodInView.dynamicFields;

    // dynamicKeys.forEach((key:any) => {
    //   this.columnsCount++;

    //   this.tableColumns.push({
    //     key: `dynamicFields.${key}`,
    //     label: this.utils.fromCamelCase(key), // optional prettify
    //     order: this.columnsCount,
    //     columnWidth: `${(100 - 45) / dynamicKeys.length}%`,
    //     sortable: true
    //   });
    // });

    credits.forEach((item:any) => {
      this.columnsCount = this.columnsCount + 1;
      let columnObject = {
        key: `dynamicFields.${this.utils.toCamelCase(item.name)}`,
        label: item.name,
        order: this.columnsCount,
        columnWidth: String((100-45)/(credits.length + debits.length)) + '%',
        cellClass: "text-success",
        sortable: true
      }
      this.tableColumns.push(columnObject);
    });

    debits.forEach((item:any) => {
      this.columnsCount = this.columnsCount + 1;
      let columnObject = {
        key: `dynamicFields.${this.utils.toCamelCase(item.name)}`,
        label: item.name,
        order: this.columnsCount,
        columnWidth: String((100-45)/(credits.length + debits.length)) + '%',
        cellClass: "text-danger",
        sortable: true
      }
      this.tableColumns.push(columnObject);
    });

    const otherColumns = ['Net Earnings', 'Status'];
    otherColumns.map(item => {
      this.columnsCount = this.columnsCount + 1;
      let columnObject = {
        key: this.utils.toCamelCase(item),
        label: item,
        order: this.columnsCount,
        columnWidth: item == 'Status' ? '10%' : '8%',
        cellStyle: "width: 100%",
        statusMap: item == 'Status' ? this.utils.statusMap : {},
        sortable: false
      }
      this.tableColumns.push(columnObject);
    })
  }

  openPeriodModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
    }
    this.modalService.open(
      PayrollPeriodInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.search$.next('');
      }
    });
  }

  openCalculatorModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
      payrollCredits: this.payrollCredits,
      payrollDebits: this.payrollDebits
    }
    this.modalService.open(
      PayrollCalculatorComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.search$.next('');
      }
    });
  }

  viewRow(row:any) {
    this.openCalculatorModal(row);
  }

  // Search input
  onSearchChange(value: string) {
    //this.search$.next(value);
  }

  onSelectionChange(event:any) {
    //console.log(event);
    this.selectedRows = event;
  }
}
