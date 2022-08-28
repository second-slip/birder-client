import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { map, Observable, timer, switchMap } from 'rxjs';

const ASYNC_VALIDATION_DELAY = 1000;

@Injectable({
  providedIn: 'root'
})
export class AccountValidationService {

  constructor(private readonly _http: HttpClient) { }

  public validateUsername(username: string): ReturnType<AsyncValidatorFn> {
    return timer(ASYNC_VALIDATION_DELAY).pipe(
      switchMap(() => this.isUsernameTaken(username)),
      map((usernameTaken) => (usernameTaken ? { usernameTaken: true } : null)),
    );
  }

  public validateEmail(email: string): ReturnType<AsyncValidatorFn> {
    return timer(ASYNC_VALIDATION_DELAY).pipe(
      switchMap(() => this.isEmailTaken(email)),
      map((emailTaken) => (emailTaken ? { emailTaken: true } : null)),
    );
  }

  public isUsernameTaken(username: string): Observable<boolean> {
    return this._http.post<{ usernameTaken: boolean }>('api/Account/checkusername', {
      username,
    }).pipe(map((result) => result.usernameTaken));
  }

  public isEmailTaken(email: string): Observable<boolean> {
    return this._http.post<{ emailTaken: boolean }>('api/Account/checkemail', { email }).pipe(
      map((result) => result.emailTaken),
    );
  }
}