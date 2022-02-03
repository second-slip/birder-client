import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { IObservation } from '../i-observation.dto';

@Injectable({
  providedIn: 'root'
})
export class ObservationReadService {
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _observation$: BehaviorSubject<IObservation | null> = new BehaviorSubject<IObservation | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getObservation(): Observable<IObservation | null> {
    return this._observation$.asObservable();
  }

  public getData(id: string): void {

    if (!id) {
      this._isError$.next(true);
      return;
    }

    this._isLoading$.next(true);

    const options = id ?
      { params: new HttpParams().append('id', id.toString()) } : {};

    this._httpClient.get<IObservation>('api/Observation', options)
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe({
        next: (response) => {
          this._observation$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    this._isError$.next(true);
  }
}