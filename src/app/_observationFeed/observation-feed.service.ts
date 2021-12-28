import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { IObservationFeed } from './i-observation-feed.dto';

@Injectable({
  providedIn: 'root'
})
export class ObservationFeedService {

  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _observations$: BehaviorSubject<IObservationFeed[]> = new BehaviorSubject<IObservationFeed[]>([]);

  constructor(private _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getObservations(): Observable<IObservationFeed[]> {
    return this._observations$.asObservable();
  }

  public getData(): void {

    this._isLoading$.next(true);

    this._httpClient.get<IObservationFeed[]>(`api/ObservationFeed`)
      //.pipe(map(data => this._mapToModel(data.rates)), finalize(() => this._isLoading$.next(false)))
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe({
        next: (r: IObservationFeed[]) => {
          this._observations$.next([...this._observations$.getValue(), ...r]);
        },
        error: (e: any) => { this._handleError(e); },
        complete: () => { }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    this._isError$.next(true);
  }
}
