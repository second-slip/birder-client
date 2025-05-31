import { ConfirmEmailResendComponent } from './confirm-email-resend.component';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  dispatchFakeEvent,
  expectText,
  expectTextToContain,
  findEl,
  setFieldValue,
} from 'src/app/testing/element.spec-helper';
import { AccountService } from '../account.service';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';

import { of, throwError } from 'rxjs';
import { emailModel, email } from 'src/app/testing/account-tests-helpers';

const requiredFields = ['email'];

describe('ConfirmEmailResendComponent', () => {
  let fixture: ComponentFixture<ConfirmEmailResendComponent>;
  let fakeAccountService: jasmine.SpyObj<AccountService>;

  const setup = async (
    fakeAccountServiceReturnValues?: jasmine.SpyObjMethodNames<AccountService>
  ) => {
    fakeAccountService = jasmine.createSpyObj<AccountService>(
      'AccountService',
      {
        isEmailTaken: undefined,
        isUsernameTaken: undefined,
        register: undefined,
        requestPasswordReset: undefined,
        resendEmailConfirmation: undefined,
        resetPassword: undefined,
        ...fakeAccountServiceReturnValues, // Overwrite with given return values
      }
    );

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ConfirmEmailResendComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AccountService, useValue: fakeAccountService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailResendComponent);
    fixture.detectChanges();
  };

  const fillForm = () => {
    setFieldValue(fixture, 'email', email);
  };

  it('submits the form successfully', async () => {
    await setup({
      resendEmailConfirmation: of({ success: true }),
    });

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    fillForm();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('[data-testid="success"]')?.textContent
    ).toBeUndefined();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(false);

    findEl(fixture, 'resendConfirmEmailForm').triggerEventHandler('submit', {});

    fixture.detectChanges();

    expectText(
      fixture,
      'success',
      'Success! An email confirmation has been sent to your inbox. '
    );

    expect(fakeAccountService.resendEmailConfirmation).toHaveBeenCalledWith(
      jasmine.objectContaining(emailModel)
    );
  });

  it('handles errors', async () => {
    await setup({
      // Let the API report a failure
      resendEmailConfirmation: throwError(() => new Error('test')), // throwError(new Error('Validation failed')),
    });

    fillForm();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('[data-testid="error"]')?.textContent
    ).toBeUndefined();

    findEl(fixture, 'resendConfirmEmailForm').triggerEventHandler('submit', {});
    fixture.detectChanges();

    expectText(fixture, 'error', ' An error occurred. Please try again ');

    expect(fakeAccountService.resendEmailConfirmation).toHaveBeenCalledWith(
      jasmine.objectContaining(emailModel)
    );
  });

  // This should not happen as the 'submit' button should be disabled, but:
  it('does not submit an invalid form', async () => {
    await setup();

    //tick(1000) no async validators

    findEl(fixture, 'resendConfirmEmailForm').triggerEventHandler('submit', {});

    expect(fakeAccountService.resendEmailConfirmation).not.toHaveBeenCalled();
  });

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
      expect(el.attributes['required']).toBe(
        //['aria-required']).toBe(
        '',
        `${testId} must be marked as aria-required`
      );

      // check error message is displayed
      expectTextToContain(fixture, `${testId}-error`, `Email is required`);
    });
  });
});
