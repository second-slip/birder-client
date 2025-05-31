import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { skip } from 'rxjs/operators';
import {
  fakeITweet,
  fakeTweetResponse,
} from 'src/app/testing/tweet-day-test-helper';
import { ITweet } from '../i-tweet.dto';
import { TweetDayService } from './tweet-day.service';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

const _apiUrl = 'api/tweets';

describe('TweetDayService', () => {
  let controller: HttpTestingController;
  let service: TweetDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TweetDayService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(TweetDayService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('makes an http call', () => {
    // Arrange
    let actualTweet: ITweet | null | undefined; // undefined initial state to check if Observable emits
    let actualErrorState: boolean | undefined;

    // Act
    service.getData(); // call http request method

    // We expect that the Observable emits an array that equals to the one from the API response:
    service.getTweet.subscribe((tweetObservable) => {
      actualTweet = tweetObservable;
    });

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    const request = controller.expectOne(_apiUrl); // _apiUrl);
    // Answer the request so the Observable emits a value.
    request.flush(fakeTweetResponse); // also paste the response object in with {}

    // Assert
    expect(actualTweet).toEqual(fakeITweet);
    expect(actualErrorState).toBeFalse();
  });

  it('#getData should use GET to retrieve data', () => {
    service.getData();
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
