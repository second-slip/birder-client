import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  recordingsResponse,
  species,
} from 'src/app/testing/flickr-recordings-api-tests-helper';
import { IRecording } from './i-recording.dto';
import { RecordingsService } from './recordings.service';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

const apiUrl = `api/Recording?species=${species}`;

describe('RecordingsService', () => {
  let service: RecordingsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RecordingsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(RecordingsService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches data', () => {
    let actualRecordingsState: Array<IRecording> | null | undefined;
    let actualErrorState: boolean | undefined;

    service.getData(species);

    service.recordings.subscribe((otherResult) => {
      actualRecordingsState = otherResult;
    });

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    controller.expectOne(apiUrl).flush(recordingsResponse);

    expect(actualRecordingsState).toEqual(recordingsResponse);
    expect(actualErrorState).toBeFalse();
  });

  it('#getData should use GET to retrieve data', () => {
    service.getData(species);
    const testRequest = controller.expectOne(apiUrl);
    expect(testRequest.request.method).toEqual('GET');
  });

  it('passes the errors through', () => {
    let actualRecordingsState: Array<IRecording> | null | undefined;
    let actualErrorState: boolean | undefined;

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    service.getData(species);

    service.recordings.subscribe((otherResult) => {
      actualRecordingsState = otherResult;
    });

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    controller.expectOne(apiUrl).error(errorEvent, { status, statusText });

    expect(actualRecordingsState).toEqual(null);
    expect(actualErrorState).toBeTrue();
  });
});
