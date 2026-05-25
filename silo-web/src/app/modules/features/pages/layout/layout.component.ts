import { Component, OnInit } from '@angular/core';
import { AuthService } from '@sharedWeb/services/utils/auth.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  userDetails: any;
  rightPanelOpen = false;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userDetails = this.authService.loggedInUser;
  }

  toggleRightPanel() {
    this.rightPanelOpen = !this.rightPanelOpen;
  }

}
