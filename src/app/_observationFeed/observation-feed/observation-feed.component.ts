import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  public title = 'Latest observations in your network';
  public filter: string = '';

  constructor(readonly _service: ObservationFeedService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.params.subscribe(pmap => {
      this._setup(pmap['filter']);
      this._getData();
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

  private _setup(filter: string | null): void {
    switch (filter) {
      case 'network': {
        this._url = 'api/ObservationFeed/NetworkFeed';
        this.filter = filter;
        this.title = 'Latest observations in your network';
        break;
      }
      default: {
        this._url = 'api/ObservationFeed';
        this.filter = 'public';
        this.title = 'Latest observations';
        break;
      }
    }
  }
}