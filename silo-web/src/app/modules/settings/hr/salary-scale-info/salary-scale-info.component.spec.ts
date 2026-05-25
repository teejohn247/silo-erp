import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryScaleInfoComponent } from './salary-scale-info.component';

describe('SalaryScaleInfoComponent', () => {
  let component: SalaryScaleInfoComponent;
  let fixture: ComponentFixture<SalaryScaleInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryScaleInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryScaleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
