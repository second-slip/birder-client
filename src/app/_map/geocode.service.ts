import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {
  constructor(private readonly _http: HttpClient) { }

  public geocode(searchTerm: string): Observable<any> {
    const url = this._createGeocodeUrl(searchTerm);
    return this._http.get<any>(url);
  }

  public reverseGeocode(latitude: number, longitude: number): Observable<any> {
    const url = this._createReverseGeocodeUrl(latitude, longitude);
    return this._http.get<any>(url);

    // .pipe(map(response => {this.googleApiResponseHelper(response.results[0].address_components, "postal_town")}));
  }

  private _createGeocodeUrl(searchTerm: string): string {
    const url = new URL('https://maps.google.com/maps/api/geocode/json');

    url.searchParams.set('address', searchTerm);
    url.searchParams.set('key', environment.mapKey);

    return url.toString();
  }

  private _createReverseGeocodeUrl(latitude: number, longitude: number): string {
    const url = new URL('https://maps.google.com/maps/api/geocode/json');

    url.searchParams.set('latlng', latitude + ',' + longitude);
    url.searchParams.set('key', environment.mapKey);

    return url.toString();
  }


  /**
 * Get the value for a given key in address_components
 * 
 * @param {Array} components address_components returned from Google maps autocomplete
 * @param type key for desired address component
 * @returns {String} value, if found, for given type (key)
 */
  public googleApiResponseHelper(components: any[], type: any): string {
    return components.filter((component) => component.types.indexOf(type) === 0).map((item) => item.long_name).pop() || '';
  }

  // googleApiResponseHelperShort(components, type) {
  //   return components.filter((component) => component.types.indexOf(type) === 0).map((item) => item.short_name).pop() || '';
  // }
}