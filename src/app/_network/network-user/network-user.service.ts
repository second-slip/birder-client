import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this._http.post<INetworkUser>('api/network/follow', viewModel, httpOptions);
  }

  postUnfollowUser(viewModel: INetworkUser): Observable<INetworkUser> {
    return this._http.post<INetworkUser>('api/network/unfollow', viewModel, httpOptions);
  }
}
