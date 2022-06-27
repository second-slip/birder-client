import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BirdIndexService } from './bird-index.service';

describe('BirdIndexService', () => {
  let service: BirdIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(BirdIndexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
