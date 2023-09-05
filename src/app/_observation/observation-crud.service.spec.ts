import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createObservationModel, createdResponse, observationId, singleObservation, singleObservationResponse, updateObservationModel, updatedResponse } from '../testing/observation-test-helpers';
import { ObservationCrudService } from './observation-crud.service';
import { IUpdateObservation } from './observation-update/i-update-observation.dto';

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

  it('checks it gets the observation', () => {
    let result: IUpdateObservation | null | undefined;
    service.getObservation(observationId.toString())
      .subscribe((otherResult) => {
        result = otherResult;
      });

    const request = controller.expectOne({
      method: 'GET',
      url: `api/observationread/update?id=${observationId}`
    });
    request.flush(singleObservationResponse);

    expect(result).toEqual(singleObservation);
  });

  it('check it adds the observation', () => {
    let result: { observationId: string} | null | undefined;

    service.addObservation(createObservationModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/observation/create',
    });
    expect(request.request.body).toEqual(createObservationModel);
    request.flush(createdResponse);

    expect(result).toEqual(createdResponse);
  });

  it('check it updates the observation', () => {
    let result: { observationId: string} | null | undefined;
    service.updateObservation(observationId.toString(), updateObservationModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'PUT',
      url: `api/observation/update?id=${observationId}`,
    });

    request.flush(updatedResponse);

    expect(result).toEqual(updatedResponse);
  });

  it('check it deletes the observation', () => {
    let result: number | undefined;
    service.deleteObservation(observationId).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'DELETE',
      url: `api/observation/delete?id=${observationId}`,
    });

    request.flush(observationId);

    expect(result).toEqual(observationId);
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
    service.deleteObservation(observationId).subscribe({ next: fail, error: recordError, complete: fail, });
    service.getObservation(observationId.toString()).subscribe({ next: fail, error: recordError, complete: fail, });
    service.updateObservation(observationId.toString(), updateObservationModel).subscribe({ next: fail, error: recordError, complete: fail, });

    const requests = controller.match(() => true);
    requests.forEach((request) => {
      request.error(errorEvent, { status, statusText });
    });

    expect(errors.length).toBe(4);
    errors.forEach((error) => {
      expect(error.error).toBe(errorEvent);
      expect(error.status).toBe(status);
      expect(error.statusText).toBe(statusText);
    });
  });

});
