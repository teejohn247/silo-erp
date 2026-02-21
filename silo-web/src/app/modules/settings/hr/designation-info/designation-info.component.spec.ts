import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationInfoComponent } from './designation-info.component';

describe('DesignationInfoComponent', () => {
  let component: DesignationInfoComponent;
  let fixture: ComponentFixture<DesignationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
