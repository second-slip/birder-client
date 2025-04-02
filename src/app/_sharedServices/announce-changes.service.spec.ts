import { TestBed } from '@angular/core/testing';
import { AnnounceChangesService } from './announce-changes.service';

describe('AnnounceChangesService', () => {
  let service: AnnounceChangesService;

  // fakeCountService = jasmine.createSpyObj<ObservationCountService>(
  //   'ObservationCountService',
  //   {
  //     getData: undefined
  //   },
  //   {
  //     count: undefined,
  //     isError: undefined
  //   });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // { provide: ObservationCountService, useValue: fakeCountService },
      ],
    });
    service = TestBed.inject(AnnounceChangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('announceNetworkChanged events', () => {

  it('should publish event to subscribers', () => {
    // Arrange
    let subscriber: any | undefined;

    service.networkChanged$.subscribe((response) => {
      subscriber = response;
    });

    expect(subscriber).toBeFalsy();

    // Act
    service.announceNetworkChanged('');

    //Assert
    expect(subscriber).toBeTruthy();
  });

});

describe('announceObservationsChanged events', () => {

  it('should publish event to subscribers', () => {
    // Arrange
    let subscriber: any | undefined;

    service.observationsChanged$.subscribe((response) => {
      subscriber = response;
    });

    expect(subscriber).toBeFalsy();

    // Act
    service.announceObservationsChanged('');

    //Assert
    expect(subscriber).toBeTruthy();
  });

});

});
