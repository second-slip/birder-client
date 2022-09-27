import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { FlickrService } from './flickr.service';

@Component({
  selector: 'app-flickr',
  templateUrl: './flickr.component.html',
  styleUrls: ['./flickr.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlickrComponent implements OnInit, OnDestroy {
  @Input() species: string;

  private _subscription = new Subject();
  private readonly _images$: BehaviorSubject<Array<{ url: string }> | null> = new BehaviorSubject<Array<{ url: string }> | null>(null);
  public fetchStatus: 'success' | 'loading' | 'error' = 'loading';

  constructor(private _flickr: FlickrService) { }

  ngOnInit(): void {
    this._getImages();
  }

  public get getImages(): Observable<Array<{ url: string }> | null> {
    return this._images$.asObservable();
  }

  private _getImages(): void {
    this._flickr.getSearchResults(this.species, undefined, undefined)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (photos: Array<{ url: string }>) => {
          this.fetchStatus = 'success';
          this._images$.next(photos);
        },
        error: () => { this.fetchStatus = 'error'; }
      });
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}