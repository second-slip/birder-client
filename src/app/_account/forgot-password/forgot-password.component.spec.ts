import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../account.service';
import { ForgotPasswordComponent } from './forgot-password.component';
import { of, throwError } from 'rxjs';
import {
  emailModel,
  email
} from 'src/app/testing/account-tests-helpers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let fakeAccountService: jasmine.SpyObj<AccountService>;
  let loader: HarnessLoader;

  const setup = async (
    fakeAccountServiceReturnValues?: jasmine.SpyObjMethodNames<AccountService>) => {

    fakeAccountService = jasmine.createSpyObj<AccountService>(
      'AccountService',
      {
        isEmailTaken: undefined,
        isUsernameTaken: undefined,
        register: undefined,
        requestPasswordReset: undefined,
        resendEmailConfirmation: undefined,
        resetPassword: undefined,
        ...fakeAccountServiceReturnValues // Overwrite with given return values
      }
    );

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [{ provide: AccountService, useValue: fakeAccountService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  };


  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });


  describe('initial form setup', () => {

    it('should load 1 input harness', async () => {
      await setup();
      const inputs = await loader.getAllHarnesses(MatInputHarness);
      expect(inputs.length).toBe(1);
    });

    it('should load email input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('email');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe('');
    });

    it('should render the Submit button - disabled as form is invalid', async () => {
      await setup();
      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
      expect(await submitBtn.isDisabled()).toBe(true);
      expect(await submitBtn.getText()).toBe('Submit');
    });
  });

  describe('form completion and submission', async () => {

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
    });

    it('should not submit an invalid form', async () => {
      await setup();

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      await submitBtn.click();

      expect(fakeAccountService.requestPasswordReset).not.toHaveBeenCalled();
    });

    it('test form validity check onSubmit()', async () => {
      await setup();

      component.onSubmit();

      expect(fakeAccountService.requestPasswordReset).not.toHaveBeenCalled();
    });

    it('should call the service on Submit', async () => {
      await setup();
      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
      await input2.setValue(email);

      expect(await submitBtn.isDisabled()).toBe(false);

      await submitBtn.click();

      expect(fakeAccountService.requestPasswordReset).toHaveBeenCalledTimes(1);
      expect(fakeAccountService.requestPasswordReset).toHaveBeenCalledWith(emailModel);
    });
  });


  describe('handles service NEXT notification', () => {

    it('should handle success reposnse', async () => {
      await setup({ requestPasswordReset: of({ success: true }) });

      expect(fixture.componentInstance.submitProgress()).toBe('idle');

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
      await input2.setValue(email);

      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      // Assert
      expect(fakeAccountService.requestPasswordReset).toHaveBeenCalledWith(emailModel);
      expect(fakeAccountService.requestPasswordReset).toHaveBeenCalledTimes(1);

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
      await setup({ requestPasswordReset: throwError(() => new Error('error')) });

      expect(fixture.componentInstance.submitProgress()).toBe('idle');

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
      expect(await submitBtn.isDisabled()).toBe(true);

      const input2 = await loader.getHarness(MatInputHarness.with({ selector: '#email' }));
      await input2.setValue(email);

      expect(await submitBtn.isDisabled()).toBe(false);

      // Act
      await submitBtn.click();

      // Assert
      expect(fakeAccountService.requestPasswordReset).toHaveBeenCalledWith(emailModel);
      expect(fakeAccountService.requestPasswordReset).toHaveBeenCalledTimes(1);

      fixture.detectChanges();

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