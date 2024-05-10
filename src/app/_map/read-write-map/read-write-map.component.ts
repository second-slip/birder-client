import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker, GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { Subject, takeUntil } from 'rxjs';
import { GeocodeService } from '../geocode.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { WindowGeolocateService } from '../window-geolocate.service';

@Component({
  selector: 'app-read-write-map',
  templateUrl: './read-write-map.component.html',
  styleUrls: ['./read-write-map.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [FormsModule, MatIconModule,
    GoogleMapsModule,
    GoogleMap, MapInfoWindow, MapAdvancedMarker,
    LoadingComponent]
})
export class ReadWriteMapComponent implements OnInit, OnDestroy {
  @Input() latitude: number;
  @Input() longitude: number;

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow

  private _subscription = new Subject();

  // public markerStatus: 'idle' | 'success' | 'error' = 'idle';
  public formattedAddress: string;
  public shortAddress: string;
  public locationMarker: any;
  public options: any; // google.maps.MapOptions = { mapTypeId: 'terrain', zoom: 8 }
  public searchAddress = '';
  public geoError = '';
  public error: boolean;

  constructor(private readonly _geocoding: GeocodeService,
    private readonly _g: WindowGeolocateService) { } // <-------------------------------------

  ngOnInit(): void {
    try {
      this._addMarker(this.latitude, this.longitude);
      // this.markerStatus = 'success';
    } catch (error) {
      this.error = true;
    }
  }

  private _addMarker(latitude: number, longitude: number): void {

    this.options = {
      center: { lat: latitude, lng: longitude },
      zoom: 8,
      mapTypeId: 'terrain'
    }

    this.locationMarker = ({
      position: {
        lat: latitude,
        lng: longitude
      },
      options: { draggable: true },
    });

    this.latitude = latitude;
    this.longitude = longitude;

    // if (getAddress) {
    this._getFormattedAddress(latitude, longitude);
    // }
    // this.infoWindow.open(this.locationMarker.position);
  }

  public markerChanged(event: google.maps.MapMouseEvent): void {
    if (event.latLng) this._addMarker(event.latLng?.lat(), event.latLng.lng());
  }

  public openInfoWindow(marker: MapAdvancedMarker): void {
    this.infoWindow.open(marker);
  }

  private _getFormattedAddress(latitude: number, longitude: number): void {
    this._geocoding.reverseGeocode(latitude, longitude)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (r) => {
          this.formattedAddress = r.results[0].formatted_address;
          this.shortAddress = this._geocoding.googleApiResponseHelper(r.results[0].address_components, "postal_town") + ', ' + this._geocoding.googleApiResponseHelper(r.results[0].address_components, "country");
        },
        error: (e) => {
          this.error = true;
        }
      });
  }

  public findAddress(): void {
    if (!this.searchAddress) { return };

    this._geocoding.geocode(this.searchAddress)
      .pipe(takeUntil(this._subscription))
      .subscribe({
        next: (r) => {
          this._changeZoomLevel(15);
          this._addMarker(r.results[0].geometry.location.lat, r.results[0].geometry.location.lng); // false to stop second hit on API to get address...
          this.formattedAddress = r.results[0].formatted_address;
          if ((r.results[0].formatted_address.split(",").length - 1) === 1) {
            this.shortAddress = r.results[0].formatted_address;
          } else {
            this.shortAddress = this._geocoding.googleApiResponseHelper(r.results[0].address_components, "postal_town") + ', ' + this._geocoding.googleApiResponseHelper(r.results[0].address_components, "country");
          }
          this.searchAddress = '';
        },
        error: (e) => {
          this.error = true;
        }
      });
  }

  public getCurrentPosition(): void {

    if (this.geoError) { this.geoError = '' };

    this._g.getCurrentPosition().subscribe({
      next: (position) => {
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
        // 
        this._addMarker(position.coords.latitude, position.coords.longitude);
        this._changeZoomLevel(15);
      },
      error: (error) => {
        this.geoError = 'Error getting geolocation:';
        console.error('Error getting geolocation:', error);
      },
    });
  }

  private _changeZoomLevel(level: number): void {
    this.options.zoom = level;
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}