import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { IObservationFeed } from './i-observation-feed.dto';

@Injectable({
  providedIn: 'root'
})
export class ObservationFeedService {

  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _allLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _observations$: BehaviorSubject<IObservationFeed[]> = new BehaviorSubject<IObservationFeed[]>([]);

  constructor(private _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get allLoaded(): Observable<boolean> {
    return this._allLoaded$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getObservations(): Observable<IObservationFeed[]> {
    return this._observations$.asObservable();
  }

  // do this is a more sophisticated way than just on feed component destruction
  // --> observations are changed / home button clicked etc / after x time elapsed

  // onObservationsChanged    ---> alert which says new observations are available?
  public resetFeed(): void {
    this._observations$.next([]);
  }

  public getData(pageIndex: number, pageSize: number = 10, filter: string = ''): void {

    const parameters = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    // .set('filter', filter.toString());

    console.log(pageIndex);

    this._isLoading$.next(true);

    this._httpClient.get<IObservationFeed[]>(`api/ObservationFeed`, { params: parameters })
      .pipe(finalize(() => {
        this._isLoading$.next(false);
      }))
      .subscribe({
        next: (items: IObservationFeed[]) => {
          this._observations$.next([...this._observations$.getValue(), ...items]); // or concat?
          this._moreToGet(pageSize, items.length);
          if (this._isError$) this._isError$.next(false);
        },
        error: (e: any) => { this._handleError(e); } //,
        // complete: () => {  }
      })
  }

  private _moreToGet(pageSize: number, items: number): void {
    if (items < pageSize) {
      console.log('no more available');
      this._allLoaded$.next(true);
    }
  }

  private _handleError(error: any) { // no need to send the error to the component...
    this._isError$.next(true);
  }
}
