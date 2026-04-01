import { Component, OnInit, ViewChild } from '@angular/core';
import { DealsCardComponent } from '../deals-card/deals-card.component';
import { KanbanBoardComponent } from '@sharedWeb/components/blocks/kanban-board/kanban-board.component';
import { theme } from 'highcharts';
import { DealInfoComponent } from '../deal-info/deal-info.component';
import { ModalService } from '@services/utils/modal.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, forkJoin, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CrmService } from '@services/crm/crm.service';
import { FilterConfig, TableColumn } from '@models/general/table-data';
import { KanbanStage } from '@models/crm/deals-pipeline';
import { UtilityService } from '@services/utils/utility.service';
import { NotificationService } from '@services/utils/notification.service';

@Component({
  selector: 'app-sales-pipeline',
  templateUrl: './sales-pipeline.component.html',
  styleUrls: ['./sales-pipeline.component.scss']
})
export class SalesPipelineComponent implements OnInit {
  activeTab:string = 'tableView';
  agentsList:any[] = [];
  leadsList:any[] = [];
  contactsList:any[] = [];
  selectedRows:any[] = [];
  @ViewChild(KanbanBoardComponent) any!: KanbanBoardComponent;

  kanbanCardComponent = DealsCardComponent;
  
  tableData!: any[];
  isLoading = false;

  // Sample stages
  stages: KanbanStage[] = [];
  // stages: KanbanStage[] = [
  //   { id: '1', name: 'Leads', order: 1, color: '#1976d2', theme: 'blue'},
  //   { id: '2', name: 'Qualified', order: 2, color: '#7b1fa2', theme: 'red'},
  //   { id: '3', name: 'Proposal', order: 3, color: '#f57c00', theme: 'yellow' },
  //   { id: '4', name: 'Closed', order: 4, color: '#388e3c', theme: 'green' }
  // ];

  // Sample items
  kanbanItems!: any[];
  // kanbanItems: any[] = [
  //   {
  //     id: '101',
  //     stageId: '3',
  //     theme: 'yellow',
  //     data: {
  //       title: 'Purchase of Oil Wells',
  //       value: 20000,
  //       company: 'Evergreen Technologies',
  //       contactName: 'Karen Catalona',
  //       email: 'karencatalona@technologies.com',
  //       avatar: 'assets/img/project/home/employee1.webp',
  //       date: '13 February, 2026. 5:20 PM',
  //       priority: 'hot'
  //     }
  //   },
  //   {
  //     id: '102',
  //     stageId: '1',
  //     theme: 'blue',
  //     data: {
  //       title: 'Solar Farm Investment',
  //       value: 45000,
  //       company: 'SunGrid Energy',
  //       contactName: 'James Peterson',
  //       email: 'j.peterson@sungrid.com',
  //       avatar: 'assets/img/project/home/employee2.webp',
  //       date: '12 February, 2026. 11:00 AM',
  //       priority: 'hot'
  //     }
  //   },
  //   {
  //     id: '103',
  //     stageId: '1',
  //     theme: 'blue',
  //     data: {
  //       title: 'Wind Turbine Maintenance Contract',
  //       value: 15000,
  //       company: 'Aeolus Systems',
  //       contactName: 'Maria Velasquez',
  //       email: 'm.velasquez@aeolus.com',
  //       avatar: 'assets/img/project/home/employee3.webp',
  //       date: '10 February, 2026. 3:10 PM',
  //       priority: 'warm'
  //     }
  //   },
  //   {
  //     id: '104',
  //     stageId: '2',
  //     theme: 'red',
  //     data: {
  //       title: 'AI Data Center Expansion',
  //       value: 120000,
  //       company: 'NovaTech Industries',
  //       contactName: 'Robert Hill',
  //       email: 'robert.hill@novatech.com',
  //       avatar: 'assets/img/project/home/employee4.webp',
  //       date: '11 February, 2026. 9:30 AM',
  //       priority: 'cold'
  //     }
  //   },
  //   {
  //     id: '105',
  //     stageId: '2',
  //     theme: 'red',
  //     data: {
  //       title: 'Enterprise Security Upgrade',
  //       value: 32000,
  //       company: 'CyberShield Corp',
  //       contactName: 'Linda Park',
  //       email: 'lpark@cybershield.com',
  //       avatar: 'assets/img/project/home/employee5.webp',
  //       date: '9 February, 2026. 2:15 PM',
  //       priority: 'warm'
  //     }
  //   },
  //   {
  //     id: '106',
  //     stageId: '2',
  //     theme: 'red',
  //     data: {
  //       title: 'Healthcare Analytics Platform',
  //       value: 78000,
  //       company: 'MedCore Analytics',
  //       contactName: 'Daniel Jacobs',
  //       email: 'djacobs@medcore.com',
  //       avatar: 'assets/img/project/home/employee6.webp',
  //       date: '7 February, 2026. 1:00 PM',
  //       priority: 'hot'
  //     }
  //   },

  //   {
  //     id: '107',
  //     stageId: '1',
  //     theme: 'blue',
  //     data: {
  //       title: 'Cloud Migration Project',
  //       value: 56000,
  //       company: 'SkyNet Cloud',
  //       contactName: 'Emily Watson',
  //       email: 'emily.watson@skynet.com',
  //       avatar: 'assets/img/project/home/employee3.webp',
  //       date: '5 February, 2026. 4:45 PM',
  //       priority: 'cold'
  //     }
  //   },

  //   {
  //     id: '108',
  //     stageId: '3',
  //     theme: 'yellow',
  //     data: {
  //       title: 'Smart Factory Automation',
  //       value: 98000,
  //       company: 'AutoForge Ltd',
  //       contactName: 'Liam O’Connor',
  //       email: 'liam.oconnor@autoforge.com',
  //       avatar: 'assets/img/project/home/employee1.webp',
  //       date: '4 February, 2026. 10:10 AM',
  //       priority: 'hot'
  //     }
  //   },

  //   {
  //     id: '109',
  //     stageId: '3',
  //     theme: 'yellow',
  //     data: {
  //       title: 'Retail AI Recommendation Engine',
  //       value: 47000,
  //       company: 'ShopSense AI',
  //       contactName: 'Sophia Chen',
  //       email: 'sophia.chen@shopsense.ai',
  //       avatar: 'assets/img/project/home/employee2.webp',
  //       date: '3 February, 2026. 6:30 PM',
  //       priority: 'warm'
  //     }
  //   },

  //   {
  //     id: '110',
  //     stageId: '4',
  //     theme: 'green',
  //     data: {
  //       title: 'Airport Surveillance Upgrade',
  //       value: 210000,
  //       company: 'SecureVision Global',
  //       contactName: 'David Richardson',
  //       email: 'd.richardson@securevision.com',
  //       avatar: 'assets/img/project/home/employee3.webp',
  //       date: '1 February, 2026. 8:00 AM',
  //       priority: 'hot'
  //     }
  //   },

  //   {
  //     id: '111',
  //     stageId: '4',
  //     theme: 'green',
  //     data: {
  //       title: 'National Grid Monitoring System',
  //       value: 175000,
  //       company: 'PowerNet Infrastructure',
  //       contactName: 'Olivia Grant',
  //       email: 'olivia.grant@powernet.com',
  //       avatar: 'assets/img/project/home/employee4.webp',
  //       date: '31 January, 2026. 3:40 PM',
  //       priority: 'cold'
  //     }
  //   },

  //   {
  //     id: '112',
  //     stageId: '4',
  //     theme: 'green',
  //     data: {
  //       title: 'Telecom Network Upgrade',
  //       value: 89000,
  //       company: 'GlobalTel Communications',
  //       contactName: 'Marcus Allen',
  //       email: 'm.allen@globaltel.com',
  //       avatar: 'assets/img/project/home/employee5.webp',
  //       date: '28 January, 2026. 12:00 PM',
  //       priority: 'warm'
  //     }
  //   }

  // ];

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

  //Deals Table Column Names
  tableColumns: TableColumn[] = [
    // {
    //   key: "profilePic",
    //   label: "",
    //   order: 2,
    //   columnWidth: "5%",
    //   cellStyle: "width: 100%",
    //   type: 'profile',
    //   sortable: false
    // },
    {
      key: "leadName",
      label: "Name",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "description",
      label: "Title",
      order: 3,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "expectedRevenue",
      label: "Revenue",
      type: 'amount',
      order: 6,
      columnWidth: "8%",
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
    {
      key: "createdAt",
      label: "Date",
      type: 'date',
      order: 7,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "industry",
      label: "Industry",
      order: 8,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "conversionProbability",
      label: "Probability",
      order: 9,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "assignedAgentName",
      label: "Agent",
      order: 10,
      columnWidth: "12%",
      cellStyle: "width: 100%",
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
        { icon: 'userPen', color: 'var(--yellow-theme)', tooltip: 'Edit', callback: (row: any) => this.editRow(row) },
        //{ icon: 'trash', color: 'var(--red-theme)', tooltip: 'Delete', callback: (row: any) => this.deleteRow(row) },
      ],
      menuActions: [
        {
          icon: 'phoneCall',
          label: 'Contact Client',
          actionKey: 'contactClient',
          color: 'var(--blue-theme)'
        },
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
    private utils: UtilityService,
    private notify: NotificationService,
    private modalService: ModalService,
    private crmService: CrmService
  ) {}

  ngOnInit(): void {
    // Any additional setup
    forkJoin({
      statuses: this.crmService.getDealStatuses(),
      agents: this.crmService.getAgents(1, 100),
      leads: this.crmService.getLeads(1, 100),
      contacts: this.crmService.getContacts(1, 100),
    }).subscribe(({ statuses, agents, leads, contacts }) => {
      this.stages = statuses.data;
      this.agentsList = agents.data;
      this.leadsList = leads.data;
      this.contactsList = contacts.data;

      console.log('Deal Statuses', this.stages)
      //this.buildFilters();
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
        this.crmService.getDeals(paging.page, paging.pageSize, search, filters).pipe(
          catchError(() => of({ data: [], total: 0 })) // fallback if API fails
        )
      )
    )
      
    tableData$.subscribe(res => {
      this.tableData = res.data;
      this.tableData = this.utils.mapThemeToData(this.tableData, this.stages, 'stage');
      console.log('Table Data', this.tableData);
      this.paging.total = res.totalRecords;
      this.kanbanItems = this.utils.transformKanbanItems(this.tableData, this.stages);
      console.log('Kanban', this.kanbanItems);
      this.isLoading = false;
    });

    // Trigger initial load
    this.search$.next('');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCardMoved(event:any) {
    //console.log('Card moved:', event);

    // Call API with the new stage
    this.updateCardStageOnServer(event.itemId, event.fromStageId, event.toStageId);

    // Keep parent as source of truth (recommended)
    const idx = this.kanbanItems.findIndex(i => i.id === event.itemId);
    if (idx !== -1) {
      this.kanbanItems[idx] = { ...this.kanbanItems[idx], stageId: event.toStageId };
      this.kanbanItems = [...this.kanbanItems];
    }
  }

  updateCardStageOnServer(cardId: string, fromStageId:string, toStageId: string) {
    if(fromStageId === toStageId) return;
    //console.log(`API call: move card ${cardId} to stage ${toStageId}`);
    // Call your backend here
    const payload = {
      stageId: toStageId
    };
    this.crmService.moveDeal(payload, cardId).subscribe({
      next: res => {
        if(res.success) this.notify.showSuccess('Deal was moved successfully');
        this.search$.next('');
        //this.isLoading = false;
      },
      error: (err) => {},
    })
  }

  openDealsModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      agents: this.agentsList,
      leads: this.leadsList,
      contacts: this.contactsList
    }
    this.modalService.open(
      DealInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.search$.next('');
      }
    });
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
        key: 'status', 
        label: 'Deal Status', 
        type: 'select', 
        options: this.utils.arrayToObject(this.stages, 'name'), 
        includeIfEmpty: false 
      }
    ];
  }

  viewRow(row: any) {
    //console.log('View', row);
    this.openDealsModal(row);
    //this.router.navigate([row._id], { relativeTo: this.route });
    //this.router.navigate(['/app/hr/employees', row._id]);
  }

  editRow(row: any) {
    //console.log('Edit', row);
    this.openDealsModal(row);
  }

  //Delete a Deal
  deleteRow(row: any) {
    //console.log('Delete', row);
    this.notify.confirmAction({
      title: 'Remove Deal',
      message: 'Are you sure you want to remove this deal?',
      confirmText: 'Remove Deal',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.crmService.deleteDeal(row._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notify.showInfo('This deal has been deleted successfully');
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
      case 'view':
        this.viewRow(event.row)
        break;
      case 'edit':
        this.editRow(event.row)
        break;
      case 'delete':
        this.deleteRow(event.row);
        break;
    }
  }

  onBulkAction(event:any) {
    //console.log(event);
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
      this.notify.showError('Please select the deals you need to take action on')
    }    
  }
}