import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { authFailResult, authSuccessResult, loginModel, password, username } from 'src/app/testing/auth-test-helpers';
import { ConfirmEmailComponent } from 'src/app/_account/confirm-email/confirm-email.component';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { AuthenticationService } from '../authentication.service';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { provideRouter, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { TokenService } from '../token.service';
import { AuthenticationFailureReason } from '../authentication-failure-reason';
import { expectText } from 'src/app/testing/element.spec-helper';

const routes: Routes = [
  { path: 'confirm-email', component: ConfirmEmailComponent }
];

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let fakeLoginService: jasmine.SpyObj<LoginService>;
  let fakeAuthService: jasmine.SpyObj<AuthenticationService>;
  let fakeNavService: NavigationService;
  let fakeTokenService: jasmine.SpyObj<TokenService>;
  let loader: HarnessLoader;

  const setup = async (fakeLoginServiceReturnValues?: jasmine.SpyObjMethodNames<LoginService>) => {

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

    fakeTokenService = jasmine.createSpyObj<TokenService>(
      'TokenService',
      {
        addToken: undefined,
        getToken: '',
        removeToken: undefined,
        // ...fakeTokenServicereturnValues
      }
    );

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, LoginComponent, BrowserAnimationsModule],
      providers: [
        provideRouter(routes),
        { provide: NavigationService, useValue: fakeNavService },
        { provide: LoginService, useValue: fakeLoginService },
        { provide: AuthenticationService, useValue: fakeAuthService },
        { provide: TokenService, useValue: fakeTokenService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  };

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });


  describe('initial form setup', () => {

    it('should load two input harnesses', async () => {
      await setup();
      const inputs = await loader.getAllHarnesses(MatInputHarness);
      expect(inputs.length).toBe(2);
    });

    it('should load username input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('email');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe('');
    });

    it('should load password input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('password');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe('');
    });

    it('should render the Submit button - disabled as form is invalid', async () => {
      await setup();
      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));
      expect(await submitBtn.isDisabled()).toBe(true);
      expect(await submitBtn.getText()).toBe('Login');
    });
  });

  describe('form completion and submission', async () => {

    it('should be able to set value of username input', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));

      expect(await input.getValue()).toBe('');
      await input.setValue(username);

      expect(await input.getValue()).toBe(username);
    });

    it('should show required validation messages when username input is touched but empty', async () => {
      await setup();

      const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#username' }));
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      expect(await formField.getTextErrors()).toEqual(['Email is required']);

      fixture.componentInstance.loginForm.get('username')?.setValue('');
      expect(await formField.isControlValid()).toBe(false);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.validation-required-username')?.textContent).toBeDefined();
      expect(compiled.querySelector('.validation-required-username')?.textContent).toBe(' Email is required');
    });

    it('should show Username email format validation messages when input invalid', async () => {
      await setup();

      const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#username' }));
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      await ((await formField.getControl()) as MatInputHarness)?.setValue('k');
      expect(await formField.getTextErrors()).toEqual(['Email is not valid']);

      fixture.componentInstance.loginForm.get('username')?.setValue('k');
      expect(await formField.isControlValid()).toBe(false);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.validation-email-username')?.textContent).toBeDefined();
      expect(compiled.querySelector('.validation-email-username')?.textContent).toBe(' Email is not valid');
    });

    it('should be able to set value of password input', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));

      expect(await input.getValue()).toBe('');
      await input.setValue(password);

      expect(await input.getValue()).toBe(password);
    });

    it('should show required validation messages when password input is touched but empty', async () => {
      await setup();

      const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#password' }));
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      expect(await formField.getTextErrors()).toEqual(['Password is required']);

      fixture.componentInstance.loginForm.get('password')?.setValue('');
      expect(await formField.isControlValid()).toBe(false);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.validation-required-password')?.textContent).toBeDefined();
      expect(compiled.querySelector('.validation-required-password')?.textContent).toBe(' Password is required');
    });


    it('should not submit an invalid form', fakeAsync(async () => {
      await setup();

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      await submitBtn.click();

      expect(fakeLoginService.login).not.toHaveBeenCalled();
      expect(fakeLoginService.login).not.toHaveBeenCalledWith(loginModel);
    }));

    it('the Login button should be disabled unless all inputs are valid', async () => {
      await setup();
      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      await input1.setValue(username);
      expect(await submitBtn.isDisabled()).toBe(true);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input2.setValue(password);

      expect(await submitBtn.isDisabled()).toBe(false);
    });

    it('should call the service on Submit', async () => {
      await setup();
      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      await input1.setValue(username);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input2.setValue(password);

      expect(await submitBtn.isDisabled()).toBe(false);

      await submitBtn.click();

      expect(fakeLoginService.login).toHaveBeenCalledTimes(1);
      expect(fakeLoginService.login).toHaveBeenCalledWith(loginModel);
    });

  });

  describe('handles service NEXT notification', () => {

    it('should handle the auth token and update the auth status', async () => {
      await setup({ login: of(authSuccessResult) });

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      await input1.setValue(username);
      expect(await submitBtn.isDisabled()).toBe(true);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input2.setValue(password);

      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      // Assert
      expect(fakeLoginService.login).toHaveBeenCalledWith(loginModel);
      expect(fakeAuthService.checkAuthStatus).toHaveBeenCalledTimes(1);
      expect(fakeTokenService.addToken).toHaveBeenCalledOnceWith(authSuccessResult.authenticationToken)
      expect(fixture.componentInstance.submitProgress).toBe('success');
    });

    it('hide the successfully completed form and show the success alert banner', async () => {
      await setup({ login: of(authSuccessResult) });

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      await input1.setValue(username);
      expect(await submitBtn.isDisabled()).toBe(true);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input2.setValue(password);

      expect(await submitBtn.isDisabled()).toBe(false);

      expect(fixture.componentInstance.submitProgress).toBe('idle');

      // Act
      await submitBtn.click();

      // Assert
      expectText(fixture, 'success', 'Success! You have successfully signed in ');

      expect(fixture.componentInstance.submitProgress).toBe('success');

      const isFormHidden = fixture.nativeElement as HTMLElement;
      expect(isFormHidden.querySelector('[data-testid="loginForm"]')?.textContent).toBeUndefined();
    });
  })

  describe('handles service ERROR notification', () => {

    it('handles error response object', async () => {
      const failResponse = authFailResult;
      failResponse.failureReason = AuthenticationFailureReason.LockedOut;

      await setup({
        login: throwError(() => failResponse)
      });

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      await input1.setValue(username);
      expect(await submitBtn.isDisabled()).toBe(true);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input2.setValue(password);

      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      expect(fakeLoginService.login).toHaveBeenCalledWith(loginModel);

      expect(fakeAuthService.checkAuthStatus).not.toHaveBeenCalled();
      expect(fakeTokenService.addToken).not.toHaveBeenCalled();
      expect(fakeAuthService.checkAuthStatus).not.toHaveBeenCalled();

      expect(fixture.componentInstance.submitProgress).toBe('error');
    });

    it('handles error response object with email confirmation required', async () => {
      await setup({
        login: throwError(() => authFailResult)
      });

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      await input1.setValue(username);
      expect(await submitBtn.isDisabled()).toBe(true);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input2.setValue(password);

      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      expect(fakeLoginService.login).toHaveBeenCalledWith(loginModel);

      expect(fakeAuthService.checkAuthStatus).not.toHaveBeenCalled();
      expect(fakeTokenService.addToken).not.toHaveBeenCalled();
      expect(fakeAuthService.checkAuthStatus).not.toHaveBeenCalled();

      expect(fixture.componentInstance.submitProgress).toBe('error');
    });

    it('shows error alert banner', async () => {
      const failResponse = authFailResult;
      failResponse.failureReason = AuthenticationFailureReason.LockedOut;

      await setup({
        login: throwError(() => failResponse)
      });

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Login' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      await input1.setValue(username);
      expect(await submitBtn.isDisabled()).toBe(true);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input2.setValue(password);

      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      expect(fixture.componentInstance.submitProgress).toBe('error');
      expectText(fixture, 'error', 'Sign in failed There was an error logging in. Make sure you have typed the correct email and password. If you have forgotten your password, you can reset it. ');
    });

  });

});