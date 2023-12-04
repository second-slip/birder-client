import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authenticationInterceptor } from './authentication.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TokenService } from '../_auth/token.service';

const testToken = 'jwtToken';

describe('authenticationInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authenticationInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});

describe('authenticationInterceptor integration(?) tests', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let fakeService: jasmine.SpyObj<TokenService>;

  const setup = async (fakeTokenServicereturnValues?: jasmine.SpyObjMethodNames<TokenService>) => {

    fakeService = jasmine.createSpyObj<TokenService>(
      'TokenService',
      {
        addToken: undefined,
        getToken: undefined,
        removeToken: undefined,
        ...fakeTokenServicereturnValues
      }
    );

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authenticationInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: fakeService },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  };

  afterEach(() => {
    httpTestingController.verify();
  });


  it('should add auth header ', fakeAsync(async () => {
    await setup({
      getToken: `${testToken}`
    });

    //arrange
    const url = 'api/observationfeed/';

    //act
    httpClient.get(url).subscribe();

    // assert
    const req = httpTestingController
      .expectOne({
        method: 'GET',
        url: url
      });

    expect(req.request.headers.get('Authorization')).toEqual(
      `bearer ${testToken}`
    );
    expect(fakeService.getToken).toHaveBeenCalled();
  }));

  it('should not add auth header ', fakeAsync(async () => {
    await setup();

    //arrange
    const url = 'maps.google.com/';

    //act
    httpClient.get(url).subscribe();

    // assert
    const req = httpTestingController
      .expectOne({
        method: 'GET',
        url: url
      });

    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(fakeService.getToken).not.toHaveBeenCalled();
  }));
});