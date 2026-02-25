import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '@models/general/menu-item';
import { AuthService } from '@sharedWeb/services/utils/auth.service';
import { NotificationService } from '@sharedWeb/services/utils/notification.service';
import { UtilityService } from '@sharedWeb/services/utils/utility.service';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  @Input() userDetails:any;
  collapsed = false;
  navMenuInfo:MenuItem[] = [];

  currentLink = 'Human Resources';

  constructor(
    private route: Router,
    private utilityService: UtilityService,
    private notifyService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initMenu();
    this.menuLinksConfig();    
  }

  initMenu() {
    this.navMenuInfo = this.utilityService.userMenu;
    //console.log('User', this.userDetails)
  }

  menuLinksConfig() {
    if(this.userDetails.isSuperAdmin) {
      this.collapsed = false;
      this.currentLink = 'Human Resources';
    };
    let urlsplit = this.route.url?.split("/");
    console.log(urlsplit);
    if(urlsplit[2] == 'hr') this.currentLink = 'Human Resources';
    if(urlsplit[2] == 'crm') this.currentLink = 'CRM';
    if(urlsplit[2] == 'settings') this.currentLink = 'Settings';
    //console.log('User', this.userDetails)
  }

  logOut() {
    this.notifyService.confirmAction({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logOut();
      }
    });
  }
}
