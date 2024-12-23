import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ObservationFeedService } from '../../_observation-feed/observation-feed.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { ObservationFeedItemComponent } from '../observation-feed-item/observation-feed-item.component';
import { FilterControlComponent } from '../filter-control/filter-control.component';

@Component({
  selector: 'app-observation-feed',
  templateUrl: './observation-feed.component.html',
  providers: [ObservationFeedService],
  host: { class: 'standard-container' },
  imports: [
    FilterControlComponent,
    ObservationFeedItemComponent,
    RouterLink,
    LoadingComponent,
  ],
  standalone: true, // temporarily restore to enable MockComponent (ng-mocks) in tests
})
export class ObservationFeedComponent implements OnInit {
  readonly _service = inject(ObservationFeedService);
  private _route = inject(ActivatedRoute);

  private _url = signal('');
  private _page = signal(1);

  public title = signal('Latest observations');
  public filter = signal('');

  constructor() {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((pmap) => {
      this._setup(pmap.get('filter'));
      this._getData();
    });
  }

  public fetchMore(id: number): void {
    if (id == this._service.lastLoadedRecordId()) {
      this._page.update((page) => page + 1);
      this._getData();
    }
  }

  public reload(): void {
    // this._page = 1;
    this._getData();
  }

  private _getData(): void {
    this._service.getData(this._page(), this._url());
  }

  private _setup(filter: string | null): void {
    if (filter === 'network') {
      this._url.set('api/observationfeed/network');
      this.filter.set(filter);
      this.title.set('Latest observations in your network');
    } else {
      this._url.set('api/observationfeed');
      this.filter.set('public');
      this.title.set('Latest observations');
    }
  }
}
