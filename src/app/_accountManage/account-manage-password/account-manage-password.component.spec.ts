import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagePasswordComponent } from './account-manage-password.component';

describe('AccountManagePasswordComponent', () => {
  let component: AccountManagePasswordComponent;
  let fixture: ComponentFixture<AccountManagePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountManagePasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountManagePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
