import { TestBed } from '@angular/core/testing';
import { ObservationCountService } from '../_analysis/observation-count/observation-count.service';
import { ObservationTopFiveService } from '../_analysis/observation-top-five/observation-top-five.service';
import { NetworkSummaryService } from '../_network/network-summary/network-summary.service';
import { AnnounceChangesService } from './announce-changes.service';

describe('AnnounceChangesService', () => {
  let service: AnnounceChangesService;
  let fakeTop5Service: jasmine.SpyObj<ObservationTopFiveService>;
  let fakeCountService: jasmine.SpyObj<ObservationCountService>;
  let fakeNetworkService: jasmine.SpyObj<NetworkSummaryService>;

  fakeCountService = jasmine.createSpyObj<ObservationCountService>(
    'ObservationCountService',
    {
      getData: undefined
    },
    {
      count: undefined,
      isError: undefined
    });

  fakeTop5Service = jasmine.createSpyObj<ObservationTopFiveService>(
    'ObservationTopFiveService',
    {
      getData: undefined
    },
    {
      getTop: undefined,
      isError: undefined,
      // isLoading: undefined
    });

  fakeNetworkService = jasmine.createSpyObj<NetworkSummaryService>(
    'NetworkSummaryService',
    {
      getData: undefined
    },
    {
      getSummary: undefined,
      isError: undefined,
      isLoading: undefined
    });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ObservationCountService, useValue: fakeCountService },
        { provide: ObservationTopFiveService, useValue: fakeTop5Service },
        { provide: NetworkSummaryService, useValue: fakeNetworkService }
      ]
    });
    service = TestBed.inject(AnnounceChangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('announces observations have changed', () => {
    service.announceObservationsChanged();
    expect(fakeCountService.getData).toHaveBeenCalledTimes(1);
    expect(fakeTop5Service.getData).toHaveBeenCalledTimes(1);
  });

  it('announces network has changed', () => {
    service.announceNetworkChanged();
    expect(fakeNetworkService.getData).toHaveBeenCalledTimes(1);
  });
});
