import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IRecording } from './i-recording.dto';

@Injectable()
export class RecordingsService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _recordings$: BehaviorSubject<Array<IRecording> | null> = new BehaviorSubject<Array<IRecording> | null>(null);
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly _http: HttpClient) { }

  public get recordings(): Observable<Array<IRecording> | null> {
    return this._recordings$.asObservable();
  }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public getData(species: string): void {
    const options = species ? { params: new HttpParams().set('species', species) } : {};

    this._http.get<Array<IRecording>>('api/Recording', options)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (recordings: Array<IRecording>) => {
          this._recordings$.next(recordings);
        },
        error: (e: any) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      });
  }

  private _handleError(error: any) {
    this._isError$.next(true);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}