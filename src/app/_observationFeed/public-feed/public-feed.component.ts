import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PublicFeedService } from './public-feed.service';

@Component({
  selector: 'app-public-feed',
  templateUrl: './public-feed.component.html',
  styleUrls: ['./public-feed.component.scss'],
  providers: [PublicFeedService],
  encapsulation: ViewEncapsulation.None
})
export class PublicFeedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
