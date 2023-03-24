import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { manageProfileModel } from 'src/app/testing/account-tests-helpers';
import { userModel } from 'src/app/testing/auth-test-helpers';
import { dispatchFakeEvent, expectText, findEl, setFieldValue } from 'src/app/testing/element.spec-helper';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { LoginComponent } from 'src/app/_auth/login/login.component';
import { AccountValidationService } from '../account-validation.service';
import { AccountService } from '../account.service';
import { ConfirmEmailComponent } from '../confirm-email/confirm-email.component';

import { AccountManageProfileComponent } from './account-manage-profile.component';

const requiredFields = [
  'username',
  'email'
];

describe('AccountManageProfileComponent', () => {
  let component: AccountManageProfileComponent;
  let fixture: ComponentFixture<AccountManageProfileComponent>;
  let fakeAccountService: jasmine.SpyObj<AccountService>;
  let fakeValidationService: jasmine.SpyObj<AccountValidationService>;
  let fakeAuthService: jasmine.SpyObj<AuthenticationService>;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }

  const setup = async (
    fakeAccountServiceReturnValues?: jasmine.SpyObjMethodNames<AccountService>,
    fakeValidationReturnValues?: jasmine.SpyObjMethodNames<AccountValidationService>) => {

    fakeAccountService = jasmine.createSpyObj<AccountService>(
      'AccountService',
      {
        isEmailTaken: of(false),
        isUsernameTaken: of(false),
        register: undefined,
        requestPasswordReset: undefined,
        resendEmailConfirmation: undefined,
        resetPassword: undefined,
        getUserProfile: of(manageProfileModel),
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

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined,
        // ...fakeAuthReturnValues
      },
      {
        isAuthorisedObservable: of(false),
        getAuthUser: of(userModel),
        // ...fakeAuthPropertyValues
      },
    )

    await TestBed.configureTestingModule({
      declarations: [
        AccountManageProfileComponent
      ],
      imports: [FormsModule, ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
          { path: 'confirm-email', component: ConfirmEmailComponent }
        ])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AccountValidationService, useValue: fakeValidationService },
        { provide: AccountService, useValue: fakeAccountService },
        { provide: AuthenticationService, useValue: fakeAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountManageProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', fakeAsync(async () => {
    await setup();
    expect(component).toBeTruthy();
  }));

  const markFieldAsTouched = (element: DebugElement) => {
    dispatchFakeEvent(element.nativeElement, 'blur');
  };

  it('submits the form successfully', fakeAsync(async () => {
    await setup(
      {
        getUserProfile: of(manageProfileModel),
        postUpdateProfile: of(true)
      }
    );

    // Mark required fields as touched (update on blur)
    requiredFields.forEach((testId) => {
      markFieldAsTouched(findEl(fixture, testId));
    });

    tick(1000);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeUndefined();

    findEl(fixture, 'manageProfileForm').triggerEventHandler('submit', {});

    tick(1000);
    fixture.detectChanges();

    expectText(fixture, 'success', "Success! You have updated your profile ");
    expect(fakeAccountService.postUpdateProfile).toHaveBeenCalledWith(manageProfileModel);

    const isFormHidden = fixture.nativeElement as HTMLElement;
    expect(isFormHidden.querySelector('[data-testid="manageProfileForm"]')?.textContent).toBeUndefined();
  }));

  it('handles errors', fakeAsync(async () => {

    await setup({
      // Let the API report a failure
      getUserProfile: of(manageProfileModel),
      postUpdateProfile: throwError(() => new Error('test')), // throwError(new Error('Validation failed')),
    });

    //fillForm();
    // Mark required fields as touched (update on blur)
    requiredFields.forEach((testId) => {
      markFieldAsTouched(findEl(fixture, testId));
    });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

    findEl(fixture, 'manageProfileForm').triggerEventHandler('submit', {});

    // tick(1000);
    fixture.detectChanges();

    expectText(fixture, 'error', 'Whoops! An error occurred. Please try again.');
    expect(fakeAccountService.postUpdateProfile).toHaveBeenCalledWith(manageProfileModel);
  }));

  it('does not submit an invalid form', fakeAsync(async () => {
    await setup();

    findEl(fixture, 'manageProfileForm').triggerEventHandler('submit', {});

    expect(fakeAccountService.register).not.toHaveBeenCalled();
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