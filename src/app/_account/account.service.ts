import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IAccountRegistration } from './account-registration/i-account-registration';
import { IUserEmail } from './i-user-email.dto';
import { IUsername } from './i-username.dto';
import { IResetPassword } from './reset-password/i-reset-password.dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private readonly _http: HttpClient) { }

  public register(model: IAccountRegistration): Observable<IAccountRegistration> {
    return this._http.post<IAccountRegistration>('api/account/register', model, httpOptions);
  }

  public requestPasswordReset(model: IUserEmail): Observable<boolean> {
    return this._http.post<{ success: boolean }>('api/account/request-password-reset', model, httpOptions)
      .pipe(map((result) => result.success));
  }

  public resendEmailConfirmation(model: IUserEmail): Observable<IUserEmail> {
    return this._http.post<IUserEmail>('api/account/resend-email-confirmation', model, httpOptions);
  }

  public resetPassword(model: IResetPassword): Observable<IResetPassword> {
    return this._http.post<IResetPassword>('api/account/reset-password', model, httpOptions);
  }

  public isUsernameTaken(username: string): Observable<boolean> {
    const model = <IUsername>{ username: username };

    return this._http.post<{ usernameTaken: boolean }>('api/account/check-username', { model }, httpOptions)
      .pipe(map((result) => result.usernameTaken));
  }

  public isEmailTaken(email: string): Observable<boolean> {
    const model = <IUserEmail>{ email: email };

    return this._http.post<{ emailTaken: boolean }>('api/account/check-email', { model }, httpOptions)
      .pipe(map((result) => result.emailTaken));
  }
}