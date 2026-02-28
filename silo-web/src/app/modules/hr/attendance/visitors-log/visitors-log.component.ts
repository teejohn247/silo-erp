import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, forkJoin, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { VisitorInfoComponent } from '../visitor-info/visitor-info.component';

@Component({
  selector: 'app-visitors-log',
  templateUrl: './visitors-log.component.html',
  styleUrl: './visitors-log.component.scss'
})
export class VisitorsLogComponent implements OnInit {

  tableData!: any[];
  tableFilters!: FilterConfig[];
  isLoading = false;
  selectedRows:any[] = [];
  selectedDate = new Date();

  employeesList: any[] = [];

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

  tableColumns: TableColumn[] = [
    {
      key: "image",
      label: "",
      order: 1,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      type: 'profile',
      sortable: false
    },
    {
      key: "guestName",
      label: "Name",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "purpose",
      label: "Purpose",
      order: 3,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "employeeName",
      label: "Host",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "checkIn",
      label: "Checked In",
      order: 5,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    {
      key: "checkOut",
      label: "Checked Out",
      order: 6,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    {
      key: "status",
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
    },
    {
      key: "actions",
      label: "",
      order: 11,
      columnWidth: "10%",
      sortable: false,
      type: "actions",
      actions: [
        { icon: 'doorOpen', color: 'var(--green-theme)', tooltip: 'View', callback: (row: any) => this.checkIn(row) },
        { icon: 'doorClosed', color: 'var(--yellow-theme)', tooltip: 'Edit', callback: (row: any) => this.checkOut(row) },
        { icon: 'trash', color: 'var(--red-theme)', tooltip: 'Delete', callback: (row: any) => this.deleteRow(row) },
      ],
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
        this.hrService.getVisitorsList(paging.page, paging.pageSize, search, filters).pipe(
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
      employees: this.hrService.getEmployees(1, 100),
    }).subscribe(({ employees }) => {
      this.employeesList = employees.data;
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

  checkIn(row:any) {
    let currentDate = new Date();
    const payload = {
      checkInTime: currentDate,
    }
    this.hrService.checkInVisitor(payload, row._id).subscribe({
      next: res => {
        console.log(res);
        if(res.status == 200) {
          this.notify.showSuccess('This visitor has been checked in successfully');
          const dateRange = this.utils.buildDayRange(this.selectedDate);
          this.filters$.next({ startDate: dateRange.startDate, endDate: dateRange.endDate });
        }
      },
      error: err => {
        console.log(err)
      } 
    })
  }

  checkOut(row:any) {
    let currentDate = new Date();
    const payload = {
      checkOutTime: currentDate,
    }
    this.hrService.checkOutVisitor(payload, row._id).subscribe({
      next: res => {
        console.log(res);
        if(res.status == 200) {
          this.notify.showSuccess('This visitor has been checked out successfully');
          const dateRange = this.utils.buildDayRange(this.selectedDate);
          this.filters$.next({ startDate: dateRange.startDate, endDate: dateRange.endDate });
        }
      },
      error: err => {
        console.log(err)
      } 
    })
  }

  deleteRow(row: any) {
    //console.log('Delete', row);
    this.notify.confirmAction({
      title: 'Remove Visitor',
      message: 'Are you sure you want to remove this visitor?',
      confirmText: 'Remove Visitor',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteMeeting(row._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notify.showInfo('The employee has been deleted successfully');
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
  
  openVisitorModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      employees: this.employeesList,
    }
    //if(this.form.value.department) modalConfig['name'] = this.form.value.department;
    this.modalService.open(
      VisitorInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        const dateRange = this.utils.buildDayRange(this.selectedDate);
        this.filters$.next({ startDate: dateRange.startDate, endDate: dateRange.endDate });
      }
    });
  }
}
