import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollDebitInfoComponent } from './payroll-debit-info.component';

describe('PayrollDebitInfoComponent', () => {
  let component: PayrollDebitInfoComponent;
  let fixture: ComponentFixture<PayrollDebitInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollDebitInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollDebitInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
