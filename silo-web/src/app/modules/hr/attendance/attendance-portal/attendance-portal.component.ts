import { Component } from '@angular/core';

@Component({
  selector: 'app-attendance-portal',
  templateUrl: './attendance-portal.component.html',
  styleUrl: './attendance-portal.component.scss'
})
export class AttendancePortalComponent {

  tabMenu = [
    {
      routeLink: 'attendance',
      label: 'Attendance',
    },
    {
      routeLink: 'visitors',
      label: 'Visitors Log',
    }
  ]
}
