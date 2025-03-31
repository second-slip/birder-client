import { TestBed } from '@angular/core/testing';

import { TopFiveFilterService } from './top-five-filter.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { fakeIObservationTopFive, fakeTopObservationsResponse } from 'src/app/testing/analysis-helpers';

const _days = 30;
const _apiUrl = `api/list/top-five-filter?days=${_days}`;

describe('TopFiveFilterService', () => {
  let service: TopFiveFilterService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TopFiveFilterService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should get the top5 response', () => {
    // Arrange
    expect(service.records()).toEqual([]);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(false);

    // Act
    service.getData();

    const request = controller.expectOne({
      method: 'GET',
      url: _apiUrl,
    });

    // Assert
    request.flush(fakeTopObservationsResponse);

    expect(service.records()).toEqual(fakeIObservationTopFive);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(false);
  });

  it('should return empty array if response is null', () => {
    // Arrange
    expect(service.records()).toEqual([]);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(false);

    // Act
    service.getData();

    const request = controller.expectOne({
      method: 'GET',
      url: _apiUrl,
    });

    // Assert
    request.flush(null);

    expect(service.records()).toEqual([]);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(false);
  });

  it('#getData should use GET to retrieve data', () => {
    service.getData();
    const testRequest = controller.expectOne(_apiUrl);
    expect(testRequest.request.method).toEqual('GET');
  });

  it('should pass through error response state', () => {
    // Arrange
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API error');

    expect(service.records()).toEqual([]);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(false);

    // Act
    service.getData();

    // Assert
    controller.expectOne(_apiUrl).error(errorEvent, { status, statusText });

    expect(service.records()).toEqual([]);
    expect(service.isLoading()).toBe(false);
    expect(service.isError()).toBe(true);
  });
});
