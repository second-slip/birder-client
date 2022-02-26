import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserFeedService } from './user-feed.service';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.scss'],
  providers: [UserFeedService],
  encapsulation: ViewEncapsulation.None
})
export class UserFeedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
