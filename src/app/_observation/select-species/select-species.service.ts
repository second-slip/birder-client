import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';

@Injectable({
  providedIn: 'root'
})
export class SelectSpeciesService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _birds$: BehaviorSubject<IBirdSummary[]> = new BehaviorSubject<IBirdSummary[]>([]);

  constructor(private readonly _httpClient: HttpClient) { 
    this.getData();
  }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public get getBirds(): IBirdSummary[] {
    return this._birds$.value;
  }

  public getData(): void {

    this._httpClient.get<IBirdSummary[]>('api/birds-list')
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this._birds$.next(response);
        },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) {
    this._isError$.next(true);
  }


  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}