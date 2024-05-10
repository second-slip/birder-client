import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { IObservationPosition } from '../i-observation-position.dto';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-read-only-map',
  templateUrl: './read-only-map.component.html',
  styleUrls: ['./read-only-map.component.scss'],
  standalone: true,
  imports: [MatIconModule, GoogleMap, MapInfoWindow, MapAdvancedMarker]
})
export class ReadOnlyMapComponent implements OnInit {
  @Input() position: IObservationPosition;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

  public error: boolean;
  public locationMarker: google.maps.LatLngLiteral;
  public options: any;

  ngOnInit(): void {
    try {
      this._addMarker(this.position.latitude, this.position.longitude);
    } catch (error) {
      this.error = true;
    }
  }

  public openInfoWindow(marker: MapAdvancedMarker): void {
    this.infoWindow.open(marker);
  }

  private _addMarker(latitude: number, longitude: number): void {
    this.options = {
      center: { lat: latitude, lng: longitude },
      zoom: 8,
      mapTypeId: 'terrain',
    }

    this.locationMarker = { lat: latitude, lng: longitude };
  }
}