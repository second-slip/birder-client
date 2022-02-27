import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { catchError, Observable, share, Subject, takeUntil, throwError } from 'rxjs';
import { RecordingsService } from './recordings.service';
import { IRecording } from './xeno-canto.service';

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecordingsComponent implements OnInit, OnDestroy {
  @Input() species: string;

  private _subscription = new Subject();
  
  public recordings$: Observable<IRecording[]>;
  public errorObject = null;
  public page: number = 1;
  public pageSize = 10;

  constructor(private _service: RecordingsService) { }

  ngOnInit(): void {
    this._getRecordings();
  }

  // ToDo: refactor...into separate service...
  private _getRecordings(): void {
    this.recordings$ = this._service.getRecordings(this.species)
    .pipe(share(), takeUntil(this._subscription),
    catchError(err => {
      this.errorObject = err;
      return throwError(err);
    }));
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}
