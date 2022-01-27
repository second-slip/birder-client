import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { isThisTypeNode } from 'typescript';
import { IBirdSummary } from '../_bird/i-bird-summary.dto';

@Injectable({
  providedIn: 'root'
})
export class SelectSpeciesService {
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _birds$: BehaviorSubject<IBirdSummary[]> = new BehaviorSubject<IBirdSummary[]>([]);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get isLoading(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public get getBirds(): IBirdSummary[] { // Observable<IBirdSummary[]> {
    return this._birds$.value;
  }

  private y = { fetched: false, _fetchedTime: new Date() };

  _check(): boolean {
    var expiry = new Date();
    expiry.setUTCHours(23, 59, 59, 999);

    //short circuit
    var getData = ((!this.y.fetched) || (this.y._fetchedTime > expiry));
    
    return getData;

  }

  public getData(): void {

    console.log('getData is: ' + this._check());


    this._isLoading$.next(true);

    this._httpClient.get<IBirdSummary[]>('api/Birds/BirdsList')
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe({
        next: (response) => {
          this._birds$.next(response);
          
          this.y.fetched = true;
          this.y._fetchedTime = new Date();
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) { // no need to send error to the component...
    this._isError$.next(true);
  }
}
