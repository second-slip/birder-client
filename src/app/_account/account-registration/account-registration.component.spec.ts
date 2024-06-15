import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { AccountRegistrationComponent } from './account-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../account.service';
import { ConfirmEmailComponent } from '../confirm-email/confirm-email.component';
import { AccountValidationService } from '../account-validation.service';
import { of, throwError } from 'rxjs';
import {
  registerModel,
  username,
  password,
  confirmPassword,
  email
} from 'src/app/testing/account-tests-helpers';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/_auth/login/login.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent }
];

describe('AccountRegistrationComponent', () => {
  let component: AccountRegistrationComponent;
  let fixture: ComponentFixture<AccountRegistrationComponent>;
  let fakeAccountService: jasmine.SpyObj<AccountService>;
  let fakeValidationService: jasmine.SpyObj<AccountValidationService>;
  let loader: HarnessLoader;

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
        getUserProfile: undefined,
        postChangePassword: undefined,
        postUpdateLocation: undefined,
        postUpdateProfile: undefined,
        ...fakeAccountServiceReturnValues
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

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        provideRouter(routes),
        { provide: AccountValidationService, useValue: fakeValidationService },
        { provide: AccountService, useValue: fakeAccountService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountRegistrationComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  };

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  describe('initial form setup', () => {

    it('should load 4 input harnesses', async () => {
      await setup();
      const inputs = await loader.getAllHarnesses(MatInputHarness);
      expect(inputs.length).toBe(4);
    });

    it('should load username input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('text');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe('');
    });

    it('should load email input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
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

    it('should load confirmPassword input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#confirmPassword' }));
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('password');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe('');
    });

    it('should render the Submit button - disabled as form is invalid', async () => {
      await setup();
      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Register' }));
      expect(await submitBtn.isDisabled()).toBe(true);
      expect(await submitBtn.getText()).toBe('Register');
    });
  });

  describe('form completion and submission', async () => {

    describe('username control', () => {
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
        expect(await formField.getTextErrors()).toEqual(['Username is required']);

        fixture.componentInstance.form.get('username')?.setValue('');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-required-username')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-required-username')?.textContent).toBe(' Username is required');
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

        expect(await input.getValue()).toBe('');
        await input.setValue(email);

        expect(await input.getValue()).toBe(email);
      });

      it('should show required validation messages when email input is touched but empty', async () => {
        await setup();

        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#email' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual(['Email is required']);

        fixture.componentInstance.form.get('email')?.setValue('');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-required-email')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-required-email')?.textContent).toBe(' Email is required');
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

    describe('password control', () => {

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

        fixture.componentInstance.form?.get('passwordgroup')?.get('password')?.setValue('');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-required-password')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-required-password')?.textContent).toBe(' Password is required');
      });

      it('should show minlength validation messages when password input less tha minimum length', async () => {
        await setup();

        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#password' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.setValue('k1');
        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual(['Password must be at least 8 characters long']);

        fixture.componentInstance.form?.get('passwordgroup')?.get('password')?.setValue('k1');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-minlength-password')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-minlength-password')?.textContent).toBe(' Password must be at least 8 characters long');
      });

      it('should show pattern validation messages when password input does not match patter', async () => {
        await setup();

        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#password' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.setValue('kyuioptopl');
        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual(['Password must contain at least one number and one letter']);

        fixture.componentInstance.form?.get('passwordgroup')?.get('password')?.setValue('kyuioptopl');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-pattern-password')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-pattern-password')?.textContent).toBe(' Password must contain at least one number and one letter');
      });

    });

    describe('confirmPassword control', () => {
      it('should be able to set value of confirmPassword input', async () => {
        await setup();
        const input = await loader.getHarness(MatInputHarness.with({ selector: '#confirmPassword' }));

        expect(await input.getValue()).toBe('');
        await input.setValue(confirmPassword);

        expect(await input.getValue()).toBe(confirmPassword);
      });

      it('should show required validation messages when confirmPassword input is touched but empty', async () => {
        await setup();

        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#confirmPassword' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual(['Password is required']);

        fixture.componentInstance.form?.get('passwordgroup')?.get('confirmPassword')?.setValue('');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-required-confirmPassword')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-required-confirmPassword')?.textContent).toBe(' Password is required');
      });

      it('should show match validation messages when password and confirm password do not match', async () => {
        await setup();

        const passwordInput = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));

        expect(await passwordInput.getValue()).toBe('');
        await passwordInput.setValue(password);
        expect(await passwordInput.getValue()).toBe(password);

        const matchPasswordInput = await loader.getHarness(MatInputHarness.with({ selector: '#confirmPassword' }));

        expect(await matchPasswordInput.getValue()).toBe('');
        await matchPasswordInput.setValue('not-match');
        expect(await matchPasswordInput.getValue()).toBe('not-match');


        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#confirmPassword' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        // expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual(['Passwords do not match']);

        fixture.componentInstance.form?.get('passwordgroup')?.get('password')?.setValue(password);
        fixture.componentInstance.form?.get('passwordgroup')?.get('confirmPassword')?.setValue('not-match');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-match-confirmPassword')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-match-confirmPassword')?.textContent).toBe(' Passwords do not match');
      });
    });

    it('should not submit an invalid form', fakeAsync(async () => {
      await setup();

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Register' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      await submitBtn.click();

      expect(fakeAccountService.register).not.toHaveBeenCalled();
    }));

    it('should call the service on Submit', async () => {
      await setup();
      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Register' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      await input1.setValue(username);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
      await input2.setValue(email);

      const input3 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input3.setValue(password);

      const input4 = await loader.getHarness(MatInputHarness.with({ selector: '#confirmPassword' }));
      await input4.setValue(confirmPassword);

      expect(await submitBtn.isDisabled()).toBe(false);

      await submitBtn.click();

      expect(fakeAccountService.register).toHaveBeenCalledTimes(1);
      expect(fakeAccountService.register).toHaveBeenCalledWith(registerModel);
    });
  });

  describe('handles service NEXT notification', () => {

    it('should handle success reposnse', async () => {
      await setup({ register: of({ success: true }) });

      expect(fixture.componentInstance.submitProgress).toBe('idle');

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Register' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      await input1.setValue(username);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
      await input2.setValue(email);

      const input3 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input3.setValue(password);

      const input4 = await loader.getHarness(MatInputHarness.with({ selector: '#confirmPassword' }));
      await input4.setValue(confirmPassword);

      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      // Assert
      expect(fakeAccountService.register).toHaveBeenCalledWith(registerModel);
      expect(fakeAccountService.register).toHaveBeenCalledTimes(1);

      fixture.detectChanges();

      expect(fixture.componentInstance.submitProgress).toBe('success');
      const isFormHidden = fixture.nativeElement as HTMLElement;
      expect(isFormHidden.querySelector('[data-testid="form"]')?.textContent).toBeUndefined();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeDefined();
    });
  });

  describe('handles service ERROR notification', () => {
    
    it('should handle error reposnse', async () => {
      await setup({ register: throwError(() => new Error('error'))});

      expect(fixture.componentInstance.submitProgress).toBe('idle');

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Register' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#username' }));
      await input1.setValue(username);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
      await input2.setValue(email);

      const input3 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input3.setValue(password);

      const input4 = await loader.getHarness(MatInputHarness.with({ selector: '#confirmPassword' }));
      await input4.setValue(confirmPassword);

      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      // Assert
      expect(fakeAccountService.register).toHaveBeenCalledWith(registerModel);
      expect(fakeAccountService.register).toHaveBeenCalledTimes(1);

      fixture.detectChanges();

      expect(fixture.componentInstance.submitProgress).toBe('error');
      const isFormHidden = fixture.nativeElement as HTMLElement;
      expect(isFormHidden.querySelector('[data-testid="form"]')?.textContent).toBeDefined();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeUndefined();

      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
    });
  });
});
