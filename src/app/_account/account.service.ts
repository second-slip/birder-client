import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { map, Observable, switchMap, timer } from 'rxjs';
import { IManageLocation } from './account-manage-location/i-manage-location.dto';
import { IManagePassword } from './account-manage-password/i-manage-password.dto';
import { IConfirmEmail } from './account-manage-profile/i-confirm-email.dto';
import { IManageProfile } from './account-manage-profile/i-manage-profile.dto';
import { IAccountRegistration } from './account-registration/i-account-registration';
import { IUserEmail } from './i-user-email.dto';
import { IUsername } from './i-username.dto';
import { IResetPassword } from './reset-password/i-reset-password.dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const ASYNC_VALIDATION_DELAY = 1000;

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
    const model = <IUsername>{ username: username };

    return this._http.post<{ usernameTaken: boolean }>('api/account/check-username', { model }, httpOptions)
      .pipe(map((result) => result.usernameTaken));
  }

  public isEmailTaken(email: string): Observable<boolean> {
    const model = <IUserEmail>{ email: email };

    return this._http.post<{ emailTaken: boolean }>('api/account/check-email', { model }, httpOptions)
      .pipe(map((result) => result.emailTaken));
  }

  // todo: change route urls

  public getUserProfile(): Observable<IManageProfile> {
    return this._http.get<IManageProfile>('api/Manage');
  }

  public postUpdateProfile(viewModel: IManageProfile): Observable<IConfirmEmail> {
    return this._http.post<IConfirmEmail>('api/Manage/Profile', viewModel, httpOptions);
  }

  postChangePassword(viewModel: IManagePassword): Observable<any> {
    return this._http.post<any>('api/Manage/Password', viewModel, httpOptions);
  }

  public postUpdateLocation(viewModel: IManageLocation): Observable<IManageLocation> {
    return this._http.post<IManageLocation>('api/Manage/Location', viewModel, httpOptions);
  }

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

  // postAvatar(formData: FormData): Observable<any> {
  //   return this._http.post('api/Manage/Avatar', formData, { reportProgress: true, observe: 'events' });
  // }
}