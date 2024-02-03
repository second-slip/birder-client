import { Component, Input, OnInit } from '@angular/core';
import { FlickrService } from './flickr.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-flickr',
  templateUrl: './flickr.component.html',
  styleUrls: ['./flickr.component.scss'],
  providers: [FlickrService],
  standalone: true,
  imports: [LoadingComponent, AsyncPipe, MatGridListModule]
})
export class FlickrComponent implements OnInit {
  @Input() species: string;

  constructor(readonly _service: FlickrService) { }

  ngOnInit(): void {
    this._getImages();
  }
  
  retry(): void {
    this._getImages();
  }

  private _getImages(): void {
    this._service.getData(this.species, undefined);
  }
}