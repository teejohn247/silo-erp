import { Component, OnInit } from '@angular/core';
import { ModalService } from '@sharedWeb/services/utils/modal.service';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, forkJoin, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from '@services/crm/crm.service';
import { LeadsInfoComponent } from '../leads-info/leads-info.component';

@Component({
  selector: 'app-leads-overview',
  templateUrl: './leads-overview.component.html',
  styleUrl: './leads-overview.component.scss'
})
export class LeadsOverviewComponent implements OnInit {
  agentsList:any[] = [];
  industriesList:any[] = [];
  selectedRows:any[] = [];
  tableData!: any[];
  isLoading = false;

  bulkActions = [
    {
      icon: 'briefcase',
      label: 'Convert to Contact',
      action: 'convertToContact'
    },
    {
      icon: 'userStar',
      label: 'Rate Lead',
      action: 'rateLead'
    },
    {
      icon: 'layers',
      label: 'Convert to Deal',
      action: 'convertToDeal'
    },
    // {
    //   icon: 'layers2',
    //   label: 'Assign Salary Scale',
    //   action: 'assignSalaryScale'
    // },
    // {
    //   icon: 'send',
    //   label: 'Resend Invite',
    //   action: 'invite'
    // },
  ]

  tableFilters!: FilterConfig[];
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

  //Lead Table Column Names
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
      key: "name",
      label: "Name",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "email",
      label: "Email",
      order: 6,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "phoneNumber",
    //   label: "Phone Number",
    //   order: 7,
    //   columnWidth: "12%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    // {
    //   key: "dateOfBirth",
    //   label: "Date of Birth",
    //   order: 8,
    //   columnWidth: "8%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "industry",
      label: "Industry",
      order: 8,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leadOwner",
      label: "Lead Owner",
      order: 9,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "expectedRevenue",
      label: "Expected Revenue",
      order: 6,
      columnWidth: "15%",
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
        { icon: 'view', color: 'var(--blue-theme)', tooltip: 'View', callback: (row: any) => this.viewRow(row) },
        { icon: 'userPen', color: 'var(--yellow-theme)', tooltip: 'Edit', callback: (row: any) => this.editRow(row) },
        // { icon: 'trash', color: 'var(--red-theme)', tooltip: 'Delete', callback: (row: any) => this.deleteRow(row) },
      ],
      menuActions: [
        {
          icon: 'briefcase',
          label: 'Convert to Contact',
          actionKey: 'convertToContact'
        },
        {
          icon: 'userStar',
          label: 'Rate Lead',
          actionKey: 'rateLead'
        },
        {
          icon: 'layers',
          label: 'Convert to Deal',
          actionKey: 'convertToDeal'
        },
        // {
        //   icon: 'userCheck',
        //   label: 'Assign Approvers',
        //   actionKey: 'assignApprover'
        // },
        // {
        //   icon: 'layers2',
        //   label: 'Assign Salary Scale',
        //   actionKey: 'assignSalaryScale'
        // },
        // {
        //   icon: 'send',
        //   label: 'Resend Invite',
        //   actionKey: 'invite'
        // },
        {
          icon: 'trash',
          label: 'Delete',
          actionKey: 'delete',
          color: 'var(--red-theme)'
        },
      ]
    }
  ]

  constructor(
    private modalService: ModalService,
    private crmService: CrmService,
    private utils: UtilityService,
    private router: Router,
    private route: ActivatedRoute,
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
        this.crmService.getLeads(paging.page, paging.pageSize, search, filters).pipe(
          catchError(() => of({ data: [], total: 0 })) // fallback if API fails
        )
      )
    )
      
    tableData$.subscribe(res => {
      //console.log('Employees', res)
      this.tableData = res.data;
      this.paging.total = res.totalRecords;
      this.isLoading = false;
    });

    // Trigger initial load
    this.search$.next('');

    forkJoin({
      agents: this.crmService.getAgents(),
    }).subscribe(({ agents }) => {
      this.agentsList = agents.data;
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

  onSelectionChange(event:any) {
    //console.log(event);
    this.selectedRows = event;
  }

  buildFilters() {
    this.tableFilters = [
      { 
        key: 'agents', 
        label: 'Agents', 
        type: 'select', 
        options: this.utils.arrayToObject(this.agentsList, 'agentName'), 
        includeIfEmpty: false 
      },
      { 
        key: 'industry', 
        label: 'Industries', 
        type: 'select', 
        options: this.utils.arrayToObject(this.industriesList, 'industryName'), 
        includeIfEmpty: false 
      },
      { 
        key: 'leadStatus', 
        label: 'Lead Status', 
        type: 'select', 
        options: {
          Active: 'Active',
          Inactive: 'Inactive'
        }, 
        includeIfEmpty: false 
      }
    ];
  }

  viewRow(row: any) {
    //console.log('View', row);
    this.router.navigate([row._id], { relativeTo: this.route });
    //this.router.navigate(['/app/hr/employees', row._id]);
  }

  editRow(row: any) {
    //console.log('Edit', row);
    this.openLeadsModal(row);
  }

  //Delete a LEAD
  deleteRow(row: any) {
    //console.log('Delete', row);
    this.notify.confirmAction({
      title: 'Remove Lead',
      message: 'Are you sure you want to remove this lead?',
      confirmText: 'Remove Lead',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.crmService.deleteLead(row._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notify.showInfo('This Lead has been deleted successfully');
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

  onTableAction(event: { action: string; row: any }) {
    switch (event.action) {
      case 'convertToContact':
        this.convertToContact(event.row)
        //this.resendEmployeeInvite([event.row]);
        break;
      case 'convertToDeal':
        this.convertToDeal(event.row)
        break;
      case 'delete':
        this.deleteRow(event.row);
        break;
    }
  }

  onBulkAction(event:any) {
    console.log(event);
    if(this.selectedRows.length) {
      switch (event) {
        // case 'invite':
        //   this.resendEmployeeInvite([event.row]);
        //   break;
        // case 'assignManager':
        //   this.openAssignmentModal('manager');
        //   break;
        // case 'assignApprover':
        //   this.openAssignmentModal('approver');
        //   break;
      }
    }
    else {
      this.notify.showError('Please select the leads you need to take action on')
    }    
  }

  openLeadsModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      agents: this.agentsList
    }
    this.modalService.open(
      LeadsInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.search$.next('');
      }
    });
  }

  convertToContact(info:any) {
    this.crmService.convertToContact(info._id).subscribe({
      next: res => {
        // console.log(res);
        if(res.status == 200) {
          this.notify.showInfo('This Lead has been converted to a deal successfully');
        }
        this.search$.next('');
      },
      error: err => {
        //console.log(err)
      } 
    })
  }

  convertToDeal(info:any) {
    this.crmService.convertToDeal(info._id).subscribe({
      next: res => {
        // console.log(res);
        if(res.status == 200) {
          this.notify.showInfo('This Lead has been converted to a deal successfully');
        }
        this.search$.next('');
      },
      error: err => {
        //console.log(err)
      } 
    })
  }
}
