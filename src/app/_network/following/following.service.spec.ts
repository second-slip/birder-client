import { TestBed } from '@angular/core/testing';

import { FollowingService } from './following.service';

describe('FollowingService', () => {
  let service: FollowingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
