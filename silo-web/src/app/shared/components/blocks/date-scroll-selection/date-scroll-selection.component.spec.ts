import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateScrollSelectionComponent } from './date-scroll-selection.component';

describe('DateScrollSelectionComponent', () => {
  let component: DateScrollSelectionComponent;
  let fixture: ComponentFixture<DateScrollSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateScrollSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateScrollSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
