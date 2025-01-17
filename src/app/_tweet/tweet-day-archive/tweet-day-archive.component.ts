import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TweetDayArchiveService } from './tweet-day-archive.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-tweet-day-archive',
    templateUrl: './tweet-day-archive.component.html',
    styleUrls: ['./tweet-day-archive.component.scss'],
    providers: [TweetDayArchiveService],
    encapsulation: ViewEncapsulation.None,
    imports: [RouterLink, LoadingComponent, AsyncPipe, DatePipe]
})
export class TweetDayArchiveComponent implements OnInit {
  private _page: number = 1;

  constructor(readonly _service: TweetDayArchiveService) { }

  ngOnInit(): void {
    this._getData();
  }

  protected getMoreTweets(): void {
    this._page++;
    this._getData();
  }

  protected reload(): void {
    this._page = 1;
    this._getData();
  }

  private _getData(): void {
    this._service.getData(this._page);
  }
}