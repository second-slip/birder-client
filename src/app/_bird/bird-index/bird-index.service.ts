import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, finalize, Observable, Subject, takeUntil } from 'rxjs';
import { IBirdSummary } from '../i-bird-summary.dto';
import { IBirdIndex } from './i-bird-index.dto';

@Injectable()
export class BirdIndexService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _totalItems$: BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly _birds$: BehaviorSubject<IBirdSummary[] | null> = new BehaviorSubject<IBirdSummary[] | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getBirds(): Observable<IBirdSummary[] | null> {
    return this._birds$.asObservable();
  }

  public get getTotalItems(): Observable<number> {
    return this._totalItems$.asObservable();
  }

  public getData(pageIndex: number, pageSize: number, speciesFilter: string): void {

    // if (!username) {
    //   this._isError$.next(true);
    //   return;
    // }

    this._isLoading$.next(true);

    const options = speciesFilter ?
      {
        params: new HttpParams()
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
          .set('speciesFilter', speciesFilter.toString())
      } : {};

    this._httpClient.get<IBirdIndex>('api/Birds', options)
      .pipe(finalize(() => this._isLoading$.next(false)), takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this._birds$.next(response.items);
          this._totalItems$.next(response.totalItems);
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