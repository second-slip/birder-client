import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { findInvalidControls } from 'src/app/testing/form-helpers';
import { MatchOtherValidator, ValidatePassword } from 'src/app/_validators';
import { AccountValidationService } from '../account-validation.service';
import { AccountService } from '../account.service';
import { IManagePassword } from './i-manage-password.dto';

@Component({
  selector: 'app-account-manage-password',
  templateUrl: './account-manage-password.component.html',
  styleUrls: ['./account-manage-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountManagePasswordComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  public requesting: boolean;
  public submitProgress: 'idle' | 'success' | 'error' = 'idle';
  public changePasswordForm: FormGroup;

  constructor(private readonly _formBuilder: FormBuilder
    , readonly _validation: AccountValidationService
    , private readonly _service: AccountService
    , private readonly _router: Router) { }

  ngOnInit(): void {
    this._createForms();
  }

  public onSubmit(formValue: any): void {
    console.log(findInvalidControls(this.changePasswordForm))
    if (!this.changePasswordForm.valid) return;
    this.requesting = true;

    const model = <IManagePassword>{
      oldPassword: formValue.oldPassword,
      newPassword: formValue.passwordGroup.password,
      confirmPassword: formValue.passwordGroup.confirmPassword
    };

    this._service.postChangePassword(model)
      .pipe(first(), finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: () => {
          this.submitProgress = 'success';
          this._redirect();
        },
        error: () => { this.submitProgress = 'error'; }
      });
  }

  private _redirect(): void {
    this._router.navigate(['/login']);
  }

  private _createForms() {
    this.changePasswordForm = this._formBuilder.group({
      oldPassword: ['', { validators: [Validators.required], }],
      passwordGroup: this._formBuilder.group({
        password: ['', {
          validators: [
            Validators.minLength(8),
            Validators.required,
            Validators.pattern('^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9!@#$%]+$')]
        }],
        confirmPassword: ['', {
          validators: [
            Validators.required,
            MatchOtherValidator('password') // makes css ng-valid label invalid if not matching
          ]
        }],
      }, { validators: ValidatePassword.passwordMatcher })
    })
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}