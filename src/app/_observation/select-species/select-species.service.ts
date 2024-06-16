import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { IBirdListState } from './i-bird-list-state.dto';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectSpeciesService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _httpClient = inject(HttpClient);

  private state = signal<IBirdListState>({ // state
    speciesList: [],
    // loaded: false,
    error: false
  });

  public birds = computed(() => this.state().speciesList);
  // public loaded = computed(() => this.state().loaded);
  public error = computed(() => this.state().error)

  constructor() {
    this._fetchData();
  }

  public retry(): void {
    this._fetchData();
  }

  private _fetchData(): void {
    this._httpClient.get<IBirdSummary[]>('api/birds-list')
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response) => {
          this.state.update((state) => ({
            // ...state,
            speciesList: response,
            loaded: false,
            error: false
          }));
        },
        error: (e) => {
          this.state.update((e) => ({ ...e, error: true }))
        }
      });
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}