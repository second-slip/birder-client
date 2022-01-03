import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first } from 'rxjs';
import { ITweetDay } from '../i-tweet-day.dto';

@Injectable({
  providedIn: 'root'
})
export class TweetDayService {

  constructor(private http: HttpClient) { }

  getTweetDay(): Observable<ITweetDay> {
    return this.http.get<ITweetDay>('api/Tweets/GetTweetDay')
      .pipe(first());
  }

  // getTweetArchive(pageIndex: number, pageSize: number): Observable<TweetArchiveDto> {
  //   const params = new HttpParams()
  //     .set('pageIndex', pageIndex.toString())
  //     .set('pageSize', pageSize.toString());

  //   return this.http.get<TweetArchiveDto>('api/Tweets/GetTweetArchive', { params })
  //     .pipe(first());
  // }
}
