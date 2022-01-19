import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { INetworkUser } from '../i-network-user.dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NetworkUserService {

  constructor(private readonly _http: HttpClient) { }

  postFollowUser(viewModel: INetworkUser): Observable<INetworkUser> {
    console.log('postFollowUser');
    return this._http.post<INetworkUser>('api/Network/Follow', viewModel, httpOptions)
      .pipe(tap(_ => { this._onNetworkChanged(); }));
  }

  postUnfollowUser(viewModel: INetworkUser): Observable<INetworkUser> {
    return this._http.post<INetworkUser>('api/Network/Unfollow', viewModel, httpOptions)
      .pipe(tap(_ => { this._onNetworkChanged(); }));
  }

  private _onNetworkChanged(): void {
    // this.networkChanged.next(1);
  }
}
