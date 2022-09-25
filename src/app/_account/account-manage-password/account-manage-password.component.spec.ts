import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from 'src/app/_auth/login/login.component';
import { AccountValidationService } from '../account-validation.service';
import { AccountService } from '../account.service';
import { AccountManagePasswordComponent } from './account-manage-password.component';
import {
  confirmPassword,
  oldPassword,
  changePasswordModel,
  newPassword,
  password
} from 'src/app/testing/account-tests-helpers';
import { dispatchFakeEvent, expectText, findEl, setFieldValue } from 'src/app/testing/element.spec-helper';

const requiredFields = [
  'oldPassword',
  'password',
  'confirmPassword'
];

describe('AccountManagePasswordComponent', () => {
  let component: AccountManagePasswordComponent;
  let fixture: ComponentFixture<AccountManagePasswordComponent>;
  let fakeAccountService: jasmine.SpyObj<AccountService>;
  let fakeValidationService: jasmine.SpyObj<AccountValidationService>;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }

  const setup = async (
    fakeAccountServiceReturnValues?: jasmine.SpyObjMethodNames<AccountService>,
    fakeValidationReturnValues?: jasmine.SpyObjMethodNames<AccountValidationService>
  ) => {

    fakeAccountService = jasmine.createSpyObj<AccountService>(
      'AccountService',
      {
        isEmailTaken: of(false),
        isUsernameTaken: of(false),
        register: undefined,
        requestPasswordReset: undefined,
        resendEmailConfirmation: undefined,
        resetPassword: undefined,
        getUserProfile: undefined,
        postChangePassword: undefined,
        postUpdateLocation: undefined,
        postUpdateProfile: undefined,
        ...fakeAccountServiceReturnValues // Overwrite with given return values
      }
    );

    fakeValidationService = jasmine.createSpyObj<AccountValidationService>(
      'AccountValidationService',
      {
        validateEmail: of(null),
        validateUsername: of(null),
        account_validation_messages: undefined,
        ...fakeValidationReturnValues
      }
    );

    await TestBed.configureTestingModule({
      declarations: [
        AccountManagePasswordComponent
      ],
      imports: [FormsModule, ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
        ])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AccountValidationService, useValue: fakeValidationService },
        { provide: AccountService, useValue: fakeAccountService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountManagePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', fakeAsync(async () => {
    await setup();
    expect(component).toBeTruthy();
  }));

  const fillForm = () => {
    setFieldValue(fixture, 'oldPassword', oldPassword)
    setFieldValue(fixture, 'password', password);
    setFieldValue(fixture, 'confirmPassword', confirmPassword);
  };

  const markFieldAsTouched = (element: DebugElement) => {
    dispatchFakeEvent(element.nativeElement, 'blur');
  };

  it('submits the form successfully', fakeAsync(async () => {
    await setup(
      {
        postChangePassword: of({ success: true }),
      }
    );

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    fillForm();
    // Mark required fields as touched (update on blur)
    requiredFields.forEach((testId) => {
      markFieldAsTouched(findEl(fixture, testId));
    });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeUndefined();

    findEl(fixture, 'changePasswordForm').triggerEventHandler('submit', {});

    tick(1000);
    fixture.detectChanges();

    expectText(fixture, 'success', "Success! You have successfully changed your password ");
    expect(fakeAccountService.postChangePassword).toHaveBeenCalledWith(changePasswordModel);

    const isFormHidden = fixture.nativeElement as HTMLElement;
    expect(isFormHidden.querySelector('[data-testid="userRegisterForm"]')?.textContent).toBeUndefined();
  }));

  it('handles errors', fakeAsync(async () => {

    await setup({
      // Let the API report a failure
      postChangePassword: throwError(() => new Error('test')), // throwError(new Error('Validation failed')),
    });

    fillForm();
    // Mark required fields as touched (update on blur)
    requiredFields.forEach((testId) => {
      markFieldAsTouched(findEl(fixture, testId));
    });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

    findEl(fixture, 'changePasswordForm').triggerEventHandler('submit', {});

    fixture.detectChanges();

    expectText(fixture, 'error', 'Whoops! An error occurred. Please try again. ');

    expect(fakeAccountService.postChangePassword).toHaveBeenCalledWith(changePasswordModel);
  }));

  it('does not submit an invalid form', fakeAsync(async () => {
    await setup();

    findEl(fixture, 'changePasswordForm').triggerEventHandler('submit', {});

    expect(fakeAccountService.postChangePassword).not.toHaveBeenCalled();
  }));

  it('marks fields as required', async () => {

    await setup();

    // Mark required fields as touched
    requiredFields.forEach((testId) => {
      markFieldAsTouched(findEl(fixture, testId));
    });

    fixture.detectChanges();

    requiredFields.forEach((testId) => {
      const el = findEl(fixture, testId);

      // Check aria-required attribute
      expect(el.attributes['required']).toBe(  //['aria-required']).toBe(
        '',
        `${testId} must be marked as aria-required`,
      );
    });
  });
});