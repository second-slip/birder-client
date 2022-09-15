import { ResetPasswordComponent } from './reset-password.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { dispatchFakeEvent, expectText, findEl, setFieldValue } from 'src/app/testing/element.spec-helper';
import { AccountService } from '../account.service';
import { DebugElement } from '@angular/core';

import { of, throwError } from 'rxjs';
import {
  resetPasswordModel,
  password,
  confirmPassword,
  email,
  code
} from 'src/app/testing/account-tests-helpers';
import { ActivatedRoute } from '@angular/router';

const requiredFields = [
  'email',
  'password',
  'confirmPassword'
];

describe('ResetPasswordComponent', () => {
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let fakeAccountService: jasmine.SpyObj<AccountService>;

  const setup = async (
    fakeAccountServiceReturnValues?: jasmine.SpyObjMethodNames<AccountService>) => {

    fakeAccountService = jasmine.createSpyObj<AccountService>(
      'AccountService',
      {
        isEmailTaken: undefined,
        isUsernameTaken: undefined,
        register: undefined,
        requestPasswordReset: undefined,
        resendEmailConfirmation: undefined,
        resetPassword: undefined,
        ...fakeAccountServiceReturnValues // Overwrite with given return values
      }
    );

    const obj = {
      code: code
    };

    await TestBed.configureTestingModule({
      declarations: [
        ResetPasswordComponent
      ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map(Object.entries(obj)))
            // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
            // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
          }
        },
        { provide: AccountService, useValue: fakeAccountService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    fixture.detectChanges();
  };


  const fillForm = () => {
    setFieldValue(fixture, 'email', email);
    setFieldValue(fixture, 'password', password);
    setFieldValue(fixture, 'confirmPassword', confirmPassword);
  };


  it('submits the form successfully', fakeAsync(async () => {
    await setup(
      {
        resetPassword: of({ success: true })
      }
    );

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    fillForm();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeUndefined();

    // expect(findEl(fixture, 'submit').properties.disabled).toBe(false);

    findEl(fixture, 'resetPasswordForm').triggerEventHandler('submit', {});

    tick(1000);
    fixture.detectChanges();

    expectText(fixture, 'success', "Success! Your password was reset. Login");

    expect(fakeAccountService.resetPassword).toHaveBeenCalledWith(resetPasswordModel);

    const isFormHidden = fixture.nativeElement as HTMLElement;
    expect(isFormHidden.querySelector('[data-testid="resetPasswordForm"]')?.textContent).toBeUndefined();
  }));

  it('handles errors', fakeAsync(async () => {

    await setup({
      // Let the API report a failure
      resetPassword: throwError(() => new Error('test')) // throwError(new Error('Validation failed')),
    });

    fillForm();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

    findEl(fixture, 'resetPasswordForm').triggerEventHandler('submit', {});

    fixture.detectChanges();
    
    expectText(fixture, 'error', 'Whoops! An error occurred. Please try again.');

    expect(fakeAccountService.resetPassword).toHaveBeenCalledWith(resetPasswordModel);
  }));


  // This should not happen as the 'submit' button should be disabled, but:
  it('does not submit an invalid form', fakeAsync(async () => {
    await setup();

    tick(1000); //no async validators

    findEl(fixture, 'resetPasswordForm').triggerEventHandler('submit', {});

    expect(fakeAccountService.resetPassword).not.toHaveBeenCalled();
  }));

  const markFieldAsTouched = (element: DebugElement) => {
    dispatchFakeEvent(element.nativeElement, 'blur');
  };

  it('marks fields as required', async () => {

    await setup();

    // Mark required fields as touched
    requiredFields.forEach((testId) => {
      markFieldAsTouched(findEl(fixture, testId));
      // console.log(el.attributes)
      // changes ng-untouched to ng-touched
      // e.g.: 'form-control ng-touched ng-pristine ng-invalid'
    });

    fixture.detectChanges();

    requiredFields.forEach((testId) => {
      const el = findEl(fixture, testId);

      // console.log(el);
      // console.log(el.attributes);

      // Check aria-required attribute
      expect(el.attributes['required']).toBe(  //['aria-required']).toBe(
        '',
        `${testId} must be marked as aria-required`,
      );

    });

      // check error message is displayed
      expectText(fixture, `email-error`, ` Email is required `);
      expectText(fixture, `password-error`, ` Your new password is required `);
      expectText(fixture, `confirmPassword-error`, ` You must confirm your new password`);
  });
});