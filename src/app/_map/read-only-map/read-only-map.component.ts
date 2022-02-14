import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { IObservationPosition } from '../i-observation-position.dto';

@Component({
  selector: 'app-read-only-map',
  templateUrl: './read-only-map.component.html',
  styleUrls: ['./read-only-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReadOnlyMapComponent implements OnInit {
  @Input() position: IObservationPosition;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

  public errorObject: any = null;
  public locationMarker: any;
  public options: google.maps.MapOptions = {
    mapTypeId: 'terrain', zoom: 8,
  }

  constructor() { }

  ngOnInit(): void {
    this._addMarker(this.position.latitude, this.position.longitude);
  }

  public openInfoWindow(marker: MapMarker): void {
    this.infoWindow.open(marker);
  }

  private _addMarker(latitude: number, longitude: number): void {
    try {
      this.locationMarker = ({
        position: {
          lat: latitude,
          lng: longitude
        },
        options: { animation: google.maps.Animation.BOUNCE },
      })
    } catch (error) {
      // ToDo: implementation
      this.errorObject = error;
    }
  }
}
