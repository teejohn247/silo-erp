import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, forkJoin, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-attendance-log',
  templateUrl: './attendance-log.component.html',
  styleUrl: './attendance-log.component.scss'
})
export class AttendanceLogComponent implements OnInit {
  tableData!: any[];
  tableFilters!: FilterConfig[];
  isLoading = false;
  selectedRows:any[] = [];
  selectedDate = new Date();

  departmentList: any[] = [];

  private search$ = new BehaviorSubject<any>('');
  private filters$ = new BehaviorSubject<any>(this.utils.buildDayRange(this.selectedDate));
  private paging$ = new BehaviorSubject<{ page: number; pageSize: number }>({ page: 1, pageSize: 10 });
  private unsubscribe$ = new Subject<void>();

  // Paging object sent to dynamic-table
  paging = {
    page: 1,
    pageSize: 10,
    total: 0
  };

  //Attendance Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "employeeImage",
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
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "department",
      label: "Department",
      order: 3,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "checkIn",
      label: "Checked In",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    {
      key: "checkOut",
      label: "Checked Out",
      order: 5,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    {
      key: "attendanceStatus",
      label: "Status",
      order: 6,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'status',
      statusMap: {
        true: 'active',
        false: 'pending'
      },
      sortable: true
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
        this.hrService.getAttendanceList(paging.page, paging.pageSize, search, filters).pipe(
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

    //this.search$.next('');

    forkJoin({
      departments: this.hrService.getDepartments(),
    }).subscribe(({ departments }) => {
      this.departmentList = departments.data;
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
    console.log(filters);
    this.filters$.next(filters);
  }

  onDateChange(date: Date) {
    const range = this.utils.buildDayRange(date);
    this.onFilterChange({
      ...this.filters$.value,
      startDate: range.startDate,
      endDate: range.endDate
    });
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
    const dateRange = this.utils.buildDayRange(this.selectedDate);
    this.tableFilters = [
      { 
        key: 'departments', 
        label: 'Departments', 
        type: 'select', 
        options: this.utils.arrayToObject(this.departmentList, 'departmentName'), 
        includeIfEmpty: false 
      },
      { 
        key: 'startDate', 
        label: 'Start Date', 
        type: 'date', 
        includeIfEmpty: false,
        default: dateRange.startDate
      },
      { 
        key: 'endDate', 
        label: 'End date', 
        type: 'date', 
        includeIfEmpty: false,
        default: dateRange.endDate
      }
    ];

    console.log(this.tableFilters)
    //this.filters$.next({ startDate: dateRange.startDate, endDate: dateRange.endDate });
  }
}
