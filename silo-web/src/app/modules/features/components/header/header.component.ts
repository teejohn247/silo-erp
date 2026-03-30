import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@services/settings/settings.service';
import { ModalService } from '@services/utils/modal.service';
import { AuthService } from '@sharedWeb/services/utils/auth.service';
import { NotificationService } from '@sharedWeb/services/utils/notification.service';
import { PlatformSupportInfoComponent } from '../platform-support-info/platform-support-info.component';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  @Input() userDetails:any;
  userName!:string;
  userRole!:string;
  profilePhoto!: string;
  sideModalOpened:boolean = false;
  currentLink = 'Human Resources';
  systemAdminLoggedIn: boolean = false;

  notifications:any[] = [];
  notificationBadgeCount:number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private modalService: ModalService,
    private settingsService: SettingsService,
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.systemAdminLoggedIn = this.userDetails.email === 'superadmin@siloerp.io';
    if(this.userDetails.isSuperAdmin) {
      this.userName = this.userDetails.companyName;
      this.userRole = 'Super Admin';
      console.log('Logged In User', this.userDetails);
    }
    else if(this.systemAdminLoggedIn) {
      this.userName = this.userDetails.companyName;
      this.userRole = 'Silo Admin';
    }
    else {
      this.userName = this.userDetails.fullName;
      this.userRole = this.userDetails.companyRole;
      this.profilePhoto = this.userDetails.profilePic;
      console.log('profile photo', this.profilePhoto)
    }

    this.getNotifications();
  }

  //Logout function
  logout() {
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

  goToCalendar() {
    this.router.navigateByUrl('/app/hr/calendar');
  }

  getNotifications() {
    this.settingsService.pollNotifications(600000).subscribe(res => { 
      const raw = res.data; // this is already an array

      // 1. Sort unread first
      const sorted = raw.sort((a:any, b:any) => Number(a.read) - Number(b.read));

      // 2. Count unread
      this.notificationBadgeCount = sorted.filter((n:any) => !n.read).length;

      // 3. Build the display list (max 5)
      const unread = sorted.filter((n:any) => !n.read);
      const read = sorted.filter((n:any) => n.read);

      if (unread.length >= 5) {
        // show only unread (max 5)
        this.notifications = unread.slice(0, 5);
      } 
      else {
        // show all unread + fill with read
        const remaining = 5 - unread.length;
        this.notifications = [
          ...unread,
          ...read.slice(0, remaining)
        ];
      }

      console.log('Notifications (processed)', this.notifications);
    });
  }

  markAllAsRead() {
    const unread = this.notifications.filter(n => !n.read);
    if (unread.length === 0) return;

    unread.forEach(n => {
      this.settingsService.readNotification(n._id).subscribe((res) => {
        if (res.success) { 
          n.read = true;
          this.notificationBadgeCount--;
        }
      });
    });    
  }

  openSupportModal() {
    const modalConfig:any = {
      isExisting: false,
      width: '40%',
    }
    this.modalService.open(
      PlatformSupportInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        
      }
    });
  }

}
