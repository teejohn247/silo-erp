import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeraTriggerComponent } from './zera-trigger.component';

describe('ZeraTriggerComponent', () => {
  let component: ZeraTriggerComponent;
  let fixture: ComponentFixture<ZeraTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZeraTriggerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZeraTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
