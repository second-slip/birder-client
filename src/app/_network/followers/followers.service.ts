import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { INetworkUser } from '../i-network-user.dto';

@Injectable({
  providedIn: 'root'
})
export class FollowersService {

  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _followers$: BehaviorSubject<INetworkUser[] | null> = new BehaviorSubject<INetworkUser[] | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getFollowers(): Observable<INetworkUser[] | null> {
    return this._followers$.asObservable();
  }

  // public get getFollowing(): Observable<INetworkUser[] | null> {
  //   return this._following$.asObservable();
  // }

  public getData(): void {

    this._isLoading$.next(true);

    this._httpClient.get<INetworkUser[]>('api/Network/GetFollowers')
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe({
        next: (response) => {
          this._followers$.next(response);
        },
        error: (e) => { this._handleError(e); }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    //console.log(error);
    this._isError$.next(true);
  }


}
