import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMapsModule } from '@angular/google-maps';
import { IObservationPosition } from '../i-observation-position.dto';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-read-only-map',
    templateUrl: './read-only-map.component.html',
    styleUrls: ['./read-only-map.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, MatIconModule, GoogleMapsModule, LoadingComponent]
})
export class ReadOnlyMapComponent implements OnInit {
  @Input() position: IObservationPosition;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

  public markerStatus: 'idle' | 'success' | 'error' = 'idle';
  public locationMarker: any;
  public options: google.maps.MapOptions = { mapTypeId: 'terrain', zoom: 8 }

  constructor() { }

  ngOnInit(): void {
    try {
      this._addMarker(this.position.latitude, this.position.longitude);
      this.markerStatus = 'success';
    } catch (error) {
      this.markerStatus = 'error';
    }
  }

  public openInfoWindow(marker: MapMarker): void {
    this.infoWindow.open(marker);
  }

  private _addMarker(latitude: number, longitude: number): void {
    this.locationMarker = ({
      position: {
        lat: latitude,
        lng: longitude
      },
      options: { animation: google.maps.Animation.BOUNCE },
    });
  }
}