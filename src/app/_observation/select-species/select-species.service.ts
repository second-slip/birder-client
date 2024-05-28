import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject } from 'rxjs';

export interface ChecklistItemsState {
  speciesList: IBirdSummary[];
  loaded: boolean;
  error: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SelectSpeciesService {

  destroyRef = inject(DestroyRef);

  constructor(private readonly _httpClient: HttpClient) {
    this.g();
  }

  public g(): void {
    alert('p')
    this._httpClient.get<IBirdSummary[]>('api/birds-list')
      .pipe(takeUntilDestroyed(this.destroyRef)) // need destroyRef outside an injection context
      .subscribe({
        next: (response) => {
          this.state.update((state) => ({
            // ...state,
            speciesList: response,
            loaded: true,
            error: false
          }))
        },
        error: (e) => {
          this.state.update((e) => ({ ...e, error: true }))
        },
        complete: () => { alert('hello1') }
      })
  }

  // state
  private state = signal<ChecklistItemsState>({
    speciesList: [],
    loaded: false,
    error: false
  })

  // selectors
  checklistItems = computed(() => this.state().speciesList);
  loaded = computed(() => this.state().loaded);
  error = computed(() => this.state().error)

  // source
  // fetch$ = this.g();
  // private checklistItemsLoaded$ = new Subject<IBirdSummary[]>();
}


// private _subscription = new Subject();
// private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
// private readonly _birds$: BehaviorSubject<IBirdSummary[]> = new BehaviorSubject<IBirdSummary[]>([]);

// todo -- test if length == 0
// public getData(): void { // Note: b.p: DO NOT call methods in the constructor
//   if (!this._birds$.value.length) { // only fetch if empty... | conider doing this by date as well?
//     this._httpClient.get<IBirdSummary[]>('api/birds-list')
//       .pipe(takeUntil(this._subscription))
//       .subscribe({
//         next: (response) => {
//           this._birds$.next(response);
//         },
//         error: (e) => { this._handleError(e); },
//         complete: () => { if (this._isError$) this._isError$.next(false); }
//       })
//   }
// }

// private _handleError(error: any) {
//   this._isError$.next(true);
// }

// ngOnDestroy(): void {
//   this._subscription.next('');
//   this._subscription.complete();
// }

// public get isError(): Observable<boolean> {
//   return this._isError$.asObservable();
// }

// public get getBirds(): IBirdSummary[] {
//   return this._birds$.value;
// }
