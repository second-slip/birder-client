import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FlickrService } from './flickr.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-flickr',
    templateUrl: './flickr.component.html',
    styleUrls: ['./flickr.component.scss'],
    providers: [FlickrService],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, NgbCarousel, NgFor, NgbSlide, LoadingComponent, AsyncPipe]
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