import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { userModel } from 'src/app/testing/auth-test-helpers';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { LoginComponent } from 'src/app/_auth/login/login.component';
import { AccountValidationService } from '../account-validation.service';
import { AccountService } from '../account.service';
import { ConfirmEmailComponent } from '../confirm-email/confirm-email.component';
import { AccountManageProfileComponent } from './account-manage-profile.component';
import { Routes, provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import {
  manageProfileModel,
  username,
  email,
  invalidManageProfileModel
} from 'src/app/testing/account-tests-helpers';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent }
];

describe('AccountManageProfileComponent', () => {
  let component: AccountManageProfileComponent;
  let fixture: ComponentFixture<AccountManageProfileComponent>;
  let fakeAccountService: jasmine.SpyObj<AccountService>;
  let fakeValidationService: jasmine.SpyObj<AccountValidationService>;
  let fakeAuthService: jasmine.SpyObj<AuthenticationService>;
  let loader: HarnessLoader;

  const setup = async (
    fakeAccountServiceReturnValues?: jasmine.SpyObjMethodNames<AccountService>,
    fakeValidationReturnValues?: jasmine.SpyObjMethodNames<AccountValidationService>) => {

    fakeAccountService = jasmine.createSpyObj<AccountService>(
      'AccountService',
      {
        isEmailTaken: of(false),
        isUsernameTaken: of(false),
        postUpdateProfile: undefined,
        requestPasswordReset: undefined,
        resendEmailConfirmation: undefined,
        resetPassword: undefined,
        getUserProfile: of(manageProfileModel),
        postChangePassword: undefined,
        postUpdateLocation: undefined,
        register: undefined,
        ...fakeAccountServiceReturnValues // Overwrite with given return values
      }
    );

    fakeValidationService = jasmine.createSpyObj<AccountValidationService>(
      'AccountValidationService',
      {
        validateEmail: of(null),
        validateUsername: of(null),
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
      imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        provideRouter(routes),
        { provide: AccountValidationService, useValue: fakeValidationService },
        { provide: AccountService, useValue: fakeAccountService },
        { provide: AuthenticationService, useValue: fakeAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountManageProfileComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  };

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  describe('initial form setup', () => {

    it('should load 3 input harnesses', async () => {
      await setup();
      const inputs = await loader.getAllHarnesses(MatInputHarness);
      expect(inputs.length).toBe(2);
    });

    it('should load username input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('text');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe(username);
    });

    it('should load email input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('email');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe(email);
    });

    it('should render the Submit button - enabled as form is valid', async () => {
      await setup();
      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update profile' }));
      expect(await submitBtn.isDisabled()).toBe(false);
      expect(await submitBtn.getText()).toBe('Update profile');
    });
  });


  describe('form completion and submission', async () => {

    describe('username control', () => {
      it('should be able to set value of username input', async () => {
        await setup();
        const input = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));

        expect(await input.getValue()).toBe(username);
        await input.setValue(username);

        expect(await input.getValue()).toBe(username);
      });

      it('should show Username minlength validation messages when input is minlength', async () => {
        await setup();

        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#username' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.setValue('kl');
        await ((await formField.getControl()) as MatInputHarness)?.blur(); //ctrl updates AFTER blur
        expect(await formField.getTextErrors()).toEqual(['Username must be at least 5 characters long']);

        fixture.componentInstance.form.get('username')?.setValue('kl');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-minlength-username')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-minlength-username')?.textContent).toBe(' Username must be at least 5 characters long');
      });

      it('should show Username maxlength validation messages when input is maxlength', async () => {
        await setup();

        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#username' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.setValue('1234567a89123456789123456789');
        await ((await formField.getControl()) as MatInputHarness)?.blur(); //ctrl updates AFTER blur
        expect(await formField.getTextErrors()).toEqual(['Username must not be more than 20 characters long']);

        fixture.componentInstance.form.get('username')?.setValue('1234567891234567a89123456789');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-maxlength-username')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-maxlength-username')?.textContent).toBe(' Username must not be more than 20 characters long');
      });

      it('should show Username pattern validation messages when input is pattern', async () => {
        await setup();

        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#username' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.setValue('!!!a%%');
        await ((await formField.getControl()) as MatInputHarness)?.blur(); //ctrl updates AFTER blur
        expect(await formField.getTextErrors()).toEqual(['Username must be alphanumeric (no special characters) and must not contain spaces']);

        fixture.componentInstance.form.get('username')?.setValue('!!!a%%');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-pattern-username')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-pattern-username')?.textContent).toBe(' Username must be alphanumeric (no special characters) and must not contain spaces');
      });

      // todo: need to provide RestrictedNameValidator

      // it('should show Username restrictedUsername validation message when input is restrictedUsername', async () => {
      //   await setup();

      //   const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#username' }));
      //   expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
      //   expect(await formField.getTextErrors()).toEqual([]);

      //   await ((await formField.getControl()) as MatInputHarness)?.setValue('abirder');
      //   await ((await formField.getControl()) as MatInputHarness)?.blur(); //ctrl updates AFTER blur
      //   expect(await formField.getTextErrors()).toEqual(['Username may not contain the word "birder"']);

      //   fixture.componentInstance.form.get('username')?.setValue('abirder');
      //   expect(await formField.isControlValid()).toBe(false);

      //   const compiled = fixture.nativeElement as HTMLElement;
      //   expect(compiled.querySelector('.validation-restrictedUsername-username')?.textContent).toBeDefined();
      //   expect(compiled.querySelector('.validation-restrictedUsername-username')?.textContent).toBe(' Username may not contain the word "birder"');
      // });

      it('should show Username usernameTaken validation message when input is usernameTaken', async () => {
        await setup({}, {
          validateUsername: of({ usernameTaken: true })
        });

        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#username' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.setValue('hellochicken');
        await ((await formField.getControl()) as MatInputHarness)?.blur(); //ctrl updates AFTER blur
        expect(await formField.getTextErrors()).toEqual(['Username is taken']);

        fixture.componentInstance.form.get('username')?.setValue('hellochicken');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-usernameTaken-username')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-usernameTaken-username')?.textContent).toBe(' Username is taken');
      });
    });

    describe('email control', () => {
      it('should be able to set value of email input', async () => {
        await setup();
        const input = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));

        expect(await input.getValue()).toBe(email);
        await input.setValue(email);

        expect(await input.getValue()).toBe(email);
      });

      it('should show email format validation message when input invalid', async () => {
        await setup();

        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#email' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.setValue('k');
        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual(['Email is not valid']);

        fixture.componentInstance.form.get('email')?.setValue('k');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-email-email')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-email-email')?.textContent).toBe(' Email is not valid');
      });

      it('should show Username emailTaken validation message when input is email is taken', async () => {
        await setup({}, {
          validateEmail: of({ emailTaken: true })
        });

        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#email' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.setValue(email);
        await ((await formField.getControl()) as MatInputHarness)?.blur(); //ctrl updates AFTER blur
        expect(await formField.getTextErrors()).toEqual(['Email is taken']);

        fixture.componentInstance.form.get('username')?.setValue(email);
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-emailTaken-email')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-emailTaken-email')?.textContent).toBe(' Email is taken');
      });
    });

    it('should not submit an invalid form', async () => {
      await setup(
        {
          getUserProfile: of(invalidManageProfileModel)
        }
      );

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update profile' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      await submitBtn.click();

      expect(fakeAccountService.postUpdateProfile).not.toHaveBeenCalled();
    });

    it('test form validity check onSubmit()', async () => {
      await setup({
        getUserProfile: of(invalidManageProfileModel)
      });

      component.onSubmit();

      expect(fakeAccountService.postUpdateProfile).not.toHaveBeenCalled();
    });

    it('should call the service on Submit', async () => {
      await setup();
      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update profile' }));
      expect(await submitBtn.isDisabled()).toBe(false);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      await input1.setValue(username);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
      await input2.setValue(email);

      expect(await submitBtn.isDisabled()).toBe(false);

      await submitBtn.click();

      expect(fakeAccountService.postUpdateProfile).toHaveBeenCalledTimes(1);
      expect(fakeAccountService.postUpdateProfile).toHaveBeenCalledWith(manageProfileModel);
    });
  });

  describe('handles service NEXT notification', () => {

    it('should handle success reposnse', async () => {
      await setup({ postUpdateProfile: of(true) });

      expect(fixture.componentInstance.submitProgress()).toBe('idle');

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update profile' }));
      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      // Assert
      expect(fakeAccountService.postUpdateProfile).toHaveBeenCalledWith(manageProfileModel);
      expect(fakeAccountService.postUpdateProfile).toHaveBeenCalledTimes(1);

      // fixture.detectChanges();

      expect(fixture.componentInstance.submitProgress()).toBe('success');
      const isFormHidden = fixture.nativeElement as HTMLElement;
      expect(isFormHidden.querySelector('[data-testid="form"]')?.textContent).toBeUndefined();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeDefined();
    });
  });

  describe('handles service ERROR notification', () => {

    it('postUpdateProfile should handle error reposnse', async () => {
      await setup({ postUpdateProfile: throwError(() => new Error('error')) });

      expect(fixture.componentInstance.submitProgress()).toBe('idle');

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update profile' }));
      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      // Assert
      expect(fakeAccountService.postUpdateProfile).toHaveBeenCalledWith(manageProfileModel);
      expect(fakeAccountService.postUpdateProfile).toHaveBeenCalledTimes(1);

      // fixture.detectChanges();

      expect(fixture.componentInstance.submitProgress()).toBe('error');
      const isFormHidden = fixture.nativeElement as HTMLElement;
      expect(isFormHidden.querySelector('[data-testid="form"]')?.textContent).toBeUndefined();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeUndefined();

      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
    });

    it('_getProfile should handle error reposnse', async () => {
      await setup({ getUserProfile: throwError(() => new Error('error')) });

      // Assert
      expect(fakeAccountService.getUserProfile).toHaveBeenCalledTimes(1);

      // fixture.detectChanges();

      expect(fixture.componentInstance.dataFetchError()).toBeTruthy()

      const dataFetchErrorMsg = fixture.nativeElement as HTMLElement;
      expect(dataFetchErrorMsg.querySelector('[data-testid="dataFetchError"]')?.textContent).toBeDefined();

      const isFormHidden = fixture.nativeElement as HTMLElement;
      expect(isFormHidden.querySelector('[data-testid="form"]')?.textContent).toBeUndefined();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeUndefined();

      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
    });
  });
});