import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IObservation } from './i-observation.dto';


@Injectable()
export class ObservationReadService implements OnDestroy {
  private readonly _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  //private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _observation$: BehaviorSubject<IObservation | null> = new BehaviorSubject<IObservation | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  // public get isLoading(): Observable<boolean> {
  //   return this._isLoading$.asObservable();
  // }

  public get observation(): Observable<IObservation | null> {
    return this._observation$.asObservable();
  }

  public getData(id: string): void {

    if (!id) {
      this._isError$.next(true);
      return;
    }

    //this._isLoading$.next(true);

    const options = id ?
      { params: new HttpParams().append('id', id.toString()) } : {};

    this._httpClient.get<IObservation>('api/Observation', options)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this._observation$.next(response);
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