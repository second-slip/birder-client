import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ObservationFeedService } from '../observation-feed.service';

@Component({
  selector: 'app-observation-feed',
  templateUrl: './observation-feed.component.html',
  styleUrls: ['./observation-feed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationFeedComponent implements OnInit, OnDestroy {

  constructor(readonly _service: ObservationFeedService) { }
  
  ngOnDestroy(): void {
    console.log('destroy');
    this._service.resetFeed();
  }

  ngOnInit(): void {
    this._service.getData();
  }

  public onScroll(): void {
    this._service.getData();
  }

}
