import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { BirdDetailService } from './bird-detail.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { RecordingsComponent } from '../recordings/recordings.component';
import { FlickrComponent } from '../flickr/flickr.component';
import { BirdInfoComponent } from '../bird-info/bird-info.component';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, AsyncPipe } from '@angular/common';
import { LoremIpsumComponent } from 'src/app/lorem-ipsum/lorem-ipsum.component';

@Component({
    selector: 'app-bird-detail',
    templateUrl: './bird-detail.component.html',
    styleUrls: ['./bird-detail.component.scss'],
    providers: [BirdDetailService],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, LoremIpsumComponent, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, BirdInfoComponent, FlickrComponent, RecordingsComponent, NgbNavOutlet, RouterLink, LoadingComponent, AsyncPipe]
})
export class BirdDetailComponent implements OnInit {
  private _birdId: string;

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