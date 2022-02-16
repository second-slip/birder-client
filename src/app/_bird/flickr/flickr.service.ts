import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TokenService } from 'src/app/_auth/token.service';
import { FlickrUrlsViewModel } from './flickr.component';

@Injectable({
  providedIn: 'root'
})
export class FlickrService {
  private readonly apiKey = this.token.getFlikrKey();
  private readonly apiUrl = 'https://api.flickr.com/services/rest/';
  private readonly baseUrl = `${this.apiUrl}?api_key=${this.apiKey}&format=json&nojsoncallback=1&method=flickr.photos.`;
  private readonly flickrPhotoSearch = `${this.baseUrl}search&per_page=20&tags=`;

  constructor(private readonly _http: HttpClient, private token: TokenService) { }

  public getSearchResults(page: number, term: any = null, tagMode: any): Observable<FlickrUrlsViewModel[]> {
    return this._http.get(`${this.flickrPhotoSearch}${encodeURIComponent(term)}&page=${page}${tagMode}`)
      .pipe(
        map((resp: any) => {
          return resp.photos.photo.map((photo: { farm: any; server: any; id: any; secret: any; }) =>
            <FlickrUrlsViewModel>{
              url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`
            })
        })
      );
  }
}
