import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPeriodInfoComponent } from './payroll-period-info.component';

describe('PayrollPeriodInfoComponent', () => {
  let component: PayrollPeriodInfoComponent;
  let fixture: ComponentFixture<PayrollPeriodInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollPeriodInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollPeriodInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
