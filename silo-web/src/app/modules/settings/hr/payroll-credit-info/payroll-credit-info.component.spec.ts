import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollCreditInfoComponent } from './payroll-credit-info.component';

describe('PayrollCreditInfoComponent', () => {
  let component: PayrollCreditInfoComponent;
  let fixture: ComponentFixture<PayrollCreditInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollCreditInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollCreditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
