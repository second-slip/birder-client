import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IObservationTopFive } from './i-observation-top-five.dto';

@Injectable({
  providedIn: 'root'
})
export class ObservationTopFiveService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _topObservations$: BehaviorSubject<IObservationTopFive | null> = new BehaviorSubject<IObservationTopFive | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get getTop(): Observable<IObservationTopFive | null> {
    return this._topObservations$.asObservable();
  }

  public getData(): void {

    this._httpClient.get<IObservationTopFive>('api/list/topObservationsList')
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this._topObservations$.next(response);
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