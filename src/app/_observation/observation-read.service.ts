import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IObservationViewDto } from './i-observation-view.dto';

@Injectable()
export class ObservationReadService implements OnDestroy {
  private readonly _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _observation$: BehaviorSubject<IObservationViewDto | null> = new BehaviorSubject<IObservationViewDto | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get observation(): Observable<IObservationViewDto | null> {
    return this._observation$.asObservable();
  }

  public getData(id: string): void {

    if (!id) {
      this._isError$.next(true);
      return;
    }

    const options = id ?
      { params: new HttpParams().append('id', id.toString()) } : {};

    this._httpClient.get<IObservationViewDto>('api/observationread', options)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response: IObservationViewDto) => {
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