import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseManagementOverviewComponent } from './expense-management-overview.component';

describe('ExpenseManagementOverviewComponent', () => {
  let component: ExpenseManagementOverviewComponent;
  let fixture: ComponentFixture<ExpenseManagementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseManagementOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseManagementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
