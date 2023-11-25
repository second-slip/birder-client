import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { authFailResult, authSuccessResult, loginModel, password, username } from 'src/app/testing/auth-test-helpers';
import { dispatchFakeEvent, expectText, findEl, setFieldValue } from 'src/app/testing/element.spec-helper';
import { ConfirmEmailComponent } from 'src/app/_account/confirm-email/confirm-email.component';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { AuthenticationService } from '../authentication.service';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let fakeLoginService: jasmine.SpyObj<LoginService>;
  let fakeAuthService: jasmine.SpyObj<AuthenticationService>;
  let fakeNavService: NavigationService;
  // let fakeTokenService: jasmine.SpyObj<TokenService>;


  const setup = async (
    fakeLoginServiceReturnValues?: jasmine.SpyObjMethodNames<LoginService>) => {

    fakeLoginService = jasmine.createSpyObj<LoginService>(
      'LoginService',
      {
        login: undefined,
        ...fakeLoginServiceReturnValues
      }
    );

    fakeNavService = jasmine.createSpyObj<NavigationService>(
      'NavigationService',
      {
        back: undefined
      }
    );
  
    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined,
      },
      {
        isAuthorisedObservable: of(false),
        getAuthUser: undefined
      }
    );
  
    // fakeTokenService = jasmine.createSpyObj<TokenService>(
    //   'TokenService',
    //   {
    //     addToken: undefined,
    //     getToken: undefined,
    //     getUser: undefined,
    //     isTokenValid: undefined,
    //     removeToken: undefined,
    //   }
    // );

    await TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule,
        RouterTestingModule.withRoutes([
            { path: 'confirm-email', component: ConfirmEmailComponent }
        ]), LoginComponent],
    providers: [
        //{ provide: TokenService, useValue: fakeTokenService },
        { provide: NavigationService, useValue: fakeNavService },
        { provide: LoginService, useValue: fakeLoginService },
        { provide: AuthenticationService, useValue: fakeAuthService }
    ]
}).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', fakeAsync(async () => {
    await setup();
    expect(component).toBeTruthy();
  }));

  const requiredFields = [
    'username',
    'password'
  ];

  const fillForm = () => {
    setFieldValue(fixture, 'username', username)
    setFieldValue(fixture, 'password', password);
  };

  const markFieldAsTouched = (element: DebugElement) => {
    dispatchFakeEvent(element.nativeElement, 'blur');
  };

  it('submits the form successfully', fakeAsync(async () => {
    await setup(
      {
        login: of(authSuccessResult)
      }
    );

    fillForm();

    requiredFields.forEach((testId) => {
      markFieldAsTouched(findEl(fixture, testId));
    });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeUndefined();

    findEl(fixture, 'form').triggerEventHandler('submit', {});

    // tick(1000);
    fixture.detectChanges();

    expectText(fixture, 'success', 'Success! You have successfully signed in ');
    expect(fakeLoginService.login).toHaveBeenCalledWith(loginModel);
    expect(fakeAuthService.checkAuthStatus).toHaveBeenCalledTimes(1);

    const isFormHidden = fixture.nativeElement as HTMLElement;
    expect(isFormHidden.querySelector('[data-testid="loginForm"]')?.textContent).toBeUndefined();
  }));

  describe('on login error', () => {
    
    it('handles errors', fakeAsync(async () => {

      await setup({
        login: throwError(() => authFailResult)
      });

      tick(1000);

      fillForm();

      requiredFields.forEach((testId) => {
        markFieldAsTouched(findEl(fixture, testId));
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

      findEl(fixture, 'form').triggerEventHandler('submit', {});

      fixture.detectChanges();

      expectText(fixture, 'error', 'Sign in failed There was an error logging in. Make sure you have typed the correct email and password. If you have forgotten your password, you can reset it. ');
      expect(fakeLoginService.login).toHaveBeenCalledWith(loginModel);
      expect(fakeAuthService.checkAuthStatus).not.toHaveBeenCalled();
    }));
  });

  it('does not submit an invalid form', fakeAsync(async () => {
    await setup();

    findEl(fixture, 'form').triggerEventHandler('submit', {});

    expect(fakeLoginService.login).not.toHaveBeenCalled();
  }));

  it('marks fields as required', async () => {

    await setup();

    requiredFields.forEach((testId) => {
      markFieldAsTouched(findEl(fixture, testId));
    });

    fixture.detectChanges();

    requiredFields.forEach((testId) => {
      const el = findEl(fixture, testId);

      expect(el.attributes['required']).toBe(
        '',
        `${testId} must be marked as aria-required`,
      );
    });
  });
});