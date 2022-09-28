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
      providers: [FlickrService]
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

  it('fetches data', () => {
    let actualImagesState: Array<{ url: string }> | null | undefined;
    let actualErrorState: boolean | undefined;

    service.getData(species);

    service.images.subscribe((otherResult) => {
      actualImagesState = otherResult;
    });

    service.isError
      .subscribe((error) => {
        actualErrorState = error;
      });

    controller.expectOne(flickrUrl).flush(flickrResponse);

    expect(actualImagesState).toEqual(photoUrlsArray);
    expect(actualErrorState).toBeFalse();
  });

  it('#getData should use GET to retrieve data', () => {
    service.getData(species);
    const testRequest = controller.expectOne(flickrUrl);
    expect(testRequest.request.method).toEqual('GET');
  });

  it('passes the errors through', () => {
    let actualImagesState: Array<{ url: string }> | null | undefined;
    let actualErrorState: boolean | undefined;

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    service.getData(species);

    service.images.subscribe((otherResult) => {
      actualImagesState = otherResult;
    });

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    controller.expectOne(flickrUrl).error(errorEvent, { status, statusText });

    expect(actualImagesState).toEqual(null);
    expect(actualErrorState).toBeTrue();
  });
});