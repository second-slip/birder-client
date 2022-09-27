import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { recordingsResponse, species } from 'src/app/testing/flickr-recordings-api-tests-helper';
import { IRecording } from './i-recording.dto';
import { RecordingsService } from './recordings.service';

describe('RecordingsService', () => {
  let service: RecordingsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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

  it('check it registers', () => {
    let result: Array<IRecording> | undefined;

    service.getRecordings(species).subscribe((otherResult) => {
      result = otherResult;
    });

    controller.expectOne(`api/Recording?species=${species}`).flush(recordingsResponse);

    expect(result).toEqual(recordingsResponse);
  });

  it('passes the errors through', () => {
    const errors: HttpErrorResponse[] = [];
    const recordError = (error: HttpErrorResponse) => {
      errors.push(error);
    };

    service.getRecordings(species).subscribe(fail, recordError, fail);

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    const requests = controller.match(() => true);
    requests.forEach((request) => {
      request.error(errorEvent, { status, statusText });
    });

    expect(errors.length).toBe(1);
    errors.forEach((error) => {
      expect(error.error).toBe(errorEvent);
      expect(error.status).toBe(status);
      expect(error.statusText).toBe(statusText);
    });
  });
});