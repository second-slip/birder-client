import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowGeolocateService {

  getCurrentPosition(): Observable<any> {
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not available in this browser.');
      }
    });
  }

  // public getCurrentPosition(): Promise<GeolocationPosition | any> {

  //   // if (this.geoError) { this.geoError = '' };

  //   if (window.navigator.geolocation) {
  //     window.navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         return of(position);
  //         // this._addMarker(position.coords.latitude, position.coords.longitude);
  //         // this._changeZoomLevel(15);
  //       },
  //       (error) => {
  //         throw error;
  //         // return '';
  //         // switch (error.code) {
  //         //   case 3: // ...deal with timeout
  //         //     this.geoError = 'The request to get user location timed out...';
  //         //     break;
  //         //   case 2: // ...device can't get data
  //         //     this.geoError = 'Location information is unavailable...';
  //         //     break;
  //         //   case 1: // ...user said no ☹️
  //         //     this.geoError = 'User denied the request for Geolocation...';
  //         //     break;
  //         //   default:
  //         //     this.geoError = 'An error occurred with Geolocation...';
  //         // }
  //       });
  //   }
  //   else {
  //     throw new Error('Geolocation not supported in this browser');
  //   }
  // }
}
