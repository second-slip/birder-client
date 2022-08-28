import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { AccountValidationService } from 'src/app/_account/account-validation.service';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { RestrictedNameValidator } from 'src/app/_validators';
import { AccountManagerService } from '../account-manager.service';
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
  public manageProfileForm: UntypedFormGroup;
  public errorObject: any = null;

  constructor(private _formBuilder: UntypedFormBuilder
    , private readonly _service: AccountManagerService
    , private readonly _authService: AuthenticationService
    , private _validation: AccountValidationService
    , private readonly _router: Router) { }

  ngOnInit(): void {
    this._getProfile();
  }

  public onSubmit(model: IManageProfile): void {
    this.requesting = true;

    try {
      this._service.postUpdateProfile(model)
        .pipe(first(), finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
        .subscribe({
          next: (r) => { this._redirect(r.isEmailConfirmationRequired); },
          error: (e) => {
            this.errorObject = e;
          }
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
        error: (e) => { this.errorObject = e; }
      });
  }

  private _createForm(user: IManageProfile): UntypedFormGroup {
    return this._formBuilder.group({
      userName: [
        user.userName,
        {
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
            Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$'), // ^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$
            RestrictedNameValidator(/birder/i)],
          //asyncValidators: [this._usernameService.usernameValidator()],
          asyncValidators: (control: AbstractControl) => this._validation.validateUsername(control.value),
          updateOn: 'blur'
        }
      ],
      email: [
        user.email,
        {
          validators: [Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]
        }
      ]
    });
  }

  profile_validation_messages = {
    'userName': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your username must be alphanumeric (no special characters) and must not contain spaces' },
      { type: 'restrictedName', message: 'Username may not contain the name "birder"' },
      // { type: 'usernameExists', message: 'Username is not available.  Please type another one...' },
      { type: 'usernameTaken', message: 'Username is not available.  Please type another one...' },
      { type: 'serverError', message: 'Unable to connect to the server.  Please try again.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ]
  };

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}