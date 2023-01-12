import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FlickrService } from './flickr.service';

@Component({
  selector: 'app-flickr',
  templateUrl: './flickr.component.html',
  styleUrls: ['./flickr.component.scss'],
  providers: [FlickrService],
  encapsulation: ViewEncapsulation.None
})
export class FlickrComponent implements OnInit {
  @Input() species: string;

  constructor(readonly _service: FlickrService) { }

  ngOnInit(): void {
    this._getImages();
  }

  private _getImages(): void {
    this._service.getData(this.species, undefined);
  }
}