import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { INetworkUser } from '../i-network-user.dto';

@Injectable()

export class NetworkFindService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _searchResults$: BehaviorSubject<INetworkUser[] | null> = new BehaviorSubject<INetworkUser[] | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get getSearchResults(): Observable<INetworkUser[] | null> {
    return this._searchResults$.asObservable();
  }

  public getData(searchCriterion: string): void {

    const options = searchCriterion ?
      { params: new HttpParams().set('searchCriterion', searchCriterion) } : {};

    this._httpClient.get<INetworkUser[]>('api/network/search', options)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this._searchResults$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) {
    this._isError$.next(true);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}