import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformSupportInfoComponent } from './platform-support-info.component';

describe('PlatformSupportInfoComponent', () => {
  let component: PlatformSupportInfoComponent;
  let fixture: ComponentFixture<PlatformSupportInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformSupportInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformSupportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
