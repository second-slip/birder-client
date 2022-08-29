import { Injectable } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { map, timer, switchMap } from 'rxjs';
import { AccountService } from './account.service';

const ASYNC_VALIDATION_DELAY = 1000;

@Injectable({
  providedIn: 'root'
})
export class AccountValidationService {

  constructor(private readonly _service: AccountService) { }

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
}