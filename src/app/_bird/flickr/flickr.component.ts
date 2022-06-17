import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { catchError, Observable, share, Subject, takeUntil, throwError } from 'rxjs';
import { FlickrService } from './flickr.service';

@Component({
  selector: 'app-flickr',
  templateUrl: './flickr.component.html',
  styleUrls: ['./flickr.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlickrComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  @Input() species: string;

  public images$: Observable<FlickrUrlsViewModel[]>;
  public errorObject = null;

  constructor(private _flickr: FlickrService) { }

  ngOnInit(): void {
    this._getImages();
  }

  private _getImages() {
    this.images$ = this._flickr.getSearchResults(1, this.species, '')
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

export interface FlickrUrlsViewModel {
  url: string;
}
