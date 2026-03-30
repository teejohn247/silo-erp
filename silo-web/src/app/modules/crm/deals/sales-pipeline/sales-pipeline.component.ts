import { Component, OnInit, ViewChild } from '@angular/core';
import { DealsCardComponent } from '../deals-card/deals-card.component';
import { KanbanBoardComponent } from '@sharedWeb/components/blocks/kanban-board/kanban-board.component';
import { theme } from 'highcharts';
import { DealInfoComponent } from '../deal-info/deal-info.component';
import { ModalService } from '@services/utils/modal.service';
import { BehaviorSubject, catchError, combineLatest, debounceTime, forkJoin, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CrmService } from '@services/crm/crm.service';
import { FilterConfig } from '@models/general/table-data';

@Component({
  selector: 'app-sales-pipeline',
  templateUrl: './sales-pipeline.component.html',
  styleUrls: ['./sales-pipeline.component.scss']
})
export class SalesPipelineComponent implements OnInit {

  agentsList:any[] = [];
  leadsList:any[] = [];
  contactsList:any[] = [];
  @ViewChild(KanbanBoardComponent) any!: KanbanBoardComponent;

  kanbanCardComponent = DealsCardComponent;
  
  tableData!: any[];
  isLoading = false;

  // Sample stages
  stages: any[] = [
    { id: '1', title: 'Leads', order: 1, color: '#1976d2', theme: 'blue'},
    { id: '2', title: 'Qualified', order: 2, color: '#7b1fa2', theme: 'red'},
    { id: '3', title: 'Proposal', order: 3, color: '#f57c00', theme: 'yellow' },
    { id: '4', title: 'Closed', order: 4, color: '#388e3c', theme: 'green' }
  ];

  // Sample items
  items: any[] = [
    {
      id: '101',
      stageId: '3',
      theme: 'yellow',
      data: {
        title: 'Purchase of Oil Wells',
        value: 20000,
        company: 'Evergreen Technologies',
        contactName: 'Karen Catalona',
        email: 'karencatalona@technologies.com',
        avatar: 'assets/img/project/home/employee1.webp',
        date: '13 February, 2026. 5:20 PM',
        priority: 'hot'
      }
    },
    {
      id: '102',
      stageId: '1',
      theme: 'blue',
      data: {
        title: 'Solar Farm Investment',
        value: 45000,
        company: 'SunGrid Energy',
        contactName: 'James Peterson',
        email: 'j.peterson@sungrid.com',
        avatar: 'assets/img/project/home/employee2.webp',
        date: '12 February, 2026. 11:00 AM',
        priority: 'hot'
      }
    },
    {
      id: '103',
      stageId: '1',
      theme: 'blue',
      data: {
        title: 'Wind Turbine Maintenance Contract',
        value: 15000,
        company: 'Aeolus Systems',
        contactName: 'Maria Velasquez',
        email: 'm.velasquez@aeolus.com',
        avatar: 'assets/img/project/home/employee3.webp',
        date: '10 February, 2026. 3:10 PM',
        priority: 'warm'
      }
    },
    {
      id: '104',
      stageId: '2',
      theme: 'red',
      data: {
        title: 'AI Data Center Expansion',
        value: 120000,
        company: 'NovaTech Industries',
        contactName: 'Robert Hill',
        email: 'robert.hill@novatech.com',
        avatar: 'assets/img/project/home/employee4.webp',
        date: '11 February, 2026. 9:30 AM',
        priority: 'cold'
      }
    },
    {
      id: '105',
      stageId: '2',
      theme: 'red',
      data: {
        title: 'Enterprise Security Upgrade',
        value: 32000,
        company: 'CyberShield Corp',
        contactName: 'Linda Park',
        email: 'lpark@cybershield.com',
        avatar: 'assets/img/project/home/employee5.webp',
        date: '9 February, 2026. 2:15 PM',
        priority: 'warm'
      }
    },
    {
      id: '106',
      stageId: '2',
      theme: 'red',
      data: {
        title: 'Healthcare Analytics Platform',
        value: 78000,
        company: 'MedCore Analytics',
        contactName: 'Daniel Jacobs',
        email: 'djacobs@medcore.com',
        avatar: 'assets/img/project/home/employee6.webp',
        date: '7 February, 2026. 1:00 PM',
        priority: 'hot'
      }
    },

    {
      id: '107',
      stageId: '1',
      theme: 'blue',
      data: {
        title: 'Cloud Migration Project',
        value: 56000,
        company: 'SkyNet Cloud',
        contactName: 'Emily Watson',
        email: 'emily.watson@skynet.com',
        avatar: 'assets/img/project/home/employee3.webp',
        date: '5 February, 2026. 4:45 PM',
        priority: 'cold'
      }
    },

    {
      id: '108',
      stageId: '3',
      theme: 'yellow',
      data: {
        title: 'Smart Factory Automation',
        value: 98000,
        company: 'AutoForge Ltd',
        contactName: 'Liam O’Connor',
        email: 'liam.oconnor@autoforge.com',
        avatar: 'assets/img/project/home/employee1.webp',
        date: '4 February, 2026. 10:10 AM',
        priority: 'hot'
      }
    },

    {
      id: '109',
      stageId: '3',
      theme: 'yellow',
      data: {
        title: 'Retail AI Recommendation Engine',
        value: 47000,
        company: 'ShopSense AI',
        contactName: 'Sophia Chen',
        email: 'sophia.chen@shopsense.ai',
        avatar: 'assets/img/project/home/employee2.webp',
        date: '3 February, 2026. 6:30 PM',
        priority: 'warm'
      }
    },

    {
      id: '110',
      stageId: '4',
      theme: 'green',
      data: {
        title: 'Airport Surveillance Upgrade',
        value: 210000,
        company: 'SecureVision Global',
        contactName: 'David Richardson',
        email: 'd.richardson@securevision.com',
        avatar: 'assets/img/project/home/employee3.webp',
        date: '1 February, 2026. 8:00 AM',
        priority: 'hot'
      }
    },

    {
      id: '111',
      stageId: '4',
      theme: 'green',
      data: {
        title: 'National Grid Monitoring System',
        value: 175000,
        company: 'PowerNet Infrastructure',
        contactName: 'Olivia Grant',
        email: 'olivia.grant@powernet.com',
        avatar: 'assets/img/project/home/employee4.webp',
        date: '31 January, 2026. 3:40 PM',
        priority: 'cold'
      }
    },

    {
      id: '112',
      stageId: '4',
      theme: 'green',
      data: {
        title: 'Telecom Network Upgrade',
        value: 89000,
        company: 'GlobalTel Communications',
        contactName: 'Marcus Allen',
        email: 'm.allen@globaltel.com',
        avatar: 'assets/img/project/home/employee5.webp',
        date: '28 January, 2026. 12:00 PM',
        priority: 'warm'
      }
    }

  ];

  tableFilters!: FilterConfig[];
  private search$ = new Subject<string>();
  private filters$ = new BehaviorSubject<any>({});
  private paging$ = new BehaviorSubject<{ page: number; pageSize: number }>({ page: 1, pageSize: 10 });
  private unsubscribe$ = new Subject<void>();

  // Paging object sent to dynamic-table
  paging = {
    page: 1,
    pageSize: 100,
    total: 0
  };

  constructor(
    private modalService: ModalService,
    private crmService: CrmService
  ) {}

  ngOnInit(): void {
    // Any additional setup
    forkJoin({
      agents: this.crmService.getAgents(1, 100),
      leads: this.crmService.getLeads(1, 100),
      contacts: this.crmService.getContacts(1, 100),
    }).subscribe(({ agents, leads, contacts }) => {
      this.agentsList = agents.data;
      this.leadsList = leads.data;
      this.contactsList = contacts.data
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
      //console.log('Employees', res)
      this.tableData = res.data;
      this.paging.total = res.totalRecords;
      this.isLoading = false;
    });

    // Trigger initial load
    this.search$.next('');
  }

  onCardMoved(event:any) {
    console.log('Card moved:', event);

    // Call API with the new stage
    this.updateCardStageOnServer(event.itemId, event.toStageId);

    // Keep parent as source of truth (recommended)
    const idx = this.items.findIndex(i => i.id === event.itemId);
    if (idx !== -1) {
      this.items[idx] = { ...this.items[idx], stageId: event.toStageId };
      this.items = [...this.items];
    }
  }

  updateCardStageOnServer(cardId: string, stageId: string) {
    console.log(`API call: move card ${cardId} to stage ${stageId}`);
    // Call your backend here
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

  // Optional: programmatically move a card
  // moveJohnDoeToProposal() {
  //   this.kanbanBoard.moveItem('101', '3', 0); // Move John Doe to Proposal stage
  // }
}