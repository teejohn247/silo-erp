import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingsPortalComponent } from './account-settings-portal.component';

describe('AccountSettingsPortalComponent', () => {
  let component: AccountSettingsPortalComponent;
  let fixture: ComponentFixture<AccountSettingsPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSettingsPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingsPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
