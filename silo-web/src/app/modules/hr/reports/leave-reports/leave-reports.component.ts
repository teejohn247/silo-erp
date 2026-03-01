import { Component, OnInit } from '@angular/core';
import { ModalService } from '@sharedWeb/services/utils/modal.service';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, filter, forkJoin, of, startWith, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leave-reports',
  templateUrl: './leave-reports.component.html',
  styleUrl: './leave-reports.component.scss'
})
export class LeaveReportsComponent implements OnInit {
  departmentList: any[] = [];
  designationList: any[] = [];
  leaveTypes:any[] = [];
  selectedRows:any[] = [];
  tableData!: any[];
  isLoading = false;
  isExportingData = false;

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
      key: "fullName",
      label: "Name",
      order: 2,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leaveTypeName",
      label: "Leave Type",
      order: 3,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "requestDate",
      label: "Submitted",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    {
      key: "leaveStartDate",
      label: "Start Date",
      order: 5,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'date',
      sortable: true
    },
    {
      key: "leaveEndDate",
      label: "End Date",
      order: 6,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'date',
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
    }
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
    forkJoin({
      leaveTypes: this.hrService.getLeaveTypes(),
      sharedData: this.hrService.reportsFilters$.pipe(
        filter(data => data != null),
        take(1) // ensures forkJoin can complete
      )
    }).subscribe(({ leaveTypes, sharedData }) => {
      this.leaveTypes = leaveTypes.data;
      this.departmentList = sharedData.departments.data;
      this.designationList = sharedData.designations.data;

      this.buildFilters();
    });

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
        this.hrService.getRequestedLeaveApprovals(paging.page, paging.pageSize, search, filters).pipe(
          catchError(() => of({ data: [], total: 0 })) // fallback if API fails
        )
      )
    )
      
    tableData$.subscribe(res => {
      this.tableData = res.data;
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
      const exportData = res.data;
      const dataExportFields:any = ['fullName', 'leaveTypeName', 'requestDate', 'leaveStartDate', 'leaveEndDate', 'status'];
      const formatters = {
        requestDate: (val: any) => val ? new Date(val).toLocaleDateString('en-GB') : '',
        leaveStartDate: (val: any) => val ? new Date(val).toLocaleDateString('en-GB') : '',
        leaveEndDate: (val: any) => val ? new Date(val).toLocaleDateString('en-GB') : ''
      };
      this.utils.exportToCsv(exportData, dataExportFields, 'Leave_Report.csv', formatters);
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
        key: 'leaveType', 
        label: 'Leave Types', 
        type: 'select', 
        options: this.utils.arrayToObject(this.leaveTypes, 'leaveName'), 
        includeIfEmpty: false 
      },
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
      },
    ];
  }

}
