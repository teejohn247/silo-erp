import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseRequestsOverviewComponent } from './expense-requests-overview.component';

describe('ExpenseRequestsOverviewComponent', () => {
  let component: ExpenseRequestsOverviewComponent;
  let fixture: ComponentFixture<ExpenseRequestsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseRequestsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseRequestsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
