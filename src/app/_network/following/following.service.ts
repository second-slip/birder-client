import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { INetworkUser } from '../i-network-user.dto';

@Injectable({
  providedIn: 'root'
})
export class FollowingService {

  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _following$: BehaviorSubject<INetworkUser[] | null> = new BehaviorSubject<INetworkUser[] | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getFollowing(): Observable<INetworkUser[] | null> {
    return this._following$.asObservable();
  }

  public getData(username: string | null): void {

    if (!username) {
      this._isError$.next(true);
      return;
    }

    this._isLoading$.next(true);

    const options = username ?
      { params: new HttpParams().set('requestedUsername', username) } : {};

    this._httpClient.get<INetworkUser[]>('api/Network/GetFollowing', options)
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe({
        next: (response) => {
          this._following$.next(response);
        },
        error: (e) => { this._handleError(e); }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    //console.log(error);
    this._isError$.next(true);
  }
}
