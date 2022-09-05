import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IAccountRegistration } from './account-registration/i-account-registration';

import { AccountService } from './account.service';
import { IUserEmail } from './i-user-email.dto';
import { IUsername } from './i-username.dto';
import { IResetPassword } from './reset-password/i-reset-password.dto';

const username = 'test-username';
const email = 'test@email.net';
const password = 'password';
const confirmPassword = 'confirmPassword';
const model = <IUserEmail>{ email: email };
const usernameModel = <IUsername>{ username: username };
const registerModel = <IAccountRegistration>{
  userName: username, email: email, password: password, confirmPassword: confirmPassword
};
const resetPasswordModel = <IResetPassword>{
  email: email,
  password: password,
  confirmPassword: confirmPassword,
  code: ''
};

describe('AccountService', () => {
  let service: AccountService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AccountService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('checks if the username is taken', () => {
    let result: boolean | undefined;
    service.isUsernameTaken(username).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/account/check-username',
    });
    expect(request.request.body).toEqual({ model: { username: username } });
    request.flush({ usernameTaken: true });

    expect(result).toBe(true);
  });

  it('checks if the email is taken', () => {
    let result: boolean | undefined;
    service.isEmailTaken(email).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/account/check-email',
    });
    expect(request.request.body).toEqual({ model: { email: email } });
    request.flush({ emailTaken: true });

    expect(result).toBe(true);
  });


  it('check it registers', () => {
    let result: { success: true } | undefined;
    service.register(registerModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/account/register',
    });
    expect(request.request.body).toEqual({ userName: username, email: email, password: password, confirmPassword: confirmPassword });
    request.flush({ success: true });

    expect(result).toEqual({ success: true });
  });

  it('checks the requestPasswordReset model is posted', () => {
    let result: { success: true } | undefined;
    service.requestPasswordReset(model).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/account/request-password-reset',
    });
    expect(request.request.body).toEqual({ email: email }); // model is created by the service from string email parameter 
    request.flush({ success: true });

    expect(result).toEqual({ success: true });
  });

  it('checks it resends email', () => {
    let result: { success: true } | undefined;
    service.resendEmailConfirmation(model).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/account/resend-email-confirmation',
    });
    expect(request.request.body).toEqual(model); // model is created by the service from string email parameter 
    request.flush({ success: true });

    expect(result).toEqual({ success: true });
  });

  it('checks it resets the password', () => {
    let result: { success: true } | undefined;
    service.resetPassword(resetPasswordModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/account/reset-password',
    });
    expect(request.request.body).toEqual(resetPasswordModel);
    request.flush({ success: true });

    expect(result).toEqual({ success: true });
  });

  it('passes the errors through', () => {
    const errors: HttpErrorResponse[] = [];
    const recordError = (error: HttpErrorResponse) => {
      errors.push(error);
    };

    service.isUsernameTaken(username).subscribe(fail, recordError, fail);
    service.isEmailTaken(email).subscribe(fail, recordError, fail);
    service.register(registerModel).subscribe(fail, recordError, fail);
    service.requestPasswordReset(model).subscribe(fail, recordError, fail);
    service.resendEmailConfirmation(model).subscribe(fail, recordError, fail);
    service.resetPassword(resetPasswordModel).subscribe(fail, recordError, fail);

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API error');

    const requests = controller.match(() => true);
    requests.forEach((request) => {
      request.error(errorEvent, { status, statusText });
    });

    expect(errors.length).toBe(6);
    errors.forEach((error) => {
      expect(error.error).toBe(errorEvent);
      expect(error.status).toBe(status);
      expect(error.statusText).toBe(statusText);
    });
  });
});
