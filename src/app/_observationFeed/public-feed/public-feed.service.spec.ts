import { TestBed } from '@angular/core/testing';

import { PublicFeedService } from './public-feed.service';

describe('PublicFeedService', () => {
  let service: PublicFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
