import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { IObservationCount } from './i-observation-count.dto';

@Injectable({
  providedIn: 'root'
})
export class ObservationCountService {

  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _observationCount$: BehaviorSubject<IObservationCount | null> = new BehaviorSubject<IObservationCount | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getCount(): Observable<IObservationCount | null> {
    return this._observationCount$.asObservable();
  }

  public getData(): void {
    this._isLoading$.next(true);

    this._httpClient.get<IObservationCount>('api/ObservationAnalysis')
      .pipe(finalize(() => { this._isLoading$.next(false); }))
      .subscribe({
        next: (response) => {
          this._observationCount$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) {
    this._isError$.next(true);
  }
}