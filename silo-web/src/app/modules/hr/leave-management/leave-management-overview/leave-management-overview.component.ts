import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { LeaveRequestInfoComponent } from '../leave-request-info/leave-request-info.component';

@Component({
  selector: 'app-leave-management-overview',
  templateUrl: './leave-management-overview.component.html',
  styleUrl: './leave-management-overview.component.scss'
})
export class LeaveManagementOverviewComponent implements OnInit {

  requestedApprovals!: any[];
  approvedRequests!: any[];
  leaveGraphDetails:any;
  leaveTypes: any[] = [];
  leaveRequestMatrix:any = [
    {
      id: 1,
      label: "21+",
      key: "21+ days",
    },
    {
      id: 2,
      label: "15-21",
      key: "15-21 days",
    },
    {
      id: 3,
      label: "8-14",
      key: "8-14 days",
    },
    {
      id: 4,
      label: "0-7",
      key: "0-7 days",
    },
  ]

  chartYear: string = new Date().getFullYear().toString();
  chartYearOptions:any = {};

  keepOrder = () => 0;

  tableFilters!: FilterConfig[];
  isLoading = false;
  selectedRows:any[] = [];

  tableColumns: TableColumn[] = [
    // {
    //   key: "select",
    //   label: "Select",
    //   order: 1,
    //   columnWidth: "3%",
    //   cellStyle: "width: 100%",
    //   sortable: false
    // },
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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private utils: UtilityService,
    private modalService: ModalService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.chartYearOptions = this.utils.generateYearOptions(Number(this.chartYear));
    const leaveGraph$ = this.hrService.getLeaveGraph(Number(this.chartYear)).subscribe(res => {
      this.leaveGraphDetails = res.data;
      console.log(this.leaveGraphDetails);
      this.leaveGraphDetails.forEach((row:any) => {
        this.leaveRequestMatrix.find((x:any) => {
          if(x.key == row.group) x.staff = row.employees;
        }) 
      });
      console.log('Matrix', this.leaveRequestMatrix)
    });

    this.hrService.getLeaveTypes().subscribe(res => {
      this.leaveTypes = res.data;
      this.buildFilters();
    });

    // Reactive pipeline
    const leaveHistory$ = combineLatest([
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
      
    leaveHistory$.subscribe(res => {
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

  goBack() {
    this.utils.goBack();
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
        key: 'leaveType', 
        label: 'Leave Types', 
        type: 'select', 
        options: this.utils.arrayToObject(this.leaveTypes, 'leaveName'), 
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
      leaveTypes: this.leaveTypes
    }
    this.modalService.open(
      LeaveRequestInfoComponent, 
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
      title: 'Remove Leave Request',
      message: 'Are you sure you want to remove this request?',
      confirmText: 'Remove Leave Request',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteLeaveRequest(row._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notify.showInfo('This leave request has been deleted successfully');
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
