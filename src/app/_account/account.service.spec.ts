import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';
import { IUserEmail } from './i-user-email.dto';
import { IUsername } from './i-username.dto';

const username = 'test-username';
const email = 'test@email.net';
const model = <IUserEmail>{ email: email };
const usernameModel = <IUsername>{ username: username };

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


  it('checks the requestPasswordReset model is posted', () => {
    let result: boolean | undefined;
    service.requestPasswordReset(model).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/account/request-password-reset',
    });
    expect(request.request.body).toEqual({ email: email }); //: { email: email } });
    request.flush({ success: true });

    expect(result).toBe(true);
  });


  // beforeEach(() => {
  //   TestBed.configureTestingModule({});
  //   service = TestBed.inject(AccountService);
  // });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
