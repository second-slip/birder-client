import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ObservationFeedService } from '../observation-feed.service';

@Component({
  selector: 'app-observation-feed',
  templateUrl: './observation-feed.component.html',
  styleUrls: ['./observation-feed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationFeedComponent implements OnInit {

  constructor(readonly _service: ObservationFeedService) { }

  ngOnInit(): void {
    this._service.getData();
  }

  onScroll() {
    console.log('scroll')
    this._service.getData();
  }

}
