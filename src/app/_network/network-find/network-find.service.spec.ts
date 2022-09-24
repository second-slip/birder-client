import { TestBed } from '@angular/core/testing';

import { NetworkFindService } from './network-find.service';

describe('NetworkFindService', () => {
  let service: NetworkFindService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkFindService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
