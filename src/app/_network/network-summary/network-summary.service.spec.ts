import { TestBed } from '@angular/core/testing';

import { NetworkSummaryService } from './network-summary.service';

describe('NetworkSummaryService', () => {
  let service: NetworkSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
