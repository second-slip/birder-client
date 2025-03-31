import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { finalize, map, Subject, takeUntil } from 'rxjs';
import { IObservationTopFive } from '../i-observation-top-five.dto';

const numberOfDays = 30;

@Injectable({
  providedIn: 'root',
})
export class TopFiveFilterService {
  private readonly _httpClient = inject(HttpClient);

  private readonly _subscription = new Subject();

  private readonly _records = signal<IObservationTopFive[]>([]); //no null
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

  public getData(): void {
    this._isLoading.set(true);

    const parameters = new HttpParams().set('days', numberOfDays.toString());

    this._httpClient
      .get<IObservationTopFive[]>('api/list/top-five-filter',  { params: parameters })
      .pipe(
        finalize(() => {
          this._isLoading.set(false);
        }),
        //delay(1000),
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
