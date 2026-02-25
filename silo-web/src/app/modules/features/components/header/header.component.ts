import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@sharedWeb/services/utils/auth.service';
import { NotificationService } from '@sharedWeb/services/utils/notification.service';

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

  constructor(
    private route: Router,
    private authService: AuthService, 
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    if(this.userDetails.isSuperAdmin) {
      this.userName = this.userDetails.companyName;
      this.userRole = 'Super Admin';
      console.log('Logged In User', this.userDetails);
    }
    else if(this.userDetails.email == 'siloerp@silo-inc.com') {
      this.userName = this.userDetails.data.companyName;
      this.userRole = 'Silo Admin';
    }
    else {
      this.userName = this.userDetails.fullName;
      this.userRole = this.userDetails.companyRole;
      this.profilePhoto = this.userDetails.profilePic;
      console.log('profile photo', this.profilePhoto)
    }
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

}
