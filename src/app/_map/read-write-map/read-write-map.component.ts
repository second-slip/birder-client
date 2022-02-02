import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { GeocodeService } from '../geocode.service';

@Component({
  selector: 'app-read-write-map',
  templateUrl: './read-write-map.component.html',
  styleUrls: ['./read-write-map.component.scss']
})
export class ReadWriteMapComponent implements OnInit {
  @Input() latitude: number;
  @Input() longitude: number;
  formattedAddress: string;
  shortAddress: string;

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow

  //public errorObject = null;
  public locationMarker: any;
  public options: google.maps.MapOptions = {
    mapTypeId: 'terrain', zoom: 8,
  }
  public searchAddress = '';
  public geoError: string | null;

  constructor(private readonly _geocoding: GeocodeService) { }

  ngOnInit(): void {
    this._addMarker(this.latitude, this.longitude);
  }

  private _addMarker(latitude: number, longitude: number): void {
    try {
      this.locationMarker = ({
        position: {
          lat: latitude,
          lng: longitude
        },
        options: { draggable: true },
      })

      this.latitude = latitude;
      this.longitude = longitude;

      // if (getAddress) {
      this._getFormattedAddress(latitude, longitude);
      // }
    } catch (error) {
      // this.errorObject = error;
    }
    // this.infoWindow.open(this.locationMarker.position);
  }

  public markerChanged(event: google.maps.MapMouseEvent): void {
    if (event.latLng) this._addMarker(event.latLng?.lat(), event.latLng.lng());
  }

  public openInfoWindow(marker: MapMarker): void {
    this.infoWindow.open(marker);
  }

  private _getFormattedAddress(latitude: number, longitude: number): void {
    this._geocoding.reverseGeocode(latitude, longitude)
      .subscribe(
        (response: any) => {
          //console.log(response);
          this.formattedAddress = response.results[0].formatted_address;
          this.shortAddress = this._geocoding.googleApiResponseHelper(response.results[0].address_components, "postal_town") + ', ' + this._geocoding.googleApiResponseHelper(response.results[0].address_components, "country");
        },
        (error: any) => {
        }
      );
  }

  public findAddress(searchValue: string): void {
    this._geocoding.geocode(searchValue)
      .subscribe(
        (response: any) => {
          //console.log(response);
          this._changeZoomLevel(15);
          this._addMarker(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng); // false to stop second hit on API to get address...
          this.formattedAddress = response.results[0].formatted_address;
          if ((response.results[0].formatted_address.split(",").length - 1) === 1) {
            this.shortAddress = response.results[0].formatted_address;
          } else {
            this.shortAddress = this._geocoding.googleApiResponseHelper(response.results[0].address_components, "postal_town") + ', ' + this._geocoding.googleApiResponseHelper(response.results[0].address_components, "country");
          }
          this.searchAddress = '';
        }
      );
  }

  closeAlert(): void {
    this.geoError = null;
  }

  public getCurrentPosition(): void {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          this._addMarker(position.coords.latitude, position.coords.longitude);
          this._changeZoomLevel(15);
        }, (error) => {
          switch (error.code) {
            case 3: // ...deal with timeout
              this.geoError = 'The request to get user location timed out...';
              break;
            case 2: // ...device can't get data
              this.geoError = 'Location information is unavailable...';
              break;
            case 1: // ...user said no ☹️
              this.geoError = 'User denied the request for Geolocation...';
              break;
            default:
              this.geoError = 'An error occurred with Geolocation...';
          }
        });
    } else {
      this.geoError = 'Geolocation not supported in this browser';
    }
  }

  private _changeZoomLevel(level: number): void {
    this.options.zoom = level;
  }
}


// export interface ObservationPosition {
//   observationPositionId: number;
//   latitude: number;
//   longitude: number;
//   formattedAddress: string;
//   shortAddress: string;
// }
