import { TestBed } from '@angular/core/testing';
import { BirdIndexService } from './bird-index.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { skip } from 'rxjs';
import { IBirdSummary } from '../i-bird-summary.dto';
import { fakeBirdIndexResponse, fakeIBirdArray } from 'src/app/testing/birds-helpers';

const _pageIndex = 1;
const _apiUrl = `api/Birds?pageIndex=${_pageIndex}&pageSize=30&speciesFilter=0`;

describe('BirdIndexService', () => {
  let controller: HttpTestingController;
  let service: BirdIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BirdIndexService],
    });
    service = TestBed.inject(BirdIndexService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });


  it('makes an http call', () => {
    // Arrange
    let actualBirdsObservable: IBirdSummary[] | null | undefined; // undefined initial state to check if Observable emits
    let actualErrorState: boolean | undefined;
    let actualTotalItems: number | undefined;

    // Act
    service.getData(_pageIndex, 30, '0'); // call http request method

    // We expect that the Observable emits an array that equals to the one from the API response:
    service.getBirds.subscribe((birdsIndexObservable) => {
      actualBirdsObservable = birdsIndexObservable
    });

    service.isError
      .subscribe((error) => {
        actualErrorState = error;
      });

      service.getTotalItems.pipe()
      .subscribe((total) => {
        actualTotalItems = total;
      });

    const request = controller.expectOne(_apiUrl);
    // Answer the request so the Observable emits a value.
    request.flush(fakeBirdIndexResponse); // also paste the response object in with {}

    // Assert
    expect(actualBirdsObservable).toEqual(fakeIBirdArray);
    expect(actualErrorState).toBeFalse();
    expect(actualTotalItems).toBe(fakeBirdIndexResponse.totalItems);
  });

  it('#getData should use GET to retrieve data', () => {
    service.getData(_pageIndex, 30, '0'); // call http request method
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
    service.getData(_pageIndex, 30, '0'); // call http request method

    service.isError.pipe(skip(1)) // skip first, default 'false' value emitted...
      .subscribe((error) => {
        actualErrorState = error;
      });

    controller.expectOne(_apiUrl).error(errorEvent, { status, statusText });

    expect(actualErrorState).toBeTrue();
  });
});