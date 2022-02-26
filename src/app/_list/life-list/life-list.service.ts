import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { ILifeList } from './i-life-list.dto';

@Injectable()
export class LifeListService {
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _suggestions$: BehaviorSubject<ILifeList[]> = new BehaviorSubject<ILifeList[]>([]);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getLifeList(): Observable<ILifeList[]> {
    return this._suggestions$.asObservable();
  }

  public getData(username: string = ''): void {

    // const options = username ?
    //   { params: new HttpParams().set('requestedUsername', username) } : {};

    this._isLoading$.next(true);

    this._httpClient.get<ILifeList[]>('api/List/LifeList')
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe({
        next: (response) => {
          this._suggestions$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    this._isError$.next(true);
  }
}
