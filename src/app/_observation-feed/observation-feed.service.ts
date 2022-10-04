import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, finalize, Observable, Subject, takeUntil } from 'rxjs';
import { IObservationFeed } from './i-observation-feed.dto';

@Injectable()
export class ObservationFeedService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _allLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _observations$: BehaviorSubject<IObservationFeed[] | null> = new BehaviorSubject<IObservationFeed[] | null>(null);

  constructor(private _httpClient: HttpClient) { }

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

    this._isLoading$.next(true);

    const parameters = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    this._httpClient.get<IObservationFeed[]>(url, { params: parameters })
      .pipe(finalize(() => { this._isLoading$.next(false) }), takeUntil(this._subscription))
      .subscribe({
        next: (items: IObservationFeed[]) => {
          this._observations$.next([...this._observations$.getValue() || [], ...items]); // spread syntax, or concat?
          this._moreToGet(pageSize, items.length);
        },
        error: (e: any) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _moreToGet(pageSize: number, items: number): void {
    if (items < pageSize) {
      // console.log('no more available');
      this._allLoaded$.next(true);
    }
  }

  private _handleError(error: any) {
    this._isError$.next(true);
  }

  ngOnDestroy(): void {
    // console.log('feed service destroyed...');
    this._subscription.next('');
    this._subscription.complete();
  }
}
