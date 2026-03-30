import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { SettingsService } from '@services/settings/settings.service';
import { AuthService } from '@services/utils/auth.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-billing-overview',
  templateUrl: './billing-overview.component.html',
  styleUrl: './billing-overview.component.scss'
})
export class BillingOverviewComponent implements OnInit {
  loggedInUser:any;
  userSubscription:any;
  activeCard:any;
  currency:any;

  tableData!:any;
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
      key: "invoiceNumber",
      label: "Invoice No",
      order: 1,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "createdAt",
      label: "Date Issued",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    // {
    //   key: "plan",
    //   label: "Plan",
    //   order: 3,
    //   columnWidth: "10%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "amount",
      label: "Amount",
      order: 4,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'amount',
      sortable: false
    },
    {
      key: "dueDate",
      label: "Due Date",
      order: 5,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    {
      key: "datePaid",
      label: "Date Paid",
      order: 5,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'datetime',
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
    // {
    //   key: "actions",
    //   label: "",
    //   order: 11,
    //   columnWidth: "10%",
    //   sortable: false,
    //   type: "actions",
    //   actions: [
    //     { icon: 'userPen', color: 'var(--yellow-theme)', tooltip: 'Edit', callback: (row: any) => this.openApprovalModal(row) },
    //     { icon: 'trash', color: 'var(--red-theme)', tooltip: 'Delete', callback: (row: any) => this.deleteRow(row) },
    //   ]
    // }
  ]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utils: UtilityService,
    private authService: AuthService,
    private settingsService: SettingsService,
    private notifyService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.currency = this.utils.currency;
    
    //this.getSubscriptionPlans();
    this.getUserSubscription();
    
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
        this.settingsService.getInvoices(paging.page, paging.pageSize, search, filters).pipe(
          catchError(() => of({ data: [], total: 0 })) // fallback if API fails
        )
      )
    )
      
    tableData$.subscribe(res => {
      console.log('Requests', res)
      this.tableData = res.data;
      this.paging.total = res.totalRecords;
      this.isLoading = false;
    });

    this.search$.next('');
  }

  getUserSubscription() {
    this.settingsService.getUserSubscription(this.loggedInUser.email).subscribe(res => {
      console.log('Response', res);
      this.userSubscription = res.data
      this.activeCard = res.data.authorizations[0];
    })
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

  manageSubscription() {
    this.settingsService.manageUserSubscription(this.userSubscription?.activeSubscription.subscriptionCode).subscribe({
      next: res => {
        console.log('Manage', res);
        // Open URL in a new tab
        window.open(res.data.link, '_blank');
      },
      error: err => {}
    })
  }
}
