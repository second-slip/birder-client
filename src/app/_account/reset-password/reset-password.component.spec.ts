import { ResetPasswordComponent } from './reset-password.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../account.service';
import { of, throwError } from 'rxjs';
import {
  resetPasswordModel,
  password,
  confirmPassword,
  email,
  code,
} from 'src/app/testing/account-tests-helpers';
import { ActivatedRoute } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let fakeAccountService: jasmine.SpyObj<AccountService>;
  let loader: HarnessLoader;

  const setup = async (
    fakeAccountServiceReturnValues?: jasmine.SpyObjMethodNames<AccountService>
  ) => {
    fakeAccountService = jasmine.createSpyObj<AccountService>(
      'AccountService',
      {
        isEmailTaken: of(false),
        isUsernameTaken: of(false),
        register: of(),
        requestPasswordReset: of(),
        resendEmailConfirmation: of(),
        resetPassword: of(),
        ...fakeAccountServiceReturnValues,
      }
    );

    const obj = {
      code: code,
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              new Map(
                Object.entries({
                  code: code,
                })
              )
            ),
            // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
            // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
          },
        },
        { provide: AccountService, useValue: fakeAccountService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
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

    it('should load email input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#email' })
      );
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('email');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe('');
    });

    it('should load password input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#password' })
      );
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('password');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe('');
    });

    it('should load confirmPassword input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#confirmPassword' })
      );
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('password');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe('');
    });

    it('should render the Submit button - disabled as form is invalid', async () => {
      await setup();
      const submitBtn = await loader.getHarness(
        MatButtonHarness.with({ text: 'Update password' })
      );
      expect(await submitBtn.isDisabled()).toBe(true);
      expect(await submitBtn.getText()).toBe('Update password');
    });
  });

  describe('form completion and submission', async () => {
    describe('email control', () => {
      it('should be able to set value of email input', async () => {
        await setup();
        const input = await loader.getHarness(
          MatInputHarness.with({ selector: '#email' })
        );

        expect(await input.getValue()).toBe('');
        await input.setValue(email);

        expect(await input.getValue()).toBe(email);
      });

      it('should show required validation messages when email input is touched but empty', async () => {
        await setup();

        const formField = await loader.getHarness(
          MatFormFieldHarness.with({ selector: '#email' })
        );
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(
          true
        );
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual(['Email is required']);

        fixture.componentInstance.form.get('email')?.setValue('');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('.validation-required-email')?.textContent
        ).toBeDefined();
        expect(
          compiled.querySelector('.validation-required-email')?.textContent
        ).toBe(' Email is required');
      });

      it('should show email format validation message when input invalid', async () => {
        await setup();

        const formField = await loader.getHarness(
          MatFormFieldHarness.with({ selector: '#email' })
        );
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(
          true
        );
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.setValue(
          'k'
        );
        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual(['Email is not valid']);

        fixture.componentInstance.form.get('email')?.setValue('k');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('.validation-email-email')?.textContent
        ).toBeDefined();
        expect(
          compiled.querySelector('.validation-email-email')?.textContent
        ).toBe(' Email is not valid');
      });
    });

    describe('password control', () => {
      it('should be able to set value of password input', async () => {
        await setup();
        const input = await loader.getHarness(
          MatInputHarness.with({ selector: '#password' })
        );

        expect(await input.getValue()).toBe('');
        await input.setValue(password);

        expect(await input.getValue()).toBe(password);
      });

      it('should show required validation messages when password input is touched but empty', async () => {
        await setup();

        const formField = await loader.getHarness(
          MatFormFieldHarness.with({ selector: '#password' })
        );
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(
          true
        );
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual([
          'Password is required',
        ]);

        fixture.componentInstance.form
          ?.get('passwordgroup')
          ?.get('password')
          ?.setValue('');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('.validation-required-password')?.textContent
        ).toBeDefined();
        expect(
          compiled.querySelector('.validation-required-password')?.textContent
        ).toBe(' Password is required');
      });

      it('should show minlength validation messages when password input less tha minimum length', async () => {
        await setup();

        const formField = await loader.getHarness(
          MatFormFieldHarness.with({ selector: '#password' })
        );
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(
          true
        );
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.setValue(
          'k1'
        );
        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual([
          'Password must be at least 8 characters long',
        ]);

        fixture.componentInstance.form
          ?.get('passwordgroup')
          ?.get('password')
          ?.setValue('k1');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('.validation-minlength-password')?.textContent
        ).toBeDefined();
        expect(
          compiled.querySelector('.validation-minlength-password')?.textContent
        ).toBe(' Password must be at least 8 characters long');
      });

      it('should show pattern validation messages when password input does not match patter', async () => {
        await setup();

        const formField = await loader.getHarness(
          MatFormFieldHarness.with({ selector: '#password' })
        );
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(
          true
        );
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.setValue(
          'kyuioptopl'
        );
        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual([
          'Password must contain at least one number and one letter',
        ]);

        fixture.componentInstance.form
          ?.get('passwordgroup')
          ?.get('password')
          ?.setValue('kyuioptopl');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('.validation-pattern-password')?.textContent
        ).toBeDefined();
        expect(
          compiled.querySelector('.validation-pattern-password')?.textContent
        ).toBe(' Password must contain at least one number and one letter');
      });
    });

    describe('confirmPassword control', () => {
      it('should be able to set value of confirmPassword input', async () => {
        await setup();
        const input = await loader.getHarness(
          MatInputHarness.with({ selector: '#confirmPassword' })
        );

        expect(await input.getValue()).toBe('');
        await input.setValue(confirmPassword);

        expect(await input.getValue()).toBe(confirmPassword);
      });

      it('should show required validation messages when confirmPassword input is touched but empty', async () => {
        await setup();

        const formField = await loader.getHarness(
          MatFormFieldHarness.with({ selector: '#confirmPassword' })
        );
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(
          true
        );
        expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual([
          'Password is required',
        ]);

        fixture.componentInstance.form
          ?.get('passwordgroup')
          ?.get('confirmPassword')
          ?.setValue('');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('.validation-required-confirmPassword')
            ?.textContent
        ).toBeDefined();
        expect(
          compiled.querySelector('.validation-required-confirmPassword')
            ?.textContent
        ).toBe(' Password is required');
      });

      it('should show match validation messages when password and confirm password do not match', async () => {
        await setup();

        const passwordInput = await loader.getHarness(
          MatInputHarness.with({ selector: '#password' })
        );

        expect(await passwordInput.getValue()).toBe('');
        await passwordInput.setValue(password);
        expect(await passwordInput.getValue()).toBe(password);

        const matchPasswordInput = await loader.getHarness(
          MatInputHarness.with({ selector: '#confirmPassword' })
        );

        expect(await matchPasswordInput.getValue()).toBe('');
        await matchPasswordInput.setValue('not-match');
        expect(await matchPasswordInput.getValue()).toBe('not-match');

        const formField = await loader.getHarness(
          MatFormFieldHarness.with({ selector: '#confirmPassword' })
        );
        expect((await formField.getControl()) instanceof MatInputHarness).toBe(
          true
        );
        // expect(await formField.getTextErrors()).toEqual([]);

        await ((await formField.getControl()) as MatInputHarness)?.blur();
        expect(await formField.getTextErrors()).toEqual([
          'Passwords do not match',
        ]);

        fixture.componentInstance.form
          ?.get('passwordgroup')
          ?.get('password')
          ?.setValue(password);
        fixture.componentInstance.form
          ?.get('passwordgroup')
          ?.get('confirmPassword')
          ?.setValue('not-match');
        expect(await formField.isControlValid()).toBe(false);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('.validation-match-confirmPassword')
            ?.textContent
        ).toBeDefined();
        expect(
          compiled.querySelector('.validation-match-confirmPassword')
            ?.textContent
        ).toBe(' Passwords do not match');
      });
    });

    it('should not submit an invalid form', async () => {
      await setup();

      const submitBtn = await loader.getHarness(
        MatButtonHarness.with({ text: 'Update password' })
      );
      expect(await submitBtn.isDisabled()).toBe(true);

      await submitBtn.click();

      expect(fakeAccountService.resetPassword).not.toHaveBeenCalled();
    });

    it('test form validity check onSubmit()', async () => {
      await setup();

      component.onSubmit();

      expect(fakeAccountService.resetPassword).not.toHaveBeenCalled();
    });

    it('should call the service on Submit', async () => {
      await setup();
      const submitBtn = await loader.getHarness(
        MatButtonHarness.with({ text: 'Update password' })
      );
      expect(await submitBtn.isDisabled()).toBe(true);

      const input2 = await loader.getHarness(
        MatInputHarness.with({ selector: '#email' })
      );
      await input2.setValue(email);

      const input3 = await loader.getHarness(
        MatInputHarness.with({ selector: '#password' })
      );
      await input3.setValue(password);

      const input4 = await loader.getHarness(
        MatInputHarness.with({ selector: '#confirmPassword' })
      );
      await input4.setValue(confirmPassword);

      expect(await submitBtn.isDisabled()).toBe(false);

      await submitBtn.click();

      expect(fakeAccountService.resetPassword).toHaveBeenCalledTimes(1);
      expect(fakeAccountService.resetPassword).toHaveBeenCalledWith(
        resetPasswordModel
      );
    });

    describe('handles service NEXT notification', () => {
      it('should handle success reposnse', async () => {
        await setup({ resetPassword: of({ success: true }) });

        expect(fixture.componentInstance.submitProgress()).toBe('idle');

        const submitBtn = await loader.getHarness(
          MatButtonHarness.with({ text: 'Update password' })
        );
        expect(await submitBtn.isDisabled()).toBe(true);

        const input2 = await loader.getHarness(
          MatInputHarness.with({ selector: '#email' })
        );
        await input2.setValue(email);

        const input3 = await loader.getHarness(
          MatInputHarness.with({ selector: '#password' })
        );
        await input3.setValue(password);

        const input4 = await loader.getHarness(
          MatInputHarness.with({ selector: '#confirmPassword' })
        );
        await input4.setValue(confirmPassword);

        expect(await submitBtn.isDisabled()).toBe(false);

        // Act
        await submitBtn.click();

        // Assert
        expect(fakeAccountService.resetPassword).toHaveBeenCalledWith(
          resetPasswordModel
        );
        expect(fakeAccountService.resetPassword).toHaveBeenCalledTimes(1);

        fixture.detectChanges();

        expect(fixture.componentInstance.submitProgress()).toBe('success');
        const isFormHidden = fixture.nativeElement as HTMLElement;
        expect(
          isFormHidden.querySelector('[data-testid="form"]')?.textContent
        ).toBeUndefined();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('[data-testid="success"]')?.textContent
        ).toBeDefined();
      });
    });

    describe('handles service ERROR notification', () => {
      it('should handle error reposnse', async () => {
        await setup({ resetPassword: throwError(() => new Error('error')) });

        expect(fixture.componentInstance.submitProgress()).toBe('idle');

        const submitBtn = await loader.getHarness(
          MatButtonHarness.with({ text: 'Update password' })
        );
        expect(await submitBtn.isDisabled()).toBe(true);

        const input2 = await loader.getHarness(
          MatInputHarness.with({ selector: '#email' })
        );
        await input2.setValue(email);

        const input3 = await loader.getHarness(
          MatInputHarness.with({ selector: '#password' })
        );
        await input3.setValue(password);

        const input4 = await loader.getHarness(
          MatInputHarness.with({ selector: '#confirmPassword' })
        );
        await input4.setValue(confirmPassword);

        expect(await submitBtn.isDisabled()).toBe(false);

        // Act
        await submitBtn.click();

        // Assert
        expect(fakeAccountService.resetPassword).toHaveBeenCalledWith(
          resetPasswordModel
        );
        expect(fakeAccountService.resetPassword).toHaveBeenCalledTimes(1);

        fixture.detectChanges();

        expect(fixture.componentInstance.submitProgress()).toBe('error');
        const isFormHidden = fixture.nativeElement as HTMLElement;
        expect(
          isFormHidden.querySelector('[data-testid="form"]')?.textContent
        ).toBeUndefined();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('[data-testid="success"]')?.textContent
        ).toBeUndefined();

        const error = fixture.nativeElement as HTMLElement;
        expect(
          error.querySelector('[data-testid="error"]')?.textContent
        ).toBeDefined();
      });
    });
  });
});
