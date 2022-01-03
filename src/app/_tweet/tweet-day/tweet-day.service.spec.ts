import { TestBed } from '@angular/core/testing';

import { TweetDayService } from './tweet-day.service';

describe('TweetDayService', () => {
  let service: TweetDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweetDayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
