import { TestBed } from '@angular/core/testing';

import { UserFeedService } from './user-feed.service';

describe('UserFeedService', () => {
  let service: UserFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
