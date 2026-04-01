import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-deals-card',
  templateUrl: './deals-card.component.html',
  styleUrl: './deals-card.component.scss'
})
export class DealsCardComponent implements OnInit {
  currency: any;
  @Input() menuActions: any[] = [
    {
      icon: 'view',
      label: 'View',
      color: 'var(--blue-theme)', 
      tooltip: 'View',
      actionKey: 'view'
    },
    {
      icon: 'userPen',
      label: 'Edit',
      color: 'var(--yellow-theme)', 
      tooltip: 'Edit',
      actionKey: 'edit'
    },
    {
      icon: 'trash',
      label: 'Delete',
      color: 'var(--red-theme)', 
      tooltip: 'Delete',
      actionKey: 'delete'
    },
  ];
  @Output() actionClick = new EventEmitter<{action: string; row: any;}>();
  
  constructor(
    @Inject('KANBAN_CARD_DATA') public data: any,
    @Inject('KANBAN_CARD_THEME') public theme: string,
    private utils: UtilityService
  ) {}

  ngOnInit(): void {
    //console.log(this.data)
    this.currency = this.utils.currency;
  }

  handleActionClick(action: any, row: any, event: Event) {
    event.stopPropagation();

    // If using actionKey → emit to parent
    if (action.actionKey) {
      this.actionClick.emit({
        action: action.actionKey,
        row
      });
    }
  }

  openMenu(event: MouseEvent, trigger: MatMenuTrigger) {
    console.log('Action Called')
    event.stopPropagation();
    event.preventDefault();
    trigger.openMenu();
  }

  triggerAction() {
    console.log('Action Called')
  }
}
