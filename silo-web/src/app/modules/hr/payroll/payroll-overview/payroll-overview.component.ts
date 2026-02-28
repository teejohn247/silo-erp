import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PayrollPeriodInfoComponent } from '../payroll-period-info/payroll-period-info.component';
import { PaymentInfoComponent } from '../payment-info/payment-info.component';
import { PayslipComponent } from '../payslip/payslip.component';

@Component({
  selector: 'app-payroll-overview',
  templateUrl: './payroll-overview.component.html',
  styleUrl: './payroll-overview.component.scss'
})
export class PayrollOverviewComponent implements OnInit {
  loggedInUser:any;
  tableData!: any[];
  currency:string = '';

  chartYear: string = new Date().getFullYear().toString();
  chartYearOptions:any = {};

  keepOrder = () => 0;

  tableFilters!: FilterConfig[];
  isLoading = false;
  selectedRows:any[] = [];

  private search$ = new Subject<string>();
  private filters$ = new BehaviorSubject<any>({});
  private paging$ = new BehaviorSubject<{ page: number; pageSize: number }>({ page: 1, pageSize: 10 });
  private unsubscribe$ = new Subject<void>();

  // Paging object sent to dynamic-table
  paging = {
    page: 1,
    pageSize: 10,
    total: 0
  };

  //Payroll Summary Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "reference",
      label: "Reference",
      order: 1,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "payrollPeriodName",
      label: "Payroll Name",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "startDate",
      label: "Pay Period",
      order: 3,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      type: 'date',
      sortable: true
    },
    {
      key: "totalEarnings",
      label: "Total Earnings",
      order: 6,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'amount',
      sortable: true
    },
    {
      key: "deductions",
      label: "Deductions",
      order: 9,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'amount',
      sortable: true
    },
    {
      key: "netEarnings",
      label: "Net Earnings",
      order: 10,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'amount',
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 10,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'status',
      statusMap: this.utils.statusMap,
      sortable: true
    },
    

  ]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private utils: UtilityService,
    private modalService: ModalService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.currency = this.utils.currency;
    this.chartYearOptions = this.utils.generateYearOptions(Number(this.chartYear));
    this.loggedInUser.isSuperAdmin ? 
    this.tableColumns.push({
      key: "actions",
      label: "",
      order: 11,
      columnWidth: "10%",
      sortable: false,
      type: "actions",
      actions: [
        { icon: 'view', color: 'var(--blue-theme)', tooltip: 'View', callback: (row: any) => this.viewRow(row) },
        { icon: 'calendarSync', color: 'var(--yellow-theme)', tooltip: 'Edit', callback: (row: any) => this.editRow(row) },
        { icon: 'trash', color: 'var(--red-theme)', tooltip: 'Delete', callback: (row: any) => this.deleteRow(row) },
      ],
    }) 
    :
    this.tableColumns.push({
      key: "actions",
      label: "",
      order: 11,
      columnWidth: "10%",
      sortable: false,
      type: "actions",
      actions: [
        { icon: 'view', color: 'var(--blue-theme)', tooltip: 'View', callback: (row: any) => this.viewRow(row) },
      ],
    })

    // Reactive pipeline
    const tableData$ = combineLatest([
      this.search$.pipe(
        debounceTime(300)
      ), 
      this.filters$, 
      this.paging$
      ]
    ).pipe(
      takeUntil(this.unsubscribe$),
      tap(() => (this.isLoading = true)),
      switchMap(([search, filters, paging]) =>
        this.hrService.getPayrollPeriods(paging.page, paging.pageSize, search, filters).pipe(
          catchError(() => of({ data: [], total: 0 })) // fallback if API fails
        )
      )
    )
      
    tableData$.subscribe(res => {
      console.log('Table Data', res)
      this.tableData = res.data;
      this.paging.total = res.totalRecords;
      this.isLoading = false;
    });

    this.buildFilters();
    this.search$.next('');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // Search input
  onSearchChange(value: string) {
    this.search$.next(value);
  }

  // Filter changes
  onFilterChange(filters: any) {
    this.filters$.next(filters);
  }

  // Called whenever pagination changes in the table
  onPagingChange(newPaging: { page: number; pageSize: number }) {
    //console.log(newPaging)
    this.paging = {
      ...this.paging,
      ...newPaging
    };
    this.paging$.next(newPaging);
  }

  onSelectionChange(event:any) {
    //console.log(event);
    this.selectedRows = event;
  }

  buildFilters() {
    this.tableFilters = [
      { 
        key: 'startDate', 
        label: 'Start Date', 
        type: 'date', 
        includeIfEmpty: false,
      },
      { 
        key: 'endDate', 
        label: 'End date', 
        type: 'date', 
        includeIfEmpty: false,
      }
    ];
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
        this.search$.next('');
      }
    });
  }

  viewRow(row: any) {
    this.loggedInUser.isSuperAdmin ? this.router.navigate([row._id], { relativeTo: this.route }) : this.openPayslipModal(row);
  }

  editRow(row:any) {
    this.openPeriodModal(row)
  }

  deleteRow(row: any) {
    //console.log('Delete', row);
    this.notify.confirmAction({
      title: 'Remove Payroll Period',
      message: 'Are you sure you want to remove this period?',
      confirmText: 'Remove Payroll Period',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePayrollPeriod(row._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notify.showInfo('This payroll period has been deleted successfully');
            }
            this.search$.next('');
          },
          error: err => {
            //console.log(err)
          } 
        })
      }
    });
  }

  openPaymentInfoModal() {
    const modalConfig:any = {
      isExisting: true,
      width: '38%',
      data: {
        ...this.loggedInUser.paymentInformation[0],
        profilePhoto: this.loggedInUser.profilePic
      },
    }
    this.modalService.open(
      PaymentInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.loggedInUser = this.authService.loggedInUser;
      }
    });
  }

  openPayslipModal(row:any) {
    const modalConfig:any = {
      isExisting: true,
      width: '38%',
      data: row,
    }
    this.modalService.open(
      PayslipComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.loggedInUser = this.authService.loggedInUser;
      }
    });
  }
}
