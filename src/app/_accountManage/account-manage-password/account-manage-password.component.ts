import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { MatchOtherValidator, ValidatePassword } from 'src/app/_validators';
import { AccountManagerService } from '../account-manager.service';
import { IConfirmEmail } from '../account-manage-profile/i-confirm-email.dto';
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
  public errorObject: any = null;
  public changePasswordForm: UntypedFormGroup;

  constructor(private _formBuilder: UntypedFormBuilder
    , private _service: AccountManagerService
    , private _router: Router) { }

  ngOnInit(): void {
    this._createForms();
  }

  public onSubmit(formValue: any): void {
    this.requesting = true;

    const model = <IManagePassword>{
      oldPassword: formValue.oldPassword,
      newPassword: formValue.passwordGroup.password,
      confirmPassword: formValue.passwordGroup.confirmPassword
    };

    this._service.postChangePassword(model)
      .pipe(first(), finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: (r) => { this._redirect(); },
        error: (e) => { this.errorObject = e; }
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
      }, { validator: ValidatePassword.passwordMatcher })
    })
  }

  changePassword_validation_messages = {
    'oldPassword': [
      { type: 'required', message: 'Your current password required' },
    ],
    'password': [
      { type: 'required', message: 'Your new password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one number and one letter' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'You must confirm your new password' },
      { type: 'match', message: 'Password mismatch' }
    ]
  };

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}
