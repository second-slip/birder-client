import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './error.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('errorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => errorInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});

describe('errorInterceptor integration(?) tests', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return server-side error message variant', () => {
    //arrange
    const url = 'api/test-server-error';
    const status = 500;
    const statusText = 'Internal Server Error';
    const emsg = `server-side error: ${status}\nMessage: Http failure response for ${url}: ${status} ${statusText}`;// 'deliberate 404 error';

    //act
    httpClient.get(url).subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: string) => {
        expect(error).toBe(emsg);
      },
    });

    // assert
    const req = httpTestingController
      .expectOne({
        method: 'GET',
        url: url
      });

    req.flush(emsg, { status: status, statusText: statusText });
  });

  it('should return client-side error message variant', () => {
    //arrange
    const url = 'api/test-client-error';
    const status = 404;
    const statusText = 'client error';
    //const emsg = `server-side error: ${status}\nMessage: Http failure response for ${url}: ${status} ${statusText}`;// 'deliberate 404 error';
    const errorInitEvent: ErrorEventInit = {
      error: new Error('AAAHHHH'),
      message: 'fake client error meesage!',
      lineno: 402,
      colno: 123,
      filename: 'jimmy.html'
    };

    const errorEvent = new ErrorEvent('MyErrEventType', errorInitEvent);

    //act
    httpClient.get(url).subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: string) => {
        expect(error).toBe(`client-side error: ${errorEvent.message}`);
      },
    });

    // assert
    const req = httpTestingController
      .expectOne({
        method: 'GET',
        url: url
      });

    req.flush(errorEvent, { status: status, statusText: statusText });
  });
});
