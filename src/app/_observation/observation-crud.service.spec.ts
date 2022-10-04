import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createObservationModel, singleObservation } from '../testing/observation-test-helpers';
import { IObservation } from './i-observation.dto';
import { ObservationCrudService } from './observation-crud.service';

describe('ObservationCrudService', () => {
  let service: ObservationCrudService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ObservationCrudService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('check it adds the observation', () => {
    let result: IObservation | null | undefined;

    service.addObservation(createObservationModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/observation/create',
    });
    expect(request.request.body).toEqual(createObservationModel);
    request.flush(singleObservation);

    expect(result).toEqual(singleObservation);
  });

  it('check it deletes the observation', () => {
    let result: number | undefined;
    service.deleteObservation(1).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'DELETE',
      url: 'api/observation/delete?id=1',
    });

    request.flush(1);

    expect(result).toEqual(1);
  });

  it('passes the errors through', () => {
    const errors: HttpErrorResponse[] = [];
    const recordError = (error: HttpErrorResponse) => {
      errors.push(error);
    };

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    service.addObservation(createObservationModel).subscribe({ next: fail, error: recordError, complete: fail, });
    service.deleteObservation(1).subscribe({ next: fail, error: recordError, complete: fail, });


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

});
