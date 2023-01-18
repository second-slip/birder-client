import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { INetworkUser } from '../i-network-user.dto';

@Injectable()

export class NetworkSuggestionService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _suggestions$: BehaviorSubject<INetworkUser[] | null> = new BehaviorSubject<INetworkUser[] | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get getNetworkSuggestions(): Observable<INetworkUser[] | null> {
    return this._suggestions$.asObservable();
  }

  public getData(): void {

    this._httpClient.get<INetworkUser[]>('api/network/suggestions')
    .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this._suggestions$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    //console.log(error);
    this._isError$.next(true);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}