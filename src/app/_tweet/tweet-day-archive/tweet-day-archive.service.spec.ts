import { TestBed } from '@angular/core/testing';

import { TweetDayArchiveService } from './tweet-day-archive.service';

describe('TweetDayArchiveService', () => {
  let service: TweetDayArchiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweetDayArchiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
