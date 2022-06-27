import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ObservationReadService } from './observation-read.service';

describe('ObservationReadService', () => {
  let service: ObservationReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(ObservationReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
