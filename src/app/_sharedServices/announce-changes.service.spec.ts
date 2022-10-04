import { TestBed } from '@angular/core/testing';
import { ObservationCountService } from '../_analysis/observation-count/observation-count.service';
import { ObservationTopFiveService } from '../_analysis/observation-top-five/observation-top-five.service';

import { AnnounceChangesService } from './announce-changes.service';

describe('AnnounceChangesService', () => {
  let service: AnnounceChangesService;
  let fakeTop5Service: jasmine.SpyObj<ObservationTopFiveService>;
  let fakeCountService: jasmine.SpyObj<ObservationCountService>;

  fakeCountService = jasmine.createSpyObj<ObservationCountService>(
    'ObservationCountService',
    {
      getData: undefined
    },
    {
      getCount: undefined,
      isError: undefined,
      isLoading: undefined
    });

  fakeTop5Service = jasmine.createSpyObj<ObservationTopFiveService>(
    'ObservationTopFiveService',
    {
      getData: undefined
    },
    {
      getTop: undefined,
      isError: undefined,
      isLoading: undefined
    });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ObservationCountService, useValue: fakeCountService },
        { provide: ObservationTopFiveService, useValue: fakeTop5Service }
      ]
    });
    service = TestBed.inject(AnnounceChangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
