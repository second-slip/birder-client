import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountManagerComponent } from './account-manager.component';
import { AccountManageAvatarComponent } from '../account-manage-avatar/account-manage-avatar.component';
import { AccountManageLocationComponent } from '../account-manage-location/account-manage-location.component';
import { AccountManagePasswordComponent } from '../account-manage-password/account-manage-password.component';
import { AccountManageProfileComponent } from '../account-manage-profile/account-manage-profile.component';
import { MockComponent } from 'ng-mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ɵDeferBlockBehavior } from '@angular/core';

describe('AccountManagerComponent', () => {
  let component: AccountManagerComponent;
  let fixture: ComponentFixture<AccountManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountManagerComponent, NoopAnimationsModule]
    })
      .overrideComponent(AccountManagerComponent, {
        remove: { imports: [AccountManageAvatarComponent, AccountManageLocationComponent, AccountManagePasswordComponent, AccountManageProfileComponent] },
        add: { imports: [MockComponent(AccountManageAvatarComponent), MockComponent(AccountManageLocationComponent), MockComponent(AccountManagePasswordComponent), MockComponent(AccountManageProfileComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
