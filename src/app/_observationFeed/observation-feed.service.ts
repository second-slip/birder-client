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

  // do this is a more sophisticated way than just on feed component destruction
  // --> observations are changed / home button clicked etc / after x time elapsed
  public resetFeed(): void {

    //this._observations$.next([]);
  }

  public getData(): void {

    this._isLoading$.next(true);

    this._httpClient.get<IObservationFeed[]>(`api/ObservationFeed`)
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe({
        next: (r: IObservationFeed[]) => {
          this._observations$.next([...this._observations$.getValue(), ...r]); // or concat?
        },
        error: (e: any) => { this._handleError(e); },
        complete: () => { }
      })
  }

  private _handleError(error: any) { // no need to send the error to the component...
    this._isError$.next(true);
  }
}
