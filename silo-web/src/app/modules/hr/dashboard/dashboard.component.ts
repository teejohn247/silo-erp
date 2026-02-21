import { Component, OnInit } from '@angular/core';
import { authPageStagger } from '@animations/auth-page-animations';
import { AuthService } from '@sharedWeb/services/utils/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [authPageStagger]
})
export class DashboardComponent implements OnInit {
  loggedInUser:any;
  dateTime!: Date;
  dayStatus: string = '';

  announcements: any[] = [
    {
      timestamp: '2026-02-16T09:30:00Z',
      user: 'Alice Johnson',
      message: 'Quarterly financial results have been published. Please review the report in the company portal.'
    },
    {
      timestamp: '2026-02-16T11:15:00Z',
      user: 'Bob Martinez',
      message: 'Reminder: Team meeting scheduled at 3 PM today in Conference Room B.'
    },
    {
      timestamp: '2026-02-16T13:45:00Z',
      user: 'Clara Singh',
      message: 'New health and safety guidelines have been uploaded. All employees are required to acknowledge.'
    }
  ];

  expenseAnalysisColorScheme = {
    domain: ['rgba(54, 171, 104, 0.7)', 'rgba(229, 166, 71, 0.7)', 'rgba(66, 133, 244, 0.7)', 'rgba(235, 87, 87, 0.7)']
  };
  expenseAnalysisData = [
    {
      name: "Transportation",
      value: 25,
      status: "complete"
    },
    {
      name: "Accommodation",
      value: 45,
      status: "pending"
    },
    {
      name: "Hire Purchase",
      value: 120,
      status: "awaiting"
    },
    {
      name: "Legal Fees",
      value: 30,
      status: "warning"
    },
  ]

  payrollYear!: number;
  payrollYearOptions:any = {
    2024: '2024',
    2025: '2025',
    2026: '2026'  
  };

  keepOrder = () => 0;

  cardTriggerVal:string = 'birthdays';
  employeeList: any[] = [];
  birthdays!:any[];
  workAnniversaries!:any[];

  constructor(
    private authService: AuthService
  ) {
    setInterval(() => {
      this.dateTime = new Date();
      this.updateDayStatus();
    }, 1000)
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;

    this.generateUpcomingBithdays();
    this.generateUpcomingAnniversaries();
  }

  updateDayStatus() {
    const hour = this.dateTime.getHours();

    if (hour >= 5 && hour < 12) {
      this.dayStatus = 'morning';
    } else if (hour >= 12 && hour < 17) {
      this.dayStatus = 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      this.dayStatus = 'evening';
    } else {
      this.dayStatus = 'night';
    }
  }

  generateUpcomingBithdays() {
    this.birthdays = this.orderByUpcoming(this.employeeList, 'dateOfBirth')
  }

  generateUpcomingAnniversaries() {
    this.workAnniversaries = this.orderByUpcoming(this.employeeList, 'employmentStartDate')
  }

  orderByUpcoming(items:any[], dateKey:string) {
    const now = new Date();
    const nowMonth = now.getMonth();
    const nowDate = now.getDate();

    return items.slice().sort((a, b) => {
      const dA = new Date(a[dateKey]);
      const dB = new Date(b[dateKey]);

      const aMonthDay = { month: dA.getMonth(), day: dA.getDate() };
      const bMonthDay = { month: dB.getMonth(), day: dB.getDate() };

      const isAFuture = aMonthDay.month > nowMonth || (aMonthDay.month === nowMonth && aMonthDay.day >= nowDate);
      const isBFuture = bMonthDay.month > nowMonth || (bMonthDay.month === nowMonth && bMonthDay.day >= nowDate);

      if (isAFuture && !isBFuture) return -1;
      if (!isAFuture && isBFuture) return 1;

      // Compare month and day
      if (aMonthDay.month !== bMonthDay.month) {
        return aMonthDay.month - bMonthDay.month;
      }
      return aMonthDay.day - bMonthDay.day;
    });
  }

}
