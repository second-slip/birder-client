import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public postUpdateProfile(viewModel: IManageProfile): Observable<IManageProfile> {
    return this._http.post<IManageProfile>('api/Manage/Profile', viewModel, httpOptions);
  }

  // postChangePassword(viewModel: ChangePasswordViewModel): Observable<ChangePasswordViewModel> {
  //   return this._http.post<ChangePasswordViewModel>('api/Manage/Password', viewModel, httpOptions);
  // }

  // postSetLocation(viewModel: SetLocationViewModel): Observable<SetLocationViewModel> {
  //   return this._http.post<SetLocationViewModel>('api/Manage/Location', viewModel, httpOptions);
  // }

  // postAvatar(formData: FormData): Observable<any> {
  //   return this._http.post('api/Manage/Avatar', formData, { reportProgress: true, observe: 'events' });
  // }
}
