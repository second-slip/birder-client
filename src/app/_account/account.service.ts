import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccountRegistration } from './account-registration/i-account-registration';
import { IUserEmail } from './i-user-email.dto';
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
    return this._http.post<IAccountRegistration>('api/Account/Register', model, httpOptions);
  }

  public requestPasswordReset(model: IUserEmail): Observable<IUserEmail> {
    return this._http.post<IUserEmail>('api/Account/RequestPasswordReset', model, httpOptions);
  }

  public resendEmailConfirmation(model: IUserEmail): Observable<IUserEmail> {
    return this._http.post<IUserEmail>('api/Account/ResendEmailConfirmation', model, httpOptions);
  }

  public resetPassword(model: IResetPassword): Observable<IResetPassword> {
    return this._http.post<IResetPassword>('api/Account/ResetPassword', model, httpOptions);
  }
}
