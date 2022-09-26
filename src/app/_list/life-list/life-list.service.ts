import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, finalize, Observable, Subject, takeUntil } from 'rxjs';
import { ILifeList } from './i-life-list.dto';

@Injectable()
export class LifeListService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _lifeList$: BehaviorSubject<ILifeList[]> = new BehaviorSubject<ILifeList[]>([]);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getLifeList(): Observable<ILifeList[]> {
    return this._lifeList$.asObservable();
  }

  public getData(): void {

    this._isLoading$.next(true);

    this._httpClient.get<ILifeList[]>('api/List/LifeList')
      .pipe(finalize(() => this._isLoading$.next(false)), takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this._lifeList$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    this._isError$.next(true);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}
