import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { UtilityService } from '@services/utils/utility.service';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { BehaviorSubject, Subject } from 'rxjs';
import { ExpenseRequestsInfoComponent } from '../expense-requests-info/expense-requests-info.component';


@Component({
  selector: 'app-expense-requests-overview',
  templateUrl: './expense-requests-overview.component.html',
  styleUrl: './expense-requests-overview.component.scss'
})
export class ExpenseRequestsOverviewComponent implements OnInit {
  loggedInUser:any;
  expenseTypes: any[] = [];
  expenseRecords: any[] = [];
  currency:string = '';

  tableFilters!: FilterConfig[];
  isLoading = false;

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

  //Expense Request Table Column Names
  tableColumns: TableColumn[] = [
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
      key: "dateRemitted",
      label: "Date Remitted",
      order: 7,
      columnWidth: "10%",
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
        { icon: 'view', color: 'var(--yellow-theme)', tooltip: 'Edit', callback: (row: any) => this.openExpenseModal(row) },
        // { icon: 'trash', color: 'var(--red-theme)', tooltip: 'Delete', callback: (row: any) => this.deleteRow(row) },
      ]
    }

  ]

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private utils: UtilityService,
    private hrService: HrService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    console.log(this.loggedInUser)
    this.currency = this.utils.currency;
    const expenseTypes$ = this.hrService.getExpenseTypes().subscribe(res => {
      this.expenseTypes = res.data;
      this.buildFilters();
    });
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

  openExpenseModal(modalData?:any) {
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

  buildFilters() {
    this.tableFilters = [
      { 
        key: 'expenseType', 
        label: 'Expense Types', 
        type: 'select', 
        options: this.utils.arrayToObject(this.expenseTypes, 'expenseType'), 
        includeIfEmpty: false 
      },
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
}
