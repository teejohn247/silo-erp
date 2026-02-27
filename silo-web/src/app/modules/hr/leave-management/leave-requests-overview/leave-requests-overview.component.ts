import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { UtilityService } from '@services/utils/utility.service';
import { LeaveRequestInfoComponent } from '../leave-request-info/leave-request-info.component';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-leave-requests-overview',
  templateUrl: './leave-requests-overview.component.html',
  styleUrl: './leave-requests-overview.component.scss'
})
export class LeaveRequestsOverviewComponent implements OnInit {

  loggedInUser:any;
  chartYear: string = new Date().getFullYear().toString();
  chartYearOptions:any = {};
  leaveBreakdown: any[] = [];
  leaveTypes: any[] = [];
  leaveRecords: any[] = [];

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

  //Leave Request Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "leaveTypeName",
      label: "Leave Type",
      order: 1,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "requestDate",
      label: "Submitted",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    {
      key: "leaveStartDate",
      label: "Start Date",
      order: 3,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'date',
      sortable: true
    },
    {
      key: "leaveEndDate",
      label: "End Date",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'date',
      sortable: true
    },
    {
      key: "approver",
      label: "Approver",
      order: 5,
      columnWidth: "12%",
      cellStyle: "width: 100%",
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
        { icon: 'userPen', color: 'var(--yellow-theme)', tooltip: 'Edit', callback: (row: any) => this.openLeaveModal(row) },
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
  ) {

  }
  
  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;

    const leaveTypes$ = this.hrService.getLeaveTypes().subscribe(res => {
      this.leaveTypes = res.data;
      this.buildFilters();
    });

    const tempBreakdown = [
      {
        id: 1,
        daysUsed: 2,
        totalDays: 6,
        name: 'Vacation',
      },
      {
        id: 2,
        daysUsed: 3,
        totalDays: 10,
        name: 'Sabbatical',
      }
    ]

    this.leaveBreakdown = this.loggedInUser.leaveAssignment.length ? this.loggedInUser.leaveAssignment.map((item:any, index:number) => {
      let data = {
        id: index + 1,
        daysUsed: item.daysUsed,
        totalDays: item.noOfLeaveDays,
        name: item.leaveName,
      }
      return data;
    }) : tempBreakdown;
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

  openLeaveModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
      forApproval: false,
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
