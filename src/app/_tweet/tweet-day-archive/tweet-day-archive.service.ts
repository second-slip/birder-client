import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, finalize, Observable, Subject, takeUntil } from 'rxjs';
import { ITweet } from '../i-tweet.dto';

@Injectable()
export class TweetDayArchiveService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _allLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _tweets$: BehaviorSubject<ITweet[] | null> = new BehaviorSubject<ITweet[] | null>(null);

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

  public get getTweets(): Observable<ITweet[] | null> {
    return this._tweets$.asObservable();
  }

  public getData(pageIndex: number, pageSize: number = 8): void {
    this._isLoading$.next(true);

    const parameters = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    this._httpClient.get<ITweet[]>('api/tweets/archive', { params: parameters })
      .pipe(finalize(() => { this._isLoading$.next(false) }), takeUntil(this._subscription))
      .subscribe({
        next: (items: ITweet[]) => {
          this._tweets$.next([...this._tweets$.getValue() || [], ...items]); // or concat?
          this._moreToGet(pageSize, items.length);
        },
        error: (e: any) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _moreToGet(pageSize: number, items: number): void {
    if (items < pageSize) {
      this._allLoaded$.next(true);
    }
  }

  private _handleError(error: any) {
    this._isError$.next(true);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}