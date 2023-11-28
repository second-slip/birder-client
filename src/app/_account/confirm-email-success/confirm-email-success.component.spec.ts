import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailSuccessComponent } from './confirm-email-success.component';
import { LoginComponent } from 'src/app/_auth/login/login.component';
import { MockComponent } from 'ng-mocks';

describe('ConfirmEmailSuccessComponent', () => {
  let component: ConfirmEmailSuccessComponent;
  let fixture: ComponentFixture<ConfirmEmailSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEmailSuccessComponent]
    })
      .overrideComponent(ConfirmEmailSuccessComponent, {
        remove: { imports: [LoginComponent] },
        add: { imports: [MockComponent(LoginComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
