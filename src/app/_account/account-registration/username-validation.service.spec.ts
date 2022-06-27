import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UsernameValidationService } from './username-validation.service';

describe('UsernameValidationService', () => {
  let service: UsernameValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(UsernameValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
