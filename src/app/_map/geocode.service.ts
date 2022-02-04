import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from '../_auth/token.service';

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {
  private readonly apiUrl = 'https://maps.google.com/maps/api/geocode/json?';
  private readonly apiKey = environment.mapKey;

  constructor(private readonly _http: HttpClient, private token: TokenService) { }

  public geocode(searchTerm: string): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}address=${encodeURIComponent(searchTerm)}&key=${this.apiKey}`);
  }

  public reverseGeocode(latitude: number, longitude: number): Observable<any> {
    const latLng = latitude + ',' + longitude;
    return this._http.get<any>(`${this.apiUrl}latlng=${encodeURIComponent(latLng)}&key=${this.apiKey}`);
  }


  //ToDo: consider writing a function to process the 'formatted_address' from the response

  /**
 * Get the value for a given key in address_components
 * 
 * @param {Array} components address_components returned from Google maps autocomplete
 * @param type key for desired address component
 * @returns {String} value, if found, for given type (key)
 */
  public googleApiResponseHelper(components: any[], type: any) {
    return components.filter((component) => component.types.indexOf(type) === 0).map((item) => item.long_name).pop() || '';
  }

  // googleApiResponseHelperShort(components, type) {
  //   return components.filter((component) => component.types.indexOf(type) === 0).map((item) => item.short_name).pop() || '';
  // }
}