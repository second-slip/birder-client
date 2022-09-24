import { TestBed } from '@angular/core/testing';

import { NetworkUserService } from './network-user.service';

describe('NetworkUserService', () => {
  let service: NetworkUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
