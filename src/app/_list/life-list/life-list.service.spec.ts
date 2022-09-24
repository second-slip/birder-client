import { TestBed } from '@angular/core/testing';

import { LifeListService } from './life-list.service';

describe('LifeListService', () => {
  let service: LifeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LifeListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
