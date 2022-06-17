import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TweetDayService } from './tweet-day.service';

@Component({
  selector: 'app-tweet-day',
  templateUrl: './tweet-day.component.html',
  styleUrls: ['./tweet-day.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TweetDayComponent implements OnInit {

  constructor(readonly _service: TweetDayService) { }

  ngOnInit(): void {
    this._getData();
  }

  private _getData(): void {
    this._service.getData();
  }

  public reload(): void {
    this._getData();
  }
}
