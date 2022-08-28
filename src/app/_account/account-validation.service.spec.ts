import { TestBed } from '@angular/core/testing';

import { AccountValidationService } from './account-validation.service';

describe('AccountValidationService', () => {
  let service: AccountValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
