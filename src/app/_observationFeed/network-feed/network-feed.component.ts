import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { ObservationFeedService } from '../observation-feed.service';

@Component({
  selector: 'app-network-feed',
  templateUrl: './network-feed.component.html',
  styleUrls: ['./network-feed.component.scss'],
  providers: [ObservationFeedService],
  encapsulation: ViewEncapsulation.None
})
export class NetworkFeedComponent implements OnInit {
  private _url: string = 'api/ObservationFeed/NetworkFeed';
  private _page: number = 1;

  public title = 'Latest observations in your network';

  constructor(readonly _service: ObservationFeedService
    , readonly _authService: AuthenticationService) { }

  ngOnInit(): void {
    this._getData();
  }

  public onScroll(): void {
    this._page++;
    this._getData();
  }

  public reload(): void {
    this._page = 1;
    this._getData();
  }

  private _getData(): void {
    this._service.getData(this._page, undefined, this._url);
  }
}