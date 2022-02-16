import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { catchError, Observable, share, throwError } from 'rxjs';
import { RecordingsService } from './recordings.service';
import { IRecording } from './xeno-canto.service';

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecordingsComponent implements OnInit {
  @Input() species: string;
  
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
    .pipe(share(),
    catchError(err => {
      this.errorObject = err;
      return throwError(err);
    }));
  }
}
