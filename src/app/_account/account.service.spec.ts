import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';

import {
  registerModel,
  resetPasswordModel,
  username,
  emailModel,
  password,
  confirmPassword,
  email,
  changePasswordModel,
  locationModel,
  manageProfileModel
} from 'src/app/testing/account-tests-helpers';
import { IManageProfile } from './account-manage-profile/i-manage-profile.dto';

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
    service.requestPasswordReset(emailModel).subscribe((otherResult) => {
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
    service.resendEmailConfirmation(emailModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/account/resend-email-confirmation',
    });
    expect(request.request.body).toEqual(emailModel); // model is created by the service from string email parameter 
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

  it('checks it gets the profile', () => {
    let result: IManageProfile | null | undefined;
    service.getUserProfile()
      .subscribe((otherResult) => {
        result = otherResult;
        console.log(result);
      });

    controller.expectOne('api/manage').flush(manageProfileModel);
    expect(result).toEqual(manageProfileModel);
  });

  it('checks it updates the profile', () => {
    let result: boolean | undefined;
    service.postUpdateProfile(manageProfileModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/manage/profile',
    });
    expect(request.request.body).toEqual(manageProfileModel);
    request.flush({ emailConfirmationRequired: true });

    expect(result).toEqual(true);
  });

  it('checks it updates the password', () => {
    let result: { success: true } | undefined;
    service.postChangePassword(changePasswordModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/manage/password',
    });
    expect(request.request.body).toEqual(changePasswordModel);
    request.flush({ success: true });

    expect(result).toEqual({ success: true });
  });

  it('checks it updates the location', () => {
    let result: { success: true } | undefined;
    service.postUpdateLocation(locationModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/manage/location',
    });
    expect(request.request.body).toEqual(locationModel);
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
    service.requestPasswordReset(emailModel).subscribe(fail, recordError, fail);
    service.resendEmailConfirmation(emailModel).subscribe(fail, recordError, fail);
    service.resetPassword(resetPasswordModel).subscribe(fail, recordError, fail);
    service.postChangePassword(changePasswordModel).subscribe(fail, recordError, fail);
    service.postUpdateLocation(locationModel).subscribe(fail, recordError, fail);
    service.getUserProfile().subscribe(fail, recordError, fail);
    service.postUpdateProfile(manageProfileModel).subscribe(fail, recordError, fail);

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    const requests = controller.match(() => true);
    requests.forEach((request) => {
      request.error(errorEvent, { status, statusText });
    });

    expect(errors.length).toBe(10);
    errors.forEach((error) => {
      expect(error.error).toBe(errorEvent);
      expect(error.status).toBe(status);
      expect(error.statusText).toBe(statusText);
    });
  });
});
