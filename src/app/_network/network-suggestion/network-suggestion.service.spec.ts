import { TestBed } from '@angular/core/testing';

import { NetworkSuggestionService } from './network-suggestion.service';

describe('NetworkSuggestionService', () => {
  let service: NetworkSuggestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkSuggestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
