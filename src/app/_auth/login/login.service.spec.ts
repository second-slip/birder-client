import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { authSuccessResult, loginModel } from 'src/app/testing/auth-test-helpers';
import { AuthenticationService } from '../authentication.service';
import { IAuthenticationResult } from '../i-authentication-result.dto';
import { TokenService } from '../token.service';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let controller: HttpTestingController;

  let fakeTokenService: TokenService;
  let fakeAuthService: AuthenticationService;

  fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
    'AuthenticationService',
    {
      checkAuthStatus: undefined,
      logout: undefined,
    },
    {
      isAuthorisedObservable: undefined,
      isAuthorised: false,
      getAuthUser: undefined,
    },
  );

  fakeTokenService = jasmine.createSpyObj<TokenService>(
    'TokenService',
    {
      addToken: undefined,
      getToken: undefined,
      getUser: undefined,
      isTokenValid: undefined
    }
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: fakeAuthService },
        { provide: TokenService, useValue: fakeTokenService }
      ]
    });
    service = TestBed.inject(LoginService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', fakeAsync(async () => {
    expect(service).toBeTruthy();
  }));


  it('successfully signs in', () => {
    let result: IAuthenticationResult | undefined;
    service.login(loginModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/authentication/login',
    });
    expect(request.request.body).toEqual(loginModel);
    request.flush(authSuccessResult);

    expect(result).toBe(authSuccessResult);
    expect(fakeTokenService.addToken).toHaveBeenCalledWith(authSuccessResult.authenticationToken);
    expect(fakeAuthService.checkAuthStatus).toHaveBeenCalled();
  });

  it('passes the errors through', () => {
    const errors: HttpErrorResponse[] = [];
    const recordError = (error: HttpErrorResponse) => {
      errors.push(error);
    };

    service.login(loginModel).subscribe(fail, recordError, fail);

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    const requests = controller.match(() => true);
    requests.forEach((request) => {
      request.error(errorEvent, { status, statusText });
    });


    expect(errors.length).toBe(1);

    errors.forEach((error) => {
      expect(error.error).toBe(errorEvent);
      expect(error.status).toBe(status);
      expect(error.statusText).toBe(statusText);
    });
    expect(fakeTokenService.addToken).not.toHaveBeenCalled();
    expect(fakeAuthService.checkAuthStatus).not.toHaveBeenCalled();
  });
});
