import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';


import { of } from 'rxjs';
import { email } from '../testing/account-tests-helpers';

import { AccountValidationService } from './account-validation.service';
import { AccountService } from './account.service';

describe('AccountValidationService', () => {
  let service: AccountValidationService;
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
        getUserProfile: undefined,
        postChangePassword: undefined,
        postUpdateLocation: undefined,
        postUpdateProfile: undefined,
        ...fakeAccountServiceReturnValues // Overwrite with given return values
      }
    );

    await TestBed.configureTestingModule({
      providers: [{ provide: AccountService, useValue: fakeAccountService }]
    })
    service = TestBed.inject(AccountValidationService);
  };



  it('should be created', fakeAsync(async () => {
    await setup();
    expect(service).toBeTruthy();
  }));



  it('should return validation error object if email/username is taken', fakeAsync(async () => {
    await setup({
      isEmailTaken: of(true),
      isUsernameTaken: of(true)
    });

    const validateEmail = await service.validateEmail('gh');
    const validateUsername = await service.validateUsername('gj');

    let emailResult: { emailTaken: true } | null;
    validateEmail?.subscribe((otherResult: any) => {
      emailResult = otherResult;
      expect(emailResult).toEqual({ emailTaken: true });
    });

    let usernameResult: { usernameTaken: true } | null;
    validateUsername?.subscribe((otherResult: any) => {
      usernameResult = otherResult;
      expect(usernameResult).toEqual({ usernameTaken: true });
    });

    tick(1000);
  }));

  it('should return null object if email/username is not taken', fakeAsync(async () => {
    await setup({
      isEmailTaken: of(false),
      isUsernameTaken: of(false)
    });

    const validateEmail = await service.validateEmail('gh');
    const validateUsername = await service.validateUsername('gj');

    let emailResult: { emailTaken: true } | null;
    validateEmail?.subscribe((otherResult: any) => {
      emailResult = otherResult;
      expect(emailResult).toEqual(null);
    });

    let usernameResult: { usernameTaken: true } | null;
    validateUsername?.subscribe((otherResult: any) => {
      usernameResult = otherResult;
      expect(usernameResult).toEqual(null);
    });

    tick(1000);
  }));
});