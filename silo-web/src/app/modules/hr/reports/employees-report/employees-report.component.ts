import { Component, OnInit } from '@angular/core';
import { ModalService } from '@sharedWeb/services/utils/modal.service';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, forkJoin, of, startWith, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employees-report',
  templateUrl: './employees-report.component.html',
  styleUrl: './employees-report.component.scss'
})
export class EmployeesReportComponent implements OnInit {
  departmentList: any[] = [];
  designationList: any[] = [];
  selectedRows:any[] = [];
  tableData!: any[];
  isLoading = false;
  isExportingData = false;

  //Employee Table Column Names
  tableColumns: TableColumn[] = [
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
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "email",
      label: "Email Address",
      order: 6,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      order: 7,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "age",
      label: "Age",
      order: 8,
      columnWidth: "6%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "department",
      label: "Department",
      order: 8,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "companyRole",
      label: "Role",
      order: 9,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "employmentStartDate",
      label: "Date Joined",
      order: 10,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'date',
      sortable: true
    },
    {
      key: "activeStatus",
      label: "Status",
      order: 10,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'status',
      statusMap: {
        true: 'active',
        false: 'pending'
      },
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
    //     { icon: 'view', color: 'var(--blue-theme)', tooltip: 'View', callback: (row: any) => this.viewRow(row) },
    //     { icon: 'userPen', color: 'var(--yellow-theme)', tooltip: 'Edit', callback: (row: any) => this.editRow(row) },
    //     // { icon: 'trash', color: 'var(--red-theme)', tooltip: 'Delete', callback: (row: any) => this.deleteRow(row) },
    //   ],
    //   menuActions: [
    //     {
    //       icon: 'briefcase',
    //       label: 'Assign Manager',
    //       actionKey: 'assignManager'
    //     },
    //     {
    //       icon: 'userCheck',
    //       label: 'Assign Approvers',
    //       actionKey: 'assignApprover'
    //     },
    //     {
    //       icon: 'layers2',
    //       label: 'Assign Salary Scale',
    //       actionKey: 'assignSalaryScale'
    //     },
    //     {
    //       icon: 'send',
    //       label: 'Resend Invite',
    //       actionKey: 'invite'
    //     },
    //     {
    //       icon: 'trash',
    //       label: 'Delete',
    //       actionKey: 'delete',
    //       color: 'var(--red-theme)'
    //     },
    //   ]
    // }
  ]

  tableFilters!: FilterConfig[];
  private search$ = new Subject<string>();
  private filters$ = new BehaviorSubject<any>({});
  private paging$ = new BehaviorSubject<{ page: number; pageSize: number }>({ page: 1, pageSize: 10 });
  private unsubscribe$ = new Subject<void>();
  private export$ = new Subject<void>();

  // Paging object sent to dynamic-table
  paging = {
    page: 1,
    pageSize: 10,
    total: 0
  };

  constructor(
    private modalService: ModalService,
    private hrService: HrService,
    private utils: UtilityService,
    private router: Router,
    private route: ActivatedRoute,
    private notify: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.hrService.reportsFilters$.subscribe( res => {
      if(res) {
        this.departmentList = res?.departments.data;
        this.designationList = res?.designations.data;
        this.buildFilters();
      }
    })

    // Reactive UI pipeline
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
        this.hrService.getEmployees(paging.page, paging.pageSize, search, filters).pipe(
          catchError(() => of({ data: [], total: 0 })) // fallback if API fails
        )
      )
    )
      
    tableData$.subscribe(res => {
      this.tableData = res.data.map((employee: any) => ({
        ...employee,
        age: this.utils.calculateAge(employee.dateOfBirth)
      }));

      this.paging.total = res.totalRecords;
      this.isLoading = false;
    });

    // Trigger initial load
    this.search$.next('');

    // Trigger table export
    this.export$.pipe(
      tap(() => (this.isExportingData = true)),
      switchMap(() =>
        combineLatest([
          this.search$.pipe(startWith(''), take(1)), // emit latest search or empty
          this.filters$.pipe(take(1))
        ])
      ),
      switchMap(([search, filters]) => {
        return this.hrService.getEmployees(
          1,
          10000, // export size
          search,
          filters
        )
      }),
      catchError(() => {
        this.notify.showError('Export failed');
        return of(null);
      })
    )
    .subscribe(res => {
      if (!res) return;
      const exportData = res.data.map((employee: any) => ({
        ...employee,
        age: this.utils.calculateAge(employee.dateOfBirth)
      }));
      const dataExportFields:any = ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth', 'age', 'department', 'designation', 'companyRole', 'employmentStartDate'];
      const formatters = {
        dateOfBirth: (val: any) => val ? new Date(val).toLocaleDateString('en-GB') : '',
        employmentStartDate: (val: any) => val ? new Date(val).toLocaleDateString('en-GB') : ''
      };
      this.utils.exportToCsv(exportData, dataExportFields, 'Employees_Report.csv', formatters);
      this.isExportingData = false;
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

  onSelectionChange(event:any) {
    //console.log(event);
    this.selectedRows = event;
  }

  exportData() {
    this.export$.next();
  }

  buildFilters() {
    this.tableFilters = [
      { 
        key: 'department', 
        label: 'Department', 
        type: 'select', 
        options: this.utils.arrayToObject(this.departmentList, 'departmentName'), 
        includeIfEmpty: false 
      },
      { 
        key: 'designation', 
        label: 'Designation', 
        type: 'select', 
        options: this.utils.arrayToObject(this.designationList, 'designationName'), 
        includeIfEmpty: false 
      },
      { 
        key: 'employmentStatus', 
        label: 'Employment Status', 
        type: 'select', 
        options: {
          Active: 'Active',
          Inactive: 'Inactive'
        }, 
        includeIfEmpty: false 
      },
      { 
        key: 'employmentType', 
        label: 'Employment Type', 
        type: 'select', 
        options: {
          Contract: 'Contract',
          Permanent: 'Permanent'
        }, 
        includeIfEmpty: false 
      }
    ];
  }

}
