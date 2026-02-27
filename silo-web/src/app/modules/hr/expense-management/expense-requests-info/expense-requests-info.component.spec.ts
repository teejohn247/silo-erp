import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseRequestsInfoComponent } from './expense-requests-info.component';

describe('ExpenseRequestsInfoComponent', () => {
  let component: ExpenseRequestsInfoComponent;
  let fixture: ComponentFixture<ExpenseRequestsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseRequestsInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseRequestsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
