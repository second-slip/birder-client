import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { messageData } from 'src/app/testing/contact-form-data';
import { ContactFormModel } from './contact-form-model';
import { ContactFormService } from './contact-form.service';

describe('ContactFormService', () => {
  let service: ContactFormService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ContactFormService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('sends contact message', () => {
    let result: ContactFormModel | undefined;
    service.postMessage(messageData).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/Message/SendContactMessage',
    });
    //expect(request.request.body).toEqual({ messageData });
    request.flush(messageData); //{ usernameTaken: true });

    expect(result).toBe(messageData);
  });

  it('passes the errors through', () => {
    const errors: HttpErrorResponse[] = [];
    const recordError = (error: HttpErrorResponse) => {
      errors.push(error);
    };

    service.postMessage(messageData).subscribe({next: fail, error: recordError,complete: fail,});
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API error');

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});