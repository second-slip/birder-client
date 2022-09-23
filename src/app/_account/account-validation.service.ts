import { Injectable } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { timer, switchMap, map } from 'rxjs';
import { AccountService } from './account.service';

const ASYNC_VALIDATION_DELAY = 1000;

@Injectable({
  providedIn: 'root'
})
export class AccountValidationService {

  constructor(private _service: AccountService) { }

  public validateUsername(username: string): ReturnType<AsyncValidatorFn> {
    return timer(ASYNC_VALIDATION_DELAY).pipe(
      switchMap(() => this._service.isUsernameTaken(username)),
      map((usernameTaken) => (usernameTaken ? { usernameTaken: true } : null)),
    );
  }

  public validateEmail(email: string): ReturnType<AsyncValidatorFn> {
    return timer(ASYNC_VALIDATION_DELAY).pipe(
      switchMap(() => this._service.isEmailTaken(email)),
      map((emailTaken) => (emailTaken ? { emailTaken: true } : null)),
    );
  }

  public account_validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 20 characters long' },
      { type: 'pattern', message: 'Your username must be alphanumeric (no special characters) and must not contain spaces' },
      { type: 'restrictedName', message: 'Username may not contain the name "birder"' },
      { type: 'usernameTaken', message: 'This username has been taken' } //,
      // { type: 'serverError', message: 'Unable to connect to the server.  Please try again.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' },
      { type: 'emailTaken', message: 'There is already an account with this email' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one number and one letter' }
      // { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'match', message: 'Passwords do not match' }
    ],
    'oldPassword': [
      { type: 'required', message: 'Your current password required' },
    ]
  };
}