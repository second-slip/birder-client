import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { PublicFeedService } from './public-feed.service';

@Component({
  selector: 'app-public-feed',
  templateUrl: './public-feed.component.html',
  styleUrls: ['./public-feed.component.scss'],
  providers: [PublicFeedService],
  encapsulation: ViewEncapsulation.None
})
export class PublicFeedComponent implements OnInit {
  private _page: number;

  constructor(readonly _service: PublicFeedService
    , readonly _authService: AuthenticationService) { }

  ngOnInit(): void {
    // console.log('init ' + this._page);
    this._page = 1
    // console.log(this._page);
    this._service.getData(this._page);
  }

  // first load of data means scroll is called twice?
  public onScroll(): void {
    // console.log('onScroll()')
    this._page++;
    this._service.getData(this._page);
  }

  public reload(): void {
    this._page = 1;
    this._service.getData(this._page);
  }
}
