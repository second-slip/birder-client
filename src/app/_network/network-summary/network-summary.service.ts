import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { INetworkSummary } from '../i-network-summary.dto';

@Injectable({
  providedIn: 'root' // must be a singleton.  Updated from multiple components
})
export class NetworkSummaryService {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _summary$: BehaviorSubject<INetworkSummary | null> = new BehaviorSubject<INetworkSummary | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get getSummary(): Observable<INetworkSummary | null> {
    return this._summary$.asObservable();
  }

  public getData(): void {
    this._httpClient.get<INetworkSummary>('api/network')
    .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this._summary$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) {
    this._isError$.next(true);
  }
}