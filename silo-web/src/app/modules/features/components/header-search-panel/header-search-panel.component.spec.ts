import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSearchPanelComponent } from './header-search-panel.component';

describe('HeaderSearchPanelComponent', () => {
  let component: HeaderSearchPanelComponent;
  let fixture: ComponentFixture<HeaderSearchPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSearchPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderSearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
