import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BirdsDddlResponse } from 'src/app/testing/birds-helpers';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { SelectSpeciesService } from './select-species.service';

const apiUrl = `api/birds-list`;

describe('SelectSpeciesService', () => {
  let service: SelectSpeciesService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SelectSpeciesService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches data', () => {
    let actualBirdsState: IBirdSummary[] | null | undefined;
    let actualErrorState: boolean | undefined;

    service.getData();

    service.isError
      .subscribe((error) => {
        actualErrorState = error;
      });

    controller.expectOne(apiUrl).flush(BirdsDddlResponse);

    actualBirdsState = service.getBirds;

    expect(actualBirdsState).toEqual(BirdsDddlResponse);
    expect(actualErrorState).toBeFalse();
  });

  it('#getData should use GET to retrieve data', () => {
    service.getData();
    const testRequest = controller.expectOne(apiUrl);
    expect(testRequest.request.method).toEqual('GET');
  });

  it('passes the errors through', () => {
    let actualBirdsState: IBirdSummary[] | null | undefined;
    let actualErrorState: boolean | undefined;

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    service.getData();

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    controller.expectOne(apiUrl).error(errorEvent, { status, statusText });

    actualBirdsState = service.getBirds;

    expect(actualBirdsState).toEqual([]);
    expect(actualErrorState).toBeTrue();
  });
});