import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestInfoComponent } from './leave-request-info.component';

describe('LeaveRequestInfoComponent', () => {
  let component: LeaveRequestInfoComponent;
  let fixture: ComponentFixture<LeaveRequestInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRequestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
