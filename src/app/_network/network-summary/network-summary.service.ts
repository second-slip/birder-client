import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { INetworkSummary } from '../i-network-summary.dto';

@Injectable({
  providedIn: 'root'
})
export class NetworkSummaryService {

  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _summary$: BehaviorSubject<INetworkSummary | null> = new BehaviorSubject<INetworkSummary | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getSummary(): Observable<INetworkSummary | null> {
    return this._summary$.asObservable();
  }

  public getData(): void {

    this._isLoading$.next(true);

    this._httpClient.get<INetworkSummary>('api/Network')
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe({
        next: (response) => {
          this._summary$.next(response);
        },
        error: (e) => { this._handleError(e); }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    //console.log(error);
    this._isError$.next(true);
  }
}
