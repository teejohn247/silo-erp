import { Component } from '@angular/core';

@Component({
  selector: 'app-recruitment-portal',
  templateUrl: './recruitment-portal.component.html',
  styleUrl: './recruitment-portal.component.scss'
})
export class RecruitmentPortalComponent {
  tabMenu = [
    {
      routeLink: 'overview',
      label: 'Overview',
    },
    {
      routeLink: 'jobs',
      label: 'Job Board',
    },
    {
      routeLink: 'forms',
      label: 'Job Forms',
    },
  ]
}
