import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorsLogComponent } from './visitors-log.component';

describe('VisitorsLogComponent', () => {
  let component: VisitorsLogComponent;
  let fixture: ComponentFixture<VisitorsLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorsLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorsLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
