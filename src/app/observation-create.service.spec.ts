import { TestBed } from '@angular/core/testing';

import { ObservationCreateService } from './observation-create.service';

describe('ObservationCreateService', () => {
  let service: ObservationCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObservationCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
