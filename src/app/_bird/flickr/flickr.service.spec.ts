import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { flickrResponse, flickrUrl, photoUrlsArray, species } from 'src/app/testing/flickr-recordings-api-tests-helper';
import { FlickrService } from './flickr.service';

describe('FlickrService', () => {
  let service: FlickrService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FlickrService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('check it registers', () => {
    let result: Array<{ url: string }> | undefined;

    service.getSearchResults(species, undefined, undefined).subscribe((otherResult) => {
      result = otherResult;
    });

    controller.expectOne(flickrUrl).flush(flickrResponse);

    expect(result).toEqual(photoUrlsArray);
  });

  it('passes the errors through', () => {
    const errors: HttpErrorResponse[] = [];
    const recordError = (error: HttpErrorResponse) => {
      errors.push(error);
    };

    service.getSearchResults(species, undefined, undefined).subscribe(fail, recordError, fail);

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