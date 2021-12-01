import { TestBed } from '@angular/core/testing';

import { ReadTokenService } from './read-token.service';

describe('ReadTokenService', () => {
  let service: ReadTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
