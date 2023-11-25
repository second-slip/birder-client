import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { dispatchFakeEvent, expectText, expectTextToContain, findEl, setFieldValue } from 'src/app/testing/element.spec-helper';
import { AccountService } from '../account.service';
import { DebugElement } from '@angular/core';
import { ForgotPasswordComponent } from './forgot-password.component';
import { of, throwError } from 'rxjs';
import {
  emailModel,
  email
} from 'src/app/testing/account-tests-helpers';

const requiredFields = [
  'email'
];

describe('ForgotPasswordComponent', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;
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

    await TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, ForgotPasswordComponent],
    providers: [{ provide: AccountService, useValue: fakeAccountService }]
}).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    fixture.detectChanges();
  };

  const fillForm = () => {
    setFieldValue(fixture, 'email', email);
  };

  it('submits the form successfully', fakeAsync(async () => {
    await setup(
      {
        requestPasswordReset: of({ success: true })
      }
    );

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    fillForm();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeUndefined();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(false);

    findEl(fixture, 'requestPasswordResetForm').triggerEventHandler('submit', {});

    tick(1000);
    fixture.detectChanges();

    expectText(fixture, 'success', "Success! We've sent you an email. Check your inbox and follow the instructions to reset your password. ");

    expect(fakeAccountService.requestPasswordReset).toHaveBeenCalledWith(jasmine.objectContaining(emailModel));
  }));

  it('handles errors', fakeAsync(async () => {

    await setup({
      // Let the API report a failure
      requestPasswordReset: throwError(() => new Error('test')) // throwError(new Error('Validation failed')),
    });

    fillForm();

    tick(1000);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

    findEl(fixture, 'requestPasswordResetForm').triggerEventHandler('submit', {});
    fixture.detectChanges();

    expectText(fixture, 'error', ' An error occurred. Please try again ');

    expect(fakeAccountService.requestPasswordReset).toHaveBeenCalledWith(jasmine.objectContaining(emailModel));
  }));


  // This should not happen as the 'submit' button should be disabled, but:
  it('does not submit an invalid form', fakeAsync(async () => {
    await setup();

    //tick(1000) bot async validators

    findEl(fixture, 'requestPasswordResetForm').triggerEventHandler('submit', {});

    expect(fakeAccountService.requestPasswordReset).not.toHaveBeenCalled();
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

      // check error message is displayed
      expectTextToContain(fixture, `${testId}-error`, `Email is required`);
    });
  });
});