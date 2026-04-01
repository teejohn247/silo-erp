import { Component, OnInit } from '@angular/core';
import { ModalService } from '@sharedWeb/services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, forkJoin, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from '@services/crm/crm.service';
import { TicketInfoComponent } from '../ticket-info/ticket-info.component';

@Component({
  selector: 'app-support-overview',
  templateUrl: './support-overview.component.html',
  styleUrl: './support-overview.component.scss'
})
export class SupportOverviewComponent implements OnInit {
  agentsList:any[] = [];
  contactsList:any[] = [];
  industriesList:any[] = [];
  ticketStatuses: any[] = [];
  selectedRows:any[] = [];
  tableData!: any[];
  isLoading = false;

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

  //Tickets Table Column Names
  tableColumns: any[] = [
    {
      key: "priority",
      label: "",
      order: 1,
      columnWidth: "4%",
      cellStyle: "width: 100%",
      type: 'priority',
      sortable: false
    },
    {
      key: "contactName",
      label: "Name",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "ticketNumber",
      label: "Ticket No",
      order: 3,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "email",
      label: "Email Address",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "title",
      label: "Ticket Title",
      order: 6,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "createdAt",
      label: "Date",
      order: 7,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'datetime',
      sortable: true
    },
    {
      key: "stage",
      label: "Status",
      order: 10,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'colorStatus',
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
        { icon: 'ticket', color: 'var(--yellow-theme)', tooltip: 'Edit', callback: (row: any) => this.editRow(row) },
        { icon: 'trash', color: 'var(--red-theme)', tooltip: 'Delete', callback: (row: any) => this.deleteRow(row) },
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
    forkJoin({
      statuses: this.crmService.getTicketStatuses(),
      contacts: this.crmService.getContacts(),
      agents: this.crmService.getAgents(),
    }).subscribe(({ statuses, contacts, agents }) => {
      this.ticketStatuses = statuses.data;
      this.contactsList = contacts.data;
      this.agentsList = agents.data;
      this.buildFilters();
    });

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
        this.crmService.getTickets(paging.page, paging.pageSize, search, filters).pipe(
          catchError(() => of({ data: [], total: 0 })) // fallback if API fails
        )
      )
    )
      
    tableData$.subscribe(res => {
      //console.log('Employees', res)
      this.tableData = res.data;
      this.tableData = this.ticketStatuses.length > 0 ? this.utils.mapThemeToData(this.tableData, this.ticketStatuses, 'stage') : this.tableData;
      this.paging.total = res.totalRecords;
      this.isLoading = false;
    });

    // Trigger initial load
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
        key: 'status', 
        label: 'Ticket Status', 
        type: 'select', 
        options: this.utils.arrayToObject(this.ticketStatuses, 'name'), 
        // options: {
        //   New: 'New',
        //   Triaged: 'Triaged',
        //   Assigned: 'Assigned',
        //   Investigating: 'Investigating',
        //   Progress: 'In progress',
        //   Waiting: 'Awaiting Customer Response',
        //   Resolved: 'Resolved'
        // }, 
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
    this.openTicketsModal(row);
  }

  //Delete a Ticket
  deleteRow(row: any) {
    //console.log('Delete', row);
    this.notify.confirmAction({
      title: 'Remove Support Ticket',
      message: 'Are you sure you want to remove this ticket?',
      confirmText: 'Remove Support Ticket',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.crmService.deleteLead(row._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notify.showInfo('This support ticket has been deleted successfully');
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
      case 'invite':
        //this.resendEmployeeInvite([event.row]);
        break;
      case 'assignManager':
        // if(this.selectedRows.length > 0) {
        //   this.selectedRows = []; 
        //   this.selectedRows.push(event.row);
        // }
        // else this.selectedRows.push(event.row);
        // this.openAssignmentModal('manager');
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

  openTicketsModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      agents: this.agentsList,
      contacts: this.contactsList,
      ticketStatuses: this.ticketStatuses
    }
    this.modalService.open(
      TicketInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.search$.next('');
      }
    });
  }

}
