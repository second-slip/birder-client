import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IManageLocation } from './account-manage-location/i-manage-location.dto';
import { IManagePassword } from './account-manage-password/i-manage-password.dto';
import { IManageProfile } from './account-manage-profile/i-manage-profile.dto';
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

  public register(model: IAccountRegistration): Observable<{ success: true }> {
    return this._http.post<{ success: true }>('api/account/register', model, httpOptions);
  }

  public requestPasswordReset(model: IUserEmail): Observable<{ success: true }> {
    return this._http.post<{ success: true }>('api/account/request-password-reset', model, httpOptions);
  }

  public resendEmailConfirmation(model: IUserEmail): Observable<{ success: true }> {
    return this._http.post<{ success: true }>('api/account/resend-email-confirmation', model, httpOptions);
  }

  public resetPassword(model: IResetPassword): Observable<{ success: true }> {
    return this._http.post<{ success: true }>('api/account/reset-password', model, httpOptions);
  }

  public isUsernameTaken(username: string): Observable<boolean> {
    const options = username ?
      { params: new HttpParams().append('username', username.toString()) } : {};

    return this._http.get<{ usernameTaken: boolean }>('api/account/check-username', options)
      .pipe(map((result) => result.usernameTaken));
  }

  public isEmailTaken(email: string): Observable<boolean> {
    const options = email ?
      { params: new HttpParams().append('email', email.toString()) } : {};

    return this._http.get<{ emailTaken: boolean }>('api/account/check-email', options)
      .pipe(map((result) => result.emailTaken));
  }

  public getUserProfile(): Observable<IManageProfile> {
    return this._http.get<IManageProfile>('api/manage');
  }

  public postUpdateProfile(viewModel: IManageProfile): Observable<boolean> {
    return this._http.post<{ emailConfirmationRequired: boolean }>('api/manage/profile', viewModel, httpOptions)
      .pipe(map((result) => result.emailConfirmationRequired));
  }

  postChangePassword(viewModel: IManagePassword): Observable<{ success: true }> {
    return this._http.post<{ success: true }>('api/manage/password', viewModel, httpOptions);
  }

  public postUpdateLocation(viewModel: IManageLocation): Observable<{ success: true }> {
    return this._http.post<{ success: true }>('api/manage/location', viewModel, httpOptions);
  }
}