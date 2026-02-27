import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ExpenseRequestsInfoComponent } from '../expense-requests-info/expense-requests-info.component';

@Component({
  selector: 'app-expense-management-overview',
  templateUrl: './expense-management-overview.component.html',
  styleUrl: './expense-management-overview.component.scss'
})
export class ExpenseManagementOverviewComponent implements OnInit {
  requestedApprovals!: any[];
  approvedRequests!: any[];
  leaveGraphDetails:any;
  expenseTypes: any[] = [];
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

  tableColumns: TableColumn[] = [
    {
      key: "profilePic",
      label: "",
      order: 1,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      type: 'profile',
      sortable: false
    },
    {
      key: "employeeName",
      label: "Name",
      order: 2,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "expenseTypeName",
      label: "Expense Type",
      order: 3,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "amount",
      label: "Amount",
      order: 4,
      columnWidth: "6%",
      cellStyle: "width: 100%",
      type: 'amount',
      sortable: false
    },
    {
      key: "dateRequested",
      label: "Submitted",
      order: 5,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    {
      key: "approver",
      label: "Approver",
      order: 6,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 10,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'status',
      statusMap: {
        'Approved': 'active',
        'Pending': 'pending',
        'Declined': 'declined'
      },
      sortable: true
    },
    {
      key: "actions",
      label: "",
      order: 11,
      columnWidth: "10%",
      sortable: false,
      type: "actions",
      actions: [
        { icon: 'userPen', color: 'var(--yellow-theme)', tooltip: 'Edit', callback: (row: any) => this.openApprovalModal(row) },
        { icon: 'trash', color: 'var(--red-theme)', tooltip: 'Delete', callback: (row: any) => this.deleteRow(row) },
      ]
    }
  ]

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private utils: UtilityService,
    private modalService: ModalService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.currency = this.utils.currency;
    this.chartYearOptions = this.utils.generateYearOptions(Number(this.chartYear));
    this.hrService.getExpenseTypes().subscribe(res => {
      this.expenseTypes = res.data;
      this.buildFilters();
    });

    // Reactive pipeline
    const expenseHistory$ = combineLatest([
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
        this.hrService.getRequestedLeaveApprovals(paging.page, paging.pageSize, search, filters).pipe(
          catchError(() => of({ data: [], total: 0 })) // fallback if API fails
        )
      )
    )
      
    expenseHistory$.subscribe(res => {
      console.log('Requests', res)
      this.requestedApprovals = res.data;
      this.approvedRequests = this.requestedApprovals.filter(item => {
        return item.status === 'Approved';
      });
      this.paging.total = res.totalRecords;
      this.isLoading = false;
    });

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
        key: 'expenseType', 
        label: 'Expense Types', 
        type: 'select', 
        options: this.utils.arrayToObject(this.expenseTypes, 'expenseType'), 
        includeIfEmpty: false 
      },
      // { 
      //   key: 'departments', 
      //   label: 'Departments', 
      //   type: 'select', 
      //   options: this.utils.arrayToObject(this.designationList, 'designationName'), 
      //   includeIfEmpty: false 
      // },
      { 
        key: 'status', 
        label: 'Approval Status', 
        type: 'select', 
        options: {
          Approved: 'Approved',
          Pending: 'Pending',
          Declined: 'Declined'
        }, 
        includeIfEmpty: false 
      }
    ];
  }

  openApprovalModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
      forApproval: true,
      expenseTypes: this.expenseTypes
    }
    this.modalService.open(
      ExpenseRequestsInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.search$.next('');
      }
    });
  }

  //Delete an employee
  deleteRow(row: any) {
    //console.log('Delete', row);
    this.notify.confirmAction({
      title: 'Remove Expense Request',
      message: 'Are you sure you want to remove this request?',
      confirmText: 'Remove Expense Request',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteExpenseRequest(row._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notify.showInfo('This expense request has been deleted successfully');
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
}
