import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, first, Subject, takeUntil } from 'rxjs';

import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { RestrictedNameValidator } from 'src/app/_validators';
import { AccountValidationService } from '../account-validation.service';

import { AccountService } from '../account.service';
import { IManageProfile } from './i-manage-profile.dto';

@Component({
  selector: 'app-account-manage-profile',
  templateUrl: './account-manage-profile.component.html',
  styleUrls: ['./account-manage-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountManageProfileComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  public requesting: boolean;
  public manageProfileForm: FormGroup;
  public submitProgress: 'idle' | 'success' | 'error' = 'idle';

  constructor(private _formBuilder: FormBuilder
    , private readonly _service: AccountService
    , readonly _validation: AccountValidationService
    , private readonly _authService: AuthenticationService
    , private readonly _router: Router) { }

  ngOnInit(): void {
    this._getProfile();
  }

  public onSubmit(formValue: any): void {
    this.requesting = true;

    try {

      const model = <IManageProfile>{
        userName: formValue.username,
        email: formValue.email,
        emailConfirmationRequired: true
      };

      this._service.postUpdateProfile(model)
        .pipe(first(), finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
        .subscribe({
          next: (r) => {
            this.submitProgress = 'success';
            this._redirect(r);
          },
          error: () => { this.submitProgress = 'error'; }
        });
    }
    catch (error) {
      console.log(error);
    }
  }

  private _redirect(emailConfirmationRequired: boolean): void {
    if (emailConfirmationRequired) {
      this._authService.logout();
      this._router.navigate(['/confirm-email']);
    } else {
      this._router.navigate(['/login']);
    }
  }

  private _getProfile(): void {
    this._service.getUserProfile()
      .pipe(finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: (r) => {
          this.manageProfileForm = this._createForm(r);
        },
        error: () => { this.submitProgress = 'error'; }
      });
  }

  private _createForm(user: IManageProfile): FormGroup {
    return this._formBuilder.group({
      username: [
        user.userName,
        {
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
            Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$'), // ^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$
            RestrictedNameValidator(/birder/i)],
          asyncValidators: (control: AbstractControl) => this._validation.validateUsername(control.value),
          updateOn: 'blur'
        }
      ],
      email: [
        user.email,
        {
          validators: [Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
          asyncValidators: (control: AbstractControl) => this._validation.validateEmail(control.value),
          updateOn: 'blur'
        }
      ]
    });
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}