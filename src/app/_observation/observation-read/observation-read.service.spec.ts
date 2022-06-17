import { TestBed } from '@angular/core/testing';

import { ObservationReadService } from './observation-read.service';

describe('ObservationReadService', () => {
  let service: ObservationReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObservationReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
