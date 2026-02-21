import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayInfoComponent } from './holiday-info.component';

describe('HolidayInfoComponent', () => {
  let component: HolidayInfoComponent;
  let fixture: ComponentFixture<HolidayInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidayInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidayInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
