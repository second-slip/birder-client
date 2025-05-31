import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { skip } from 'rxjs';
import {
  apiNetworkUserArrayResponse,
  fakeNetworkUserModelArray,
} from 'src/app/testing/network-test-helpers';
import { INetworkUser } from '../i-network-user.dto';

import { NetworkSuggestionService } from './network-suggestion.service';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

const _apiUrl = `api/network/suggestions`;

describe('NetworkSuggestionService', () => {
  let service: NetworkSuggestionService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworkSuggestionService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(NetworkSuggestionService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('makes an http call', () => {
    // Arrange
    let actualSuggestions: INetworkUser[] | null | undefined; // undefined initial state to check if Observable emits
    let actualErrorState: boolean | undefined;

    // Act
    service.getData(); // call http request method

    // We expect that the Observable emits an array that equals to the one from the API response:
    service.getNetworkSuggestions.subscribe((suggestionsObservable) => {
      actualSuggestions = suggestionsObservable;
    });

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    const request = controller.expectOne({
      method: 'GET',
      url: _apiUrl,
    });
    // Answer the request so the Observable emits a value.
    request.flush(apiNetworkUserArrayResponse); // also paste the response object in with {}

    // Assert
    expect(actualSuggestions).toEqual(fakeNetworkUserModelArray);
    expect(actualErrorState).toBeFalse();
  });

  it('passes through errors', () => {
    // Arrange
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API error');
    let actualErrorState: boolean | undefined;

    // Act & Assert
    service.getData(); // call http request method

    service.isError
      .pipe(skip(1)) // skip first, default 'false' value emitted...
      .subscribe((error) => {
        actualErrorState = error;
      });

    controller.expectOne(_apiUrl).error(errorEvent, { status, statusText });

    expect(actualErrorState).toBeTrue();
  });
});
