import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancePortalComponent } from './attendance-portal.component';

describe('AttendancePortalComponent', () => {
  let component: AttendancePortalComponent;
  let fixture: ComponentFixture<AttendancePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendancePortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendancePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
