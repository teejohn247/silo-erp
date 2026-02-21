import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPermissionManagementComponent } from './roles-permission-management.component';

describe('RolesPermissionManagementComponent', () => {
  let component: RolesPermissionManagementComponent;
  let fixture: ComponentFixture<RolesPermissionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesPermissionManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesPermissionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
