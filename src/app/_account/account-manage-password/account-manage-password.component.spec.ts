import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginComponent } from 'src/app/_auth/login/login.component';
import { AccountService } from '../account.service';
import { AccountManagePasswordComponent } from './account-manage-password.component';
import {
  confirmPassword,
  oldPassword,
  changePasswordModel,
  password
} from 'src/app/testing/account-tests-helpers';

import { Routes, provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputHarness } from '@angular/material/input/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

const routes: Routes = [
  { path: 'login', component: LoginComponent }
];

describe('AccountManagePasswordComponent', () => {
  let component: AccountManagePasswordComponent;
  let fixture: ComponentFixture<AccountManagePasswordComponent>;
  let fakeAccountService: jasmine.SpyObj<AccountService>;
  let loader: HarnessLoader;


  const setup = async (
    fakeAccountServiceReturnValues?: jasmine.SpyObjMethodNames<AccountService>) => {

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

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
      // schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter(routes),
        { provide: AccountService, useValue: fakeAccountService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountManagePasswordComponent);
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
      expect(inputs.length).toBe(3);
    });

    it('should load oldPassword input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#oldPassword' }));
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('password');
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
      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update password' }));
      expect(await submitBtn.isDisabled()).toBe(true);
      expect(await submitBtn.getText()).toBe('Update password');
    });
  });


  describe('form completion and submission', async () => {

    describe('old password control', () => {

      it('should be able to set value of oldPassword input', async () => {
        await setup();
        const input = await loader.getHarness(MatInputHarness.with({ selector: '#oldPassword' }));

        expect(await input.getValue()).toBe('');
        await input.setValue(oldPassword);

        expect(await input.getValue()).toBe(oldPassword);
      });

      it('should show required validation messages when password input is touched but empty', async () => {
        await setup();

        const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#oldPassword' }));
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual(['Current password is required']);

        fixture.componentInstance.form?.get('passwordgroup')?.get('password')?.setValue('');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.validation-required-oldPassword')?.textContent).toBeDefined();
        expect(compiled.querySelector('.validation-required-oldPassword')?.textContent).toBe(' Current password is required');
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


    });

    it('should not submit an invalid form', fakeAsync(async () => {
      await setup();

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update password' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      await submitBtn.click();

      expect(fakeAccountService.register).not.toHaveBeenCalled();
    }));

    it('test form validity check onSubmit()', fakeAsync(async () => {
      await setup();

      component.onSubmit('');

      expect(fakeAccountService.register).not.toHaveBeenCalled();
    }));


    it('should call the service on Submit', async () => {
      await setup();
      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update password' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#oldPassword' }));
      await input1.setValue(oldPassword);

      const input3 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input3.setValue(password);

      const input4 = await loader.getHarness(MatInputHarness.with({ selector: '#confirmPassword' }));
      await input4.setValue(confirmPassword);

      expect(await submitBtn.isDisabled()).toBe(false);

      await submitBtn.click();

      expect(fakeAccountService.postChangePassword).toHaveBeenCalledTimes(1);
      expect(fakeAccountService.postChangePassword).toHaveBeenCalledWith(changePasswordModel);
    });
  });


  describe('handles service NEXT notification', () => {

    it('should handle success reposnse', async () => {
      await setup(
        {
          postChangePassword: of({ success: true }),
        }
      );

      expect(fixture.componentInstance.submitProgress()).toBe('idle');

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update password' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#oldPassword' }));
      await input1.setValue(oldPassword);

      const input3 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input3.setValue(password);

      const input4 = await loader.getHarness(MatInputHarness.with({ selector: '#confirmPassword' }));
      await input4.setValue(confirmPassword);

      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      // Assert
      expect(fakeAccountService.postChangePassword).toHaveBeenCalledWith(changePasswordModel);
      expect(fakeAccountService.postChangePassword).toHaveBeenCalledTimes(1);

      fixture.detectChanges();

      expect(fixture.componentInstance.submitProgress()).toBe('success');
      const isFormHidden = fixture.nativeElement as HTMLElement;
      expect(isFormHidden.querySelector('[data-testid="form"]')?.textContent).toBeUndefined();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeDefined();
    });
  });

  describe('handles service ERROR notification', () => {
    
    it('should handle error reposnse', async () => {
      await setup({ postChangePassword: throwError(() => new Error('error'))});

      expect(fixture.componentInstance.submitProgress()).toBe('idle');

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update password' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input1 = await loader.getHarness(MatInputHarness.with({ selector: '#oldPassword' }));
      await input1.setValue(oldPassword);

      const input3 = await loader.getHarness(MatInputHarness.with({ selector: '#password' }));
      await input3.setValue(password);

      const input4 = await loader.getHarness(MatInputHarness.with({ selector: '#confirmPassword' }));
      await input4.setValue(confirmPassword);

      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      // iIMPORTANT: detectChanges() is needed here due to the signals
      fixture.detectChanges();

      // Assert
      expect(fakeAccountService.postChangePassword).toHaveBeenCalledWith(changePasswordModel);
      expect(fakeAccountService.postChangePassword).toHaveBeenCalledTimes(1);

      expect(fixture.componentInstance.submitProgress()).toBe('error');
      const isFormHidden = fixture.nativeElement as HTMLElement;
      expect(isFormHidden.querySelector('[data-testid="form"]')?.textContent).toBeUndefined();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeUndefined();

      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
    });
  });
});