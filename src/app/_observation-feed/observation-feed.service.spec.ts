import { TestBed } from '@angular/core/testing';
import { ObservationFeedService } from './observation-feed.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  fakeIObservationFeed,
  fakeIObservationFeedWithOneElement,
  fakeObservationFeedResponse,
  fakeObservationFeedResponseWithOneElement,
} from '../testing/observation-feed-helper';
import { provideHttpClient } from '@angular/common/http';

const _pageIndex = 1;
const _apiUrl = `api/observationfeed?pageIndex=${_pageIndex}&pageSize=10`;

describe('ObservationFeedService', () => {
  let controller: HttpTestingController;
  let service: ObservationFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ObservationFeedService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ObservationFeedService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should get observations', () => {
    // Arrange
    expect(service.observations()).toBe(null);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(false);
    expect(service.isAllLoaded()).toBe(false);
    expect(service.lastLoadedRecordId()).toBe(0);
    expect(service.observations()).toBe(null);

    // Act
    service.getData(_pageIndex, 'api/observationfeed');

    const request = controller.expectOne({
      method: 'GET',
      url: _apiUrl,
    });

    // Assert
    request.flush(fakeObservationFeedResponse);

    expect(service.observations()).toEqual(fakeObservationFeedResponse);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(false);
    expect(service.isAllLoaded()).toBe(false);
    expect(service.lastLoadedRecordId()).toBe(
      fakeIObservationFeed[fakeIObservationFeed.length - 1].observationId
    );
  });

  it('should pass through error response state', () => {
    // Arrange
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API error');

    expect(service.observations()).toBe(null);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(false);
    expect(service.isAllLoaded()).toBe(false);
    expect(service.lastLoadedRecordId()).toBe(0);
    expect(service.observations()).toBe(null);

    // Act
    service.getData(_pageIndex, 'api/observationfeed');

    // Assert
    controller.expectOne(_apiUrl).error(errorEvent, { status, statusText });

    expect(service.observations()).toEqual(null);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(true);
    expect(service.isAllLoaded()).toBe(false);
    expect(service.lastLoadedRecordId()).toBe(0);
  });

  it('should set isAllLoaded flag', () => {
    // Arrange
    expect(service.observations()).toBe(null);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(false);
    expect(service.isAllLoaded()).toBe(false);
    expect(service.lastLoadedRecordId()).toBe(0);
    expect(service.observations()).toBe(null);

    // Act
    service.getData(_pageIndex, 'api/observationfeed');

    const request = controller.expectOne({
      method: 'GET',
      url: _apiUrl,
    });

    // Assert
    request.flush(fakeObservationFeedResponseWithOneElement);

    expect(service.observations()).toEqual(fakeIObservationFeedWithOneElement);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(false);
    expect(service.isAllLoaded()).toBe(true);
    expect(service.lastLoadedRecordId()).toBe(
      fakeIObservationFeedWithOneElement[0].observationId
    );
  });
});