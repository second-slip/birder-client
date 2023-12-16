import { TestBed } from '@angular/core/testing';
import { SelectSpeciesTwoService } from './select-species-two.service';

describe('SelectSpeciesTwoService', () => {
  let service: SelectSpeciesTwoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectSpeciesTwoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
