import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IBirdDetail } from './i-bird-detail.dto';

@Injectable()
export class BirdDetailService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _bird$: BehaviorSubject<IBirdDetail | null> = new BehaviorSubject<IBirdDetail | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get getBird(): Observable<IBirdDetail | null> {
    return this._bird$.asObservable();
  }

  public getData(id: string): void {
    const options = id ?
      { params: new HttpParams().append('id', id.toString()) } : {};

    this._httpClient.get<IBirdDetail>('api/Birds/Bird', options)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this._bird$.next(response);
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