import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManageAvatarComponent } from './account-manage-avatar.component';

describe('AccountManageAvatarComponent', () => {
  let component: AccountManageAvatarComponent;
  let fixture: ComponentFixture<AccountManageAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountManageAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountManageAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
