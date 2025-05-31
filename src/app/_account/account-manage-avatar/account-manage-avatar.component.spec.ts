import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManageAvatarComponent } from './account-manage-avatar.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('AccountManageAvatarComponent', () => {
  let component: AccountManageAvatarComponent;
  let fixture: ComponentFixture<AccountManageAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountManageAvatarComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
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
