import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IRecording } from './i-recording.dto';
import { RecordingsService } from './recordings.service';

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecordingsComponent implements OnInit, OnDestroy {
  @Input() species: string;

  private _subscription = new Subject();
  private readonly _recordings$: BehaviorSubject<Array<IRecording> | null> = new BehaviorSubject<Array<IRecording> |null>(null);
  public fetchStatus: 'success' | 'loading' | 'error' = 'loading';
  public page: number = 1;
  public pageSize = 10;

  constructor(private _service: RecordingsService) { }

  public get getRecordings(): Observable<Array<IRecording> | null> {
    return this._recordings$.asObservable();
  }

  // todo: refresh button in case of fetch error

  ngOnInit(): void {
    this._getRecordings();
  }

  private _getRecordings(): void {
    this._service.getRecordings(this.species)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (r: Array<IRecording>) => {
          this._recordings$.next(r);
        },
        error: () => { this.fetchStatus = 'error'; }
      });
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}
