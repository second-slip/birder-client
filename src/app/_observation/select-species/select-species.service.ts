import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';


@Injectable({
  providedIn: 'root'
})
export class SelectSpeciesService {
  private _dataValidUntil: number = 0;
  //private _dataValidUntil = new Subject<number>();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _birds$: BehaviorSubject<IBirdSummary[]> = new BehaviorSubject<IBirdSummary[]>([]);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getBirds(): IBirdSummary[] { // Observable<IBirdSummary[]> {
    return this._birds$.value;
  }

  public getData(): void {

    if (!this._isCacheExpired()) {
      //console.log('cached data are available');
      return;
    } //else {
    //console.log('cached data either not available or expired - proceed to data fetch');
    //}

    this._isLoading$.next(true);

    this._httpClient.get<IBirdSummary[]>('api/Birds/BirdsList')
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe({
        next: (response) => {
          this._birds$.next(response);
          this._dataValidUntil = new Date().setHours(24, 0, 0, 0);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) {
    this._isError$.next(true);
  }

  // The static Date.now() method returns 
  // the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
  private _isCacheExpired(): boolean {
    const isExpired = Date.now() >= this._dataValidUntil;
    return isExpired;
  }
}
