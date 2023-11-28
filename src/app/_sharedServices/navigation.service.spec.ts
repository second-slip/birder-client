import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
