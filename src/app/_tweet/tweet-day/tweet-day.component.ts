import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { catchError, Observable, share, throwError } from 'rxjs';
import { ITweetDay } from '../i-tweet-day.dto';
import { TweetDayService } from './tweet-day.service';

@Component({
  selector: 'app-tweet-day',
  templateUrl: './tweet-day.component.html',
  styleUrls: ['./tweet-day.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TweetDayComponent {
  tweet$: Observable<ITweetDay>;
  public errorObject = null;

  constructor(private tweetsService: TweetDayService) {
    this.getTweetOfTheDay();
  }

  getTweetOfTheDay(): void {
    this.tweet$ = this.tweetsService.getTweetDay()
      .pipe(share(),
        catchError(err => {
          this.errorObject = err;
          return throwError(err);
        })
      );
  }
}
