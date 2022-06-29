import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { ITweet } from '../i-tweet.dto';

@Injectable({
  providedIn: 'root'
})
export class TweetDayService {
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _tweet$: BehaviorSubject<ITweet | null> = new BehaviorSubject<ITweet | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getTweet(): Observable<ITweet | null> {
    return this._tweet$.asObservable();
  }

  public getData(): void {

    this._isLoading$.next(true);

    this._httpClient.get<ITweet>('api/Tweets')
      .pipe(finalize(() => { this._isLoading$.next(false); }))
      .subscribe({
        next: (response) => {
          this._tweet$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    this._isError$.next(true);
  }
}