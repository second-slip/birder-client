import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { ObservationFeedService } from '../observation-feed.service';

@Component({
  selector: 'app-observation-feed',
  templateUrl: './observation-feed.component.html',
  styleUrls: ['./observation-feed.component.scss'],
  providers: [ObservationFeedService],
  encapsulation: ViewEncapsulation.None
})
export class ObservationFeedComponent implements OnInit {
  private _url: string = 'api/ObservationFeed';
  private _page: number = 1;

  public type: FeedType;
  public title = 'Latest observations';

  constructor(readonly _service: ObservationFeedService
    , readonly _authService: AuthenticationService
    , private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.params.subscribe(_ => {
      this._route.paramMap.subscribe(pmap => {
        this._getFeedType(pmap.get('type'));
      })
    });
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

  private _getFeedType(type: string | null): void {

    switch (type) {
      case 'my-observations':
        this.type = FeedType.User;
        this._url = 'api/ObservationFeed/UserFeed';
        this.title = 'Your latest observations';
        break;
      case 'my-network':
        this.type = FeedType.Network;
        this._url = 'api/ObservationFeed/NetworkFeed';
        this.title = 'Latest observations in your network';
        break;
      case 'public':
        this.type = FeedType.Public
        this._url = 'api/ObservationFeed';
        this.title = 'Latest observations';
        break;
      default:
        // ***************************************
        //redirect
        this.type = FeedType.Public
        break;
    }
    this._getData();
  }
}


export enum FeedType {
  Public = 'Public',
  User = 'User',
  Network = 'Network',
}