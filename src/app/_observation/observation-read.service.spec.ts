import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { skip } from 'rxjs';
import { singleObservationResponse, singleObservation, singleObservationView, singleObservationViewResponse } from '../testing/observation-test-helpers';

import { ObservationReadService } from './observation-read.service';
import { IObservationViewDto } from './i-observation-view.dto';

const _observationId = '10';
const _apiUrl = `api/observationread?id=${_observationId}`;

describe('ObservationReadService', () => {
  let service: ObservationReadService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ObservationReadService]
    });
    service = TestBed.inject(ObservationReadService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return error if id is null or empty', () => {

    let actualObservation: IObservationViewDto | null | undefined;
    let actualErrorState: boolean | undefined;

    // Act
    service.getData(''); // empty string, which should be caught by the method guard

    service.observation.subscribe((tweetObservable) => {
      actualObservation = tweetObservable
    });

    service.isError
      .subscribe((error) => {
        actualErrorState = error;
      });

    controller.expectNone(_apiUrl);

    expect(actualErrorState).toBeTrue();
    expect(actualObservation).toBeNull();
  });

  it('makes an http call', () => {
    // Arrange
    let actualObservation: IObservationViewDto | null | undefined;
    let actualErrorState: boolean | undefined;

    // Act
    service.getData(_observationId);

    service.observation.subscribe((tweetObservable) => {
      actualObservation = tweetObservable
    });

    service.isError
      .subscribe((error) => {
        actualErrorState = error;
      });

    const request = controller.expectOne(_apiUrl);
    request.flush(singleObservationViewResponse);

    // Assert
    expect(actualObservation).toEqual(singleObservationView);
    expect(actualErrorState).toBeFalse();
  });

  it('#getData should use GET to retrieve data', () => {
    service.getData(_observationId);
    const testRequest = controller.expectOne(_apiUrl);
    expect(testRequest.request.method).toEqual('GET');
  });

  it('passes through errors', () => {
    // Arrange
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API error');
    let actualObservation: IObservationViewDto | null | undefined;
    let actualErrorState: boolean | undefined;

    // Act & Assert
    service.getData(_observationId);

    service.observation.subscribe((tweetObservable) => {
      actualObservation = tweetObservable
    });

    service.isError.pipe(skip(1))
      .subscribe((error) => {
        actualErrorState = error;
      });

    controller.expectOne(_apiUrl).error(errorEvent, { status, statusText });

    expect(actualErrorState).toBeTrue();
    expect(actualObservation).toBeNull();
  });
});