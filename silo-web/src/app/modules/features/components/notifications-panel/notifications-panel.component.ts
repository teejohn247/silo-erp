import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrl: './notifications-panel.component.scss'
})
export class NotificationsPanelComponent implements OnInit {

  @Input() notifications:any;

  ngOnInit(): void {
      
  }

}
