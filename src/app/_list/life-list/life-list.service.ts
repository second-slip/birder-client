import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { ILifeList } from './i-life-list.dto';

@Injectable()
export class LifeListService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _lifeList$: BehaviorSubject<ILifeList[] | null> = new BehaviorSubject<ILifeList[] | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get lifeList(): Observable<ILifeList[] | null> {
    return this._lifeList$.asObservable();
  }

  public getData(): void {
    this._httpClient.get<ILifeList[]>('api/list/life')
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response: ILifeList[]) => {
          this._lifeList$.next(response);
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
