import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SelectSpeciesService } from './select-species.service';

describe('SelectSpeciesService', () => {
  let service: SelectSpeciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(SelectSpeciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
