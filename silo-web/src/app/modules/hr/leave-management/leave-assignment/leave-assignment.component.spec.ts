import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAssignmentComponent } from './leave-assignment.component';

describe('LeaveAssignmentComponent', () => {
  let component: LeaveAssignmentComponent;
  let fixture: ComponentFixture<LeaveAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
