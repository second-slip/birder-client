import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { skip } from 'rxjs/operators';
import {
  fakeBirdDetailResponse,
  fakeIBirdDetail,
} from 'src/app/testing/birds-helpers';

import { BirdDetailService } from './bird-detail.service';
import { IBirdDetail } from './i-bird-detail.dto';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

const _birdId = '1013';
const _apiUrl = `api/Birds/Bird?id=${_birdId}`;

describe('BirdDetailService', () => {
  let controller: HttpTestingController;
  let service: BirdDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BirdDetailService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(BirdDetailService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('makes an http call', () => {
    // Arrange
    let actualBird: IBirdDetail | null | undefined; // undefined initial state to check if Observable emits
    let actualErrorState: boolean | undefined;

    // Act
    service.getData(_birdId); // call http request method

    // We expect that the Observable emits an array that equals to the one from the API response:
    service.getBird.subscribe((birdObservable) => {
      actualBird = birdObservable;
    });

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    const request = controller.expectOne(_apiUrl); // _apiUrl);
    // Answer the request so the Observable emits a value.
    request.flush(fakeBirdDetailResponse); // also paste the response object in with {}

    // Assert
    expect(actualBird).toEqual(fakeIBirdDetail);
    expect(actualErrorState).toBeFalse();
  });

  it('#getData should use GET to retrieve data', () => {
    service.getData(_birdId);
    const testRequest = controller.expectOne(_apiUrl);
    expect(testRequest.request.method).toEqual('GET');
  });

  it('passes through errors', () => {
    // Arrange
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API error');
    let actualErrorState: boolean | undefined;

    // Act & Assert
    service.getData(_birdId); // call http request method

    service.isError
      .pipe(skip(1)) // skip first, default 'false' value emitted...
      .subscribe((error) => {
        actualErrorState = error;
      });

    controller.expectOne(_apiUrl).error(errorEvent, { status, statusText });

    expect(actualErrorState).toBeTrue();
  });
});
