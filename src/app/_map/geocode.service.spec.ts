import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  apiKey,
  apiUrl,
  googleMapsApiResponse,
  latitude,
  longitude,
  searchTerm,
} from '../testing/map-tests-helpers';
import { GeocodeService } from './geocode.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('GeocodeService', () => {
  let service: GeocodeService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GeocodeService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(GeocodeService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('checks geocode', () => {
    let result: any | undefined;
    service.geocode(searchTerm).subscribe((otherResult) => {
      result = otherResult;
    });

    controller
      .expectOne(
        `${apiUrl}address=${encodeURIComponent(searchTerm)}&key=${apiKey}`
      )
      .flush(googleMapsApiResponse);

    expect(result).toEqual(googleMapsApiResponse);
  });

  it('checks reverse geocode', () => {
    let result: any | undefined;
    service.reverseGeocode(latitude, longitude).subscribe((otherResult) => {
      result = otherResult;
    });

    controller
      .expectOne(
        `${apiUrl}latlng=${encodeURIComponent(
          latitude + ',' + longitude
        )}&key=${apiKey}`
      )
      .flush(googleMapsApiResponse);
    expect(result).toEqual(googleMapsApiResponse);
  });

  it('passes the errors through', () => {
    const errors: HttpErrorResponse[] = [];
    const recordError = (error: HttpErrorResponse) => {
      errors.push(error);
    };

    service
      .geocode(searchTerm)
      .subscribe({ next: fail, error: recordError, complete: fail });
    service
      .reverseGeocode(latitude, longitude)
      .subscribe({ next: fail, error: recordError, complete: fail });

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    const requests = controller.match(() => true);
    requests.forEach((request) => {
      request.error(errorEvent, { status, statusText });
    });

    expect(errors.length).toBe(2);
    errors.forEach((error) => {
      expect(error.error).toBe(errorEvent);
      expect(error.status).toBe(status);
      expect(error.statusText).toBe(statusText);
    });
  });

  it('googleApiResponseHelper gets postal address from api result', () => {
    const actualPostalTown = service.googleApiResponseHelper(
      googleMapsApiResponse.results[0].address_components,
      'postal_town'
    );

    expect(actualPostalTown).toBe('London');
  });

  it('googleApiResponseHelper gets postal address from api result', () => {
    const actualCountry = service.googleApiResponseHelper(
      googleMapsApiResponse.results[0].address_components,
      'country'
    );

    expect(actualCountry).toBe('United Kingdom');
  });
});
