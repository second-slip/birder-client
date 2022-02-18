import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccountRegistration } from './account-registration/i-account-registration';

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

  // forgotPassword(viewModel: UserEmailDto): Observable<UserEmailDto> {
  //   return this.http.post<UserEmailDto>('api/Account/ForgotPassword', viewModel, httpOptions);
  // }

  // resendEmailConfirmation(viewModel: UserEmailDto): Observable<UserEmailDto> {
  //   return this.http.post<UserEmailDto>('api/Account/ResendEmailConfirmation', viewModel, httpOptions);
  // }

  // resetPassword(viewModel: ResetPasswordViewModel): Observable<ResetPasswordViewModel> {
  //   return this.http.post<ResetPasswordViewModel>('api/Account/ResetPassword', viewModel, httpOptions);
  // }

  // checkValidUsername(username: string): Observable<boolean> {
  //   username = username.trim();

  //   const options = username ?
  //     { params: new HttpParams().set('username', username) } : {};

  //   return this.http.get<boolean>('api/Account/IsUsernameAvailable', options)
  //     .pipe(first());
  // }
}
