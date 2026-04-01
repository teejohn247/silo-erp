import { Component, OnInit } from '@angular/core';
import { ModalService } from '@sharedWeb/services/utils/modal.service';
import { HrService } from '@services/hr/hr.service';
import { NotificationService } from '@services/utils/notification.service';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { UtilityService } from '@services/utils/utility.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, forkJoin, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmService } from '@services/crm/crm.service';
import { QuotationInfoComponent } from '../quotation-info/quotation-info.component';
import { InvoiceInfoComponent } from '../invoice-info/invoice-info.component';
import { PurchaseOrderInfoComponent } from '../purchase-order-info/purchase-order-info.component';

@Component({
  selector: 'app-sales-overview',
  templateUrl: './sales-overview.component.html',
  styleUrl: './sales-overview.component.scss'
})
export class SalesOverviewComponent implements OnInit {
  activeTab:string = 'all';
  agentsList:any[] = [];
  contactsList:any[] = [];
  leadsList:any[] = [];
  quotationslist:any[] = [];
  industriesList:any[] = [];
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

  bulkActions = [
    {
      icon: 'receiptText',
      label: 'Generate Invoice',
      action: 'generateInvoice'
    },
    // {
    //   icon: 'userCheck',
    //   label: 'Assign Approvers',
    //   action: 'assignApprover'
    // },
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


  tableColumns: any[] = [
    {
      key: "referenceNumber",
      label: "Reference No",
      order: 1,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "name",
      label: "Name",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "issueDate",
      label: "Date Issued",
      order: 3,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'date',
      sortable: true
    },
    {
      key: "expiryDate",
      label: "Expiry Date",
      order: 4,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      type: 'date',
      sortable: true
    },
    {
      key: "agentName",
      label: "Agent",
      order: 5,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "orderTotal",
      label: "Amount",
      order: 6,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      type: 'amount',
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 7,
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
      order: 8,
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
          icon: 'receiptText',
          label: 'Generate Invoice',
          action: 'generateInvoice'
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
        this.crmService.getSalesOrders(paging.page, paging.pageSize, search, filters).pipe(
          catchError(() => of({ data: [], total: 0 })) // fallback if API fails
        )
      )
    )
      
    tableData$.subscribe(res => {
      //console.log('Employees', res)
      this.tableData = res.data;
      console.log('Sales History', this.tableData);
      this.paging.total = res.totalRecords;
      this.isLoading = false;
    });

    // Trigger initial load
    this.search$.next('');

    forkJoin({
      contacts: this.crmService.getContacts(1, 100),
      leads: this.crmService.getLeads(1, 100),
      agents: this.crmService.getAgents(1, 100),
      quotations: this.crmService.getQuotations(1, 100),
      // purchaseOrders:
    }).subscribe(({ contacts, leads, agents, quotations }) => {
      this.contactsList = contacts.data;
      this.leadsList = leads.data;
      this.agentsList = agents.data;
      this.quotationslist = quotations.data;
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

  viewRow(row: any) {
    //console.log('View', row);
    this.router.navigate([row._id], { relativeTo: this.route });
    //this.router.navigate(['/app/hr/employees', row._id]);
  }

  editRow(row: any) {
    //console.log('Edit', row);
    //this.openLeadsModal(row);
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

  openQuotationModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '45%',
      data: modalData,
      leads: this.leadsList,
      contacts: this.contactsList,
      agents: this.agentsList
    }
    this.modalService.open(
      QuotationInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.search$.next('');
      }
    });
  }

  openOrderModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      leads: this.leadsList,
      contacts: this.contactsList,
      agents: this.agentsList,
      quotations: this.quotationslist
    }
    this.modalService.open(
      PurchaseOrderInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.search$.next('');
      }
    });
  }

  openInvoiceModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      leads: this.leadsList,
      contacts: this.contactsList,
      agents: this.agentsList
    }
    this.modalService.open(
      InvoiceInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.search$.next('');
      }
    });
  }

  filterSales(orderType:string) {
    this.activeTab = orderType;
    this.onFilterChange({
      orderType: orderType === 'all' ? null : orderType
    })
  }
}
