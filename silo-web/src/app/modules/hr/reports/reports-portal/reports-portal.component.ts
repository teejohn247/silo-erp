import { Component, OnInit } from '@angular/core';
import { HrService } from '@services/hr/hr.service';

@Component({
  selector: 'app-reports-portal',
  templateUrl: './reports-portal.component.html',
  styleUrl: './reports-portal.component.scss'
})
export class ReportsPortalComponent implements OnInit {

  tabMenu = [
    {
      routeLink: 'employees',
      label: 'Employees',
    },
    {
      routeLink: 'leave',
      label: 'Leave Reports',
    },
    {
      routeLink: 'expense',
      label: 'Expense Reports',
    },
    // {
    //   routeLink: 'attendance',
    //   label: 'Attendance',
    // }
  ]

  constructor(
    private hrService: HrService
  ) {}

  ngOnInit(): void {
    this.hrService.getReportsFilters();
  }
}
