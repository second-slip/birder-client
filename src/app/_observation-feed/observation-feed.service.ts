import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  finalize,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
} from 'rxjs';
import { IObservationFeed } from './i-observation-feed.dto';

@Injectable()
export class ObservationFeedService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  private readonly _allLoaded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly _observations$: BehaviorSubject<IObservationFeed[] | null> =
    new BehaviorSubject<IObservationFeed[] | null>(null);

  constructor(private _httpClient: HttpClient) {}

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get allLoaded(): Observable<boolean> {
    return this._allLoaded$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get observations(): Observable<IObservationFeed[] | null> {
    return this._observations$.asObservable();
  }

  public getData(pageIndex: number, url: string, pageSize: number = 10): void {
    if (this._allLoaded$.value) return; // todo: move to isCached method

    this._isLoading$.next(true);

    const parameters = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    this._httpClient
      .get<IObservationFeed[]>(url, { params: parameters })
      .pipe(
        shareReplay(),
        finalize(() => {
          this._isLoading$.next(false);
        }),
        takeUntil(this._subscription)
      )
      .subscribe({
        next: (items: IObservationFeed[]) => {
          this._observations$.next([
            ...(this._observations$.getValue() || []),
            ...items,
          ]); // spread syntax, or concat?

          this.lastId = items[- 1].observationId;
          this._moreToGet(pageSize, items.length);
        },
        error: () => {
          this._handleError();
        },
        complete: () => {
          if (this._isError$) this._isError$.next(false);
        },
      });
  }

  public lastId: number;


  private _moreToGet(pageSize: number, items: number): void {
    if (items < pageSize) {
      this._allLoaded$.next(true);
    }
  }

  private _handleError() {
    this._isError$.next(true);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}
