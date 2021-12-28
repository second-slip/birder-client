import { Component, Input, OnInit } from '@angular/core';
import { IObservationFeed } from '../i-observation-feed.dto';

@Component({
  selector: 'app-observation-feed-item',
  templateUrl: './observation-feed-item.component.html',
  styleUrls: ['./observation-feed-item.component.scss']
})
export class ObservationFeedItemComponent implements OnInit {
  @Input() observation: IObservationFeed;

  constructor() { }

  ngOnInit(): void {
  }

}
