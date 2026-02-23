import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveManagementOverviewComponent } from './leave-management-overview.component';

describe('LeaveManagementOverviewComponent', () => {
  let component: LeaveManagementOverviewComponent;
  let fixture: ComponentFixture<LeaveManagementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveManagementOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveManagementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
