import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IBirdListState } from './i-bird-list-state.dto';

@Injectable({
  providedIn: 'root'
})
export class SelectSpeciesService {
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
    this._httpClient.get<IBirdSummary[]>('api/birds-list')
      .pipe(takeUntilDestroyed())
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
}