import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FlickrService implements OnDestroy {
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

  public getData(searchTerm: string, page: string = '1'): void {
    const url = this._createUrl(searchTerm, page);

    this._http.get<Array<{ url: string }>>(url)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (response: Array<{ url: string }>) => {
          this._images$.next(this._mapResponse(response));
        },
        error: (e: any) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _createUrl(searchTerm: string, page: string): string {
    const url = new URL('https://api.flickr.com/services/rest');

    url.searchParams.set('api_key', environment.photoKey);
    url.searchParams.set('format', 'json');
    url.searchParams.set('nojsoncallback', '1');
    url.searchParams.set('method', 'flickr.photos.search');
    url.searchParams.set('per_page', '20');
    url.searchParams.set('tags', searchTerm);
    url.searchParams.set('page', page);

    return url.toString();
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