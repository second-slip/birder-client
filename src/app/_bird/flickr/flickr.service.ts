import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlickrService {
  private readonly apiKey = environment.photoKey;
  private readonly apiUrl = 'https://api.flickr.com/services/rest/';
  private readonly baseUrl = `${this.apiUrl}?api_key=${this.apiKey}&format=json&nojsoncallback=1&method=flickr.photos.`;
  private readonly flickrPhotoSearch = `${this.baseUrl}search&per_page=20&tags=`;

  constructor(private readonly _http: HttpClient) { }

  public getSearchResults(searchTerm: string, page: number = 1, tagMode: any = ''): Observable<Array<{ url: string }>> {
    return this._http.get(`${this.flickrPhotoSearch}${encodeURIComponent(searchTerm)}&page=${page}${tagMode}`)
      .pipe(map((result: any) => this._mapResponse(result)));
  }

  private _mapResponse(obj: any): Array<{ url: string }> {
    return obj.photos.photo.map((photo: { farm: any; server: any; id: any; secret: any; }) =>
      <{ url: string }>{
        url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`
      });
  }
}