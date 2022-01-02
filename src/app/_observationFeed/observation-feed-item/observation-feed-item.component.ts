import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IObservationFeed } from '../i-observation-feed.dto';

@Component({
  selector: 'app-observation-feed-item',
  templateUrl: './observation-feed-item.component.html',
  styleUrls: ['./observation-feed-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationFeedItemComponent {
  @Input() observation: IObservationFeed;

}
