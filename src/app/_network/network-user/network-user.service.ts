import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { INetworkUser } from '../i-network-user.dto';
import { NetworkSummaryService } from '../network-summary/network-summary.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NetworkUserService {

  constructor(private readonly _http: HttpClient, private readonly _service: NetworkSummaryService) { }

  postFollowUser(viewModel: INetworkUser): Observable<INetworkUser> {
    return this._http.post<INetworkUser>('api/Network/Follow', viewModel, httpOptions)
      .pipe(tap(_ => { this._onNetworkChanged(); }));
  }

  postUnfollowUser(viewModel: INetworkUser): Observable<INetworkUser> {
    return this._http.post<INetworkUser>('api/Network/Unfollow', viewModel, httpOptions)
      .pipe(tap(_ => { this._onNetworkChanged(); }));
  }

  private _onNetworkChanged(): void {
    this._service.getData();
  }
}
