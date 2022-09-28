import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FlickrService implements OnDestroy {
  private readonly apiKey = environment.photoKey;
  private readonly apiUrl = 'https://api.flickr.com/services/rest/';
  private readonly baseUrl = `${this.apiUrl}?api_key=${this.apiKey}&format=json&nojsoncallback=1&method=flickr.photos.`;
  private readonly flickrPhotoSearch = `${this.baseUrl}search&per_page=20&tags=`;
  private _subscription = new Subject();
  private readonly _images$: BehaviorSubject<Array<{ url: string }> | null> = new BehaviorSubject<Array<{ url: string }> | null>(null);
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly _http: HttpClient) { }

  public get images(): Observable<Array<{ url: string }> | null> {
    return this._images$.asObservable();
  }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  public getData(searchTerm: string, page: number = 1, tagMode: any = ''): void {
    this._http.get<Array<{ url: string }>>(`${this.flickrPhotoSearch}${encodeURIComponent(searchTerm)}&page=${page}${tagMode}`)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response: Array<{ url: string }>) => {
          this._images$.next(this._mapResponse(response));
        },
        error: (e: any) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _mapResponse(obj: any): Array<{ url: string }> {
    return obj.photos.photo.map((photo: { farm: any; server: any; id: any; secret: any; }) =>
      <{ url: string }>{
        url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`
      });
  }

  private _handleError(error: any) {
    this._isError$.next(true);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}