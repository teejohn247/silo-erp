import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTypeInfoComponent } from './expense-type-info.component';

describe('ExpenseTypeInfoComponent', () => {
  let component: ExpenseTypeInfoComponent;
  let fixture: ComponentFixture<ExpenseTypeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseTypeInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseTypeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
