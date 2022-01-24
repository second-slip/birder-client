import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { ITweetDay } from '../i-tweet-day.dto';

@Injectable({
  providedIn: 'root'
})
export class TweetDayService {

  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _observationCount$: BehaviorSubject<ITweetDay | null> = new BehaviorSubject<ITweetDay | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getTweet(): Observable<ITweetDay | null> {
    return this._observationCount$.asObservable();
  }

  public getData(): void {

    this._isLoading$.next(true);

    this._httpClient.get<ITweetDay>('api/Tweets/TweetDay')
      .pipe(finalize(() => { this._isLoading$.next(false); }))
      .subscribe({
        next: (response) => {
          this._observationCount$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    this._isError$.next(true);
  }
}
