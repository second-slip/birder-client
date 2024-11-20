import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { BirdDetailService } from './bird-detail.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { RecordingsComponent } from '../recordings/recordings.component';
import { FlickrComponent } from '../flickr/flickr.component';
import { BirdInfoComponent } from '../bird-info/bird-info.component';
import { AsyncPipe } from '@angular/common';
import { LoremIpsumComponent } from 'src/app/lorem-ipsum/lorem-ipsum.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'app-bird-detail',
    templateUrl: './bird-detail.component.html',
    styleUrls: ['./bird-detail.component.scss'],
    providers: [BirdDetailService],
    imports: [MatTabsModule, LoremIpsumComponent, BirdInfoComponent, FlickrComponent, RecordingsComponent, RouterLink, LoadingComponent, AsyncPipe]
})
export class BirdDetailComponent implements OnInit {
  private _birdId: string;

  // implmeent input binding

  constructor(readonly _service: BirdDetailService
    , private readonly _navigation: NavigationService
    , private readonly _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(pmap => {
      this._getData(pmap.get('id'));
    });
  }

  private _getData(id: string | null): void {
    if (id) {
      this._birdId = id;
      this._service.getData(id);
    }
    else {
      this._redirect();
    }
  }

  public reload(): void {
    if (this._birdId) {
      this._getData(this._birdId);
    } else {
      this._redirect();
    }
  }

  private _redirect(): void {
    this._navigation.back();
  }
}