import { inject, Injectable, signal, Signal } from '@angular/core';
import { IObservationTopFive } from '../i-observation-top-five.dto';
import { finalize, map, shareReplay, Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TopFiveService {
  private readonly _httpClient = inject(HttpClient);

  private readonly _subscription = new Subject();

  private readonly _records = signal<IObservationTopFive[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _isError = signal(false);

  get isLoading(): Signal<boolean> {
    return this._isLoading.asReadonly();
  }
  get isError(): Signal<boolean> {
    return this._isError.asReadonly();
  }
  get records(): Signal<IObservationTopFive[]> {
    return this._records.asReadonly();
  }

  // constructor() {
  //   this.getData();
  // }

  public getData(): void {
    console.log('top 5 called');

    this._isLoading.set(true);

    this._httpClient
      .get<IObservationTopFive[]>('api/list/top')
      .pipe(
        finalize(() => {
          this._isLoading.set(false);
        }),
        //delay(1000),
        shareReplay(),
        takeUntil(this._subscription),
        map((data) => {
          if (data === null) {
            return [];
          }

          return data;
        })
      )
      .subscribe({
        next: (response: IObservationTopFive[]) => {
          this._records.set(response);
        },
        error: (e) => {
          this._isError.set(true);
        },
        complete: () => {
          if (this._isError) this._isError.set(false);
        },
      });
  }
}
