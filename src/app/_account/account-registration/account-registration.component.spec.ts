import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AccountRegistrationComponent } from './account-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { dispatchFakeEvent, expectText, findEl, setFieldValue } from 'src/app/testing/element.spec-helper';
import { AccountService } from '../account.service';
import { DebugElement } from '@angular/core';

import { of, throwError } from 'rxjs';
import {
  registerModel,
  username,
  password,
  confirmPassword,
  email
} from 'src/app/testing/account-tests-helpers';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountValidationService } from '../account-validation.service';
import { ConfirmEmailComponent } from '../confirm-email/confirm-email.component';
import { Router } from '@angular/router';

const requiredFields = [
  'username',
  'email',
  'password',
  'confirmPassword'
];

describe('AccountRegistrationComponent', () => {
  let fixture: ComponentFixture<AccountRegistrationComponent>;
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
        isEmailTaken: undefined,
        isUsernameTaken: undefined,
        register: undefined,
        requestPasswordReset: undefined,
        resendEmailConfirmation: undefined,
        resetPassword: undefined,
        ...fakeAccountServiceReturnValues // Overwrite with given return values
      }
    );

    fakeValidationService = jasmine.createSpyObj<AccountValidationService>(
      'AccountValidationService',
      {
        validateEmail: undefined,
        validateUsername: undefined,
        ...fakeValidationReturnValues
      }
    );

    await TestBed.configureTestingModule({
      declarations: [
        AccountRegistrationComponent
      ],
      imports: [FormsModule, ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'confirm-email', component: ConfirmEmailComponent },
        ])],
      providers: [
        { provide: AccountValidationService, useValue: fakeValidationService },
        { provide: AccountService, useValue: fakeAccountService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountRegistrationComponent);
    fixture.detectChanges();
  };


  const fillForm = () => {
    setFieldValue(fixture, 'username', username)
    setFieldValue(fixture, 'email', email);
    setFieldValue(fixture, 'password', password);
    setFieldValue(fixture, 'confirmPassword', confirmPassword);
  };

  it('submits the form successfully', fakeAsync(async () => {
    await setup(
      {
        register: of({ success: true })
      },
      {
        validateEmail: of(null),
        validateUsername: of(null)
      }
    );

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    fillForm();
    // Mark required fields as touched (update on blur)
    requiredFields.forEach((testId) => {
      markFieldAsTouched(findEl(fixture, testId));
    });
    fixture.detectChanges();
    tick(10000);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeUndefined();

    // expect(findEl(fixture, 'submit').properties.disabled).toBe(false);

    findEl(fixture, 'userRegisterForm').triggerEventHandler('submit', {});

    tick(1000);
    fixture.detectChanges();

    expectText(fixture, 'success', "Success! You have successfully registered Login");
    expect(fakeValidationService.validateEmail).toHaveBeenCalledWith(email);
    expect(fakeValidationService.validateUsername).toHaveBeenCalledWith(username);
    expect(fakeAccountService.register).toHaveBeenCalledWith(registerModel);
    //expect(router.navigate).toHaveBeenCalledWith(['/confirm-email']);

    const isFormHidden = fixture.nativeElement as HTMLElement;
    expect(isFormHidden.querySelector('[data-testid="userRegisterForm"]')?.textContent).toBeUndefined();
  }));

  it('handles errors', fakeAsync(async () => {

    await setup({
      // Let the API report a failure
      register: throwError(() => new Error('test')) // throwError(new Error('Validation failed')),
    },
      {
        validateEmail: of(null),
        validateUsername: of(null)
      });

      fillForm();
      // Mark required fields as touched (update on blur)
      requiredFields.forEach((testId) => {
        markFieldAsTouched(findEl(fixture, testId));
      });
      fixture.detectChanges();
      tick(10000);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

    findEl(fixture, 'userRegisterForm').triggerEventHandler('submit', {});

    fixture.detectChanges();

    expectText(fixture, 'error', 'Whoops! An error occurred. Please try again.');

    expect(fakeAccountService.register).toHaveBeenCalledWith(registerModel);
    expect(fakeValidationService.validateEmail).toHaveBeenCalledWith(email);
    expect(fakeValidationService.validateUsername).toHaveBeenCalledWith(username);
  }));


  // This should not happen as the 'submit' button should be disabled, but:
  it('does not submit an invalid form', fakeAsync(async () => {
    await setup();

    tick(1000); // async validators

    findEl(fixture, 'userRegisterForm').triggerEventHandler('submit', {});

    expect(fakeAccountService.register).not.toHaveBeenCalled();
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
    expectText(fixture, `username-error`, ` Username is required `);
    expectText(fixture, `email-error`, ` Email is required `);
    expectText(fixture, `password-error`, ` Password is required `);
    expectText(fixture, `confirmPassword-error`, ` Confirm password is required`);
  });
});
