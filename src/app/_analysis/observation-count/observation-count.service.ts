import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  shareReplay,
  takeUntil,
} from 'rxjs';
import { IObservationCount } from './i-observation-count.dto';

@Injectable({
  providedIn: 'root',
})
export class ObservationCountService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly _observationCount$: BehaviorSubject<IObservationCount | null> =
    new BehaviorSubject<IObservationCount | null>(null);

  constructor(private readonly _httpClient: HttpClient) {
    // this.getData();
  }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get count(): Observable<IObservationCount | null> {
    return this._observationCount$.asObservable();
  }

  public getData(): void {
    this._httpClient
      .get<IObservationCount>('api/observationanalysis')
      .pipe(shareReplay(), takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this._observationCount$.next(response);
        },
        error: (e) => {
          this._handleError(e);
        },
        complete: () => {
          if (this._isError$) this._isError$.next(false);
        },
      });
  }

  private _handleError(error: any) {
    this._isError$.next(true);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}
