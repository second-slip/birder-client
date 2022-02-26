import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { IBirdDetail } from './i-bird-detail.dto';

@Injectable()
export class BirdDetailService {
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _bird$: BehaviorSubject<IBirdDetail | null> = new BehaviorSubject<IBirdDetail | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getBird(): Observable<IBirdDetail | null> {
    return this._bird$.asObservable();
  }

  public getData(id: string): void {

    if (!id) {
      this._isError$.next(true);
      return;
    }

    this._isLoading$.next(true);

    const options = id ?
      { params: new HttpParams().append('id', id.toString()) } : {};

    this._httpClient.get<IBirdDetail>('api/Birds/Bird', options)
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe({
        next: (response) => {
          this._bird$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    this._isError$.next(true);
  }
}
