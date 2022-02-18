import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccountRegistration } from './account-registration/i-account-registration';
import { IEmailResend } from './confirm-email/i-email-resend.dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private readonly _http: HttpClient) { }

  public register(model: IAccountRegistration): Observable<IAccountRegistration> {
    return this._http.post<IAccountRegistration>('api/Account/Register', model, httpOptions);
  }

  // forgotPassword(model: UserEmailDto): Observable<UserEmailDto> {
  //   return this.http.post<UserEmailDto>('api/Account/ForgotPassword', model, httpOptions);
  // }

  public resendEmailConfirmation(model: IEmailResend): Observable<IEmailResend> {
    return this._http.post<IEmailResend>('api/Account/ResendEmailConfirmation', model, httpOptions);
  }

  // resetPassword(model: ResetPasswordmodel): Observable<ResetPasswordmodel> {
  //   return this.http.post<ResetPasswordmodel>('api/Account/ResetPassword', model, httpOptions);
  // }

  // checkValidUsername(username: string): Observable<boolean> {
  //   username = username.trim();

  //   const options = username ?
  //     { params: new HttpParams().set('username', username) } : {};

  //   return this.http.get<boolean>('api/Account/IsUsernameAvailable', options)
  //     .pipe(first());
  // }
}
