import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IManageLocation } from './account-manage-location/i-manage-location.dto';
import { IConfirmEmail } from './account-manage-profile/i-confirm-email.dto';
import { IManagePassword } from './account-manage-password/i-manage-password.dto';
import { IManageProfile } from './account-manage-profile/i-manage-profile.dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AccountManagerService {

  constructor(private readonly _http: HttpClient) { }

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

  // postAvatar(formData: FormData): Observable<any> {
  //   return this._http.post('api/Manage/Avatar', formData, { reportProgress: true, observe: 'events' });
  // }
}
