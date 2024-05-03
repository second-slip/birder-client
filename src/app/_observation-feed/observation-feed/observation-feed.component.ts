import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ObservationFeedService } from '../../_observation-feed/observation-feed.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { ObservationFeedItemComponent } from '../observation-feed-item/observation-feed-item.component';
import { InfiniteScrollComponent } from '../../infinite-scroll/infinite-scroll.component';
import { AsyncPipe } from '@angular/common';
import { FilterControlComponent } from '../filter-control/filter-control.component';

@Component({
  selector: 'app-observation-feed',
  templateUrl: './observation-feed.component.html',
  styleUrls: ['./observation-feed.component.scss'],
  providers: [ObservationFeedService],
  standalone: true,
  imports: [FilterControlComponent, InfiniteScrollComponent, ObservationFeedItemComponent, RouterLink, LoadingComponent, AsyncPipe]
})
export class ObservationFeedComponent implements OnInit {
  private _url: string = '';
  private _page: number = 1;
  public title = 'Latest observations';
  public filter: string = '';

  constructor(readonly _service: ObservationFeedService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(pmap => {
      this._setup(pmap.get('filter'));
      this._getData();
    });
  }

  public onScroll(): void {
    this._page++;
    this._getData();
  }

  public reload(): void {
    // this._page = 1;
    this._getData();
  }

  private _getData(): void {
    this._service.getData(this._page, this._url);
  }

  private _setup(filter: string | null): void {
    if (filter === 'network') {
      this._url = 'api/observationfeed/network';
      this.filter = filter;
      this.title = 'Latest observations in your network';
    } else {
      this._url = 'api/observationfeed';
      this.filter = 'public';
      this.title = 'Latest observations';
    }
  }
}