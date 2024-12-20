import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { IObservationFeed } from './i-observation-feed.dto';
import { finalize, shareReplay, Subject, takeUntil } from 'rxjs';

@Injectable()
export class ObservationFeedService implements OnDestroy {
  private readonly _httpClient = inject(HttpClient);
  private readonly _subscription = new Subject();
  private readonly _observations = signal<IObservationFeed[] | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _isError = signal(false);
  private readonly _isAllLoaded = signal(false);
  private readonly _lastLoadedRecordId = signal(0);

  get isLoading(): Signal<boolean> {
    return this._isLoading.asReadonly();
  }
  get isError(): Signal<boolean> {
    return this._isError.asReadonly();
  }
  get isAllLoaded(): Signal<boolean> {
    return this._isAllLoaded.asReadonly();
  }
  get lastLoadedRecordId(): Signal<number> {
    return this._lastLoadedRecordId.asReadonly();
  }
  get observations(): Signal<IObservationFeed[] | null> {
    return this._observations.asReadonly();
  }

  constructor() {}

  public getData(pageIndex: number, url: string, pageSize: number = 10): void {
    if (this._isAllLoaded()) return;

    this._isLoading.set(true);

    const parameters = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    this._httpClient
      .get<IObservationFeed[]>(url, { params: parameters })
      .pipe(
        shareReplay(),
        finalize(() => {
          this._isLoading.set(false);
        }),
        takeUntil(this._subscription)
      )
      .subscribe({
        next: (items: IObservationFeed[]) => {
          this._observations.set([...(this._observations() || []), ...items]);

          this._setLastLoadedRecordId(items);
          this._moreToGet(pageSize, items.length);
        },
        error: () => {
          this._isError.set(true);
        },
        complete: () => {
          if (this._isError()) this._isError.set(false);
        },
      });
  }

  private _setLastLoadedRecordId(items: IObservationFeed[]): void {
    const id = items[items.length - 1]?.observationId;
    if (id) this._lastLoadedRecordId.set(id);
  }

  private _moreToGet(pageSize: number, items: number): void {
    if (items < pageSize) this._isAllLoaded.set(true);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}
