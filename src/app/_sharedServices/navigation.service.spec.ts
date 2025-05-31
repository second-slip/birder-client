import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
