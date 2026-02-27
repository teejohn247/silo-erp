import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestsOverviewComponent } from './leave-requests-overview.component';

describe('LeaveRequestsOverviewComponent', () => {
  let component: LeaveRequestsOverviewComponent;
  let fixture: ComponentFixture<LeaveRequestsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRequestsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
