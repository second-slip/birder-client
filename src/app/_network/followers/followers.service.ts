import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { INetworkUser } from '../i-network-user.dto';

@Injectable()
export class FollowersService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _followers$: BehaviorSubject<INetworkUser[] | null> = new BehaviorSubject<INetworkUser[] | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get getFollowers(): Observable<INetworkUser[] | null> {
    return this._followers$.asObservable();
  }

  public getData(username: string | null): void {

    if (!username) {
      this._isError$.next(true);
      return;
    }

    const options = username ?
      { params: new HttpParams().set('requestedUsername', username) } : {};

    this._httpClient.get<INetworkUser[]>('api/network/followers', options)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this._followers$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any):void { // no need to send error to the component...
    this._isError$.next(true);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}