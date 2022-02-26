import { TestBed } from '@angular/core/testing';

import { NetworkFeedService } from './network-feed.service';

describe('NetworkFeedService', () => {
  let service: NetworkFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
